import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { aiHintLimiter } from '../middleware/rateLimiter.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { streamAiHint } from '../services/ai.service.js'
import { AiHintRequestSchema } from './schemas/ai.schema.js'

const router = Router()

// POST /api/ai/hint
// Authenticated + rate-limited. Streams SSE response.
router.post(
  '/hint',
  authenticate,
  aiHintLimiter,
  validate(AiHintRequestSchema),
  asyncHandler(async (req, res) => {
    await streamAiHint(req.body, res)
  }),
)

export default router
