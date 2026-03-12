'use client'

import { useState, useDeferredValue } from 'react'
import Link from 'next/link'
import { useAdminProblems, useDeleteProblem } from '@/hooks/use-admin'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Input } from '@/components/ui/input'
import { Dropdown } from '@/components/ui/dropdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

type ProblemRow = {
  id: number; title: string; slug: string; difficulty: string
  categories: string[]; createdAt: string
  _count: { submissions: number }
}

const difficultyTone = { Easy: 'easy', Medium: 'medium', Hard: 'hard' } as const

export default function AdminProblemsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const deferredSearch = useDeferredValue(search)

  const { data, isLoading } = useAdminProblems({
    page,
    search: deferredSearch || undefined,
    difficulty: difficulty || undefined,
  })

  const deleteProblem = useDeleteProblem()
  const [deleteTarget, setDeleteTarget] = useState<ProblemRow | null>(null)

  const columns: Column<ProblemRow>[] = [
    { key: 'id', header: 'ID', render: (r) => r.id, className: 'w-16' },
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
    {
      key: 'difficulty', header: 'Difficulty',
      render: (r) => <Badge tone={difficultyTone[r.difficulty as keyof typeof difficultyTone] ?? 'neutral'} size="sm">{r.difficulty}</Badge>,
    },
    {
      key: 'categories', header: 'Categories',
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.categories.slice(0, 3).map((c) => (
            <Badge key={c} tone="neutral" size="sm">{c}</Badge>
          ))}
          {r.categories.length > 3 && (
            <Badge tone="neutral" size="sm">+{r.categories.length - 3}</Badge>
          )}
        </div>
      ),
    },
    { key: 'submissions', header: 'Submissions', render: (r) => r._count.submissions },
    {
      key: 'actions', header: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Link href={`/admin/problems/${r.id}/edit`}>
            <Button variant="ghost" size="sm">Edit</Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(r) }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">Problems</h1>
        <Link href="/admin/problems/new">
          <Button size="sm">Create Problem</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search problems..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Dropdown
          items={[
            { value: '', label: 'All Difficulties' },
            { value: 'Easy', label: 'Easy' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Hard', label: 'Hard' },
          ]}
          value={difficulty}
          onChange={(v) => { setDifficulty(v); setPage(1) }}
          placeholder="Filter by difficulty"
          className="w-48"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.problems ?? []}
        isLoading={isLoading}
        emptyMessage="No problems found"
        rowKey={(r) => r.id}
      />

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Problem"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleteProblem.isPending}
              onClick={() => {
                if (deleteTarget) deleteProblem.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? All associated submissions will also be removed.
        </p>
      </Modal>
    </div>
  )
}
