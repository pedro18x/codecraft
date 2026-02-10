import { Router } from 'express'
import authRoutes from './auth.js'
import problemsRoutes from './problems.js'
import progressRoutes from './progress.js'
import codeRoutes from './code.js'
import submissionsRoutes from './submissions.js'
import leaderboardRoutes from './leaderboard.js'
import executeRoutes from './execute.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/problems', problemsRoutes)
router.use('/progress', progressRoutes)
router.use('/code', codeRoutes)
router.use('/submissions', submissionsRoutes)
router.use('/leaderboard', leaderboardRoutes)
router.use('/execute', executeRoutes)

export default router
