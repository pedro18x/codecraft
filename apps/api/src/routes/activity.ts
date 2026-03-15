import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import * as activityService from '../services/activity.service.js'

const router = Router()

const HeatmapQuerySchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, 'Year must be a 4-digit number')
    .transform(Number)
    .optional(),
})

// GET /api/activity/heatmap?year=2026
router.get(
  '/heatmap',
  authenticate,
  validate(HeatmapQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const year = (req.query as { year?: number }).year ?? new Date().getFullYear()
    const data = await activityService.getActivityHeatmap(req.user!.id, year)
    res.json(successResponse(data))
  })
)

// GET /api/activity/streak
router.get(
  '/streak',
  authenticate,
  asyncHandler(async (req, res) => {
    const data = await activityService.getStreakInfo(req.user!.id)
    res.json(successResponse(data))
  })
)

export default router
