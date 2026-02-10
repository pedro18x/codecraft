import Dockerode from 'dockerode'
import { Writable } from 'stream'
import type { ICodeExecutor, ExecuteRequest, ExecuteResult, TestResult } from './types.js'
import { generateTestRunner, extractFunctionName } from './testRunnerTemplate.js'

export class DockerExecutor implements ICodeExecutor {
  name = 'DockerExecutor'
  private docker: Dockerode

  constructor() {
    this.docker = new Dockerode()
  }

  private static readonly IMAGE = 'node:20-alpine'

  async isAvailable(): Promise<boolean> {
    try {
      await this.docker.ping()
      // Verify the required image exists locally
      await this.docker.getImage(DockerExecutor.IMAGE).inspect()
      return true
    } catch {
      return false
    }
  }

  async execute(request: ExecuteRequest): Promise<ExecuteResult> {
    const startTime = Date.now()
    const timeout = request.timeoutMs || 5000
    const memoryLimit = (request.memoryLimitMb || 128) * 1024 * 1024

    const fnName = extractFunctionName(request.code)
    if (!fnName) {
      return this.allFailed(request, startTime, 'No function declaration found in your code.')
    }

    const runnerCode = generateTestRunner(request.code, request.testCases, fnName)

    // For TypeScript, we strip type annotations to run as plain JS
    const execCode =
      request.language === 'typescript' ? stripTypeAnnotations(runnerCode) : runnerCode

    let container: Dockerode.Container | undefined
    try {
      container = await this.docker.createContainer({
        Image: DockerExecutor.IMAGE,
        Cmd: ['node', '-e', execCode],
        NetworkDisabled: true,
        HostConfig: {
          Memory: memoryLimit,
          MemorySwap: memoryLimit,
          CpuQuota: 50000,
          PidsLimit: 50,
          ReadonlyRootfs: true,
          AutoRemove: true,
        },
      })

      await container.start()

      // Collect output
      const { stdout, stderr } = await this.collectOutput(container, timeout)

      const executionTimeMs = Date.now() - startTime

      if (stderr && !stdout) {
        return this.allFailed(request, startTime, stderr.trim())
      }

      try {
        const testResults: TestResult[] = JSON.parse(stdout.trim())
        return {
          success: testResults.every((r) => r.passed),
          testResults,
          executionTimeMs,
        }
      } catch {
        return this.allFailed(request, startTime, stdout || 'No output from execution')
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.includes('timeout')
            ? 'Time limit exceeded (5s)'
            : err.message
          : 'Execution failed'
      return this.allFailed(request, startTime, message)
    } finally {
      // Ensure container is cleaned up
      if (container) {
        try {
          await container.stop({ t: 0 })
        } catch {
          // Already stopped or removed
        }
      }
    }
  }

  private async collectOutput(
    container: Dockerode.Container,
    timeoutMs: number
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      let stdout = ''
      let stderr = ''

      const timer = setTimeout(async () => {
        try {
          await container.kill()
        } catch {}
        reject(new Error('timeout'))
      }, timeoutMs)

      container
        .logs({ follow: true, stdout: true, stderr: true })
        .then((stream) => {
          const stdoutWriter = new Writable({
            write(chunk, _encoding, callback) {
              stdout += chunk.toString()
              callback()
            },
          })

          const stderrWriter = new Writable({
            write(chunk, _encoding, callback) {
              stderr += chunk.toString()
              callback()
            },
          })

          container.modem.demuxStream(stream, stdoutWriter, stderrWriter)

          stream.on('end', () => {
            clearTimeout(timer)
            resolve({ stdout, stderr })
          })
        })
        .catch((err) => {
          clearTimeout(timer)
          reject(err)
        })
    })
  }

  private allFailed(request: ExecuteRequest, startTime: number, error: string): ExecuteResult {
    return {
      success: false,
      testResults: request.testCases.map((tc) => ({
        passed: false,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        error,
      })),
      executionTimeMs: Date.now() - startTime,
    }
  }
}

/**
 * Naive TypeScript → JavaScript type stripping.
 * Removes type annotations, interfaces, and type imports.
 * For proper TS execution in Docker, you'd use tsx or ts-node in the container.
 */
function stripTypeAnnotations(code: string): string {
  return code
    // Remove : Type from parameters and return types
    .replace(/:\s*(?:number|string|boolean|void|any|unknown|never|null|undefined)(?:\[\])?/g, '')
    // Remove : Type[] patterns
    .replace(/:\s*\w+\[\]/g, '')
    // Remove generic type parameters <T>
    .replace(/<[^>]+>/g, '')
    // Remove interface/type declarations
    .replace(/^(interface|type)\s+.*$/gm, '')
    // Remove 'as Type' assertions
    .replace(/\s+as\s+\w+/g, '')
}
