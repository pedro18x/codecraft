import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../config/database.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse, ApiError } from '../utils/apiResponse.js'

const router = Router()

const ListQuerySchema = z.object({
  difficulty: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
})

// GET /api/problems
router.get(
  '/',
  validate(ListQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { difficulty, category, search } = req.query as Record<string, string | undefined>

    const where: Record<string, unknown> = {}

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

    const problems = await prisma.problem.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        categories: true,
        description: true,
        examples: true,
        constraints: true,
        starterCode: true,
        hints: true,
        // Exclude testCases from list view for security
      },
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
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        categories: true,
        description: true,
        examples: true,
        constraints: true,
        starterCode: true,
        hints: true,
        // testCases intentionally excluded — only used server-side during submission
      },
    })

    if (!problem) {
      throw new ApiError('NOT_FOUND', 'Problem not found', 404)
    }

    res.json(successResponse(problem))
  })
)

export default router
