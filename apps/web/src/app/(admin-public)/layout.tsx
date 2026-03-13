import type { ReactNode } from 'react'

export default function AdminPublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] grid place-items-center p-4">
      <div className="w-full max-w-[26rem]">
        {children}
      </div>
    </div>
  )
}
