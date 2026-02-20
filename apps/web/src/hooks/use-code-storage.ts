'use client'

import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuth } from './use-auth'
import type { Language } from '@/types'

const LOCAL_KEY = 'codecraft-code-storage'

type Store = Record<number, Partial<Record<Language, string>>>

function load(): Store {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}')
  } catch { return {} }
}

function save(store: Store) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(store)) } catch { /* ignore */ }
}

interface Opts {
  problemId: number | null
  language: Language
  starterCode: string
}

function resolveLocalCode(problemId: number | null, language: Language, starterCode: string): string {
  if (!problemId) return starterCode
  const local = load()[problemId]?.[language]
  return local !== undefined ? local : starterCode
}

export function useCodeStorage({ problemId, language, starterCode }: Opts) {
  const { isAuthenticated } = useAuth()
  const [code, setCode] = useState(() => resolveLocalCode(problemId, language, starterCode))
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Derived-state pattern: track previous deps in state so we can
  // call setCode synchronously during render (no effect needed).
  const [prevProblemId, setPrevProblemId] = useState(problemId)
  const [prevLanguage, setPrevLanguage] = useState(language)
  const [prevStarterCode, setPrevStarterCode] = useState(starterCode)
  if (prevProblemId !== problemId || prevLanguage !== language || prevStarterCode !== starterCode) {
    setPrevProblemId(problemId)
    setPrevLanguage(language)
    setPrevStarterCode(starterCode)
    setCode(resolveLocalCode(problemId, language, starterCode))
  }

  // Fetch from API when authenticated and no local copy exists
  useEffect(() => {
    if (!problemId || !isAuthenticated) return
    const local = load()[problemId]?.[language]
    if (local !== undefined) return
    api.get<{ code: string }>(`/code/${problemId}/${language}`)
      .then((d) => { if (d?.code) setCode(d.code) })
      .catch(() => {})
  }, [problemId, language, isAuthenticated])

  // Persist on change
  const updateCode = (next: string) => {
    setCode(next)
    if (!problemId) return

    const store = load()
    store[problemId] = { ...store[problemId], [language]: next }
    save(store)

    if (isAuthenticated) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        api.put(`/code/${problemId}/${language}`, { code: next }).catch(() => {})
      }, 1500)
    }
  }

  const resetCode = () => {
    if (!problemId) return
    const store = load()
    if (store[problemId]) {
      delete store[problemId][language]
      save(store)
    }
    setCode(starterCode)
    if (isAuthenticated) {
      api.put(`/code/${problemId}/${language}`, { code: starterCode }).catch(() => {})
    }
  }

  return { code, setCode: updateCode, resetCode }
}
