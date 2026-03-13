'use client'

import { useState, useCallback } from 'react'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dropdown } from '@/components/ui/dropdown'
import { Card } from '@/components/ui/card'
import { Tabs } from '@/components/ui/tabs'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((m) => ({ default: m.default })),
  { ssr: false },
)

const ProblemFormSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  description: z.string().min(1, 'Description is required'),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    explanation: z.string().nullish(),
  })),
  constraints: z.array(z.string()),
  testCases: z.array(z.object({ input: z.string(), expectedOutput: z.string() })).min(1, 'At least one test case is required'),
  starterCode: z.record(z.string(), z.string()),
  hints: z.array(z.string()),
})

type ProblemFormData = z.infer<typeof ProblemFormSchema>

interface ProblemFormProps {
  initialData?: Partial<ProblemFormData>
  onSubmit: (data: ProblemFormData) => void
  isSubmitting?: boolean
  isEdit?: boolean
}

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
]

export function ProblemForm({ initialData, onSubmit, isSubmitting, isEdit }: ProblemFormProps) {
  const [form, setForm] = useState<ProblemFormData>({
    id: initialData?.id ?? 0,
    title: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    difficulty: initialData?.difficulty ?? 'Easy',
    categories: initialData?.categories ?? [],
    description: initialData?.description ?? '',
    examples: initialData?.examples ?? [{ input: '', output: '', explanation: null }],
    constraints: initialData?.constraints ?? [''],
    testCases: initialData?.testCases ?? [{ input: '', expectedOutput: '' }],
    starterCode: initialData?.starterCode ?? { javascript: '', typescript: '', python: '' },
    hints: initialData?.hints ?? [''],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [categoriesInput, setCategoriesInput] = useState(form.categories.join(', '))
  const [activeCodeTab, setActiveCodeTab] = useState('javascript')

  const updateField = useCallback(<K extends keyof ProblemFormData>(key: K, value: ProblemFormData[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value }
      // Auto-generate slug from title when creating
      if (key === 'title' && !isEdit) {
        next.slug = slugify(value as string)
      }
      return next
    })
    setErrors((e) => { const next = { ...e }; delete next[key]; return next })
  }, [isEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = ProblemFormSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0]?.toString() ?? 'form'] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    onSubmit(parsed.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Basic info */}
      <Card>
        <h2 className="font-[family-name:var(--font-display)] font-bold text-lg mb-4">Basic Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isEdit && (
            <Input
              label="Problem ID"
              type="number"
              value={form.id || ''}
              onChange={(e) => updateField('id', Number(e.target.value))}
              error={errors.id}
            />
          )}
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            error={errors.title}
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            error={errors.slug}
          />
          <div>
            <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1 block">Difficulty</label>
            <Dropdown
              items={[
                { value: 'Easy', label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard', label: 'Hard' },
              ]}
              value={form.difficulty}
              onChange={(v) => updateField('difficulty', v as ProblemFormData['difficulty'])}
            />
          </div>
          <Input
            label="Categories (comma-separated)"
            value={categoriesInput}
            onChange={(e) => {
              setCategoriesInput(e.target.value)
              updateField('categories', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
            }}
            error={errors.categories}
          />
        </div>
      </Card>

      {/* Description */}
      <Card>
        <h2 className="font-[family-name:var(--font-display)] font-bold text-lg mb-4">Description</h2>
        <Input
          as="textarea"
          rows={8}
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          error={errors.description}
        />
      </Card>

      {/* Examples */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">Examples</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => updateField('examples', [...form.examples, { input: '', output: '', explanation: null }])}
          >
            Add Example
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {form.examples.map((ex, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Example {i + 1}</span>
                {form.examples.length > 1 && (
                  <Button type="button" variant="danger" size="sm" onClick={() => updateField('examples', form.examples.filter((_, j) => j !== i))}>
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Input" value={ex.input} onChange={(e) => {
                  const next = [...form.examples]; next[i] = { ...next[i], input: e.target.value }; updateField('examples', next)
                }} />
                <Input label="Output" value={ex.output} onChange={(e) => {
                  const next = [...form.examples]; next[i] = { ...next[i], output: e.target.value }; updateField('examples', next)
                }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Constraints */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">Constraints</h2>
          <Button type="button" variant="secondary" size="sm" onClick={() => updateField('constraints', [...form.constraints, ''])}>
            Add Constraint
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {form.constraints.map((c, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1">
                <Input value={c} onChange={(e) => {
                  const next = [...form.constraints]; next[i] = e.target.value; updateField('constraints', next)
                }} />
              </div>
              {form.constraints.length > 1 && (
                <Button type="button" variant="danger" size="sm" onClick={() => updateField('constraints', form.constraints.filter((_, j) => j !== i))}>
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Starter Code */}
      <Card>
        <h2 className="font-[family-name:var(--font-display)] font-bold text-lg mb-4">Starter Code</h2>
        <Tabs value={activeCodeTab} items={LANGUAGES} onChange={setActiveCodeTab} className="mb-3" />
        <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
          <MonacoEditor
            height="200px"
            language={activeCodeTab}
            value={form.starterCode[activeCodeTab] ?? ''}
            onChange={(val) => updateField('starterCode', { ...form.starterCode, [activeCodeTab]: val ?? '' })}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'on', scrollBeyondLastLine: false }}
          />
        </div>
      </Card>

      {/* Test Cases */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">Test Cases</h2>
          <Button type="button" variant="secondary" size="sm" onClick={() => updateField('testCases', [...form.testCases, { input: '', expectedOutput: '' }])}>
            Add Test Case
          </Button>
        </div>
        {errors.testCases && <p className="text-xs text-[var(--color-error)] mb-2">{errors.testCases}</p>}
        <div className="flex flex-col gap-4">
          {form.testCases.map((tc, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Test Case {i + 1}</span>
                {form.testCases.length > 1 && (
                  <Button type="button" variant="danger" size="sm" onClick={() => updateField('testCases', form.testCases.filter((_, j) => j !== i))}>
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input as="textarea" rows={3} label="Input" value={tc.input} onChange={(e) => {
                  const next = [...form.testCases]; next[i] = { ...next[i], input: e.target.value }; updateField('testCases', next)
                }} />
                <Input as="textarea" rows={3} label="Expected Output" value={tc.expectedOutput} onChange={(e) => {
                  const next = [...form.testCases]; next[i] = { ...next[i], expectedOutput: e.target.value }; updateField('testCases', next)
                }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Hints */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">Hints</h2>
          <Button type="button" variant="secondary" size="sm" onClick={() => updateField('hints', [...form.hints, ''])}>
            Add Hint
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {form.hints.map((h, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1">
                <Input value={h} onChange={(e) => {
                  const next = [...form.hints]; next[i] = e.target.value; updateField('hints', next)
                }} />
              </div>
              {form.hints.length > 1 && (
                <Button type="button" variant="danger" size="sm" onClick={() => updateField('hints', form.hints.filter((_, j) => j !== i))}>
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? 'Update Problem' : 'Create Problem'}
        </Button>
      </div>
    </form>
  )
}
