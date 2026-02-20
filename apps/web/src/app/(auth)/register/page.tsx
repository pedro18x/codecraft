'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  const validate = () => {
    if (!email || !username || !password) return 'Please fill in all fields.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username))
      return 'Username must be 3–20 chars, letters/numbers/_ only.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    const err = validate()
    if (err) { setFormError(err); return }

    try {
      await register(email, username, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Registration failed.')
    }
  }

  return (
    <Card variant="elevated" padding="lg">
      <h1 className="font-[family-name:var(--font-display)] font-bold text-2xl text-[var(--color-text-primary)] mb-1">
        Create account
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Start your coding journey. It&apos;s free.
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
          type="text"
          label="Username"
          placeholder="your_handle"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <Input
          as="input"
          type="password"
          label="Password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        {formError && (
          <p className="text-sm text-[var(--color-error)]" role="alert">
            {formError}
          </p>
        )}

        <Button type="submit" loading={isLoading} block className="mt-2">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">
          Sign in
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
