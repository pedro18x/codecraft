'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
import type { ReactNode } from 'react'

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.replace('/admin/login')
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="w-60 border-r border-[var(--color-border)] p-4">
          <Skeleton height={32} className="mb-6" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={36} />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton height={40} width={200} className="mb-6" />
          <Skeleton height={300} />
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) return null

  return <>{children}</>
}
