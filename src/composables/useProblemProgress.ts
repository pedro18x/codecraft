import { computed, ref, watch } from 'vue'
import { api } from '../api/client'
import { useAuth } from './useAuth'

interface ProblemAttempt {
  problemId: number
  lastAttempted: number
  completed: boolean
  attempts: number
}

type ProgressMap = Record<number, ProblemAttempt>

const LEGACY_STORAGE_KEY = 'codecraft-progress'
const GUEST_STORAGE_KEY = 'codecraft-progress:guest'

const attempts = ref<ProgressMap>({})
let storageKey = GUEST_STORAGE_KEY
let initialized = false
let syncRequestId = 0

const getStorageKey = (userId: number | null | undefined) => {
  if (!userId) return GUEST_STORAGE_KEY
  return `codecraft-progress:user:${userId}`
}

const readProgress = (key: string): ProgressMap => {
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored) as ProgressMap

    // One-time legacy fallback for guest users only.
    if (key === GUEST_STORAGE_KEY) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
      return legacy ? (JSON.parse(legacy) as ProgressMap) : {}
    }
  } catch {
    // Ignore parse/storage errors and fallback to empty map.
  }

  return {}
}

const writeProgress = (key: string, value: ProgressMap) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage write failures (private mode/full quota).
  }
}

const normalizeServerProgress = (
  data: Array<{ problemId: number; status: string; attempts: number }>
): ProgressMap => {
  const normalized: ProgressMap = {}
  const now = Date.now()

  for (const entry of data) {
    normalized[entry.problemId] = {
      problemId: entry.problemId,
      lastAttempted: now,
      completed: entry.status === 'completed',
      attempts: entry.attempts,
    }
  }

  return normalized
}

function useProblemProgress() {
  const { user, isAuthenticated } = useAuth()

  const syncFromServer = async () => {
    if (!isAuthenticated.value) return

    const requestId = ++syncRequestId
    try {
      const data = await api.get<Array<{ problemId: number; status: string; attempts: number }>>('/progress')

      // Ignore stale responses after account switches.
      if (requestId !== syncRequestId) return

      attempts.value = normalizeServerProgress(data)
    } catch {
      // Keep local scoped data when API is unavailable.
    }
  }

  if (!initialized) {
    initialized = true

    watch(
      () => user.value?.id ?? null,
      (userId) => {
        // Invalidate any in-flight sync before switching scopes.
        syncRequestId += 1
        storageKey = getStorageKey(userId)
        attempts.value = readProgress(storageKey)

        if (userId) {
          void syncFromServer()
        }
      },
      { immediate: true }
    )

    watch(
      attempts,
      (newValue) => {
        writeProgress(storageKey, newValue)
      },
      { deep: true }
    )
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
    return Object.values(attempts.value).filter((attempt) => attempt.completed).length
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

export { useProblemProgress }
