'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface DropdownItem {
  value: string
  label: string
}

interface DropdownProps {
  items: DropdownItem[]
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  trigger?: ReactNode
  className?: string
}

export function Dropdown({ items, value, placeholder = 'Select…', onChange, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = items.find((i) => i.value === value)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center justify-between gap-2 w-full',
          'px-[0.9rem] py-[0.62rem] text-sm',
          'border border-[var(--color-border)] rounded-[var(--radius-md)]',
          'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]',
          'font-[family-name:var(--font-display)] cursor-pointer',
          'transition-[border-color] duration-[var(--duration-fast)]',
          'hover:border-[var(--color-border-strong)]',
          'focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(199,91,58,0.35)]',
        )}
      >
        <span className={selected ? '' : 'text-[var(--color-text-tertiary)]'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={cn('w-4 h-4 text-[var(--color-text-tertiary)] transition-transform', open && 'rotate-180')}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 top-full mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-brutal-md)] overflow-hidden">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => { onChange(item.value); setOpen(false) }}
              className={cn(
                'w-full text-left px-[0.9rem] py-[0.62rem] text-sm cursor-pointer',
                'font-[family-name:var(--font-display)] transition-colors duration-[var(--duration-fast)]',
                item.value === value
                  ? 'bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] font-semibold'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
