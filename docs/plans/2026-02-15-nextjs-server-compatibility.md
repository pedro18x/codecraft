# Next.js ↔ Express Server Compatibility Fixes

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all API mismatches between the Next.js frontend (port 3001) and the Express backend so the full stack runs correctly end-to-end.

**Architecture:** The Express server at `localhost:3000` is the single source of truth. All fixes are either (a) config/env changes on the server side or (b) correcting the Next.js hooks/providers to match the actual server API contracts. No new features — only correctness fixes.

**Tech Stack:** Express (server), Next.js App Router (frontend), TypeScript strict

---

## Issues Summary

| # | Location | Severity | Description |
|---|----------|----------|-------------|
| 1 | `server/.env` | **BREAKING** | `CORS_ORIGIN` doesn't include `http://localhost:3001` |
| 2 | `use-problems.ts` | **BREAKING** | Expects `unknown[]` but server returns `{ problems: [] }` |
| 3 | `auth-provider.tsx` | **BREAKING** | `/auth/me` returns user directly; hook expects `{ user }` wrapper |
| 4 | `use-code-storage.ts` | **BREAKING** | Uses `POST /code` (wrong verb+path); server has `PUT /code/:id/:lang` |
| 5 | `use-code-storage.ts` | **Bug** | Calls nonexistent reset endpoint; fix to re-save starter code |
| 6 | `use-progress.ts` + server | **Bug** | `POST /progress` silently fails; add server endpoint |

---

## Phase 1: Server Changes

### Task 1: Add `http://localhost:3001` to CORS

**Files:**
- Modify: `server/.env`

**Step 1: Edit CORS_ORIGIN**

Open `server/.env` and change:
```
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```
to:
```
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3001
```

**Step 2: Verify env schema accepts it**

The env schema in `server/src/config/env.ts` parses `CORS_ORIGIN` as a plain string and `.split(',')` it at runtime — no schema change needed.

**Step 3: Restart server and verify**

```bash
cd /Users/pedroernesto/Desktop/testeclaude/server
npm run dev
```

Open `http://localhost:3000/health` in a browser or curl it:
```bash
curl -s -H "Origin: http://localhost:3001" http://localhost:3000/health | jq .
```
Expected: `{"success":true,"data":{"status":"ok","timestamp":"..."}}` (no CORS error)

**Step 4: Commit**

```bash
git add server/.env
git commit -m "fix: add Next.js port 3001 to server CORS_ORIGIN"
```

---

### Task 2: Add `POST /api/progress` Endpoint

**Files:**
- Modify: `server/src/routes/progress.ts`
- Modify: `server/src/services/progress.service.ts`

**Context:** The Next.js `use-progress` hook calls `POST /api/progress` with `{ problemId, status }` to optimistically sync progress. The server currently only has GET routes. This adds an upsert endpoint.

**Step 1: Add `upsertProgress` to service**

In `server/src/services/progress.service.ts`, add after `getUserProgressStats`:

```typescript
export async function upsertProgress(
  userId: number,
  problemId: number,
  status: 'attempted' | 'completed',
) {
  return prisma.progress.upsert({
    where: { userId_problemId: { userId, problemId } },
    update: {
      status,
      attempts: { increment: 1 },
      lastAttempt: new Date(),
      ...(status === 'completed' ? { completedAt: new Date() } : {}),
    },
    create: {
      userId,
      problemId,
      status,
      attempts: 1,
      lastAttempt: new Date(),
      completedAt: status === 'completed' ? new Date() : null,
    },
  })
}
```

**Step 2: Check Prisma schema has composite unique key**

```bash
grep -A5 "model Progress" /Users/pedroernesto/Desktop/testeclaude/server/prisma/schema.prisma
```

Expected: `@@unique([userId, problemId])` or `userId_problemId` is a named unique. If not present, the upsert `where` clause needs adjustment — use `findFirst` + `update`/`create` instead.

**Step 3: Add POST route in `progress.ts`**

In `server/src/routes/progress.ts`, add after the stats route:

```typescript
import { z } from 'zod'
import { validate } from '../middleware/validate.js'
import { upsertProgress } from '../services/progress.service.js'

const UpsertProgressSchema = z.object({
  problemId: z.number().int().positive(),
  status: z.enum(['attempted', 'completed']),
})

// POST /api/progress
router.post(
  '/',
  validate(UpsertProgressSchema),
  asyncHandler(async (req, res) => {
    const { problemId, status } = req.body as z.infer<typeof UpsertProgressSchema>
    const result = await upsertProgress(req.userId!, problemId, status)
    res.json(successResponse(result))
  })
)
```

**Step 4: Test the endpoint manually**

```bash
# First login to get cookies
curl -s -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' | jq .

# Then test progress upsert (replace csrf_token value with actual from /auth/csrf)
curl -s -b cookies.txt -X POST http://localhost:3000/api/progress \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: $(curl -s -c cookies.txt -b cookies.txt http://localhost:3000/api/auth/csrf | jq -r '.data.csrfToken')" \
  -d '{"problemId":1,"status":"attempted"}' | jq .
```

Expected: `{"success":true,"data":{...progress record...}}`

**Step 5: Commit**

```bash
git add server/src/routes/progress.ts server/src/services/progress.service.ts
git commit -m "feat: add POST /api/progress upsert endpoint"
```

---

## Phase 2: Next.js Frontend Fixes

### Task 3: Fix `use-problems.ts` — Unwrap `{ problems }` Wrapper

**Files:**
- Modify: `codecraft-next/src/hooks/use-problems.ts`

**Context:** The server returns `successResponse({ problems })` which after API client unwrapping becomes `{ problems: [...] }`. The hook currently calls `api.get<unknown[]>('/problems')` assuming a bare array — which causes `z.array(ProblemSchema).parse()` to fail on an object.

**Step 1: Fix `useProblems` queryFn**

In `use-problems.ts`, change:
```typescript
// BEFORE
queryFn: async () => {
  const data = await api.get<unknown[]>('/problems')
  return z.array(ProblemSchema).parse(data)
},
```
to:
```typescript
// AFTER
queryFn: async () => {
  const res = await api.get<{ problems: unknown[] }>('/problems')
  return z.array(ProblemSchema).parse(res.problems)
},
```

**Step 2: Fix `useProblem` fallback path**

In the `useProblem` fallback (line ~28–31):
```typescript
// BEFORE
const all = await api.get<unknown[]>('/problems')
const problems = z.array(ProblemSchema).parse(all)
```
```typescript
// AFTER
const res = await api.get<{ problems: unknown[] }>('/problems')
const problems = z.array(ProblemSchema).parse(res.problems)
```

**Step 3: Verify types compile**

```bash
cd /Users/pedroernesto/Desktop/testeclaude/codecraft-next
npm run type-check
```

Expected: no errors.

**Step 4: Commit**

```bash
git add src/hooks/use-problems.ts
git commit -m "fix: unwrap {problems} envelope from GET /api/problems response"
```

---

### Task 4: Fix `auth-provider.tsx` — `/auth/me` Returns User Directly

**Files:**
- Modify: `codecraft-next/src/components/providers/auth-provider.tsx`

**Context:** The server does `successResponse(req.user)` — not `successResponse({ user: req.user })`. After the API client unwraps `.data`, the result is the user object itself `{ id, email, username }`. The provider calls `api.get<{ user: User }>('/auth/me')` then does `data.user` — which would be `undefined`.

**Step 1: Fix `fetchMe`**

In `auth-provider.tsx`, change:
```typescript
// BEFORE
const data = await api.get<{ user: User }>('/auth/me')
setUser(data.user)
```
to:
```typescript
// AFTER
const data = await api.get<User>('/auth/me')
setUser(data)
```

**Step 2: Verify TypeScript still compiles**

```bash
npm run type-check
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/components/providers/auth-provider.tsx
git commit -m "fix: /auth/me returns user directly, not wrapped in {user}"
```

---

### Task 5: Fix `use-code-storage.ts` — Wrong Save Endpoint

**Files:**
- Modify: `codecraft-next/src/hooks/use-code-storage.ts`

**Context:** Two bugs in this hook:
1. **Save code** — calls `api.post('/code', { problemId, language, code })`. Server expects `PUT /api/code/:problemId/:language` with body `{ code }`.
2. **Reset code** — calls a nonexistent `/code/:id/:lang/reset` endpoint. Server has no reset route. Fix: use `PUT` to save the starter code (same as normal save).

**Step 1: Fix save call (line ~61)**

Change:
```typescript
// BEFORE
api.post('/code', { problemId, language, code: next }).catch(() => {})
```
to:
```typescript
// AFTER
api.put(`/code/${problemId}/${language}`, { code: next }).catch(() => {})
```

**Step 2: Fix reset call (line ~75)**

Change:
```typescript
// BEFORE
api.post(`/code/${problemId}/${language}/reset`, {}).catch(() => {})
```
to:
```typescript
// AFTER
api.put(`/code/${problemId}/${language}`, { code: starterCode }).catch(() => {})
```

Note: `starterCode` is already in scope as the hook param.

**Step 3: Verify types compile**

```bash
npm run type-check
```

Expected: no errors.

**Step 4: Commit**

```bash
git add src/hooks/use-code-storage.ts
git commit -m "fix: use PUT /code/:id/:lang for save and reset (was POST /code)"
```

---

## Phase 3: Verification

### Task 6: Full Stack Smoke Test

**Step 1: Start both servers**

Terminal 1:
```bash
cd /Users/pedroernesto/Desktop/testeclaude/server
npm run dev
```

Terminal 2:
```bash
cd /Users/pedroernesto/Desktop/testeclaude/codecraft-next
npm run dev -- -p 3001
```

**Step 2: Verify landing page loads**

Open `http://localhost:3001`. Expected: landing page renders, no console CORS errors.

**Step 3: Verify problems list loads on dashboard**

Navigate to `http://localhost:3001/dashboard`. Expected: problem list renders (fetched from API, not empty).

**Step 4: Verify auth flow**

1. Click Login → navigate to `/login`
2. Submit credentials
3. Expected: redirected to `/dashboard` as authenticated user

**Step 5: Verify practice page**

1. Click a problem on dashboard
2. Expected: practice page loads with Monaco editor and problem description
3. Run tests — expected: test results appear, no 404 errors in network tab

**Step 6: Final build check**

```bash
cd /Users/pedroernesto/Desktop/testeclaude/codecraft-next
npm run build
```

Expected: clean build, zero TypeScript errors.

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: verify full-stack compatibility — all fixes applied"
```

---

## Execution Order Summary

| # | Task | Files | Breaking Fix |
|---|------|-------|-------------|
| 1 | CORS env var | `server/.env` | Yes — all API calls blocked |
| 2 | POST /progress endpoint | `server/src/routes/progress.ts`, `services/progress.service.ts` | No — currently silent-fails |
| 3 | useProblems response shape | `src/hooks/use-problems.ts` | Yes — dashboard shows empty |
| 4 | /auth/me response shape | `src/components/providers/auth-provider.tsx` | Yes — auth never resolves user |
| 5 | Code save/reset endpoint | `src/hooks/use-code-storage.ts` | Yes — code never persists to server |
| 6 | Smoke test | — | Verification |
