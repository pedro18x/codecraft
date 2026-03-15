import { prisma } from '../config/database.js'

interface HeatmapDay {
  date: string
  count: number
}

export async function getActivityHeatmap(userId: number, year: number): Promise<{ days: HeatmapDay[] }> {
  const startDate = new Date(`${year}-01-01T00:00:00Z`)
  const endDate = new Date(`${year + 1}-01-01T00:00:00Z`)

  const rows = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
    SELECT DATE("created_at") as date, COUNT(*) as count
    FROM submissions
    WHERE "user_id" = ${userId}
      AND "created_at" >= ${startDate}
      AND "created_at" < ${endDate}
    GROUP BY DATE("created_at")
    ORDER BY date
  `

  const days = rows.map((row) => ({
    date: row.date.toISOString().split('T')[0],
    count: Number(row.count),
  }))

  return { days }
}

interface StreakInfo {
  currentStreak: number
  longestStreak: number
  totalActiveDays: number
}

export async function getStreakInfo(userId: number): Promise<StreakInfo> {
  const rows = await prisma.$queryRaw<Array<{ date: Date }>>`
    SELECT DISTINCT DATE("created_at") as date
    FROM submissions
    WHERE "user_id" = ${userId}
    ORDER BY date DESC
  `

  if (rows.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 }
  }

  const dates = rows.map((r) => r.date.toISOString().split('T')[0])
  const totalActiveDays = dates.length

  // Compute current streak (from today backwards)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  let currentStreak = 0
  const checkDate = new Date(today)

  // Allow streak to start from today or yesterday
  if (dates[0] !== todayStr) {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    if (dates[0] !== yesterdayStr) {
      // No activity today or yesterday — streak is 0
      return { currentStreak: 0, longestStreak: computeLongestStreak(dates), totalActiveDays }
    }
    checkDate.setDate(checkDate.getDate() - 1)
  }

  const dateSet = new Set(dates)
  while (dateSet.has(checkDate.toISOString().split('T')[0])) {
    currentStreak++
    checkDate.setDate(checkDate.getDate() - 1)
  }

  const longestStreak = computeLongestStreak(dates)

  return { currentStreak, longestStreak, totalActiveDays }
}

function computeLongestStreak(sortedDatesDesc: string[]): number {
  if (sortedDatesDesc.length === 0) return 0

  // Reverse to ascending order for easier processing
  const dates = [...sortedDatesDesc].reverse()
  let longest = 1
  let current = 1

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diffMs = curr.getTime() - prev.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffDays === 1) {
      current++
      longest = Math.max(longest, current)
    } else if (diffDays > 1) {
      current = 1
    }
  }

  return longest
}
