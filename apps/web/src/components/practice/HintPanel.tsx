'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { useHint, type HintLevel } from '@/hooks/use-hint'
import type { TestResult } from '@/types'

interface Props {
  problemId: number
  code: string
  language: string
  testResults: TestResult[]
}

export function HintPanel({ problemId, code, language, testResults }: Props) {
  const [open, setOpen] = useState(false)

  const firstFailure = testResults.find((r) => !r.passed)

  const { entries, isStreaming, error, requestHint, cancel } = useHint({
    problemId,
    code,
    language,
    failingTestCase: firstFailure
      ? { input: firstFailure.input, expectedOutput: firstFailure.expectedOutput }
      : undefined,
    errorMessage: firstFailure?.error,
  })

  const lastHintLevel = entries.filter((e) => e.mode === 'hint').slice(-1)[0]?.level ?? 0
  const nextLevel = (lastHintLevel + 1) as HintLevel
  const atMaxDepth = lastHintLevel >= 3

  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] shrink-0">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <span className="font-[family-name:var(--font-display)] font-medium">
          AI Assistant
        </span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              disabled={isStreaming || atMaxDepth}
              onClick={() => !atMaxDepth && requestHint('hint', nextLevel)}
              className={cn(
                'text-xs px-3 py-1.5 font-[family-name:var(--font-display)] font-medium border-2 border-[var(--color-dark)] transition-all duration-150',
                atMaxDepth
                  ? 'opacity-40 cursor-not-allowed bg-[var(--color-surface)]'
                  : isStreaming
                    ? 'opacity-50 cursor-not-allowed bg-[var(--color-accent)]'
                    : 'bg-[var(--color-accent)] hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer',
              )}
            >
              {atMaxDepth
                ? 'Max depth reached'
                : lastHintLevel === 0
                  ? 'Get Hint'
                  : 'Go deeper →'}
            </button>

            {firstFailure && (
              <button
                type="button"
                disabled={isStreaming}
                onClick={() => requestHint('diagnose')}
                className={cn(
                  'text-xs px-3 py-1.5 font-[family-name:var(--font-display)] font-medium border-2 border-[var(--color-dark)] bg-[var(--color-surface)] transition-all duration-150',
                  isStreaming
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer',
                )}
              >
                Diagnose Error
              </button>
            )}

            {isStreaming && (
              <button
                type="button"
                onClick={cancel}
                className="text-xs px-3 py-1.5 font-[family-name:var(--font-display)] font-medium border-2 border-[var(--color-error)] bg-[var(--color-error-bg)] text-[var(--color-error)] cursor-pointer"
              >
                Stop ✕
              </button>
            )}
          </div>

          {/* Error state */}
          {error && (
            <div className="px-3 py-2 border-2 border-[var(--color-error)] border-l-4 bg-[var(--color-error-bg)]">
              <p className="text-xs text-[var(--color-error)]">{error}</p>
            </div>
          )}

          {/* Hint entries — stacked history */}
          {entries.map((entry, i) => (
            <div
              key={i}
              className="px-3 py-2 border-2 border-[var(--color-border)] border-l-4 border-l-[var(--color-accent)] bg-[var(--color-surface)]"
            >
              <p className="text-[10px] font-[family-name:var(--font-display)] font-medium text-[var(--color-text-tertiary)] mb-1 uppercase tracking-wide">
                {entry.mode === 'hint' ? `Level ${entry.level} hint` : 'Error diagnosis'}
              </p>
              <p className="text-xs font-[family-name:var(--font-mono)] text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">
                {entry.content}
                {entry.streaming && (
                  <span className="animate-pulse text-[var(--color-accent)]">▋</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
