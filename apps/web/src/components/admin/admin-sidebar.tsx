'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '◈' },
  { label: 'Users', href: '/admin/users', icon: '◉' },
  { label: 'Problems', href: '/admin/problems', icon: '◆' },
  { label: 'Submissions', href: '/admin/submissions', icon: '◇' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col h-full">
      <div className="px-4 py-5 border-b border-[var(--color-border)]">
        <Link
          href="/admin"
          className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[var(--color-text-primary)] no-underline flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1" aria-label="Admin navigation">
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium no-underline',
                'transition-colors duration-[var(--duration-fast)]',
                isActive
                  ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] shadow-[var(--shadow-brutal-sm)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]',
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[var(--color-border)]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-[var(--duration-fast)]"
        >
          ← Back to App
        </Link>
      </div>
    </aside>
  )
}
