import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { submissionLimiter } from '../middleware/rateLimiter.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import { executeProblemCode } from '../services/execution.service.js'
import { listSubmissions, saveSubmissionAndProgress } from '../services/submissions.service.js'
import { SubmissionListQuerySchema, SubmitCodeSchema } from './schemas/submissions.schema.js'

const router = Router()

// All submission routes require auth
router.use(authenticate)

// POST /api/submissions - Execute code and save results
// Rate limiter runs AFTER authenticate so req.userId is available for per-user limiting
router.post(
  '/',
  submissionLimiter,
  validate(SubmitCodeSchema),
  asyncHandler(async (req, res) => {
    const { problemId, language, code } = req.body
    const userId = req.userId!
    const execution = await executeProblemCode({
      problemId,
      language,
      code,
      route: '/api/submissions',
      userId,
    })

    const submission = await saveSubmissionAndProgress({
      userId,
      problemId,
      language,
      code,
      execution,
    })

    res.json(successResponse(submission))
  })
)

// GET /api/submissions - User's submission history
router.get(
  '/',
  validate(SubmissionListQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const userId = req.userId!
    const { problemId } = req.query as { problemId?: number }
    const submissions = await listSubmissions(userId, problemId)

    res.json(successResponse({ submissions }))
  })
)

export default router
