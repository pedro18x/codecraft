import { z } from 'zod'
import { prisma } from '../config/database.js'
import { ApiError } from '../utils/apiResponse.js'
import { logger } from '../utils/logger.js'
import { ExecutorUnavailableError, getExecutor, type TestResult } from './executor/index.js'
import { HttpExecutorError } from './executor/http.executor.js'

const TestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
})

const TestCaseListSchema = z.array(TestCaseSchema)

export type ExecutionLanguage = 'javascript' | 'typescript' | 'python'

interface ExecuteProblemCodeInput {
  problemId: number
  language: ExecutionLanguage
  code: string
  route: string
  userId?: number | null
}

export interface ExecuteProblemCodeResult {
  problemId: number
  success: boolean
  testResults: TestResult[]
  executionTimeMs: number
}

function parseTestCases(value: unknown) {
  const parsed = TestCaseListSchema.safeParse(value)
  if (!parsed.success) {
    throw new ApiError('INTERNAL_ERROR', 'Problem test cases are misconfigured', 500)
  }
  return parsed.data
}

export async function executeProblemCode({
  problemId,
  language,
  code,
  route,
  userId = null,
}: ExecuteProblemCodeInput): Promise<ExecuteProblemCodeResult> {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true, testCases: true },
  })

  if (!problem) {
    throw new ApiError('NOT_FOUND', 'Problem not found', 404)
  }

  if (language === 'python') {
    throw new ApiError(
      'NOT_IMPLEMENTED',
      'Python execution is not yet supported. Please use JavaScript or TypeScript.',
      501
    )
  }

  let executor
  try {
    executor = await getExecutor()
  } catch (error) {
    if (error instanceof ExecutorUnavailableError) {
      throw new ApiError('EXECUTOR_UNAVAILABLE', 'Execution service temporarily unavailable', 503)
    }
    throw error
  }

  const testCases = parseTestCases(problem.testCases)

  try {
    const result = await executor.execute({
      code,
      language,
      testCases,
      timeoutMs: 5000,
      memoryLimitMb: 128,
    })

    logger.info('product_event', {
      event_name: 'code_executed',
      userId,
      route,
      success: result.success,
      problemId,
      language,
      executionTimeMs: result.executionTimeMs,
    })

    return {
      problemId,
      success: result.success,
      testResults: result.testResults,
      executionTimeMs: result.executionTimeMs,
    }
  } catch (error) {
    if (error instanceof HttpExecutorError && error.statusCode === 503) {
      throw new ApiError('EXECUTOR_UNAVAILABLE', error.message, 503)
    }
    throw error
  }
}
