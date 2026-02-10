import { ref, watch } from 'vue'
import type { Language } from '../types'
import { api } from '../api/client'
import { useAuth } from './useAuth'

interface CodeStorage {
  [problemId: number]: {
    [language: string]: string
  }
}

export function useCodeStorage(problemId: number, language: Language, starterCode: string) {
  const storageKey = 'codecraft-code-storage'
  const { isAuthenticated } = useAuth()

  // Load from localStorage
  const loadLocalStorage = (): CodeStorage => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  // Save to localStorage
  const saveLocalStorage = (storage: CodeStorage) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(storage))
    } catch (e) {
      console.error('Failed to save code:', e)
    }
  }

  // Get stored code or use starter code
  const storage = loadLocalStorage()
  const storedCode = storage[problemId]?.[language] || starterCode
  const code = ref(storedCode)

  // Load from API if authenticated
  if (isAuthenticated.value) {
    api
      .get<{ code: string | null }>(`/code/${problemId}/${language}`)
      .then((data) => {
        if (data.code) {
          code.value = data.code
        }
      })
      .catch(() => {
        // Fallback to localStorage value already loaded
      })
  }

  // Auto-save on code change (debounced for API calls)
  let saveTimeout: ReturnType<typeof setTimeout>
  watch(code, (newCode) => {
    // Always save to localStorage (instant)
    const storage = loadLocalStorage()
    if (!storage[problemId]) {
      storage[problemId] = {}
    }
    storage[problemId][language] = newCode
    saveLocalStorage(storage)

    // Also save to API if authenticated (debounced)
    if (isAuthenticated.value) {
      clearTimeout(saveTimeout)
      saveTimeout = setTimeout(() => {
        api.put(`/code/${problemId}/${language}`, { code: newCode }).catch(() => {
          // Silent fail - localStorage is the backup
        })
      }, 1000)
    }
  })

  // Reset to starter code
  const resetCode = () => {
    code.value = starterCode
    const storage = loadLocalStorage()
    if (storage[problemId]) {
      delete storage[problemId][language]
      saveLocalStorage(storage)
    }

    if (isAuthenticated.value) {
      api.put(`/code/${problemId}/${language}`, { code: starterCode }).catch(() => {})
    }
  }

  return {
    code,
    resetCode,
  }
}
