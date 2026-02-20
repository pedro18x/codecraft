import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import { getLeaderboard } from '../services/leaderboard.service.js'

const router = Router()

// GET /api/leaderboard
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const leaderboard = await getLeaderboard()
    res.json(successResponse({ leaderboard }))
  })
)

export default router
