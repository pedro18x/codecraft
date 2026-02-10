export interface TestCase {
  input: string
  expectedOutput: string
}

export interface TestResult {
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput?: string
  error?: string
}

export interface ExecuteRequest {
  code: string
  language: 'javascript' | 'typescript'
  testCases: TestCase[]
  timeoutMs?: number
  memoryLimitMb?: number
}

export interface ExecuteResult {
  success: boolean
  testResults: TestResult[]
  executionTimeMs: number
}

export interface ICodeExecutor {
  execute(request: ExecuteRequest): Promise<ExecuteResult>
  isAvailable(): Promise<boolean>
  name: string
}
