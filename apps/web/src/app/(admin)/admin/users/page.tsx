'use client'

import { useState, useDeferredValue } from 'react'
import { useAdminUsers, useUpdateUserRole, useDeleteUser } from '@/hooks/use-admin'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Input } from '@/components/ui/input'
import { Dropdown } from '@/components/ui/dropdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

type UserRow = {
  id: number; email: string; username: string; role: string
  createdAt: string; updatedAt: string
  _count: { submissions: number; progress: number }
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const deferredSearch = useDeferredValue(search)

  const { data, isLoading } = useAdminUsers({
    page,
    search: deferredSearch || undefined,
    role: roleFilter || undefined,
  })

  const updateRole = useUpdateUserRole()
  const deleteUser = useDeleteUser()

  const [confirmAction, setConfirmAction] = useState<{
    type: 'role' | 'delete'
    user: UserRow
    newRole?: string
  } | null>(null)

  const handleConfirm = () => {
    if (!confirmAction) return
    if (confirmAction.type === 'role' && confirmAction.newRole) {
      updateRole.mutate({ id: confirmAction.user.id, role: confirmAction.newRole })
    } else if (confirmAction.type === 'delete') {
      deleteUser.mutate(confirmAction.user.id)
    }
    setConfirmAction(null)
  }

  const columns: Column<UserRow>[] = [
    { key: 'id', header: 'ID', render: (r) => r.id },
    { key: 'username', header: 'Username', render: (r) => <span className="font-medium">{r.username}</span> },
    { key: 'email', header: 'Email', render: (r) => r.email },
    {
      key: 'role', header: 'Role',
      render: (r) => <Badge tone={r.role === 'admin' ? 'info' : 'neutral'} size="sm">{r.role}</Badge>,
    },
    {
      key: 'created', header: 'Created',
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions', header: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setConfirmAction({
                type: 'role',
                user: r,
                newRole: r.role === 'admin' ? 'user' : 'admin',
              })
            }}
          >
            {r.role === 'admin' ? 'Demote' : 'Promote'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setConfirmAction({ type: 'delete', user: r })
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6">Users</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Dropdown
          items={[
            { value: '', label: 'All Roles' },
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' },
          ]}
          value={roleFilter}
          onChange={(v) => { setRoleFilter(v); setPage(1) }}
          placeholder="Filter by role"
          className="w-40"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.users ?? []}
        isLoading={isLoading}
        emptyMessage="No users found"
        rowKey={(r) => r.id}
      />

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}

      <Modal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction?.type === 'delete' ? 'Delete User' : 'Change Role'}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button
              variant={confirmAction?.type === 'delete' ? 'danger' : 'primary'}
              size="sm"
              onClick={handleConfirm}
              loading={updateRole.isPending || deleteUser.isPending}
            >
              Confirm
            </Button>
          </>
        }
      >
        {confirmAction?.type === 'delete' ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Are you sure you want to delete <strong>{confirmAction.user.username}</strong>? This action cannot be undone.
          </p>
        ) : confirmAction ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Change <strong>{confirmAction.user.username}</strong>&apos;s role from{' '}
            <Badge tone={confirmAction.user.role === 'admin' ? 'info' : 'neutral'} size="sm">{confirmAction.user.role}</Badge>
            {' '}to{' '}
            <Badge tone={confirmAction.newRole === 'admin' ? 'info' : 'neutral'} size="sm">{confirmAction.newRole}</Badge>?
          </p>
        ) : null}
      </Modal>
    </div>
  )
}
