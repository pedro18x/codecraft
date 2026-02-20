export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function successResponse<T>(data: T) {
  return { success: true as const, data }
}

export function errorResponse(code: string, message: string, details?: unknown) {
  return {
    success: false as const,
    error: { code, message, details },
  }
}
