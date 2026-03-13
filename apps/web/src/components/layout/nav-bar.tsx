'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
  { label: 'Leaderboard', href: '/leaderboard' },
]

export function NavBar() {
  const pathname = usePathname()
  const { isAuthenticated, isAdmin, user, logout, isLoading } = useAuth()
  // Track which pathname the menu was opened at — derived isMenuOpen avoids
  // calling setState synchronously inside an effect (lint rule react-hooks/set-state-in-effect).
  // When pathname changes, isMenuOpen becomes false automatically.
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null)
  const isMenuOpen = menuOpenedAt === pathname

  const openMenu = () => setMenuOpenedAt(pathname)
  const closeMenu = () => setMenuOpenedAt(null)

  // Close drawer on Escape key
  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

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

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="App sections">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
            return (
              <span key={item.href} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative z-10 block px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-[var(--duration-fast)] no-underline',
                    isActive
                      ? 'text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                  )}
                >
                  {item.label}
                </Link>
              </span>
            )
          })}

          {/* Desktop admin link */}
          {isAdmin && (() => {
            const isActive = pathname.startsWith('/admin')
            return (
              <span className="relative">
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <Link
                  href="/admin"
                  className={cn(
                    'relative z-10 block px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-[var(--duration-fast)] no-underline',
                    isActive
                      ? 'text-[var(--color-text-primary)]'
                      : 'text-[var(--color-primary)] hover:text-[var(--color-text-primary)]',
                  )}
                >
                  Admin
                </Link>
              </span>
            )
          })()}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Auth actions — desktop */}
          {!isLoading && (
            isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center select-none">
                    {user.username.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="hidden sm:block text-sm text-[var(--color-text-secondary)] font-medium">
                    {user.username}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="hidden sm:inline-flex">
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/register" className="hidden sm:inline-flex">
                  <Button variant="primary" size="sm">Get started</Button>
                </Link>
              </>
            )
          )}

          {/* Visual separator */}
          <span className="hidden md:block w-px h-5 bg-[var(--color-border)]" aria-hidden />

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-colors duration-[var(--duration-fast)]"
            aria-label="Open menu"
            onClick={() => openMenu()}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeMenu()}
            />

            {/* Drawer panel */}
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-72 bg-[var(--color-surface-raised)] border-l border-[var(--color-border)] flex flex-col p-6 gap-2"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              {/* Close button */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-[family-name:var(--font-display)] font-extrabold text-[var(--color-text-primary)]">
                  Menu
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => closeMenu()}
                  className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors duration-[var(--duration-fast)]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
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
                      'px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-[var(--duration-fast)] no-underline',
                      isActive
                        ? 'bg-[var(--color-background)] text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background)]',
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}

              {/* Admin link — mobile */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    'px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-[var(--duration-fast)] no-underline',
                    pathname.startsWith('/admin')
                      ? 'bg-[var(--color-background)] text-[var(--color-text-primary)]'
                      : 'text-[var(--color-primary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background)]',
                  )}
                >
                  Admin
                </Link>
              )}

              {/* Divider */}
              <div className="my-2 border-t border-[var(--color-border)]" />

              {/* Auth actions — mobile */}
              {!isLoading && (
                isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center select-none shrink-0">
                        {user.username.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)] font-medium truncate">
                        {user.username}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={logout} block className="mt-auto">
                      Sign out
                    </Button>
                  </>
                ) : (
                  <div className="mt-auto flex flex-col gap-2">
                    <Link href="/login" onClick={closeMenu}>
                      <Button variant="ghost" size="sm" block>Sign in</Button>
                    </Link>
                    <Link href="/register" onClick={closeMenu}>
                      <Button variant="primary" size="sm" block>Get started</Button>
                    </Link>
                  </div>
                )
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
