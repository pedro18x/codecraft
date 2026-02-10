import { ref, computed } from 'vue'
import { api, ApiRequestError } from '../api/client'

interface User {
  id: number
  email: string
  username: string
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// Module-level state (singleton across all component instances)
const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)

  function setTokens(auth: AuthResponse) {
    user.value = auth.user
    localStorage.setItem('accessToken', auth.accessToken)
    localStorage.setItem('refreshToken', auth.refreshToken)
  }

  function clearAuth() {
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  async function register(email: string, username: string, password: string) {
    isLoading.value = true
    error.value = null
    try {
      const auth = await api.post<AuthResponse>('/auth/register', {
        email,
        username,
        password,
      })
      setTokens(auth)
    } catch (err) {
      error.value =
        err instanceof ApiRequestError ? err.message : 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null
    try {
      const auth = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      })
      setTokens(auth)
    } catch (err) {
      error.value =
        err instanceof ApiRequestError ? err.message : 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      await api.post('/auth/logout', { refreshToken })
    } catch {
      // Logout even if API call fails
    } finally {
      clearAuth()
    }
  }

  async function fetchMe() {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    try {
      user.value = await api.get<User>('/auth/me')
    } catch {
      clearAuth()
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    fetchMe,
  }
}
