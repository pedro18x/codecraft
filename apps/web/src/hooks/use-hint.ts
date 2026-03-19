'use client'

import { useState, useRef, useCallback } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export type HintMode = 'hint' | 'diagnose'
export type HintLevel = 1 | 2 | 3

export interface HintEntry {
  mode: HintMode
  level?: HintLevel
  content: string
  streaming: boolean
}

interface UseHintParams {
  problemId: number
  code: string
  language: string
  failingTestCase?: { input: string; expectedOutput: string }
  errorMessage?: string
}

export function useHint(params: UseHintParams) {
  const [entries, setEntries] = useState<HintEntry[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
    setEntries((prev) =>
      prev.map((e, i) => (i === prev.length - 1 ? { ...e, streaming: false } : e))
    )
  }, [])

  const requestHint = useCallback(
    async (mode: HintMode, level?: HintLevel) => {
      if (isStreaming) cancel()

      const controller = new AbortController()
      abortRef.current = controller

      const entry: HintEntry = { mode, level, content: '', streaming: true }
      setEntries((prev) => [...prev, entry])
      setIsStreaming(true)
      setError(null)

      try {
        const res = await fetch(`${BASE_URL}/ai/hint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          signal: controller.signal,
          body: JSON.stringify({
            problemId: params.problemId,
            mode,
            hintLevel: level,
            code: mode === 'diagnose' ? params.code : undefined,
            language: mode === 'diagnose' ? params.language : undefined,
            failingTestCase: mode === 'diagnose' ? params.failingTestCase : undefined,
            errorMessage: mode === 'diagnose' ? params.errorMessage : undefined,
          }),
        })

        if (!res.ok) {
          const body = await res.json()
          const message = body?.error?.message || 'AI request failed'
          setError(message)
          setEntries((prev) => prev.slice(0, -1))
          return
        }

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const parsed = JSON.parse(line.slice(6))
              if (parsed.token) {
                setEntries((prev) =>
                  prev.map((e, i) =>
                    i === prev.length - 1 ? { ...e, content: e.content + parsed.token } : e
                  )
                )
              }
              if (parsed.error === 'MODEL_UNAVAILABLE') {
                setError('AI is having a moment — try again in a bit.')
                setEntries((prev) => prev.slice(0, -1))
              }
            } catch {
              // malformed SSE line — skip
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Network error — check your connection and try again.')
          setEntries((prev) => prev.slice(0, -1))
        }
      } finally {
        setIsStreaming(false)
        setEntries((prev) =>
          prev.map((e, i) =>
            i === prev.length - 1 ? { ...e, streaming: false } : e
          )
        )
      }
    },
    [isStreaming, cancel, params]
  )

  return { entries, isStreaming, error, requestHint, cancel }
}
