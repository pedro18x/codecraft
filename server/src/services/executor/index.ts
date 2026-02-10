import type { ICodeExecutor } from './types.js'
import { DockerExecutor } from './docker.executor.js'
import { VMExecutor } from './vm.executor.js'

let executor: ICodeExecutor | null = null

/**
 * Returns the best available code executor.
 * Tries Docker first, falls back to Node VM.
 */
export async function getExecutor(): Promise<ICodeExecutor> {
  if (executor) return executor

  const docker = new DockerExecutor()
  if (await docker.isAvailable()) {
    console.log('[Executor] Using Docker for code execution')
    executor = docker
    return executor
  }

  console.warn(
    '[Executor] Docker unavailable, falling back to VM sandbox (JS/TS only).',
    'WARNING: VM sandbox is NOT fully isolated. Use Docker in production.'
  )
  executor = new VMExecutor()
  return executor
}

export type { ICodeExecutor, ExecuteRequest, ExecuteResult, TestResult } from './types.js'
