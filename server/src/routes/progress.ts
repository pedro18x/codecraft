import { Router } from 'express'
import { prisma } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'

const router = Router()

// All progress routes require auth
router.use(authenticate)

// GET /api/progress
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const progress = await prisma.progress.findMany({
      where: { userId: req.userId! },
      include: {
        problem: {
          select: { id: true, title: true, slug: true, difficulty: true },
        },
      },
      orderBy: { lastAttempt: 'desc' },
    })

    res.json(successResponse(progress))
  })
)

// GET /api/progress/stats
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const userId = req.userId!

    const [totalProblems, progress] = await Promise.all([
      prisma.problem.count(),
      prisma.progress.findMany({
        where: { userId },
        include: {
          problem: { select: { difficulty: true } },
        },
      }),
    ])

    const completed = progress.filter((p) => p.status === 'completed')
    const attempted = progress.filter((p) => p.status === 'attempted')

    const stats = {
      totalProblems,
      completedCount: completed.length,
      attemptedCount: attempted.length,
      byDifficulty: {
        Easy: completed.filter((p) => p.problem.difficulty === 'Easy').length,
        Medium: completed.filter((p) => p.problem.difficulty === 'Medium').length,
        Hard: completed.filter((p) => p.problem.difficulty === 'Hard').length,
      },
    }

    res.json(successResponse(stats))
  })
)

export default router
