'use client'

import { useState, useDeferredValue } from 'react'
import { useAdminSubmissions, useAdminSubmission } from '@/hooks/use-admin'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Pagination } from '@/components/admin/pagination'
import { Input } from '@/components/ui/input'
import { Dropdown } from '@/components/ui/dropdown'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'

type SubmissionRow = {
  id: number; language: string; success: boolean; executionTimeMs: number | null; createdAt: string
  user: { id: number; username: string }; problem: { id: number; title: string }
}

export default function AdminSubmissionsPage() {
  const [page, setPage] = useState(1)
  const [successFilter, setSuccessFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const deferredUserSearch = useDeferredValue(userSearch)

  const { data, isLoading } = useAdminSubmissions({
    page,
    success: successFilter === '' ? undefined : successFilter === 'true',
    language: languageFilter || undefined,
    userId: deferredUserSearch ? Number(deferredUserSearch) || undefined : undefined,
  })

  const [selectedId, setSelectedId] = useState(0)
  const { data: detail } = useAdminSubmission(selectedId)

  const columns: Column<SubmissionRow>[] = [
    { key: 'id', header: 'ID', render: (r) => r.id, className: 'w-16' },
    { key: 'user', header: 'User', render: (r) => <span className="font-medium">{r.user.username}</span> },
    { key: 'problem', header: 'Problem', render: (r) => r.problem.title },
    { key: 'language', header: 'Language', render: (r) => <Badge tone="neutral" size="sm">{r.language}</Badge> },
    {
      key: 'success', header: 'Result',
      render: (r) => <Badge tone={r.success ? 'success' : 'error'} size="sm">{r.success ? 'Pass' : 'Fail'}</Badge>,
    },
    {
      key: 'time', header: 'Exec Time',
      render: (r) => r.executionTimeMs ? `${r.executionTimeMs}ms` : '—',
    },
    {
      key: 'created', header: 'Created',
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6">Submissions</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="max-w-[160px]">
          <Input
            placeholder="User ID"
            value={userSearch}
            onChange={(e) => { setUserSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Dropdown
          items={[
            { value: '', label: 'All Results' },
            { value: 'true', label: 'Pass' },
            { value: 'false', label: 'Fail' },
          ]}
          value={successFilter}
          onChange={(v) => { setSuccessFilter(v); setPage(1) }}
          placeholder="Filter result"
          className="w-36"
        />
        <Dropdown
          items={[
            { value: '', label: 'All Languages' },
            { value: 'javascript', label: 'JavaScript' },
            { value: 'typescript', label: 'TypeScript' },
            { value: 'python', label: 'Python' },
          ]}
          value={languageFilter}
          onChange={(v) => { setLanguageFilter(v); setPage(1) }}
          placeholder="Filter language"
          className="w-44"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.submissions ?? []}
        isLoading={isLoading}
        emptyMessage="No submissions found"
        rowKey={(r) => r.id}
        onRowClick={(r) => setSelectedId(r.id)}
      />

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}

      <Modal
        open={selectedId > 0}
        onClose={() => setSelectedId(0)}
        title={detail ? `Submission #${detail.id}` : 'Submission'}
      >
        {detail ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-[var(--color-text-secondary)]">User:</span> {detail.user.username}</div>
              <div><span className="text-[var(--color-text-secondary)]">Problem:</span> {detail.problem.title}</div>
              <div><span className="text-[var(--color-text-secondary)]">Language:</span> {detail.language}</div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Result: </span>
                <Badge tone={detail.success ? 'success' : 'error'} size="sm">{detail.success ? 'Pass' : 'Fail'}</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Code</h3>
              <pre className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 overflow-x-auto text-xs leading-relaxed">
                <code>{detail.code}</code>
              </pre>
            </div>

            {Array.isArray(detail.testResults) && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Test Results</h3>
                <div className="flex flex-col gap-1">
                  {(detail.testResults as Array<{ passed: boolean; input?: string; expectedOutput?: string; actualOutput?: string; error?: string }>).map((tr, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs border-b border-[var(--color-border)] last:border-0 py-1.5">
                      <Badge tone={tr.passed ? 'success' : 'error'} size="sm">{tr.passed ? 'Pass' : 'Fail'}</Badge>
                      <div className="flex-1">
                        {tr.input && <div><span className="text-[var(--color-text-secondary)]">Input:</span> {tr.input}</div>}
                        {tr.expectedOutput && <div><span className="text-[var(--color-text-secondary)]">Expected:</span> {tr.expectedOutput}</div>}
                        {tr.actualOutput && <div><span className="text-[var(--color-text-secondary)]">Actual:</span> {tr.actualOutput}</div>}
                        {tr.error && <div className="text-[var(--color-error)]">{tr.error}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-sm text-[var(--color-text-secondary)]">Loading...</div>
        )}
      </Modal>
    </div>
  )
}
