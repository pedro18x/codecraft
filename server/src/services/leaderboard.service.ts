import { prisma } from '../config/database.js'

interface LeaderboardRow {
  userId: number
  username: string
  problemsSolved: bigint
  easy: bigint
  medium: bigint
  hard: bigint
}

export interface LeaderboardEntry {
  rank: number
  userId: number
  username: string
  problemsSolved: number
  easy: number
  medium: number
  hard: number
}

export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
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
    LIMIT ${limit}
  `

  return rows.map((row, index) => ({
    rank: index + 1,
    userId: row.userId,
    username: row.username,
    problemsSolved: Number(row.problemsSolved),
    easy: Number(row.easy),
    medium: Number(row.medium),
    hard: Number(row.hard),
  }))
}
