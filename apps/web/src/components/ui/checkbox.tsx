'use client'

import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => {
    const generated = useId()
    const inputId = id ?? `checkbox-${generated}`
    return (
      <label
        htmlFor={inputId}
        className={cn('inline-flex items-center gap-2 cursor-pointer select-none', className)}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(
            'w-4 h-4 rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
            'accent-[var(--color-primary)]',
            'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring-shadow)]',
          )}
          {...props}
        />
        {label && (
          <span className="text-sm text-[var(--color-text-primary)]">{label}</span>
        )}
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
