'use client'

import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { api, ApiRequestError } from '@/lib/api-client'

interface User {
  id: number
  email: string
  username: string
  role: string
  createdAt?: string
}

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authChannelRef = useRef<BroadcastChannel | null>(null)

  const fetchMe = useCallback(async () => {
    try {
      const data = await api.get<User>('/auth/me')
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  // Cross-tab sync
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return

    const channel = new BroadcastChannel('codecraft-auth')
    authChannelRef.current = channel

    channel.onmessage = async (e: MessageEvent<{ type: 'login' | 'logout' }>) => {
      if (e.data?.type === 'logout') { setUser(null); return }
      if (e.data?.type === 'login') { await fetchMe() }
    }

    return () => {
      channel.onmessage = null
      channel.close()
      if (authChannelRef.current === channel) authChannelRef.current = null
    }
  }, [fetchMe])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)
    try {
      const data = await api.post<{ user: User }>('/auth/login', { email, password })
      setUser(data.user)
      authChannelRef.current?.postMessage({ type: 'login' })
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, username: string, password: string) => {
    setError(null)
    setIsLoading(true)
    try {
      const data = await api.post<{ user: User }>('/auth/register', { email, username, password })
      setUser(data.user)
      authChannelRef.current?.postMessage({ type: 'login' })
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // still clear local state
    } finally {
      setUser(null)
      authChannelRef.current?.postMessage({ type: 'logout' })
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    error,
    login,
    register,
    logout,
    fetchMe,
  }), [error, fetchMe, isLoading, login, logout, register, user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
