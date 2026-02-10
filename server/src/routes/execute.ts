import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../config/database.js'
import { validate } from '../middleware/validate.js'
import { guestExecutionLimiter } from '../middleware/rateLimiter.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse, ApiError } from '../utils/apiResponse.js'
import { getExecutor } from '../services/executor/index.js'

const router = Router()

const ExecuteCodeSchema = z.object({
  problemId: z.number().int().positive(),
  language: z.enum(['javascript', 'typescript', 'python']),
  code: z.string().min(1, 'Code cannot be empty').max(50000),
})

// POST /api/execute - Execute code without saving (guest-friendly)
router.post(
  '/',
  guestExecutionLimiter,
  validate(ExecuteCodeSchema),
  asyncHandler(async (req, res) => {
    const { problemId, language, code } = req.body

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    })

    if (!problem) {
      throw new ApiError('NOT_FOUND', 'Problem not found', 404)
    }

    const testCases = problem.testCases as { input: string; expectedOutput: string }[]

    if (language === 'python') {
      throw new ApiError(
        'NOT_IMPLEMENTED',
        'Python execution is not yet supported. Please use JavaScript or TypeScript.',
        501
      )
    }

    const executor = await getExecutor()
    const result = await executor.execute({
      code,
      language,
      testCases,
      timeoutMs: 5000,
      memoryLimitMb: 128,
    })

    res.json(
      successResponse({
        success: result.success,
        testResults: result.testResults,
        executionTimeMs: result.executionTimeMs,
      })
    )
  })
)

export default router
