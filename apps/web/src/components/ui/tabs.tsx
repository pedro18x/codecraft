'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  value: string
  items: TabItem[]
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ value, items, onChange, className }: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicator, setIndicator] = useState({ width: 0, left: 0 })

  useEffect(() => {
    const activeEl = tabRefs.current[value]
    const container = containerRef.current
    if (!activeEl || !container) return

    const containerRect = container.getBoundingClientRect()
    const rect = activeEl.getBoundingClientRect()
    setIndicator({ left: rect.left - containerRect.left, width: rect.width })
  }, [value])

  useEffect(() => {
    const onResize = () => {
      const activeEl = tabRefs.current[value]
      const container = containerRef.current
      if (!activeEl || !container) return
      const containerRect = container.getBoundingClientRect()
      const rect = activeEl.getBoundingClientRect()
      setIndicator({ left: rect.left - containerRect.left, width: rect.width })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [value])

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-orientation="horizontal"
      className={cn('relative flex gap-1 border-b border-[var(--color-border)] pb-1', className)}
    >
      {items.map((item) => (
        <button
          key={item.id}
          ref={(el) => { tabRefs.current[item.id] = el }}
          role="tab"
          tabIndex={value === item.id ? 0 : -1}
          aria-selected={value === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'border border-transparent rounded-t-[var(--radius-sm)] border-b-0',
            'px-[0.7rem] py-[0.45rem] pb-[0.35rem]',
            'font-[family-name:var(--font-display)] text-sm',
            'bg-transparent cursor-pointer transition-colors duration-[var(--duration-fast)]',
            'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring-shadow)]',
            value === item.id
              ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] font-semibold'
              : 'text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-text-primary)]',
          )}
        >
          {item.label}
        </button>
      ))}
      <span
        aria-hidden="true"
        className="absolute bottom-[-1px] h-0.5 bg-[var(--color-primary)] rounded-[var(--radius-full)] transition-all duration-[220ms]"
        style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
      />
    </div>
  )
}
