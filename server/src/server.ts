import { createApp } from './app.js'
import { env } from './config/env.js'
import { prisma } from './config/database.js'

const app = createApp()

async function start() {
  // Verify database connection
  try {
    await prisma.$connect()
    console.log('[DB] Connected to PostgreSQL')
  } catch (err) {
    console.error('[DB] Failed to connect:', err)
    process.exit(1)
  }

  app.listen(env.PORT, () => {
    console.log(`[Server] Running on http://localhost:${env.PORT}`)
    console.log(`[Server] Environment: ${env.NODE_ENV}`)
  })
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Server] Shutting down...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('[Server] Shutting down...')
  await prisma.$disconnect()
  process.exit(0)
})

start()
