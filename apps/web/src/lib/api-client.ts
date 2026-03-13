const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

const AUTH_PATHS_WITHOUT_REFRESH = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/auth/csrf',
])

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

class ApiClient {
  private csrfCookieName = 'csrf_token'
  private csrfPromise: Promise<string | null> | null = null
  private refreshPromise: Promise<boolean> | null = null

  private async ensureCsrf(): Promise<string | null> {
    const existing = getCookieValue(this.csrfCookieName)
    if (existing) return existing
    if (this.csrfPromise) return this.csrfPromise

    this.csrfPromise = fetch(`${BASE_URL}/auth/csrf`, {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) return null
        const body = await res.json()
        if (body?.data?.cookieName) this.csrfCookieName = body.data.cookieName
        return getCookieValue(this.csrfCookieName) || body?.data?.csrfToken || null
      })
      .catch(() => null)
      .finally(() => { this.csrfPromise = null })

    return this.csrfPromise
  }

  private async tryRefresh(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise
    this.refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => { this.refreshPromise = null })
    return this.refreshPromise
  }

  private async request<T>(path: string, init: RequestInit & { method: string }): Promise<T> {
    const allowRefresh = !AUTH_PATHS_WITHOUT_REFRESH.has(path)
    const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(init.method.toUpperCase())

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string>),
    }

    if (isMutation && path !== '/auth/csrf') {
      const token = await this.ensureCsrf()
      if (token) headers['X-CSRF-Token'] = token
    }

    const doFetch = () =>
      fetch(`${BASE_URL}${path}`, { ...init, headers, credentials: 'include' })

    let res = await doFetch()

    if (res.status === 401 && allowRefresh) {
      const refreshed = await this.tryRefresh()
      if (!refreshed) throw new ApiRequestError('Session expired', 'TOKEN_EXPIRED', 401)
      res = await doFetch()
    }

    let body: unknown
    try {
      body = await res.json()
    } catch {
      throw new ApiRequestError('Invalid response', 'INVALID_RESPONSE', res.status)
    }

    if (!res.ok) {
      const err = body as { error?: { message?: string; code?: string } }
      throw new ApiRequestError(
        err.error?.message || res.statusText,
        err.error?.code || 'UNKNOWN',
        res.status,
      )
    }

    return (body as { data: T }).data
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: 'GET' })
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' })
  }
}

export const api = new ApiClient()
