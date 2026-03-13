import type { ICodeExecutor, ExecuteRequest, ExecuteResult } from './types.js'

interface HttpExecutorOptions {
  baseUrl: string
  serviceToken: string
  timeoutMs: number
}

export class HttpExecutorError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'HttpExecutorError'
    this.statusCode = statusCode
  }
}

export class HttpExecutor implements ICodeExecutor {
  name = 'HttpExecutor'
  private baseUrl: string
  private serviceToken: string
  private timeoutMs: number

  constructor(options: HttpExecutorOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '')
    this.serviceToken = options.serviceToken
    this.timeoutMs = options.timeoutMs
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), Math.min(this.timeoutMs, 2000))
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.serviceToken}`,
        },
        signal: controller.signal,
      })
      clearTimeout(timer)
      return response.ok
    } catch {
      return false
    }
  }

  async execute(request: ExecuteRequest): Promise<ExecuteResult> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)
    try {
      const response = await fetch(`${this.baseUrl}/internal/execute`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.serviceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      })

      if (!response.ok) {
        let message = `Executor responded with ${response.status}`
        try {
          const body = (await response.json()) as { error?: { message?: string } }
          if (body.error?.message) {
            message = body.error.message
          }
        } catch {
          // Ignore parse errors and use generic message.
        }
        throw new HttpExecutorError(message, response.status)
      }

      const body = (await response.json()) as {
        success: true
        data: ExecuteResult
      }
      return body.data
    } finally {
      clearTimeout(timer)
    }
  }
}
