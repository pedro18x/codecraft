import { prisma } from '../config/database.js'

interface DifficultyCountRow {
  difficulty: string
  count: bigint
}

export async function getUserProgress(userId: number) {
  return prisma.progress.findMany({
    where: { userId },
    include: {
      problem: {
        select: { id: true, title: true, slug: true, difficulty: true },
      },
    },
    orderBy: { lastAttempt: 'desc' },
  })
}

export async function getUserProgressStats(userId: number) {
  const [totalProblems, statusCounts, completedByDifficulty] = await Promise.all([
    prisma.problem.count(),
    prisma.progress.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    }),
    prisma.$queryRaw<DifficultyCountRow[]>`
      SELECT
        p.difficulty AS difficulty,
        COUNT(*)::bigint AS count
      FROM progress pr
      JOIN problems p ON p.id = pr.problem_id
      WHERE pr.user_id = ${userId}
        AND pr.status = 'completed'
      GROUP BY p.difficulty
    `,
  ])

  const completedCount =
    statusCounts.find((entry) => entry.status === 'completed')?._count.status ?? 0
  const attemptedCount =
    statusCounts.find((entry) => entry.status === 'attempted')?._count.status ?? 0

  const byDifficulty = completedByDifficulty.reduce<Record<'Easy' | 'Medium' | 'Hard', number>>(
    (acc, row) => {
      if (row.difficulty === 'Easy' || row.difficulty === 'Medium' || row.difficulty === 'Hard') {
        acc[row.difficulty] = Number(row.count)
      }
      return acc
    },
    { Easy: 0, Medium: 0, Hard: 0 },
  )

  return {
    totalProblems,
    completedCount,
    attemptedCount,
    byDifficulty,
  }
}

export async function upsertProgress(
  userId: number,
  problemId: number,
  status: 'attempted' | 'completed',
) {
  return prisma.progress.upsert({
    where: { userId_problemId: { userId, problemId } },
    update: {
      status,
      attempts: { increment: 1 },
      lastAttempt: new Date(),
      ...(status === 'completed' ? { completedAt: new Date() } : {}),
    },
    create: {
      userId,
      problemId,
      status,
      attempts: 1,
      lastAttempt: new Date(),
      completedAt: status === 'completed' ? new Date() : null,
    },
  })
}
