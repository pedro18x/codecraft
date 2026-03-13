'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useUpdateProblem } from '@/hooks/use-admin'
import { ProblemForm } from '@/components/admin/problem-form'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditProblemPage({ params }: PageProps) {
  const { id } = use(params)
  const problemId = Number(id)
  const router = useRouter()
  const updateProblem = useUpdateProblem()

  const { data: problem, isLoading } = useQuery({
    queryKey: ['admin', 'problems', problemId],
    queryFn: () => api.get<{
      id: number; title: string; slug: string; difficulty: string
      categories: string[]; description: string; examples: unknown
      constraints: string[]; testCases: unknown; starterCode: unknown; hints: string[]
    }>(`/admin/problems/${problemId}`),
    enabled: problemId > 0,
  })

  if (isLoading) {
    return (
      <div>
        <Skeleton height={40} width={200} className="mb-6" />
        <Skeleton height={400} />
      </div>
    )
  }

  if (!problem) return null

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
        Edit: {problem.title}
      </h1>
      <ProblemForm
        isEdit
        initialData={problem as Record<string, unknown> as never}
        onSubmit={(data) => {
          const { id: _omit, ...rest } = data
          void _omit
          updateProblem.mutate({ id: problemId, data: rest }, {
            onSuccess: () => router.push('/admin/problems'),
          })
        }}
        isSubmitting={updateProblem.isPending}
      />
    </div>
  )
}
