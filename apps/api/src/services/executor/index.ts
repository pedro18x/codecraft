import type { ICodeExecutor } from './types.js'
import { DockerExecutor } from './docker.executor.js'
import { VMExecutor } from './vm.executor.js'
import { HttpExecutor } from './http.executor.js'
import { env } from '../../config/env.js'
import { logger } from '../../utils/logger.js'

let executor: ICodeExecutor | null = null

export class ExecutorUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExecutorUnavailableError'
  }
}

/**
 * Returns the best available code executor.
 * Uses dedicated executor service when configured.
 * In production, VM fallback is disabled.
 */
export async function getExecutor(): Promise<ICodeExecutor> {
  if (executor) return executor

  if (env.EXECUTOR_URL) {
    const remote = new HttpExecutor({
      baseUrl: env.EXECUTOR_URL,
      serviceToken: env.EXECUTOR_SERVICE_TOKEN,
      timeoutMs: env.EXECUTOR_TIMEOUT_MS + 500,
    })
    if (await remote.isAvailable()) {
      logger.info('executor_selected', { executor: remote.name, mode: 'remote' })
      executor = remote
      return executor
    }
    if (env.NODE_ENV === 'production') {
      throw new ExecutorUnavailableError('Dedicated executor service unavailable')
    }
    logger.warn('executor_http_fallback', {
      message: `HttpExecutor at ${env.EXECUTOR_URL} unavailable; falling back to local executors.`,
    })
  }

  const docker = new DockerExecutor()
  if (await docker.isAvailable()) {
    logger.info('executor_selected', { executor: docker.name, mode: 'docker' })
    executor = docker
    return executor
  }

  if (env.NODE_ENV === 'production') {
    throw new ExecutorUnavailableError(
      'Docker unavailable and VM fallback disabled in production. Configure EXECUTOR_URL.'
    )
  }

  logger.warn('executor_vm_fallback', {
    message: 'Docker unavailable; using VM sandbox in non-production only.',
  })
  executor = new VMExecutor()
  return executor
}

export async function getExecutorReadiness(): Promise<boolean> {
  if (env.EXECUTOR_URL) {
    const remote = new HttpExecutor({
      baseUrl: env.EXECUTOR_URL,
      serviceToken: env.EXECUTOR_SERVICE_TOKEN,
      timeoutMs: Math.max(1000, env.EXECUTOR_TIMEOUT_MS),
    })
    if (await remote.isAvailable()) return true
    if (env.NODE_ENV === 'production') return false
    // In dev, fall through to check local executors
  }

  const docker = new DockerExecutor()
  if (await docker.isAvailable()) {
    return true
  }

  return env.NODE_ENV !== 'production'
}

export type { ICodeExecutor, ExecuteRequest, ExecuteResult, TestResult } from './types.js'
