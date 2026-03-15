import { prisma } from '../config/database.js'

interface LanguageBreakdown {
  language: string
  count: number
}

interface WeekTrend {
  week: string
  passed: number
  failed: number
}

interface SubmissionAnalytics {
  totalSubmissions: number
  passRate: number
  avgExecutionTime: number | null
  languageBreakdown: LanguageBreakdown[]
  recentTrend: WeekTrend[]
}

export async function getSubmissionAnalytics(userId: number): Promise<SubmissionAnalytics> {
  // Total submissions and pass rate
  const [totalResult, successResult] = await Promise.all([
    prisma.submission.count({ where: { userId } }),
    prisma.submission.count({ where: { userId, success: true } }),
  ])

  const totalSubmissions = totalResult
  const passRate = totalSubmissions > 0 ? Math.round((successResult / totalSubmissions) * 100) : 0

  // Average execution time for successful submissions
  const avgResult = await prisma.submission.aggregate({
    where: { userId, success: true, executionTimeMs: { not: null } },
    _avg: { executionTimeMs: true },
  })
  const avgExecutionTime = avgResult._avg.executionTimeMs
    ? Math.round(avgResult._avg.executionTimeMs)
    : null

  // Language breakdown
  const languageRows = await prisma.$queryRaw<Array<{ language: string; count: bigint }>>`
    SELECT language, COUNT(*) as count
    FROM submissions
    WHERE "user_id" = ${userId}
    GROUP BY language
    ORDER BY count DESC
  `
  const languageBreakdown = languageRows.map((r) => ({
    language: r.language,
    count: Number(r.count),
  }))

  // Recent trend: pass/fail per week for last 8 weeks
  const eightWeeksAgo = new Date()
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56)

  const trendRows = await prisma.$queryRaw<
    Array<{ week: Date; passed: bigint; failed: bigint }>
  >`
    SELECT
      DATE_TRUNC('week', "created_at") as week,
      COUNT(*) FILTER (WHERE success = true) as passed,
      COUNT(*) FILTER (WHERE success = false) as failed
    FROM submissions
    WHERE "user_id" = ${userId} AND "created_at" >= ${eightWeeksAgo}
    GROUP BY DATE_TRUNC('week', "created_at")
    ORDER BY week
  `

  const recentTrend = trendRows.map((r) => ({
    week: r.week.toISOString().split('T')[0],
    passed: Number(r.passed),
    failed: Number(r.failed),
  }))

  return {
    totalSubmissions,
    passRate,
    avgExecutionTime,
    languageBreakdown,
    recentTrend,
  }
}
