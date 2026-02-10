import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../config/database.js'
import type { Prisma } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { submissionLimiter } from '../middleware/rateLimiter.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse, ApiError } from '../utils/apiResponse.js'
import { getExecutor } from '../services/executor/index.js'

const router = Router()

// All submission routes require auth
router.use(authenticate)

const SubmitCodeSchema = z.object({
  problemId: z.number().int().positive(),
  language: z.enum(['javascript', 'typescript', 'python']),
  code: z.string().min(1, 'Code cannot be empty').max(50000),
})

// POST /api/submissions - Execute code and save results
// Rate limiter runs AFTER authenticate so req.userId is available for per-user limiting
router.post(
  '/',
  submissionLimiter,
  validate(SubmitCodeSchema),
  asyncHandler(async (req, res) => {
    const { problemId, language, code } = req.body
    const userId = req.userId!

    // Fetch problem with test cases
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    })

    if (!problem) {
      throw new ApiError('NOT_FOUND', 'Problem not found', 404)
    }

    const testCases = problem.testCases as { input: string; expectedOutput: string }[]

    // Python is accepted by the schema for future use, but no executor supports it yet
    if (language === 'python') {
      throw new ApiError(
        'NOT_IMPLEMENTED',
        'Python execution is not yet supported. Please use JavaScript or TypeScript.',
        501
      )
    }

    // Execute code
    const executor = await getExecutor()
    const result = await executor.execute({
      code,
      language,
      testCases,
      timeoutMs: 5000,
      memoryLimitMb: 128,
    })

    // Save submission
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        language,
        code,
        success: result.success,
        testResults: result.testResults as unknown as Prisma.InputJsonValue,
        executionTimeMs: result.executionTimeMs,
      },
    })

    // Update progress
    await prisma.progress.upsert({
      where: {
        userId_problemId: { userId, problemId },
      },
      update: {
        attempts: { increment: 1 },
        lastAttempt: new Date(),
        ...(result.success ? { status: 'completed', completedAt: new Date() } : {}),
      },
      create: {
        userId,
        problemId,
        status: result.success ? 'completed' : 'attempted',
        attempts: 1,
        lastAttempt: new Date(),
        ...(result.success ? { completedAt: new Date() } : {}),
      },
    })

    res.json(
      successResponse({
        id: submission.id,
        success: result.success,
        testResults: result.testResults,
        executionTimeMs: result.executionTimeMs,
      })
    )
  })
)

// GET /api/submissions - User's submission history
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = req.userId!
    const problemId = req.query.problemId
      ? parseInt(req.query.problemId as string)
      : undefined

    const where: Record<string, unknown> = { userId }
    if (problemId) where.problemId = problemId

    const submissions = await prisma.submission.findMany({
      where,
      select: {
        id: true,
        problemId: true,
        language: true,
        success: true,
        testResults: true,
        executionTimeMs: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    res.json(successResponse({ submissions }))
  })
)

export default router
