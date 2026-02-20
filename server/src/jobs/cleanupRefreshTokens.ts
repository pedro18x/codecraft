import { cleanupExpiredTokens } from '../services/auth.service.js'
import { logger } from '../utils/logger.js'

async function run() {
  const deletedCount = await cleanupExpiredTokens()
  logger.info('refresh_token_cleanup', { deletedCount })
}

run()
  .catch((error) => {
    logger.error('refresh_token_cleanup_failed', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
