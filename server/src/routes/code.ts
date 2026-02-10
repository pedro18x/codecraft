import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse, ApiError } from '../utils/apiResponse.js'

const router = Router()

// All code routes require auth
router.use(authenticate)

const SaveCodeSchema = z.object({
  code: z.string().max(50000),
})

const VALID_LANGUAGES = ['javascript', 'typescript', 'python'] as const

function parseCodeParams(params: { problemId: string; language: string }) {
  const problemId = parseInt(params.problemId)
  if (isNaN(problemId) || problemId <= 0) {
    throw new ApiError('VALIDATION_ERROR', 'Invalid problem ID', 400)
  }
  const language = params.language
  if (!VALID_LANGUAGES.includes(language as typeof VALID_LANGUAGES[number])) {
    throw new ApiError('VALIDATION_ERROR', 'Invalid language', 400)
  }
  return { problemId, language }
}

// GET /api/code/:problemId/:language
router.get(
  '/:problemId/:language',
  asyncHandler(async (req, res) => {
    const { problemId, language } = parseCodeParams(req.params as { problemId: string; language: string })

    const saved = await prisma.savedCode.findUnique({
      where: {
        userId_problemId_language: {
          userId: req.userId!,
          problemId,
          language,
        },
      },
    })

    res.json(successResponse({ code: saved?.code || null }))
  })
)

// PUT /api/code/:problemId/:language
router.put(
  '/:problemId/:language',
  validate(SaveCodeSchema),
  asyncHandler(async (req, res) => {
    const { problemId, language } = parseCodeParams(req.params as { problemId: string; language: string })

    const saved = await prisma.savedCode.upsert({
      where: {
        userId_problemId_language: {
          userId: req.userId!,
          problemId,
          language,
        },
      },
      update: { code: req.body.code },
      create: {
        userId: req.userId!,
        problemId,
        language,
        code: req.body.code,
      },
    })

    res.json(successResponse(saved))
  })
)

export default router
