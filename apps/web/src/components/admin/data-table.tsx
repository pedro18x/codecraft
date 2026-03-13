'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  rowKey: (row: T) => string | number
}

export function DataTable<T>({ columns, data, isLoading, emptyMessage = 'No data found', onRowClick, rowKey }: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider font-[family-name:var(--font-display)]">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <Skeleton height={20} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-8 text-center">
        <p className="text-[var(--color-text-secondary)] text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
              {columns.map((col) => (
                <th key={col.key} className={cn("text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider font-[family-name:var(--font-display)]", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-[var(--color-border)] last:border-0 transition-colors duration-[var(--duration-fast)]',
                  i % 2 === 1 && 'bg-[var(--color-surface-raised)]/30',
                  onRowClick && 'cursor-pointer hover:bg-[var(--color-surface-hover)]',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-sm text-[var(--color-text-primary)]", col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
