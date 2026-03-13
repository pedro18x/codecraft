'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuth } from './use-auth'
import { useCallback } from 'react'

interface ProgressMap {
  [problemId: number]: 'attempted' | 'completed'
}

const LOCAL_KEY = 'codecraft-progress'

function loadLocal(): ProgressMap {
  try {
    const stored = localStorage.getItem(LOCAL_KEY)
    return stored ? (JSON.parse(stored) as ProgressMap) : {}
  } catch {
    return {}
  }
}

function saveLocal(map: ProgressMap) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(map))
  } catch { /* ignore */ }
}

export function useProgress() {
  const { isAuthenticated } = useAuth()
  const qc = useQueryClient()
  const scope = isAuthenticated ? 'user' : 'guest'

  const { data: progress = {} } = useQuery<ProgressMap>({
    queryKey: queryKeys.progress.map(scope),
    queryFn: async () => {
      if (isAuthenticated) {
        const entries = await api.get<Array<{ problemId: number; status: 'attempted' | 'completed' }>>('/progress')
        return Object.fromEntries(entries.map((e) => [e.problemId, e.status]))
      }
      return loadLocal()
    },
    staleTime: 30_000,
  })

  const markAttempted = useCallback(
    (problemId: number) => {
      qc.setQueryData<ProgressMap>(queryKeys.progress.map(scope), (old = {}) => {
        if (old[problemId]) return old
        const next = { ...old, [problemId]: 'attempted' as const }
        if (!isAuthenticated) saveLocal(next)
        return next
      })
      if (isAuthenticated) {
        api.post('/progress', { problemId, status: 'attempted' }).catch(() => {})
        qc.invalidateQueries({ queryKey: queryKeys.progress.stats(scope) })
        qc.invalidateQueries({ queryKey: queryKeys.progress.entries(scope) })
      }
    },
    [isAuthenticated, qc, scope],
  )

  const markCompleted = useCallback(
    (problemId: number) => {
      qc.setQueryData<ProgressMap>(queryKeys.progress.map(scope), (old = {}) => {
        const next = { ...old, [problemId]: 'completed' as const }
        if (!isAuthenticated) saveLocal(next)
        return next
      })
      if (isAuthenticated) {
        api.post('/progress', { problemId, status: 'completed' }).catch(() => {})
        qc.invalidateQueries({ queryKey: queryKeys.progress.stats(scope) })
        qc.invalidateQueries({ queryKey: queryKeys.progress.entries(scope) })
      }
    },
    [isAuthenticated, qc, scope],
  )

  const isCompleted = useCallback((id: number) => progress[id] === 'completed', [progress])
  const isAttempted = useCallback((id: number) => !!progress[id], [progress])
  const completedCount = Object.values(progress).filter((v) => v === 'completed').length

  return { progress, markAttempted, markCompleted, isCompleted, isAttempted, completedCount }
}
