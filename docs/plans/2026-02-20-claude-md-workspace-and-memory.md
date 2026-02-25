# CLAUDE.md Workspace Overhaul + Feature Memory System

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the outdated CLAUDE.md with accurate, opinionated rules for a Next.js/Express monorepo, add per-app CLAUDE.md files, and create a persistent memory system that logs every feature implementation as a markdown summary in `docs/memory/`.

**Architecture:** Root CLAUDE.md holds monorepo-wide rules (commit policy, workspace commands, memory protocol). Each app gets its own CLAUDE.md with framework-specific rules. The memory system is a `docs/memory/` folder with one markdown file per feature, written by the agent at the end of every implementation.

**Tech Stack:** npm workspaces, Next.js 16 App Router, React 19, TailwindCSS v4, Framer Motion, Monaco Editor, React Query — `apps/web`. Express 4, Prisma 6, PostgreSQL, Zod v3, JWT, Vitest — `apps/api`.

---

### Task 1: Rewrite Root CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Replace the entire file**

The current file references Vue 3 + Vite. It must be replaced in full with accurate rules. Write:

```markdown
# CodeCraft — Monorepo AI Guide

## Project Overview

**CodeCraft** is a neo-brutalist coding interview preparation platform.

**Monorepo layout:**
- `apps/web` — Next.js 16 (App Router), React 19, TailwindCSS v4, TypeScript
- `apps/api` — Express 4, Prisma 6, PostgreSQL, Zod v3, JWT auth, Vitest

## Git Commit Rules

- **Never** include `Co-Authored-By: Claude` or any AI authorship trailer.
- Commit messages: what changed and why. No filler.
- Commit frequently (after each logical unit of work).
- Never force-push to `main`/`dev` without explicit user approval.

## Workspace Commands

Always run commands from the **repo root** using npm workspace flags:

```bash
# Root-level shortcuts (defined in root package.json)
npm run dev           # starts apps/web dev server
npm run dev:api       # starts apps/api dev server
npm run build         # builds apps/web
npm run build:api     # builds apps/api
npm run type-check    # tsc --noEmit on apps/web
npm run lint          # ESLint on apps/web
npm run test:e2e      # Playwright tests in apps/web
npm run test:api      # Vitest tests in apps/api

# Run arbitrary workspace command
npm run <script> -w @codecraft/web
npm run <script> -w @codecraft/api

# Install a dep to a specific workspace
npm install <pkg> -w @codecraft/web
npm install <pkg> -w @codecraft/api
```

**Never `cd` into a workspace to run commands.** Use `-w` flags from root.

## Production Data Policy (Critical)

- Never ship hardcoded business data, fake users, or mock records in runtime UI.
- Always consume real API endpoints or persisted storage.
- If a backend endpoint is missing, render an explicit empty/loading/error state.
- Fixtures and seed data belong in `prisma/seed.ts` or test files only.

## Memory Protocol (Required)

After every feature implementation, create a memory entry:

**File:** `docs/memory/YYYY-MM-DD-<kebab-feature-name>.md`

**Format:**
```markdown
# [Feature Name] — Implementation Summary
**Date:** YYYY-MM-DD
**Branch:** <branch-name>

## What Was Built
[1-3 sentence description of the feature]

## Files Changed
- `path/to/file.tsx` — [what changed]
- `path/to/file.ts` — [what changed]

## Architecture Decisions
[Key decisions made, trade-offs, why this approach]

## API Contracts (if applicable)
[Endpoint, method, request/response shape]

## How to Test
[Commands or steps to verify the feature works]

## Known Limitations / Follow-ups
[Anything deferred, edge cases not handled]
```

This is **not optional**. Every feature = one memory file.

## Before Committing Checklist

```bash
npm run type-check    # must pass with 0 errors
npm run lint          # must pass with 0 warnings
npm run test:api      # all Vitest tests green
npm run build         # production build must succeed
```

## See Also

- `apps/web/CLAUDE.md` — Next.js/React/styling rules
- `apps/api/CLAUDE.md` — Express/Prisma/auth rules
- `docs/memory/` — history of implemented features
- `docs/plans/` — implementation plans
- `docs/adr/` — architecture decision records
```

**Step 2: Verify the file is saved correctly**

```bash
head -5 CLAUDE.md
```
Expected: `# CodeCraft — Monorepo AI Guide`

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: rewrite root CLAUDE.md for Next.js/Express monorepo reality"
```

---

### Task 2: Create apps/web/CLAUDE.md

**Files:**
- Create: `apps/web/CLAUDE.md`

**Step 1: Write the file**

```markdown
# apps/web — Next.js Frontend Rules

## Tech Stack
- Next.js 16 with App Router (`app/` directory)
- React 19 with Server Components by default
- TailwindCSS v4 (no `tailwind.config.js` — config in CSS)
- TypeScript strict mode
- Framer Motion for animations
- Monaco Editor for code editing
- TanStack React Query v5 for server state
- Zod v4 for client-side validation

## App Router Conventions

```
apps/web/src/app/
├── (auth)/          # Route group: login, register pages
├── (app)/           # Route group: authenticated app pages
├── layout.tsx       # Root layout (fonts, providers)
├── page.tsx         # Landing page
└── globals.css      # TailwindCSS v4 entry + custom properties
```

### Server vs Client Components

- **Default to Server Components.** Only add `'use client'` when you need:
  - `useState`, `useEffect`, event handlers
  - Browser APIs
  - React Query hooks

```tsx
// ✅ Server Component (default — no directive needed)
export default async function Page() {
  const data = await fetch('/api/...').then(r => r.json())
  return <div>{data.title}</div>
}

// ✅ Client Component (only when needed)
'use client'
import { useState } from 'react'
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Data Fetching

- Server Components: `fetch()` directly (Next.js caches automatically)
- Client Components: TanStack React Query hooks from `src/hooks/`
- API base URL from `src/lib/api-client.ts` — never hardcode

```typescript
// ✅ Correct: use the existing api client
import { apiClient } from '@/lib/api-client'

// ✅ Correct: React Query in client components
import { useProblems } from '@/hooks/use-problems'
const { data, isLoading, error } = useProblems()
```

## Neo-Brutalist Design System

### Color Tokens (defined in globals.css)
- `--color-primary`: coral #FF6B6B
- `--color-secondary`: turquoise #4ECDC4
- `--color-accent`: yellow #FFE66D
- `--color-dark`: #1A1A1A (borders, text)
- `--color-bg`: cream #FFFEF9

### TailwindCSS v4 Usage

TailwindCSS v4 uses CSS-first configuration. There is no `tailwind.config.js`.
Custom tokens are defined via `@theme` in `globals.css`.

```tsx
// ✅ Use design system tokens via Tailwind utilities
<button className="btn bg-primary text-white shadow-brutal">
  Click Me
</button>

// ✅ Use cn() for conditional classes
import { cn } from '@/lib/cn'
<div className={cn('card p-6', isActive && 'border-primary')}>

// ❌ Never use inline styles for design-system properties
<button style={{ border: '3px solid black' }}>Bad</button>

// ❌ Never use off-palette colors
<div className="bg-purple-500 text-gray-600">Bad</div>
```

### Component Classes

```css
/* Available utility classes (defined in globals.css) */
.btn           /* base button: border, padding, font-display, transition */
.btn:hover     /* translate 2px, shadow reduces */
.btn:active    /* translate 6px, shadow disappears */
.card          /* border-3, border-dark, shadow-brutal, bg-white */
.card-hover    /* adds hover lift transition */
.shadow-brutal     /* 6px 6px 0 0 #000 */
.shadow-brutal-lg  /* 8px 8px 0 0 #000 */
.shadow-brutal-sm  /* 3px 3px 0 0 #000 */
```

### Animation Guidelines

- Buttons: `translate-x-[2px] translate-y-[2px]` on hover, `[6px]` on active
- Cards: subtle hover lift with `duration-200`
- Framer Motion for page transitions and complex animations
- Durations: `duration-150` (snappy) to `duration-300` (smooth)
- Stagger list items: 50–100ms delay increments

## Component Patterns

### File Structure

```
src/components/
├── ui/              # Design system primitives (Button, Card, Input...)
├── auth/            # Auth-specific components
├── dashboard/       # Dashboard feature components
├── landing/         # Landing page sections
├── practice/        # Code practice workspace
├── animations/      # Reusable animation wrappers
└── providers/       # React context providers
```

### TypeScript

```typescript
// ✅ Always type props explicitly
interface Props {
  problem: Problem
  onSelect: (p: Problem) => void
  className?: string
}

// ✅ Use Zod for form/API response validation
import { z } from 'zod'
const schema = z.object({ title: z.string(), difficulty: z.enum(['Easy','Medium','Hard']) })
type Data = z.infer<typeof schema>

// ❌ No 'any'. Use 'unknown' and narrow.
```

## Testing

```bash
# E2E with Playwright (from repo root)
npm run test:e2e
npm run test:e2e:ui    # interactive debug mode
```

- Test user flows, not internal state.
- Use `page.getByRole()` and `page.getByText()` — prefer accessible selectors.
- For duplicate elements: use `.first()`, `.nth()`, or `exact: true`.

## Fonts

Configured in `src/lib/fonts.ts` and applied via CSS variables in `layout.tsx`:
- `--font-display`: Syne (headings)
- `--font-mono`: JetBrains Mono (code)
- Body: system font stack
```

**Step 2: Verify**

```bash
head -3 apps/web/CLAUDE.md
```
Expected: `# apps/web — Next.js Frontend Rules`

**Step 3: Commit**

```bash
git add apps/web/CLAUDE.md
git commit -m "docs: add apps/web CLAUDE.md with Next.js/React/TailwindCSS v4 rules"
```

---

### Task 3: Create apps/api/CLAUDE.md

**Files:**
- Create: `apps/api/CLAUDE.md`

**Step 1: Write the file**

```markdown
# apps/api — Express API Rules

## Tech Stack
- Express 4 with TypeScript (ESM modules — `"type": "module"`)
- Prisma 6 with PostgreSQL
- Zod v3 for request validation
- JWT (jsonwebtoken) + bcryptjs for auth
- Vitest for unit/integration tests
- Helmet, CORS, express-rate-limit for security

## Project Layout

```
src/
├── app.ts              # Express app factory (createApp())
├── server.ts           # Entry: connect DB, start listening
├── executorServer.ts   # Separate server for code execution
├── config/
│   ├── env.ts          # Zod-validated env vars
│   └── database.ts     # Prisma client singleton
├── middleware/
│   ├── auth.ts         # JWT verification middleware
│   ├── validate.ts     # Zod request validation wrapper
│   ├── rateLimiter.ts  # Rate limit configs
│   ├── errorHandler.ts # Centralized error handler
│   └── requestLogger.ts
├── routes/             # Route handlers (thin — delegate to services)
├── services/           # Business logic (fat — all logic here)
├── types/              # Shared TypeScript types
└── utils/
    ├── apiResponse.ts  # successResponse() / errorResponse() helpers
    └── logger.ts       # Structured logger
```

## API Response Shape

Always use the helpers from `utils/apiResponse.ts`:

```typescript
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// Success
res.json(successResponse({ user, token }))

// Error
res.status(400).json(errorResponse('VALIDATION_ERROR', 'Email is required'))
res.status(401).json(errorResponse('UNAUTHORIZED', 'Invalid token'))
res.status(404).json(errorResponse('NOT_FOUND', 'Problem not found'))
res.status(500).json(errorResponse('INTERNAL_ERROR', 'Unexpected error'))
```

Never return raw objects or ad-hoc error shapes.

## Route Pattern

Routes are thin: validate input, call service, return response.

```typescript
// routes/problems.ts
import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { getProblemById } from '../services/problems.service.js'
import { GetProblemParamsSchema } from './schemas/problems.schema.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

const router = Router()

router.get('/:id', authenticate, validate({ params: GetProblemParamsSchema }), async (req, res) => {
  const problem = await getProblemById(Number(req.params.id))
  if (!problem) {
    res.status(404).json(errorResponse('NOT_FOUND', 'Problem not found'))
    return
  }
  res.json(successResponse(problem))
})

export default router
```

## Service Pattern

All business logic lives in `services/`. Services use Prisma directly.

```typescript
// services/problems.service.ts
import { prisma } from '../config/database.js'
import type { Problem } from '@prisma/client'

export async function getProblemById(id: number): Promise<Problem | null> {
  return prisma.problem.findUnique({ where: { id } })
}
```

- Services are pure functions — no req/res dependencies.
- Throw typed errors; let the error handler catch them.

## Validation with Zod

Define schemas in `routes/schemas/`:

```typescript
// routes/schemas/problems.schema.ts
import { z } from 'zod'

export const GetProblemParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Must be a number'),
})

export const CreateSubmissionSchema = z.object({
  problemId: z.number().int().positive(),
  language: z.enum(['javascript', 'typescript', 'python']),
  code: z.string().min(1),
})
```

Use the `validate()` middleware to apply schemas to `params`, `body`, or `query`.

## Auth Middleware

```typescript
import { authenticate } from '../middleware/auth.js'

// Protected route
router.get('/me', authenticate, async (req, res) => {
  // req.user is set by authenticate middleware
  const { userId } = req.user!
  ...
})
```

JWT access tokens are short-lived (15 min). Refresh tokens use token families
to detect reuse attacks. See `services/auth.service.ts` for the full flow.

## Environment Variables

All env vars are validated at startup in `config/env.ts` using Zod.
Never use `process.env.FOO` directly in routes/services — import from `env.ts`:

```typescript
import { env } from '../config/env.js'
console.log(env.PORT, env.DATABASE_URL, env.JWT_SECRET)
```

## Database (Prisma)

```bash
# From repo root
npm run db:migrate -w @codecraft/api   # create + apply migration
npm run db:generate -w @codecraft/api  # regenerate Prisma client
npm run db:seed -w @codecraft/api      # seed dev data
npm run db:studio -w @codecraft/api    # open Prisma Studio
```

- Always use the `prisma` singleton from `config/database.ts`.
- Use `@@map` for snake_case table names.
- Add indexes for foreign keys and frequently queried columns.

## Testing with Vitest

```bash
npm run test:api        # from repo root
npm run test:watch -w @codecraft/api  # watch mode
```

```typescript
// services/example.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from '../config/database.js'
import { getProblemById } from './problems.service.js'

vi.mock('../config/database.js')

describe('getProblemById', () => {
  it('returns null for unknown id', async () => {
    vi.mocked(prisma.problem.findUnique).mockResolvedValue(null)
    expect(await getProblemById(999)).toBeNull()
  })
})
```

## Security Rules

- All routes that touch user data must use `authenticate` middleware.
- Rate limiting is applied in `app.ts` — do not bypass it for new routes.
- Passwords: always hash with bcryptjs (rounds ≥ 12). Never log or return them.
- Tokens: store only hashed refresh tokens. Never log raw JWTs.
- CSRF: the `csrf.ts` middleware protects state-changing routes.
- SQL: always use Prisma — never raw string interpolation in queries.

## ESM Import Rules

This package uses `"type": "module"`. All local imports must use `.js` extension:

```typescript
// ✅ Correct
import { prisma } from '../config/database.js'
import { env } from '../config/env.js'

// ❌ Wrong — will fail at runtime
import { prisma } from '../config/database'
```
```

**Step 2: Verify**

```bash
head -3 apps/api/CLAUDE.md
```
Expected: `# apps/api — Express API Rules`

**Step 3: Commit**

```bash
git add apps/api/CLAUDE.md
git commit -m "docs: add apps/api CLAUDE.md with Express/Prisma/Zod/auth rules"
```

---

### Task 4: Create the Memory System

**Files:**
- Create: `docs/memory/README.md`
- Create: `docs/memory/.gitkeep` (so the folder is tracked even when empty)

**Step 1: Write the README**

```markdown
# Feature Memory

This folder contains one markdown file per implemented feature, written by the
AI agent at the end of every implementation session.

## Purpose

- Persistent context across sessions — the agent reads recent memory files to
  understand what was recently built and why.
- Human-readable changelog — developers can skim this folder to understand
  what changed without reading git blame.
- Decision log — captures *why* choices were made, not just *what* changed.

## Naming Convention

```
YYYY-MM-DD-<kebab-case-feature-name>.md
```

Examples:
- `2026-02-20-jwt-refresh-token-rotation.md`
- `2026-02-21-monaco-editor-integration.md`
- `2026-02-22-leaderboard-pagination.md`

## Template

```markdown
# [Feature Name] — Implementation Summary
**Date:** YYYY-MM-DD
**Branch:** <branch-name>

## What Was Built
[1-3 sentences describing the feature from the user's perspective]

## Files Changed
- `path/to/file.tsx` — [what changed and why]
- `path/to/file.ts` — [what changed and why]

## Architecture Decisions
[Key decisions: why this approach over alternatives, trade-offs accepted]

## API Contracts (if applicable)
**Endpoint:** `METHOD /api/path`
**Request:** `{ field: type }`
**Response:** `{ field: type }`

## How to Test
```bash
# Commands to verify the feature works
npm run test:api
# or: navigate to /page and do X
```

## Known Limitations / Follow-ups
- [ ] Edge case not handled: ...
- [ ] Performance: ...
```

## Rules for Agents

1. **Always write a memory file** after completing a feature implementation.
2. **Read the last 3-5 memory files** at the start of a new session to restore context.
3. Memory files are **append-only** — never edit a past entry. Create a new one if
   revisiting a feature.
```

**Step 2: Create the .gitkeep**

The README already ensures the folder is tracked, so skip `.gitkeep`.

**Step 3: Commit**

```bash
git add docs/memory/README.md
git commit -m "docs: add docs/memory system with README and agent protocol"
```

---

### Task 5: Write the First Memory Entry (This Feature)

**Files:**
- Create: `docs/memory/2026-02-20-claude-md-workspace-overhaul.md`

**Step 1: Write the memory file**

```markdown
# CLAUDE.md Workspace Overhaul — Implementation Summary
**Date:** 2026-02-20
**Branch:** dev

## What Was Built
Replaced the outdated root CLAUDE.md (which still described Vue 3 + Vite) with
accurate rules for a Next.js 16 / Express monorepo. Added per-app CLAUDE.md
files for `apps/web` and `apps/api`. Created a persistent `docs/memory/` system
so agents can log and recall feature history across sessions.

## Files Changed
- `CLAUDE.md` — full rewrite: monorepo commands, memory protocol, production
  data policy, commit rules
- `apps/web/CLAUDE.md` — created: Next.js App Router, React 19, TailwindCSS v4,
  neo-brutalist design system, component patterns, testing
- `apps/api/CLAUDE.md` — created: Express patterns, Prisma, Zod, JWT auth,
  response shapes, ESM import rules, security rules
- `docs/memory/README.md` — created: memory folder documentation and agent
  protocol

## Architecture Decisions
- Per-app CLAUDE.md files keep rules scoped and prevent cognitive overload from
  a single giant file.
- Memory files are append-only (no edits to past entries) to preserve an honest
  audit trail.
- The memory protocol is embedded in root CLAUDE.md as a required step, not a
  suggestion.

## How to Test
Open a new Claude Code session and verify the agent reads the correct tech stack
(Next.js/React, not Vue). Ask it to create a new component — it should follow
React/TailwindCSS v4 patterns, not Vue.

## Known Limitations / Follow-ups
- [ ] Consider adding a CLAUDE.md to `packages/` if shared packages are added
- [ ] Consider automating memory-file creation via a Claude Code hook
```

**Step 2: Commit**

```bash
git add docs/memory/2026-02-20-claude-md-workspace-overhaul.md
git commit -m "docs: add memory entry for CLAUDE.md workspace overhaul"
```

---

### Task 6: Final Verification

**Step 1: Confirm all files exist**

```bash
ls CLAUDE.md apps/web/CLAUDE.md apps/api/CLAUDE.md docs/memory/README.md docs/memory/2026-02-20-claude-md-workspace-overhaul.md
```
Expected: all 5 paths listed with no errors.

**Step 2: Confirm git log**

```bash
git log --oneline -5
```
Expected: 4-5 recent commits from this plan visible.

**Step 3: Confirm root CLAUDE.md mentions correct stack**

```bash
grep -i "next.js\|express\|prisma" CLAUDE.md | head -5
```
Expected: at least one match for each.

---

## Summary of Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `CLAUDE.md` | Modified | Rewrite with correct monorepo stack + memory protocol |
| `apps/web/CLAUDE.md` | Created | Next.js/React/TailwindCSS v4/neo-brutalist rules |
| `apps/api/CLAUDE.md` | Created | Express/Prisma/Zod/JWT/security rules |
| `docs/memory/README.md` | Created | Memory system documentation + agent protocol |
| `docs/memory/2026-02-20-claude-md-workspace-overhaul.md` | Created | First memory entry (this feature) |
