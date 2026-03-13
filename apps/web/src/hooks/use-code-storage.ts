'use client'

import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuth } from './use-auth'
import type { Language } from '@/types'

const LOCAL_KEY = 'codecraft-code-storage'

type Store = Record<number, Partial<Record<Language, string>>>

let cachedStore: Store | null = null
let persistTimer: ReturnType<typeof setTimeout> | null = null

function loadStore(): Store {
  if (typeof window === 'undefined') return {}
  if (cachedStore) return cachedStore

  try {
    cachedStore = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') as Store
  } catch {
    cachedStore = {}
  }

  return cachedStore
}

function schedulePersist() {
  if (typeof window === 'undefined') return
  if (persistTimer) clearTimeout(persistTimer)

  persistTimer = setTimeout(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(cachedStore ?? {}))
    } catch {
      // ignore storage failures
    }
  }, 250)
}

function readStoredCode(problemId: number | null, language: Language): string | undefined {
  if (!problemId) return undefined
  return loadStore()[problemId]?.[language]
}

function writeStoredCode(problemId: number, language: Language, code: string | undefined) {
  const store = loadStore()
  const existing = store[problemId] ?? {}

  if (code === undefined) {
    delete existing[language]
  } else {
    existing[language] = code
  }

  if (Object.keys(existing).length === 0) {
    delete store[problemId]
  } else {
    store[problemId] = existing
  }

  cachedStore = store
  schedulePersist()
}

interface Opts {
  problemId: number | null
  language: Language
  starterCode: string
}

function resolveLocalCode(problemId: number | null, language: Language, starterCode: string): string {
  if (!problemId) return starterCode
  const local = readStoredCode(problemId, language)
  return local !== undefined ? local : starterCode
}

export function useCodeStorage({ problemId, language, starterCode }: Opts) {
  const { isAuthenticated } = useAuth()
  const storageScope = problemId ? `${problemId}:${language}` : `starter:${language}`
  const stateKey = `${storageScope}:${starterCode}`
  const [draft, setDraft] = useState(() => ({
    key: stateKey,
    value: resolveLocalCode(problemId, language, starterCode),
  }))
  const code = draft.key === stateKey
    ? draft.value
    : resolveLocalCode(problemId, language, starterCode)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeKeyRef = useRef<string | null>(null)

  useEffect(() => {
    activeKeyRef.current = problemId ? `${problemId}:${language}` : null
  }, [problemId, language])

  // Fetch from API when authenticated and no local copy exists
  useEffect(() => {
    if (!problemId || !isAuthenticated) return
    const local = readStoredCode(problemId, language)
    if (local !== undefined) return
    const activeKey = `${problemId}:${language}`
    let cancelled = false

    api.get<{ code: string }>(`/code/${problemId}/${language}`)
      .then((d) => {
        if (!d?.code) return
        writeStoredCode(problemId, language, d.code)
        setDraft((current) => {
          if (cancelled || activeKeyRef.current !== activeKey || current.key !== stateKey) {
            return current
          }

          if (current.value !== starterCode) return current

          return {
            key: stateKey,
            value: d.code,
          }
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [problemId, language, isAuthenticated, starterCode, stateKey])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  // Persist on change
  const updateCode = (next: string) => {
    setDraft({
      key: stateKey,
      value: next,
    })
    if (!problemId) return

    writeStoredCode(problemId, language, next)

    if (isAuthenticated) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        api.put(`/code/${problemId}/${language}`, { code: next }).catch(() => {})
      }, 1500)
    }
  }

  const resetCode = () => {
    if (!problemId) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    writeStoredCode(problemId, language, undefined)
    setDraft({
      key: stateKey,
      value: starterCode,
    })
    if (isAuthenticated) {
      api.put(`/code/${problemId}/${language}`, { code: starterCode }).catch(() => {})
    }
  }

  return { code, setCode: updateCode, resetCode }
}
