'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  closeOnBackdrop?: boolean
  className?: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({
  open,
  onClose,
  title,
  closeOnBackdrop = true,
  className,
  children,
  footer,
}: ModalProps) {
  const panelRef = useRef<HTMLElement>(null)

  // Focus trap + keyboard handling
  useEffect(() => {
    if (!open) return

    const prevFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const focusable = () => {
      const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      return [...(panelRef.current?.querySelectorAll<HTMLElement>(sel) ?? [])].filter(
        (el) => !el.hasAttribute('disabled'),
      )
    }

    const els = focusable()
    els[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab') return
      const all = focusable()
      if (!all.length) return
      const first = all[0], last = all[all.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      prevFocused?.focus()
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 grid place-items-center z-[70] p-5"
          style={{ background: 'color-mix(in srgb, var(--color-background) 72%, transparent)', backdropFilter: 'blur(16px)' }}
          onClick={closeOnBackdrop ? onClose : undefined}
        >
          <motion.section
            ref={panelRef}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            role="dialog" aria-modal="true"
            className={cn(
              'w-full max-w-[42rem] max-h-[80vh] overflow-auto',
              'bg-[var(--color-surface)] border border-[var(--color-border)]',
              'rounded-[var(--radius-lg)] shadow-[var(--shadow-brutal-lg)]',
              className,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between gap-3 px-4 py-[0.8rem] border-b border-[var(--color-border)] bg-[var(--color-background)]">
              {title && (
                <h2 className="m-0 font-[family-name:var(--font-display)] text-xl font-bold">{title}</h2>
              )}
              <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center border border-[var(--color-border)] rounded-full bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] text-xl font-bold leading-none cursor-pointer hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(199,91,58,0.35)] transition-colors duration-[var(--duration-fast)]"
              >
                ×
              </button>
            </header>
            <div className="p-4">{children}</div>
            {footer && (
              <footer className="border-t border-[var(--color-border)] px-4 py-3 flex justify-end gap-[0.6rem]">
                {footer}
              </footer>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
