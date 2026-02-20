import { prisma } from '../config/database.js'

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
  const [totalProblems, progress] = await Promise.all([
    prisma.problem.count(),
    prisma.progress.findMany({
      where: { userId },
      include: {
        problem: { select: { difficulty: true } },
      },
    }),
  ])

  const completed = progress.filter((item) => item.status === 'completed')
  const attempted = progress.filter((item) => item.status === 'attempted')

  return {
    totalProblems,
    completedCount: completed.length,
    attemptedCount: attempted.length,
    byDifficulty: {
      Easy: completed.filter((item) => item.problem.difficulty === 'Easy').length,
      Medium: completed.filter((item) => item.problem.difficulty === 'Medium').length,
      Hard: completed.filter((item) => item.problem.difficulty === 'Hard').length,
    },
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
