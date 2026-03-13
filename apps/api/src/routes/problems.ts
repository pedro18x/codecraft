import { Router } from 'express'
import type { Prisma } from '@prisma/client'
import { prisma } from '../config/database.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse, ApiError } from '../utils/apiResponse.js'
import { ListProblemsQuerySchema, type ListProblemsQuery } from './schemas/problems.schema.js'

const router = Router()

const problemSummarySelect = {
  id: true,
  title: true,
  slug: true,
  difficulty: true,
  categories: true,
} satisfies Prisma.ProblemSelect

const problemDetailSelect = {
  ...problemSummarySelect,
  description: true,
  examples: true,
  constraints: true,
  starterCode: true,
  hints: true,
} satisfies Prisma.ProblemSelect

function buildProblemWhereInput({
  difficulty,
  category,
  search,
}: ListProblemsQuery): Prisma.ProblemWhereInput {
  const where: Prisma.ProblemWhereInput = {}

  if (difficulty) {
    where.difficulty = { in: difficulty.split(',') }
  }

  if (category) {
    where.categories = { hasSome: category.split(',') }
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { categories: { hasSome: [search] } },
    ]
  }

  return where
}

// GET /api/problems
router.get(
  '/',
  validate(ListProblemsQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const where = buildProblemWhereInput(req.query as ListProblemsQuery)

    const problems = await prisma.problem.findMany({
      where,
      select: problemSummarySelect,
      orderBy: { id: 'asc' },
    })

    res.json(successResponse({ problems }))
  })
)

// GET /api/problems/:slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const problem = await prisma.problem.findUnique({
      where: { slug: req.params.slug as string },
      select: problemDetailSelect,
    })

    if (!problem) {
      throw new ApiError('NOT_FOUND', 'Problem not found', 404)
    }

    const [prevProblem, nextProblem] = await Promise.all([
      prisma.problem.findFirst({
        where: { id: { lt: problem.id } },
        select: { slug: true },
        orderBy: { id: 'desc' },
      }),
      prisma.problem.findFirst({
        where: { id: { gt: problem.id } },
        select: { slug: true },
        orderBy: { id: 'asc' },
      }),
    ])

    res.json(successResponse({
      ...problem,
      navigation: {
        prevSlug: prevProblem?.slug ?? null,
        nextSlug: nextProblem?.slug ?? null,
      },
    }))
  })
)

export default router
