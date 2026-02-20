import express from 'express'
import { z } from 'zod'
import { env } from './config/env.js'
import { DockerExecutor } from './services/executor/docker.executor.js'
import { errorResponse, successResponse } from './utils/apiResponse.js'
import { logger } from './utils/logger.js'

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))

const allowedIps = env.EXECUTOR_ALLOWED_IPS
  ? env.EXECUTOR_ALLOWED_IPS.split(',').map((ip) => ip.trim()).filter(Boolean)
  : []

const internalAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const auth = req.header('authorization')
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json(errorResponse('UNAUTHORIZED', 'Missing service token'))
    return
  }

  const token = auth.slice(7)
  if (token !== env.EXECUTOR_SERVICE_TOKEN) {
    res.status(401).json(errorResponse('UNAUTHORIZED', 'Invalid service token'))
    return
  }

  if (allowedIps.length > 0) {
    const source = req.ip || req.socket.remoteAddress || ''
    if (!allowedIps.includes(source)) {
      res.status(403).json(errorResponse('FORBIDDEN', 'Source IP not allowed'))
      return
    }
  }

  next()
}

class ExecutionQueue {
  private active = 0
  private waiting: Array<() => void> = []

  constructor(
    private readonly maxConcurrent: number,
    private readonly maxQueue: number
  ) {}

  async acquire(): Promise<(() => void) | null> {
    if (this.active < this.maxConcurrent) {
      this.active += 1
      return () => this.release()
    }

    if (this.waiting.length >= this.maxQueue) {
      return null
    }

    return new Promise((resolve) => {
      this.waiting.push(() => {
        this.active += 1
        resolve(() => this.release())
      })
    })
  }

  stats() {
    return {
      active: this.active,
      queued: this.waiting.length,
    }
  }

  private release() {
    this.active = Math.max(0, this.active - 1)
    const next = this.waiting.shift()
    if (next) next()
  }
}

const queue = new ExecutionQueue(env.EXECUTOR_MAX_CONCURRENCY, env.EXECUTOR_MAX_QUEUE)
const dockerExecutor = new DockerExecutor()

const ExecuteSchema = z.object({
  code: z.string().min(1).max(50000),
  language: z.enum(['javascript', 'typescript']),
  timeoutMs: z.number().int().min(1000).max(15000).optional(),
  memoryLimitMb: z.number().int().min(64).max(512).optional(),
  testCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
    })
  ),
})

app.get('/health', internalAuth, async (_req, res) => {
  const available = await dockerExecutor.isAvailable()
  if (!available) {
    res.status(503).json(errorResponse('NOT_READY', 'Docker executor unavailable'))
    return
  }
  res.json(successResponse({ status: 'ok', queue: queue.stats() }))
})

app.post('/internal/execute', internalAuth, async (req, res) => {
  const parsed = ExecuteSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json(errorResponse('VALIDATION_ERROR', 'Invalid execution payload', parsed.error.flatten()))
    return
  }

  const release = await queue.acquire()
  if (!release) {
    res.setHeader('retry-after', '1')
    res.status(503).json(errorResponse('EXECUTOR_QUEUE_FULL', 'Execution queue is full, retry shortly'))
    return
  }

  try {
    const result = await dockerExecutor.execute({
      ...parsed.data,
      timeoutMs: parsed.data.timeoutMs ?? env.EXECUTOR_TIMEOUT_MS,
      memoryLimitMb: parsed.data.memoryLimitMb ?? env.EXECUTOR_MEMORY_LIMIT_MB,
    })
    res.json(successResponse(result))
  } catch (err) {
    logger.error('executor_request_failed', {
      message: err instanceof Error ? err.message : String(err),
    })
    res.status(500).json(errorResponse('EXECUTION_FAILED', 'Executor failure'))
  } finally {
    release()
  }
})

app.listen(env.PORT, () => {
  logger.info('executor_service_started', {
    port: env.PORT,
    maxConcurrent: env.EXECUTOR_MAX_CONCURRENCY,
    maxQueue: env.EXECUTOR_MAX_QUEUE,
  })
})
