import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import { guestExecutionLimiter } from '../middleware/rateLimiter.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import { executeProblemCode } from '../services/execution.service.js'
import { ExecuteCodeSchema } from './schemas/execute.schema.js'

const router = Router()

// POST /api/execute - Execute code without saving (guest-friendly)
router.post(
  '/',
  guestExecutionLimiter,
  validate(ExecuteCodeSchema),
  asyncHandler(async (req, res) => {
    const { problemId, language, code } = req.body
    const result = await executeProblemCode({
      problemId,
      language,
      code,
      route: '/api/execute',
      userId: null,
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
