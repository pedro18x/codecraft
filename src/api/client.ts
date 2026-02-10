const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface ApiResponse<T> {
  success: true
  data: T
}

interface ApiErrorResponse {
  success: false
  error: { code: string; message: string; details?: unknown }
}

class ApiClient {
  private baseURL: string
  private refreshPromise: Promise<boolean> | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const token = localStorage.getItem('accessToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response, allowRefresh: boolean): Promise<T> {
    if (response.status === 401 && allowRefresh) {
      const refreshed = await this.tryRefresh()
      if (!refreshed) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        throw new ApiRequestError('Session expired', 'TOKEN_EXPIRED', 401)
      }
      throw new TokenRefreshedError()
    }

    if (response.status === 401 && !allowRefresh) {
      throw new ApiRequestError('Session expired', 'TOKEN_EXPIRED', 401)
    }

    let body: unknown
    try {
      body = await response.json()
    } catch {
      throw new ApiRequestError('Invalid response format', 'INVALID_RESPONSE', response.status)
    }

    if (!response.ok) {
      const err = body as ApiErrorResponse
      throw new ApiRequestError(
        err.error?.message || 'Request failed',
        err.error?.code || 'UNKNOWN',
        response.status
      )
    }

    return (body as ApiResponse<T>).data
  }

  private async tryRefresh(): Promise<boolean> {
    // Singleton: if a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.doRefresh()
    try {
      return await this.refreshPromise
    } finally {
      this.refreshPromise = null
    }
  }

  private async doRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return false

    try {
      const res = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!res.ok) return false

      const body = await res.json()
      localStorage.setItem('accessToken', body.data.accessToken)
      localStorage.setItem('refreshToken', body.data.refreshToken)
      return true
    } catch {
      return false
    }
  }

  async get<T>(path: string): Promise<T> {
    try {
      const res = await fetch(`${this.baseURL}${path}`, {
        headers: this.getHeaders(),
      })
      return this.handleResponse<T>(res, true)
    } catch (err) {
      if (err instanceof TokenRefreshedError) {
        // Retry once with new token — pass allowRefresh=false to prevent infinite loop
        const res = await fetch(`${this.baseURL}${path}`, {
          headers: this.getHeaders(),
        })
        return this.handleResponse<T>(res, false)
      }
      throw err
    }
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    try {
      const res = await fetch(`${this.baseURL}${path}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      })
      return this.handleResponse<T>(res, true)
    } catch (err) {
      if (err instanceof TokenRefreshedError) {
        const res = await fetch(`${this.baseURL}${path}`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: body ? JSON.stringify(body) : undefined,
        })
        return this.handleResponse<T>(res, false)
      }
      throw err
    }
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    try {
      const res = await fetch(`${this.baseURL}${path}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      })
      return this.handleResponse<T>(res, true)
    } catch (err) {
      if (err instanceof TokenRefreshedError) {
        const res = await fetch(`${this.baseURL}${path}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: body ? JSON.stringify(body) : undefined,
        })
        return this.handleResponse<T>(res, false)
      }
      throw err
    }
  }
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

class TokenRefreshedError extends Error {
  constructor() {
    super('Token refreshed')
  }
}

export const api = new ApiClient(API_URL)
