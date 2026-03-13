'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, isLoading, isAuthenticated, isAdmin } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.replace('/admin')
    }
  }, [isAuthenticated, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!email || !password) {
      setFormError('Please fill in all fields.')
      return
    }

    try {
      await login(email, password)
      // role check happens inside the effect above once auth state updates,
      // but we also check here for non-admin accounts that successfully auth
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Login failed.')
    }
  }

  // After login() resolves the auth state updates; if the user is not admin
  // isAuthenticated will become true but isAdmin false — show the error.
  const showRoleError = !isLoading && isAuthenticated && !isAdmin

  return (
    <Card variant="elevated" padding="lg">
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] font-bold text-2xl text-[var(--color-text-primary)] mb-1">
          Admin portal
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Restricted access. Admin accounts only.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input
          as="input"
          type="email"
          label="Email"
          placeholder="admin@example.com"
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

        {(formError || showRoleError) && (
          <p className="text-sm text-[var(--color-error)]" role="alert">
            {showRoleError
              ? 'This portal is for admin accounts only.'
              : formError}
          </p>
        )}

        <Button type="submit" loading={isLoading} block className="mt-2">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">
          Back to main login
        </Link>
      </p>
    </Card>
  )
}
