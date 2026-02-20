import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import { optionalAuth } from '../middleware/auth.js'
import { logger } from '../utils/logger.js'

const router = Router()

const TelemetrySchema = z.object({
  event_name: z.string().min(1).max(80),
  user_id: z.union([z.number().int().positive(), z.string()]).optional(),
  session_id: z.string().min(1).max(120).optional(),
  route: z.string().max(200).optional(),
  ts: z.string().datetime().optional(),
  properties: z.record(z.unknown()).optional(),
})

router.post(
  '/',
  optionalAuth,
  validate(TelemetrySchema),
  asyncHandler(async (req, res) => {
    const claimedUserId = req.body.user_id
    const userId =
      req.userId ??
      (typeof claimedUserId === 'number'
        ? claimedUserId
        : typeof claimedUserId === 'string' && /^\d+$/.test(claimedUserId)
          ? Number(claimedUserId)
          : null)

    logger.info('product_event', {
      requestId: req.requestId ?? null,
      userId,
      ...req.body,
    })

    res.json(successResponse({ accepted: true }))
  })
)

export default router
