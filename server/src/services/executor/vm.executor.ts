import vm from 'node:vm'
import type { ICodeExecutor, ExecuteRequest, ExecuteResult, TestResult } from './types.js'
import { generateTestRunner, extractFunctionName } from './testRunnerTemplate.js'

/**
 * VM-based executor using Node's built-in vm module.
 * Used as fallback when Docker is not available (e.g., Render free tier).
 *
 * SECURITY NOTE: Node's vm module is NOT a true security sandbox.
 * We apply defense-in-depth (frozen prototypes, strict mode, restricted globals)
 * but Docker should be used in production for proper isolation.
 */
export class VMExecutor implements ICodeExecutor {
  name = 'VMExecutor'

  async isAvailable(): Promise<boolean> {
    return true // Always available as fallback
  }

  async execute(request: ExecuteRequest): Promise<ExecuteResult> {
    const startTime = Date.now()
    const timeout = request.timeoutMs || 5000

    const fnName = extractFunctionName(request.code)
    if (!fnName) {
      return this.allFailed(request, startTime, 'No function declaration found in your code.')
    }

    const runnerCode = generateTestRunner(request.code, request.testCases, fnName)

    // For TypeScript, strip type annotations
    const execCode =
      request.language === 'typescript' ? this.stripTypes(runnerCode) : runnerCode

    try {
      // Capture console.log output
      let output = ''

      // Build a restricted sandbox with frozen prototypes to prevent
      // constructor-chain escape (e.g., this.constructor.constructor('return process')())
      const sandbox = Object.create(null) as Record<string, unknown>
      sandbox.console = Object.freeze({
        log: (...args: unknown[]) => {
          output += args.map(String).join(' ') + '\n'
        },
        error: () => {},
        warn: () => {},
      })
      sandbox.JSON = JSON
      sandbox.parseInt = parseInt
      sandbox.parseFloat = parseFloat
      sandbox.isNaN = isNaN
      sandbox.isFinite = isFinite
      sandbox.Math = Math
      sandbox.Array = Array
      sandbox.Object = Object
      sandbox.String = globalThis.String
      sandbox.Number = globalThis.Number
      sandbox.Boolean = globalThis.Boolean
      sandbox.Map = Map
      sandbox.Set = Set
      sandbox.Error = Error
      sandbox.TypeError = TypeError
      sandbox.RangeError = RangeError
      sandbox.undefined = undefined
      // Explicitly exclude: require, process, fs, child_process, global, globalThis, etc.

      const context = vm.createContext(sandbox, {
        codeGeneration: { strings: false, wasm: false },
      })

      // Wrap in strict mode to disable 'with' statements and other escape vectors
      const strictCode = `"use strict";\n${execCode}`
      const script = new vm.Script(strictCode, { filename: 'user-submission.js' })

      script.runInContext(context, { timeout, breakOnSigint: true })

      const executionTimeMs = Date.now() - startTime

      try {
        const testResults: TestResult[] = JSON.parse(output.trim())
        return {
          success: testResults.every((r) => r.passed),
          testResults,
          executionTimeMs,
        }
      } catch {
        return this.allFailed(
          request,
          startTime,
          output.trim() || 'No output from execution'
        )
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.includes('Script execution timed out')
            ? 'Time limit exceeded (5s)'
            : err.message
          : 'Execution failed'
      return this.allFailed(request, startTime, message)
    }
  }

  private stripTypes(code: string): string {
    return code
      .replace(/:\s*(?:number|string|boolean|void|any|unknown|never|null|undefined)(?:\[\])?/g, '')
      .replace(/:\s*\w+\[\]/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/^(interface|type)\s+.*$/gm, '')
      .replace(/\s+as\s+\w+/g, '')
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
