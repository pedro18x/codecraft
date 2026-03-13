'use client'

import { useRouter } from 'next/navigation'
import { useCreateProblem } from '@/hooks/use-admin'
import { ProblemForm } from '@/components/admin/problem-form'

export default function CreateProblemPage() {
  const router = useRouter()
  const createProblem = useCreateProblem()

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6">Create Problem</h1>
      <ProblemForm
        onSubmit={(data) => {
          createProblem.mutate(data, {
            onSuccess: () => router.push('/admin/problems'),
          })
        }}
        isSubmitting={createProblem.isPending}
      />
    </div>
  )
}
