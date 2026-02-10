import { ref, computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { api } from '../api/client'
import { useAuth } from './useAuth'

interface ProblemAttempt {
  problemId: number
  lastAttempted: number
  completed: boolean
  attempts: number
}

export function useProblemProgress() {
  const attempts = useLocalStorage<Record<number, ProblemAttempt>>('codecraft-progress', {})
  const { isAuthenticated } = useAuth()
  const serverProgress = ref<Record<number, { status: string; attempts: number }>>({})

  // Load progress from API if authenticated
  if (isAuthenticated.value) {
    api
      .get<Array<{ problemId: number; status: string; attempts: number }>>('/progress')
      .then((data) => {
        for (const p of data) {
          serverProgress.value[p.problemId] = { status: p.status, attempts: p.attempts }
          // Merge into local state
          attempts.value[p.problemId] = {
            problemId: p.problemId,
            lastAttempted: Date.now(),
            completed: p.status === 'completed',
            attempts: p.attempts,
          }
        }
      })
      .catch(() => {
        // Fallback to localStorage
      })
  }

  const markAttempted = (problemId: number) => {
    const current = attempts.value[problemId] || {
      problemId,
      lastAttempted: 0,
      completed: false,
      attempts: 0,
    }

    attempts.value[problemId] = {
      ...current,
      lastAttempted: Date.now(),
      attempts: current.attempts + 1,
    }
  }

  const markCompleted = (problemId: number) => {
    const current = attempts.value[problemId] || {
      problemId,
      lastAttempted: Date.now(),
      completed: false,
      attempts: 0,
    }

    attempts.value[problemId] = {
      ...current,
      completed: true,
      lastAttempted: Date.now(),
    }
  }

  const isCompleted = (problemId: number) => {
    return attempts.value[problemId]?.completed || false
  }

  const lastAttemptedProblemId = computed(() => {
    const entries = Object.values(attempts.value)
    if (entries.length === 0) return null

    const sorted = entries.sort((a, b) => b.lastAttempted - a.lastAttempted)
    return sorted[0]?.problemId || null
  })

  const completedCount = computed(() => {
    return Object.values(attempts.value).filter(a => a.completed).length
  })

  return {
    attempts,
    markAttempted,
    markCompleted,
    isCompleted,
    lastAttemptedProblemId,
    completedCount,
  }
}
