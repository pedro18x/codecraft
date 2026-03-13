import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import { validate } from '../middleware/validate.js'
import { getUserProgress, getUserProgressStats, upsertProgress } from '../services/progress.service.js'

const router = Router()

// All progress routes require auth
router.use(authenticate)

// GET /api/progress
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const progress = await getUserProgress(req.userId!)

    res.json(successResponse(progress))
  })
)

// GET /api/progress/stats
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const stats = await getUserProgressStats(req.userId!)
    res.json(successResponse(stats))
  })
)

const UpsertProgressSchema = z.object({
  problemId: z.number().int().positive(),
  status: z.enum(['attempted', 'completed']),
})

// POST /api/progress
router.post(
  '/',
  validate(UpsertProgressSchema),
  asyncHandler(async (req, res) => {
    const { problemId, status } = req.body as z.infer<typeof UpsertProgressSchema>
    const result = await upsertProgress(req.userId!, problemId, status)
    res.json(successResponse(result))
  })
)

export default router
