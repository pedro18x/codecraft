'use client'

import { useCallback, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProblem } from '@/hooks/use-problems'
import { useCodeStorage } from '@/hooks/use-code-storage'
import { useProgress } from '@/hooks/use-progress'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useToast } from '@/hooks/use-toast'
import { MonacoEditor } from '@/components/practice/monaco-editor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/cn'
import type { Language, TestResult } from '@/types'

const LANGUAGES: Language[] = ['typescript', 'javascript', 'python']

export default function PracticePage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const { data: problem, isLoading } = useProblem(slug)
  const { markAttempted, markCompleted } = useProgress()
  const toast = useToast()

  const [language, setLanguage] = useState<Language>('typescript')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [splitPos, setSplitPos] = useState(50)
  const [hintsOpen, setHintsOpen] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const isDragging = useRef(false)

  const starterCode = problem?.starterCode?.[language] ?? ''
  const { code, setCode, resetCode } = useCodeStorage({
    problemId: problem?.id ?? null,
    language,
    starterCode,
  })

  const prevSlug = problem?.navigation.prevSlug ?? null
  const nextSlug = problem?.navigation.nextSlug ?? null

  const runTests = useCallback(async () => {
    if (!problem || isRunning) return
    setIsRunning(true)
    markAttempted(problem.id)
    try {
      const res = await api.post<{ testResults: TestResult[]; success: boolean }>(
        '/submissions',
        { problemId: problem.id, language, code },
      )
      setTestResults(res.testResults)
      const allPassed = res.testResults.every((r) => r.passed)
      if (allPassed) {
        markCompleted(problem.id)
        toast.success('All tests passed!', 'Great job 🎉')
      } else {
        const passed = res.testResults.filter((r) => r.passed).length
        toast.warning(`${passed}/${res.testResults.length} tests passed`)
      }
    } catch (err) {
      toast.error('Execution failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsRunning(false)
    }
  }, [problem, isRunning, language, code, markAttempted, markCompleted, toast])

  useKeyboardShortcuts({
    '⌘+Enter': runTests,
    '⌘+b': () => setFocusMode((f) => !f),
    'Escape': () => setFocusMode(false),
  })

  // Split pane drag handlers
  const onMouseDown = () => { isDragging.current = true }
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    setSplitPos(Math.max(25, Math.min(75, pct)))
  }, [])
  const onMouseUp = () => { isDragging.current = false }

  if (isLoading) return <div className="p-6 grid gap-3"><Skeleton height={32} width={300} /><Skeleton height={400} /></div>
  if (!problem) return <EmptyState title="Problem not found" description="This problem doesn't exist or couldn't be loaded." action={<Button onClick={() => router.push('/dashboard')}>Back to dashboard</Button>} />

  const diffTone = { Easy: 'easy', Medium: 'medium', Hard: 'hard' } as const

  return (
    <div
      className={cn(
        'flex flex-col',
        focusMode ? 'fixed inset-0 z-50 bg-[var(--color-background)]' : 'h-[calc(100vh-5rem)]',
      )}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-background)] shrink-0">
        <span className="font-[family-name:var(--font-display)] font-bold text-sm text-[var(--color-text-primary)] truncate">
          {problem.title}
        </span>
        <Badge tone={diffTone[problem.difficulty]} size="sm">{problem.difficulty}</Badge>
        <div className="flex-1" />
        {prevSlug && (
          <button type="button" onClick={() => router.push(`/practice/${prevSlug}`)} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-2 py-1 rounded hover:bg-[var(--color-surface-raised)] transition-colors">← Prev</button>
        )}
        {nextSlug && (
          <button type="button" onClick={() => router.push(`/practice/${nextSlug}`)} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-2 py-1 rounded hover:bg-[var(--color-surface-raised)] transition-colors">Next →</button>
        )}
        <button type="button" onClick={() => setFocusMode((f) => !f)} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-2 py-1 rounded hover:bg-[var(--color-surface-raised)] transition-colors" title="⌘+B">
          {focusMode ? 'Exit focus' : 'Focus'}
        </button>
      </div>

      {/* Split pane */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        {/* Problem description */}
        <div
          className="overflow-auto p-4 border-b md:border-b-0 md:border-r border-[var(--color-border)] bg-[var(--color-background)]"
          style={{ flexBasis: `${splitPos}%` }}
        >
          <div className="prose prose-sm max-w-none text-[var(--color-text-primary)]">
            <h2 className="font-[family-name:var(--font-display)] font-bold text-lg mb-3">{problem.title}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">{problem.description}</p>

            {problem.examples.length > 0 && (
              <div className="mt-4 grid gap-3">
                <h3 className="font-semibold text-sm">Examples</h3>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs font-[family-name:var(--font-mono)]">
                    <p><span className="text-[var(--color-text-secondary)]">Input: </span>{ex.input}</p>
                    <p><span className="text-[var(--color-text-secondary)]">Output: </span>{ex.output}</p>
                    {ex.explanation && <p className="mt-1 text-[var(--color-text-tertiary)]">{ex.explanation}</p>}
                  </div>
                ))}
              </div>
            )}

            {problem.constraints.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm mb-2">Constraints</h3>
                <ul className="grid gap-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="text-xs font-[family-name:var(--font-mono)] text-[var(--color-text-secondary)]">{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {problem.hints && problem.hints.length > 0 && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setHintsOpen((o) => !o)
                    if (!hintsOpen && hintsRevealed === 0) setHintsRevealed(1)
                  }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <span>{hintsOpen ? '▾' : '▸'}</span>
                  Hints
                </button>
                {hintsOpen && (
                  <div className="mt-2 grid gap-2">
                    {problem.hints.slice(0, hintsRevealed).map((hint, i) => (
                      <div key={i} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
                        <span className="font-semibold text-[var(--color-text-tertiary)] mr-1.5">Hint {i + 1}:</span>
                        {hint}
                      </div>
                    ))}
                    {hintsRevealed < problem.hints.length && (
                      <button
                        type="button"
                        onClick={() => setHintsRevealed((n) => n + 1)}
                        className="text-xs text-[var(--color-primary)] hover:underline text-left"
                      >
                        Show next hint ({hintsRevealed}/{problem.hints.length})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Drag handle */}
        <div
          className="hidden md:flex w-1.5 cursor-col-resize bg-[var(--color-border)] hover:bg-[var(--color-primary)] transition-colors shrink-0"
          onMouseDown={onMouseDown}
        />

        {/* Editor + results */}
        <div className="flex flex-col flex-1 min-h-0 min-w-0">
          {/* Language tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
            {LANGUAGES.map((lang) => {
              const isPython = lang === 'python'
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => { if (!isPython) setLanguage(lang) }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1 text-xs rounded font-[family-name:var(--font-display)] font-medium transition-colors',
                    isPython
                      ? 'opacity-50 cursor-not-allowed text-[var(--color-text-tertiary)]'
                      : language === lang
                        ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                  )}
                >
                  {lang}
                  {isPython && (
                    <span className="px-1 py-0.5 text-[10px] rounded bg-[var(--color-surface-raised)] text-[var(--color-text-tertiary)] border border-[var(--color-border)] leading-none">
                      soon
                    </span>
                  )}
                </button>
              )
            })}
            <div className="flex-1" />
            <button
              type="button"
              onClick={resetCode}
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors px-2 py-1"
            >
              Reset
            </button>
          </div>

          {/* Monaco */}
          <div className="flex-1 min-h-0">
            <MonacoEditor language={language} value={code} onChange={setCode} />
          </div>

          {/* Run button + results */}
          <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] p-3 shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <Button size="sm" onClick={runTests} loading={isRunning}>
                {isRunning ? 'Running…' : 'Run Tests'}
              </Button>
              <span className="text-xs text-[var(--color-text-tertiary)]">⌘+Enter</span>
            </div>

            {testResults.length > 0 && (
              <div className="grid gap-1.5 max-h-56 overflow-auto">
                {testResults.map((r, i) => (
                  <div
                    key={i}
                    className={cn(
                      'px-2.5 py-1.5 rounded-[var(--radius-sm)] text-xs font-[family-name:var(--font-mono)]',
                      r.passed
                        ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                        : 'bg-[var(--color-error-bg)] text-[var(--color-error)]',
                    )}
                  >
                    <span className="font-bold">{r.passed ? '✓' : '✗'} Test {i + 1}</span>
                    {!r.passed && (
                      <div className="mt-1 grid gap-0.5 opacity-80">
                        {r.error && <span className="whitespace-pre-wrap break-words">{r.error}</span>}
                        {r.expectedOutput && <span>Expected: {r.expectedOutput}</span>}
                        {r.actualOutput && <span>Got: {r.actualOutput}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
