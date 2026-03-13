'use client'

import { AdminGuard } from '@/components/admin/admin-guard'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  )
}
