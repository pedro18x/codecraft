# CodeCraft Next.js + React Rewrite — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild CodeCraft from Vue 3 to Next.js (App Router) + React with Framer Motion animations, React Three Fiber 3D backgrounds, and the existing Zen/wabi-sabi design system — while keeping the Express backend untouched.

**Architecture:** Next.js App Router with React Server Components for static pages (landing, leaderboard) and Client Components for interactive features (practice editor, dashboard filters, auth forms). State management via React Context + TanStack Query. The existing Express API at `localhost:3000` remains the backend; the Next.js app runs on `localhost:3001` as a pure frontend.

**Tech Stack:**
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v3 + CSS custom properties (ported from Vue project)
- **Animation:** Framer Motion 11+
- **3D:** React Three Fiber + Drei (Three.js)
- **Editor:** @monaco-editor/react
- **Data fetching:** TanStack Query (React Query v5)
- **Validation:** Zod
- **Font:** Plus Jakarta Sans + JetBrains Mono (Google Fonts via `next/font`)

---

## Phase 1: Project Scaffold & Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `codecraft-next/` (new directory alongside current project root)
- Create: `codecraft-next/package.json`
- Create: `codecraft-next/tsconfig.json`
- Create: `codecraft-next/next.config.ts`
- Create: `codecraft-next/.env.local`

**Step 1: Scaffold with create-next-app**

```bash
cd /Users/pedroernesto/Desktop/testeclaude
npx create-next-app@latest codecraft-next \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

Accept all defaults. This creates the App Router structure with TypeScript and Tailwind.

**Step 2: Install core dependencies**

```bash
cd codecraft-next
npm install framer-motion @react-three/fiber @react-three/drei three \
  @monaco-editor/react @tanstack/react-query zod \
  clsx tailwind-merge
npm install -D @types/three
```

**Step 3: Create environment file**

Create `codecraft-next/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: App running on `http://localhost:3000` (or `:3001` if 3000 is taken by Express).

**Step 5: Commit**

```bash
git add codecraft-next/
git commit -m "feat: scaffold Next.js project with core dependencies"
```

---

### Task 2: Configure Fonts with next/font

**Files:**
- Create: `codecraft-next/src/lib/fonts.ts`
- Modify: `codecraft-next/src/app/layout.tsx`

**Step 1: Create font configuration**

Create `codecraft-next/src/lib/fonts.ts`:
```typescript
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

export const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})
```

**Step 2: Apply fonts to root layout**

Modify `codecraft-next/src/app/layout.tsx`:
```tsx
import { jakarta, jetbrains } from '@/lib/fonts'
import './globals.css'

export const metadata = {
  title: 'CodeCraft',
  description: 'Coding interview preparation platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
```

**Step 3: Verify fonts load in browser**

```bash
npm run dev
```

Open browser, inspect `<html>` element — should have `--font-display` and `--font-mono` CSS variables set by next/font.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: configure Plus Jakarta Sans + JetBrains Mono via next/font"
```

---

### Task 3: Port Design Tokens (CSS Custom Properties)

**Files:**
- Create: `codecraft-next/src/styles/tokens.css`
- Modify: `codecraft-next/src/app/globals.css`

**Step 1: Copy and adapt design tokens**

Copy the full contents of the existing `src/assets/styles/tokens.css` into `codecraft-next/src/styles/tokens.css`.

Key adaptations:
- Replace `--font-display: 'Plus Jakarta Sans', sans-serif` with `--font-display: var(--font-display)` (next/font injects the variable)
- Same for `--font-body` — set to `var(--font-display)` since we use one font
- `--font-mono` becomes `var(--font-mono)`

The token file defines the `:root` (dark mode default) and `[data-theme="light"]` overrides. This includes:
- 40+ color tokens (zen palette: rust, moss, amber, slate)
- Shadow scale (brutal-sm through brutal-lg — soft, organic shadows)
- Spacing scale (space-1 through space-16)
- Border radius scale (radius-sm through radius-full)
- Typography scale (text-xs through text-5xl)
- Timing tokens (duration-fast, duration-normal, ease curves)

**Step 2: Import tokens in globals.css**

Replace the contents of `codecraft-next/src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import '../styles/tokens.css';

@layer base {
  body {
    font-family: var(--font-display);
    background-color: var(--color-background);
    color: var(--color-text-primary);
  }
}
```

**Step 3: Verify tokens work**

Add a temporary test in `src/app/page.tsx`:
```tsx
export default function Home() {
  return <h1 style={{ color: 'var(--zen-accent-rust)' }}>CodeCraft</h1>
}
```

Expected: "CodeCraft" renders in rust color (#C75B3A) on dark background.

**Step 4: Remove test code and commit**

```bash
git add -A && git commit -m "feat: port Zen design tokens to Next.js"
```

---

### Task 4: Port Tailwind Configuration

**Files:**
- Modify: `codecraft-next/tailwind.config.ts`

**Step 1: Extend Tailwind with custom theme**

Port the Tailwind extend config from the Vue project's `tailwind.config.js`. The key additions are:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-primary)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '0 1px 3px rgba(0, 0, 0, 0.12)',
        brutal: '0 2px 8px rgba(0, 0, 0, 0.15)',
        'brutal-md': '0 4px 16px rgba(0, 0, 0, 0.18)',
        'brutal-lg': '0 8px 32px rgba(0, 0, 0, 0.22)',
        glow: '0 0 24px rgba(199, 91, 58, 0.15)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
    },
  },
  plugins: [],
}

export default config
```

**Step 2: Verify Tailwind classes resolve**

Test with a class in page.tsx: `<div className="bg-surface shadow-brutal rounded-md p-4">Test</div>`

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: port Tailwind config with Zen theme extensions"
```

---

### Task 5: Set Up Project Structure & Utility Helpers

**Files:**
- Create: `codecraft-next/src/lib/cn.ts`
- Create: `codecraft-next/src/lib/api-client.ts` (stub)
- Create: `codecraft-next/src/types/index.ts` (stub)
- Create: `codecraft-next/src/hooks/` (directory)
- Create: `codecraft-next/src/components/ui/` (directory)
- Create: `codecraft-next/src/components/three/` (directory)
- Create: `codecraft-next/src/components/landing/` (directory)
- Create: `codecraft-next/src/components/practice/` (directory)
- Create: `codecraft-next/src/components/dashboard/` (directory)

**Step 1: Create `cn` utility (clsx + tailwind-merge)**

Create `codecraft-next/src/lib/cn.ts`:
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 2: Create directory structure**

```bash
mkdir -p src/hooks src/components/{ui,three,landing,practice,dashboard,layout,auth} src/lib src/types src/styles
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: set up project structure and cn utility"
```

---

## Phase 2: Shared UI Components

> Port the 16 Brutal* Vue components to React. Each becomes a reusable UI component under `src/components/ui/`. These are all Client Components (`"use client"`) since they handle interactions.

### Task 6: Button Component

**Files:**
- Create: `codecraft-next/src/components/ui/button.tsx`

**Step 1: Write the Button component**

Port `BrutalButton.vue` to React. The component supports variants (primary, secondary, ghost, danger), sizes (sm, md, lg), loading state, and disabled state.

```tsx
'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)]',
  secondary: 'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-hover)]',
  ghost: 'bg-[var(--button-ghost-bg)] text-[var(--button-ghost-text)] hover:bg-[var(--button-ghost-hover)]',
  danger: 'bg-[var(--button-danger-bg)] text-[var(--button-danger-text)] hover:bg-[var(--button-danger-hover)]',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-[3.25rem] px-8 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-display font-bold',
        'border border-[var(--button-border)] rounded-[var(--radius-md)]',
        'shadow-brutal-sm transition-all duration-200 cursor-pointer select-none',
        'hover:shadow-brutal hover:opacity-90',
        'active:shadow-brutal-sm active:opacity-85',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(199,91,58,0.35)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
```

**Step 2: Smoke-test in page.tsx**

Temporarily render `<Button>Click me</Button>` and `<Button variant="ghost" size="sm">Ghost</Button>` to verify styling.

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Button component (port from BrutalButton)"
```

---

### Task 7: Card Component

**Files:**
- Create: `codecraft-next/src/components/ui/card.tsx`

**Step 1: Write the Card component**

Port `BrutalCard.vue`. Supports variants (default, flat, elevated, interactive), accent colors, and padding levels.

```tsx
'use client'

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type CardVariant = 'default' | 'flat' | 'elevated' | 'interactive'
type Accent = 'coral' | 'turquoise' | 'yellow' | null
type Padding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  accent?: Accent
  padding?: Padding
}

const variantStyles: Record<CardVariant, string> = {
  default: 'shadow-brutal',
  flat: 'shadow-none',
  elevated: 'shadow-brutal-lg hover:shadow-brutal-md',
  interactive: 'shadow-brutal cursor-pointer hover:shadow-brutal-md active:shadow-brutal-sm transition-shadow',
}

const accentStyles: Record<string, string> = {
  coral: 'border-l-[3px] border-l-[var(--color-coral)]',
  turquoise: 'border-l-[3px] border-l-[var(--color-turquoise)]',
  yellow: 'border-l-[3px] border-l-[var(--color-yellow)]',
}

const paddingStyles: Record<Padding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({
  variant = 'default',
  accent,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]',
        variantStyles[variant],
        accent && accentStyles[accent],
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add Card component (port from BrutalCard)"
```

---

### Task 8: Input, Badge, Tabs, Progress, Modal Components

**Files:**
- Create: `codecraft-next/src/components/ui/input.tsx`
- Create: `codecraft-next/src/components/ui/badge.tsx`
- Create: `codecraft-next/src/components/ui/tabs.tsx`
- Create: `codecraft-next/src/components/ui/progress.tsx`
- Create: `codecraft-next/src/components/ui/modal.tsx`
- Create: `codecraft-next/src/components/ui/empty-state.tsx`
- Create: `codecraft-next/src/components/ui/skeleton.tsx`
- Create: `codecraft-next/src/components/ui/toast.tsx`
- Create: `codecraft-next/src/components/ui/checkbox.tsx`
- Create: `codecraft-next/src/components/ui/dropdown.tsx`
- Create: `codecraft-next/src/components/ui/tooltip.tsx`

**Step 1: Port remaining UI components**

Each component follows the same pattern as Button and Card — map Vue props to React props, replace `<template>` with JSX, use `cn()` for class merging. Key notes:

- **Input:** `forwardRef` for form integration, controlled via `value`/`onChange`, error/success states
- **Badge:** Variant-based (difficulty tones: easy/medium/hard → green/amber/red)
- **Tabs:** Controlled component with `value`/`onChange`, renders tab buttons + active indicator
- **Progress:** Bar variant (width percentage) and ring variant (SVG circle stroke-dasharray)
- **Modal:** Uses `<dialog>` element or portal to `document.body`, Framer Motion `AnimatePresence` for enter/exit
- **Empty State:** Title + description + optional action button
- **Skeleton:** Animated shimmer with configurable width/height
- **Toast:** Toast stack with auto-dismiss, uses React context for `useToast()` hook
- **Checkbox/Dropdown/Tooltip:** Standard React implementations

**Step 2: Create a barrel export**

Create `codecraft-next/src/components/ui/index.ts`:
```typescript
export { Button } from './button'
export { Card } from './card'
export { Input } from './input'
export { Badge } from './badge'
export { Tabs } from './tabs'
export { Progress } from './progress'
export { Modal } from './modal'
export { EmptyState } from './empty-state'
export { Skeleton } from './skeleton'
export { Checkbox } from './checkbox'
export { Dropdown } from './dropdown'
export { Tooltip } from './tooltip'
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add remaining UI components (Input, Badge, Tabs, Progress, Modal, etc.)"
```

---

### Task 9: Toast System (Context + Hook)

**Files:**
- Create: `codecraft-next/src/components/ui/toast-provider.tsx`
- Create: `codecraft-next/src/hooks/use-toast.ts`

**Step 1: Create Toast context and provider**

```tsx
// toast-provider.tsx
'use client'

import { createContext, useCallback, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

export interface ToastContextValue {
  push: (type: ToastType, message: string) => void
  remove: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="..."
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
```

**Step 2: Create useToast hook**

```typescript
// use-toast.ts
import { useContext } from 'react'
import { ToastContext, type ToastContextValue } from '@/components/ui/toast-provider'

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Toast system with Framer Motion animations"
```

---

## Phase 3: API Client, Types & Auth

### Task 10: Port Zod Schemas & Types

**Files:**
- Create: `codecraft-next/src/types/index.ts`
- Create: `codecraft-next/src/types/api.ts`

**Step 1: Copy Zod schemas from Vue project**

Port from `src/types/index.ts` and `src/contracts/api.ts`. These are framework-agnostic — copy directly:

```typescript
// types/index.ts
import { z } from 'zod'

export const DifficultySchema = z.enum(['Easy', 'Medium', 'Hard'])
export type Difficulty = z.infer<typeof DifficultySchema>

export const LanguageSchema = z.enum(['javascript', 'typescript', 'python'])
export type Language = z.infer<typeof LanguageSchema>

export const TestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  explanation: z.string().optional(),
})

export const ProblemSchema = z.object({
  id: z.number(),
  slug: z.string().optional(),
  title: z.string(),
  difficulty: DifficultySchema,
  categories: z.array(z.string()),
  description: z.string(),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    explanation: z.string().optional(),
  })),
  constraints: z.array(z.string()),
  testCases: z.array(TestCaseSchema),
  starterCode: z.record(LanguageSchema, z.string()).partial(),
  hints: z.array(z.string()).optional(),
})

export type Problem = z.infer<typeof ProblemSchema>
export type TestCase = z.infer<typeof TestCaseSchema>

export const TestResultSchema = z.object({
  passed: z.boolean(),
  input: z.string(),
  expectedOutput: z.string(),
  actualOutput: z.string().optional(),
  error: z.string().optional(),
})

export type TestResult = z.infer<typeof TestResultSchema>
```

```typescript
// types/api.ts — API response contracts
import { z } from 'zod'

export const ExecuteResponseSchema = z.object({
  success: z.boolean(),
  testResults: z.array(z.object({
    passed: z.boolean(),
    input: z.string(),
    expectedOutput: z.string(),
    actualOutput: z.string().optional(),
    error: z.string().optional(),
  })),
  executionTimeMs: z.number().optional(),
})

export const ProgressEntrySchema = z.object({
  id: z.number(),
  problemId: z.number(),
  status: z.enum(['attempted', 'completed']),
  attempts: z.number(),
  lastAttempt: z.string(),
  completedAt: z.string().nullable(),
  problem: z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    difficulty: z.string(),
  }),
})

export const ProgressStatsSchema = z.object({
  totalProblems: z.number(),
  completedCount: z.number(),
  attemptedCount: z.number(),
  byDifficulty: z.object({
    Easy: z.number(),
    Medium: z.number(),
    Hard: z.number(),
  }),
})

export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  userId: z.number(),
  username: z.string(),
  problemsSolved: z.number(),
  easy: z.number(),
  medium: z.number(),
  hard: z.number(),
})

export type ExecuteResponse = z.infer<typeof ExecuteResponseSchema>
export type ProgressEntry = z.infer<typeof ProgressEntrySchema>
export type ProgressStats = z.infer<typeof ProgressStatsSchema>
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: port Zod schemas and TypeScript types"
```

---

### Task 11: Build API Client

**Files:**
- Create: `codecraft-next/src/lib/api-client.ts`

**Step 1: Write the API client**

Port from Vue `src/api/client.ts`. Key behaviors to preserve:
- CSRF token auto-fetching before mutations
- JWT refresh on 401 with retry
- `credentials: 'include'` for cookie auth
- Cross-tab refresh synchronization

```typescript
// lib/api-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

class ApiRequestError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

let csrfToken: string | null = null
let refreshPromise: Promise<void> | null = null

async function fetchCsrf(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/csrf`, { credentials: 'include' })
  const data = await res.json()
  csrfToken = data.token
  return csrfToken!
}

async function refreshAccessToken(): Promise<void> {
  if (refreshPromise) return refreshPromise
  refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (!res.ok) throw new ApiRequestError('Session expired', 'SESSION_EXPIRED', 401)
  }).finally(() => { refreshPromise = null })
  return refreshPromise
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`
  const method = options.method || 'GET'

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  // Attach CSRF token for mutations
  if (method !== 'GET' && method !== 'HEAD') {
    if (!csrfToken) await fetchCsrf()
    headers['x-csrf-token'] = csrfToken!
  }

  let res = await fetch(url, { ...options, headers, credentials: 'include' })

  // Auto-refresh on 401
  if (res.status === 401) {
    try {
      await refreshAccessToken()
      res = await fetch(url, { ...options, headers, credentials: 'include' })
    } catch {
      throw new ApiRequestError('Session expired', 'SESSION_EXPIRED', 401)
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiRequestError(body.message || res.statusText, body.code || 'UNKNOWN', res.status)
  }

  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
}

export { ApiRequestError }
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: port API client with CSRF and JWT refresh"
```

---

### Task 12: Auth Context & Hooks

**Files:**
- Create: `codecraft-next/src/hooks/use-auth.ts`
- Create: `codecraft-next/src/components/providers/auth-provider.tsx`

**Step 1: Create Auth context**

```tsx
// components/providers/auth-provider.tsx
'use client'

import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { api } from '@/lib/api-client'

interface User {
  id: number
  email: string
  username: string
}

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const data = await api.get<{ user: User }>('/auth/me')
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<{ user: User }>('/auth/login', { email, password })
    setUser(data.user)
  }, [])

  const register = useCallback(async (email: string, username: string, password: string) => {
    const data = await api.post<{ user: User }>('/auth/register', { email, username, password })
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    await api.post('/auth/logout')
    setUser(null)
  }, [])

  useEffect(() => { fetchMe() }, [fetchMe])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Step 2: Create useAuth hook**

```typescript
// hooks/use-auth.ts
import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from '@/components/providers/auth-provider'

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

**Step 3: Wire into root layout**

Update `src/app/layout.tsx` to wrap with providers:
```tsx
import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import { QueryProvider } from '@/components/providers/query-provider'

// ...
<body>
  <QueryProvider>
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  </QueryProvider>
</body>
```

**Step 4: Create TanStack Query provider**

Create `codecraft-next/src/components/providers/query-provider.tsx`:
```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000 } },
  }))
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
```

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Auth context, useAuth hook, and provider wiring"
```

---

### Task 13: Theme System

**Files:**
- Create: `codecraft-next/src/hooks/use-theme.ts`
- Create: `codecraft-next/src/components/providers/theme-provider.tsx`

**Step 1: Port theme toggle**

Same logic as Vue `useTheme.ts` — persist to localStorage, apply `data-theme` attribute, respect `prefers-color-scheme`.

```tsx
// components/providers/theme-provider.tsx
'use client'

import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    const initial = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

**Step 2: Create useTheme hook**

```typescript
// hooks/use-theme.ts
import { useContext } from 'react'
import { ThemeContext } from '@/components/providers/theme-provider'

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

**Step 3: Add ThemeProvider to layout (wrap around existing providers)**

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add theme system with dark/light toggle"
```

---

## Phase 4: Layout & Navigation

### Task 14: App Shell Layout

**Files:**
- Create: `codecraft-next/src/components/layout/app-shell.tsx`
- Create: `codecraft-next/src/components/layout/nav-bar.tsx`
- Create: `codecraft-next/src/app/(app)/layout.tsx` (route group for authenticated pages)

**Step 1: Create NavBar component**

Port from `AppShell.vue` header section. Links: Home, Dashboard, Profile, Leaderboard. Includes theme toggle button and logout button.

**Step 2: Create AppShell layout**

The `(app)` route group wraps Dashboard, Profile, Leaderboard, and Practice pages with the shared navigation shell.

```
src/app/
├── (app)/
│   ├── layout.tsx          ← AppShell with NavBar
│   ├── dashboard/page.tsx
│   ├── practice/[slug]/page.tsx
│   ├── profile/page.tsx
│   └── leaderboard/page.tsx
├── (auth)/
│   ├── layout.tsx          ← Auth layout (no shell)
│   ├── login/page.tsx
│   └── register/page.tsx
├── layout.tsx              ← Root layout (providers)
└── page.tsx                ← Landing page
```

**Step 3: Create route group layouts**

`(app)/layout.tsx` renders `<AppShell>` with `{children}` in the main content area.
`(auth)/layout.tsx` renders a centered auth card layout.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add AppShell layout, NavBar, and route groups"
```

---

## Phase 5: Pages (Feature Screens)

### Task 15: Landing Page

**Files:**
- Create: `codecraft-next/src/app/page.tsx`
- Create: `codecraft-next/src/components/landing/hero.tsx`
- Create: `codecraft-next/src/components/landing/how-it-works.tsx`
- Create: `codecraft-next/src/components/landing/problem-types.tsx`
- Create: `codecraft-next/src/components/landing/proof-tabs.tsx`
- Create: `codecraft-next/src/components/landing/faq.tsx`
- Create: `codecraft-next/src/components/landing/final-cta.tsx`
- Create: `codecraft-next/src/components/landing/landing-nav.tsx`

**Step 1: Create landing page as Server Component**

The landing page can be a Server Component (no interactivity at page level). Each section is a Client Component for Framer Motion animations.

Port the 7 landing sections from the Vue components. Use Framer Motion's `motion.div` with `whileInView` for scroll-triggered reveal animations (replacing the Vue `useLandingMotion` composable).

**Step 2: Add Framer Motion scroll reveals**

Example pattern for each section:
```tsx
'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export function Hero() {
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.h1 variants={fadeUp}>Master coding interviews</motion.h1>
      <motion.p variants={fadeUp} transition={{ delay: 0.1 }}>...</motion.p>
    </motion.section>
  )
}
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add landing page with Framer Motion scroll reveals"
```

---

### Task 16: Auth Pages (Login + Register)

**Files:**
- Create: `codecraft-next/src/app/(auth)/login/page.tsx`
- Create: `codecraft-next/src/app/(auth)/register/page.tsx`
- Create: `codecraft-next/src/app/(auth)/layout.tsx`

**Step 1: Create auth layout**

Centered card with AuthTopNav (brand + toggle between login/register).

**Step 2: Create Login page**

Form with email + password inputs, submit calls `useAuth().login()`, redirects to `/dashboard` on success via `useRouter().push()`.

**Step 3: Create Register page**

Form with email + username + password inputs, validation (8+ chars, username format), calls `useAuth().register()`.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Login and Register pages"
```

---

### Task 17: Dashboard Page

**Files:**
- Create: `codecraft-next/src/app/(app)/dashboard/page.tsx`
- Create: `codecraft-next/src/components/dashboard/top-bar.tsx`
- Create: `codecraft-next/src/components/dashboard/problem-list.tsx`
- Create: `codecraft-next/src/components/dashboard/daily-challenge.tsx`
- Create: `codecraft-next/src/hooks/use-dashboard.ts`

**Step 1: Create dashboard hook**

Port `useDashboardPage.ts` — filtering by search/difficulty/status/category, sorting, daily challenge selection.

**Step 2: Create dashboard components**

- TopBar: search input + difficulty dropdown + sort dropdown
- ProblemList: virtual scrolled list of problem cards (use `react-virtual` or simple pagination)
- DailyChallenge: card highlighting next unsolved problem

**Step 3: Create page**

Wire components together in `dashboard/page.tsx`.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Dashboard page with filters, search, and problem list"
```

---

### Task 18: Practice Page (Split Pane + Monaco)

**Files:**
- Create: `codecraft-next/src/app/(app)/practice/[slug]/page.tsx`
- Create: `codecraft-next/src/components/practice/problem-panel.tsx`
- Create: `codecraft-next/src/components/practice/editor-panel.tsx`
- Create: `codecraft-next/src/components/practice/monaco-editor.tsx`
- Create: `codecraft-next/src/hooks/use-practice.ts`
- Create: `codecraft-next/src/hooks/use-code-storage.ts`

**Step 1: Create Monaco wrapper**

Use `@monaco-editor/react` (simpler than the Vue manual loader):
```tsx
'use client'

import Editor from '@monaco-editor/react'

interface MonacoEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
}

export function MonacoEditor({ language, value, onChange }: MonacoEditorProps) {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(v) => onChange(v ?? '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'var(--font-mono)',
        padding: { top: 16 },
        scrollBeyondLastLine: false,
      }}
    />
  )
}
```

**Step 2: Create ProblemPanel**

Displays problem description, examples, constraints, collapsible hints. Scrollable.

**Step 3: Create EditorPanel**

Language tabs + Monaco editor + Run button + test results display.

**Step 4: Create usePractice hook**

Port from `usePracticePage.ts`:
- Problem lookup by slug
- Split pane resize (mousedown drag handler)
- Keyboard shortcuts (useEffect with keydown listener)
- Test execution (POST to /submissions or /execute)
- Focus mode toggle

**Step 5: Create useCodeStorage hook**

Port from Vue `useCodeStorage.ts` — localStorage persistence + API sync when authenticated.

**Step 6: Wire into page component**

The practice page is a Client Component (`"use client"`) since it's fully interactive.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add Practice page with Monaco editor and split pane"
```

---

### Task 19: Profile Page

**Files:**
- Create: `codecraft-next/src/app/(app)/profile/page.tsx`
- Create: `codecraft-next/src/hooks/use-profile.ts`

**Step 1: Create useProfile hook**

Port from `useProfilePage.ts` — fetches progress, stats, submissions, leaderboard rank via TanStack Query. Calculates streak and badges.

**Step 2: Create Profile page**

- Avatar + username header
- Stats cards (solved, streak, rank)
- Tabbed interface (Overview, Solutions, Activity, Badges)
- Overview: progress bar + heatmap grid
- Solutions: list of solved problems with difficulty badges
- Activity: recent submissions with pass/fail dots
- Badges: grid of earned/locked badges

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Profile page with stats, heatmap, and tabs"
```

---

### Task 20: Leaderboard Page

**Files:**
- Create: `codecraft-next/src/app/(app)/leaderboard/page.tsx`
- Create: `codecraft-next/src/hooks/use-leaderboard.ts`

**Step 1: Create useLeaderboard hook**

Port from `useLeaderboardPage.ts` — fetches entries, supports Global/Weighted/Hard tabs, search, "show only me" filter.

**Step 2: Create Leaderboard page**

- Tab selector (Global, Weighted, Hard Focus)
- Search input + "Show only me" toggle
- Podium display for top 3
- Ranked table for remaining entries
- Skeleton loaders during fetch

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Leaderboard page with tabs and ranking"
```

---

## Phase 6: 3D Backgrounds & Visual Effects

### Task 21: React Three Fiber Scene Setup

**Files:**
- Create: `codecraft-next/src/components/three/zen-background.tsx`
- Create: `codecraft-next/src/components/three/floating-particles.tsx`
- Create: `codecraft-next/src/components/three/zen-canvas.tsx`

**Step 1: Create the canvas wrapper**

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

interface ZenCanvasProps {
  children: React.ReactNode
  className?: string
}

export function ZenCanvas({ children, className }: ZenCanvasProps) {
  return (
    <div className={className} style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}
```

**Step 2: Create floating particles scene**

Organic floating particles that drift slowly — matching the wabi-sabi aesthetic. Uses `@react-three/drei` helpers:

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function FloatingParticles({ count = 80 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [count])

  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.02
    mesh.current.rotation.x += delta * 0.01
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#C75B3A"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}
```

**Step 3: Create ZenBackground composition**

Combine particles with subtle ambient lighting and optional fog for depth:

```tsx
'use client'

import { ZenCanvas } from './zen-canvas'
import { FloatingParticles } from './floating-particles'

export function ZenBackground() {
  return (
    <ZenCanvas>
      <ambientLight intensity={0.3} />
      <fog attach="fog" args={['#171614', 4, 12]} />
      <FloatingParticles count={100} />
    </ZenCanvas>
  )
}
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add React Three Fiber zen background with floating particles"
```

---

### Task 22: Landing Page 3D Hero Scene

**Files:**
- Create: `codecraft-next/src/components/three/hero-scene.tsx`

**Step 1: Create a hero-specific 3D scene**

An interactive scene for the landing hero — e.g., a slowly rotating geometric shape (icosahedron or torus knot) with organic displacement, reacting subtly to mouse movement.

```tsx
'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'

export function HeroGeometry() {
  const mesh = useRef<Mesh>(null!)
  const { pointer } = useThree()

  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.x += delta * 0.1
    mesh.current.rotation.y += delta * 0.15
    // Subtle mouse follow
    mesh.current.position.x += (pointer.x * 0.5 - mesh.current.position.x) * 0.02
    mesh.current.position.y += (pointer.y * 0.3 - mesh.current.position.y) * 0.02
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={mesh} scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#C75B3A"
          roughness={0.6}
          metalness={0.1}
          distort={0.25}
          speed={1.5}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  )
}
```

**Step 2: Integrate into landing hero section**

Place the `<ZenCanvas>` with `<HeroGeometry>` behind the hero text content.

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add 3D hero scene with distorted icosahedron"
```

---

### Task 23: Page Transitions with Framer Motion

**Files:**
- Create: `codecraft-next/src/components/layout/page-transition.tsx`
- Modify: `codecraft-next/src/app/(app)/layout.tsx`

**Step 1: Create page transition wrapper**

```tsx
'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
```

**Step 2: Wrap `{children}` in app layout with PageTransition**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Framer Motion page transitions"
```

---

### Task 24: Noise Texture & Atmospheric CSS

**Files:**
- Modify: `codecraft-next/src/app/globals.css`

**Step 1: Add noise overlay (same as Phase 7A from Vue project)**

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,..."); /* SVG feTurbulence noise */
  background-repeat: repeat;
  background-size: 256px 256px;
  mix-blend-mode: overlay;
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add atmospheric noise texture overlay"
```

---

## Phase 7: Polish & Integration

### Task 25: Responsive Design Pass

**Files:**
- Modify: Various components

**Step 1: Test all pages at mobile (375px), tablet (768px), and desktop (1280px)**

Key responsive behaviors to verify:
- Landing: stacked sections, hero text wraps
- Dashboard: sidebar collapses to filter rail with backdrop
- Practice: panels stack vertically instead of side-by-side
- Profile: overview grid becomes single column
- Leaderboard: table becomes scrollable horizontally
- Navigation: hamburger menu on mobile

**Step 2: Fix any breakpoint issues**

Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) and the existing `useBreakpoints` pattern (port to a `useMediaQuery` hook in React).

**Step 3: Commit**

```bash
git add -A && git commit -m "fix: responsive layout pass for mobile and tablet"
```

---

### Task 26: Keyboard Shortcuts

**Files:**
- Create: `codecraft-next/src/hooks/use-keyboard-shortcuts.ts`

**Step 1: Create keyboard shortcut hook**

Port from Vue practice page shortcuts. Uses `useEffect` with `keydown` listener:

```typescript
import { useEffect } from 'react'

type ShortcutMap = Record<string, () => void>

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {
      const key = [
        e.metaKey || e.ctrlKey ? '⌘' : '',
        e.shiftKey ? 'Shift' : '',
        e.key,
      ].filter(Boolean).join('+')

      const action = shortcuts[key]
      if (action) {
        e.preventDefault()
        action()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts, enabled])
}
```

**Step 2: Wire into practice page**

```typescript
useKeyboardShortcuts({
  '⌘+b': () => setFocusMode(f => !f),
  '⌘+Enter': runTests,
  '⌘+r': resetCode,
  '⌘+[': goToPrevious,
  '⌘+]': goToNext,
  '⌘+/': () => setShowShortcuts(s => !s),
  'Escape': () => setFocusMode(false),
})
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add keyboard shortcuts for practice page"
```

---

### Task 27: Problem Data & Progress Hooks

**Files:**
- Create: `codecraft-next/src/hooks/use-problems.ts`
- Create: `codecraft-next/src/hooks/use-progress.ts`
- Create: `codecraft-next/src/lib/problem-utils.ts`

**Step 1: Port problem utilities**

Port from `src/utils/problemUtils.ts` and `src/features/problems/repository.ts`:
- Slug generation from problem title
- Problem lookup by slug/ID
- Category and difficulty constants

**Step 2: Port useProgress hook**

TanStack Query wrapper for `/progress` and `/progress/stats` endpoints. Fallback to localStorage for guests.

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add problem data utilities and progress hook"
```

---

### Task 28: E2E Testing Setup

**Files:**
- Create: `codecraft-next/playwright.config.ts`
- Create: `codecraft-next/e2e/landing.spec.ts`
- Create: `codecraft-next/e2e/auth.spec.ts`
- Create: `codecraft-next/e2e/dashboard.spec.ts`

**Step 1: Install Playwright**

```bash
cd codecraft-next
npm init playwright@latest
```

**Step 2: Write core E2E tests**

- Landing: page loads, hero visible, CTA buttons navigate to auth
- Auth: login form submits, register form validates, redirects to dashboard
- Dashboard: problem list renders, search filters work, clicking a problem navigates to practice

**Step 3: Run tests**

```bash
npx playwright test
```

**Step 4: Commit**

```bash
git add -A && git commit -m "test: add Playwright E2E tests for landing, auth, and dashboard"
```

---

### Task 29: Build Verification & Final QA

**Files:**
- No new files

**Step 1: Production build**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors.

**Step 2: Preview production build**

```bash
npm run start
```

Navigate every page: Landing → Login → Register → Dashboard → Practice → Profile → Leaderboard.

**Step 3: Theme toggle**

Toggle dark ↔ light on every page. Verify all tokens switch correctly.

**Step 4: Mobile check**

Open DevTools responsive mode at 375px width. Check all pages.

**Step 5: 3D performance**

Verify the R3F canvas doesn't cause jank on page navigation. Check that `dpr` is capped and particles are GPU-friendly.

**Step 6: Final commit**

```bash
git add -A && git commit -m "chore: final QA pass and build verification"
```

---

## Execution Order Summary

| # | Task | Est. Complexity |
|---|------|----------------|
| 1 | Initialize Next.js project | Low |
| 2 | Configure fonts (next/font) | Low |
| 3 | Port design tokens | Low |
| 4 | Port Tailwind config | Low |
| 5 | Project structure + cn utility | Low |
| 6 | Button component | Low |
| 7 | Card component | Low |
| 8 | Remaining UI components (10 components) | Medium |
| 9 | Toast system (context + hook) | Medium |
| 10 | Port Zod schemas + types | Low |
| 11 | Build API client | Medium |
| 12 | Auth context + hooks | Medium |
| 13 | Theme system | Low |
| 14 | App Shell + Nav layout | Medium |
| 15 | Landing page (7 sections) | Medium |
| 16 | Auth pages (Login + Register) | Medium |
| 17 | Dashboard page | High |
| 18 | Practice page (Monaco + split pane) | High |
| 19 | Profile page | Medium |
| 20 | Leaderboard page | Medium |
| 21 | R3F Zen background | Medium |
| 22 | Landing hero 3D scene | Medium |
| 23 | Page transitions (Framer Motion) | Low |
| 24 | Noise texture overlay | Low |
| 25 | Responsive design pass | Medium |
| 26 | Keyboard shortcuts | Low |
| 27 | Problem data + progress hooks | Medium |
| 28 | E2E testing | Medium |
| 29 | Build verification + QA | Low |

---

## Key Migration Notes

### Vue → React Concept Mapping

| Vue Concept | React Equivalent |
|-------------|-----------------|
| `ref()` / `reactive()` | `useState()` |
| `computed()` | `useMemo()` |
| `watch()` | `useEffect()` |
| `onMounted()` | `useEffect(() => {}, [])` |
| `defineProps<T>()` | Component props interface |
| `defineEmits<T>()` | Callback props (`onClick`, `onChange`) |
| `provide/inject` | React Context |
| `<template>` | JSX return |
| `v-if` / `v-else` | Ternary / `&&` in JSX |
| `v-for` | `.map()` |
| `v-model` | `value` + `onChange` (controlled) |
| `<Teleport>` | `createPortal()` |
| `<Transition>` | Framer Motion `AnimatePresence` |
| `<script setup>` | Function component body |
| Vue Router `useRoute()` | Next.js `useParams()` / `usePathname()` |
| Vue Router `useRouter()` | Next.js `useRouter()` |
| Composition API composable | Custom React hook |

### Files NOT Migrated (kept as-is)

- `server/` — entire Express backend stays untouched
- `server/prisma/` — database schema unchanged
- `.env` files for server
