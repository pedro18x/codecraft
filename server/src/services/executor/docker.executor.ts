import Dockerode from 'dockerode'
import { Writable } from 'stream'
import type { ICodeExecutor, ExecuteRequest, ExecuteResult, TestResult } from './types.js'
import { generateTestRunner, extractFunctionName } from './testRunnerTemplate.js'
import { transpileTypeScript } from './transpile.js'

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

    const sourceCode =
      request.language === 'typescript'
        ? (() => {
            const compiled = transpileTypeScript(request.code)
            if (!compiled.ok) {
              return compiled
            }
            return compiled.code
          })()
        : request.code

    if (typeof sourceCode !== 'string') {
      return this.allFailed(request, startTime, sourceCode.error)
    }

    const fnName = extractFunctionName(sourceCode)
    if (!fnName) {
      return this.allFailed(request, startTime, 'No function declaration found in your code.')
    }

    const execCode = generateTestRunner(sourceCode, request.testCases, fnName)

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
          // Ignore cleanup failures (container may already be removed).
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
        } catch {
          // Ignore kill failures after timeout.
        }
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
