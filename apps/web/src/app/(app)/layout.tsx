import { NavBar } from '@/components/layout/nav-bar'
import { PageTransition } from '@/components/layout/page-transition'
import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <NavBar />
      <main className="flex-1 px-[var(--app-shell-gutter)] py-[var(--app-shell-pad-y)] max-w-[var(--max-width-content)] mx-auto w-full">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  )
}
