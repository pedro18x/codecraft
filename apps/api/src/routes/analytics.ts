import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import * as analyticsService from '../services/analytics.service.js'

const router = Router()

// GET /api/analytics/submissions
router.get(
  '/submissions',
  authenticate,
  asyncHandler(async (req, res) => {
    const data = await analyticsService.getSubmissionAnalytics(req.user!.id)
    res.json(successResponse(data))
  })
)

export default router
