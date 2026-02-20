'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/cn'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
  { label: 'Leaderboard', href: '/leaderboard' },
]

export function NavBar() {
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]"
      style={{ backdropFilter: 'blur(12px)' }}
      data-testid="app-nav"
    >
      <div className="flex items-center justify-between gap-4 px-[var(--app-shell-gutter)] py-[var(--app-shell-pad-y)] max-w-[var(--max-width-content)] mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] font-extrabold text-lg text-[var(--color-text-primary)] no-underline hover:text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)]"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          CodeCraft
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="App sections">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-[var(--duration-fast)] no-underline',
                  isActive
                    ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-colors duration-[var(--duration-fast)]"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {isAuthenticated && (
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-raised)] transition-colors duration-[var(--duration-fast)]"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
