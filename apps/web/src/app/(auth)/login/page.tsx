'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!email || !password) {
      setFormError('Please fill in all fields.')
      return
    }

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Login failed.')
    }
  }

  return (
    <Card variant="elevated" padding="lg">
      <h1 className="font-[family-name:var(--font-display)] font-bold text-2xl text-[var(--color-text-primary)] mb-1">
        Sign in
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Track your progress and compete on the leaderboard.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input
          as="input"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          as="input"
          type="password"
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {formError && (
          <p className="text-sm text-[var(--color-error)]" role="alert">
            {formError}
          </p>
        )}

        <Button type="submit" loading={isLoading} block className="mt-2">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        No account yet?{' '}
        <Link href="/register" className="text-[var(--color-primary)] hover:underline font-medium">
          Create one
        </Link>
      </p>
      <p className="mt-3 text-center text-xs text-[var(--color-text-tertiary)]">
        Just browsing?{' '}
        <Link href="/dashboard" className="text-[var(--color-primary)] hover:underline font-medium">
          Continue as guest
        </Link>
      </p>
    </Card>
  )
}
