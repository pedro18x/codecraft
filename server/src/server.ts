import { createApp } from './app.js'
import { env } from './config/env.js'
import { prisma } from './config/database.js'
import { logger } from './utils/logger.js'
import { getExecutorReadiness } from './services/executor/index.js'
import { errorResponse, successResponse } from './utils/apiResponse.js'

const app = createApp()

app.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    const executorReady = await getExecutorReadiness()
    if (!executorReady) {
      res.status(503).json(errorResponse('EXECUTOR_UNAVAILABLE', 'Executor dependency unavailable'))
      return
    }
    res.json(successResponse({ status: 'ready', timestamp: new Date().toISOString() }))
  } catch {
    res.status(503).json(errorResponse('NOT_READY', 'Service not ready'))
  }
})

async function start() {
  // Verify database connection
  try {
    await prisma.$connect()
    logger.info('db_connected')
  } catch (err) {
    logger.error('db_connect_failed', {
      error: err instanceof Error ? err.message : String(err),
    })
    process.exit(1)
  }

  app.listen(env.PORT, () => {
    logger.info('server_started', {
      port: env.PORT,
      environment: env.NODE_ENV,
    })
  })
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('server_shutdown_signal', { signal: 'SIGINT' })
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('server_shutdown_signal', { signal: 'SIGTERM' })
  await prisma.$disconnect()
  process.exit(0)
})

start()
