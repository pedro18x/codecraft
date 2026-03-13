import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] grid place-items-center p-4">
      <div className="w-full max-w-[26rem]">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-display)] font-extrabold text-xl text-[var(--color-text-primary)] no-underline hover:text-[var(--color-primary)] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
            CodeCraft
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
