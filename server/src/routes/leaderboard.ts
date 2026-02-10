import { Router } from 'express'
import { prisma } from '../config/database.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'

const router = Router()

interface LeaderboardRow {
  userId: number
  username: string
  problemsSolved: bigint
  easy: bigint
  medium: bigint
  hard: bigint
}

// GET /api/leaderboard
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    // Aggregate at the DB level instead of loading all users into memory
    const rows = await prisma.$queryRaw<LeaderboardRow[]>`
      SELECT
        u.id AS "userId",
        u.username,
        COUNT(p.id) AS "problemsSolved",
        COUNT(p.id) FILTER (WHERE pr.difficulty = 'Easy') AS "easy",
        COUNT(p.id) FILTER (WHERE pr.difficulty = 'Medium') AS "medium",
        COUNT(p.id) FILTER (WHERE pr.difficulty = 'Hard') AS "hard"
      FROM users u
      JOIN progress p ON p.user_id = u.id AND p.status = 'completed'
      JOIN problems pr ON pr.id = p.problem_id
      GROUP BY u.id, u.username
      HAVING COUNT(p.id) > 0
      ORDER BY
        COUNT(p.id) FILTER (WHERE pr.difficulty = 'Hard') DESC,
        COUNT(p.id) FILTER (WHERE pr.difficulty = 'Medium') DESC,
        COUNT(p.id) DESC
      LIMIT 50
    `

    // Convert BigInt to Number (Prisma raw queries return COUNT as BigInt)
    const leaderboard = rows.map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      username: row.username,
      problemsSolved: Number(row.problemsSolved),
      easy: Number(row.easy),
      medium: Number(row.medium),
      hard: Number(row.hard),
    }))

    res.json(successResponse({ leaderboard }))
  })
)

export default router
