'use client'

import { createContext, useCallback, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
}

export interface ToastContextValue {
  push: (type: ToastType, title: string, message?: string) => void
  remove: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

const toneStyles: Record<ToastType, string> = {
  success: 'border-l-[3px] border-l-[var(--color-success)]',
  error: 'border-l-[3px] border-l-[var(--color-error)]',
  warning: 'border-l-[3px] border-l-[var(--color-warning)]',
  info: 'border-l-[3px] border-l-[var(--color-info)]',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [{ id, type, title, message }, ...prev])
      setTimeout(() => remove(id), 5000)
    },
    [remove],
  )

  const ctx: ToastContextValue = {
    push,
    remove,
    success: (t, m) => push('success', t, m),
    error: (t, m) => push('error', t, m),
    warning: (t, m) => push('warning', t, m),
    info: (t, m) => push('info', t, m),
  }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-[22rem]">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn(
                'flex items-start justify-between gap-3 p-4',
                'bg-[var(--color-surface-elevated)] border border-[var(--color-border)]',
                'rounded-[var(--radius-md)] shadow-[var(--shadow-brutal-md)]',
                toneStyles[toast.type],
              )}
            >
              <div className="grid gap-0.5">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] font-[family-name:var(--font-display)]">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-xs text-[var(--color-text-secondary)]">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(toast.id)}
                aria-label="Dismiss"
                className="mt-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors shrink-0"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
