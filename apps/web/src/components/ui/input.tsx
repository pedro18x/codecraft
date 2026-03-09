'use client'

import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface BaseProps {
  label?: string
  error?: string
  success?: string
}

interface InputProps extends BaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  as?: 'input'
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea'
  rows?: number
}

type Props = InputProps | TextareaProps

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, error, success, className, as: asEl = 'input', ...props }, ref) => {
    const id = useId()
    const hasError = Boolean(error)
    const hasSuccess = Boolean(success) && !hasError

    const fieldClass = cn(
      'w-full border rounded-[var(--radius-md)] bg-[var(--color-surface-raised)]',
      'font-[family-name:var(--font-display)] text-base text-[var(--color-text-primary)]',
      'px-[0.9rem] pt-[0.92rem] pb-[0.62rem]',
      'transition-[box-shadow,border-color] duration-[var(--duration-fast)]',
      'placeholder:text-[var(--color-text-tertiary)]',
      'focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[var(--focus-ring-shadow)]',
      'disabled:opacity-55 disabled:cursor-not-allowed',
      hasError
        ? 'border-[var(--color-error)] shadow-[0_0_0_3px_var(--color-error-bg)]'
        : hasSuccess
          ? 'border-[var(--color-success)]'
          : 'border-[var(--color-border)]',
      className,
    )

    return (
      <div className="grid gap-[0.36rem]">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        {asEl === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            className={cn(fieldClass, 'resize-y min-h-[7.5rem]')}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id}
            className={fieldClass}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {hasError && (
          <span className="text-xs font-medium text-[var(--color-error)]">{error}</span>
        )}
        {hasSuccess && (
          <span className="text-xs font-medium text-[var(--color-success)]">{success}</span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
