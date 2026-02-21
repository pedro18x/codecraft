# apps/api — Express API Rules

## Tech Stack
- Express 4 with TypeScript (ESM modules — `"type": "module"`)
- Prisma 6 with PostgreSQL
- Zod v3 for request/response validation
- JWT (jsonwebtoken) + bcryptjs for authentication
- Vitest for unit and integration tests
- Helmet, CORS, express-rate-limit for security

## Project Layout

```
src/
├── app.ts              # Express app factory (createApp())
├── server.ts           # Entry: connect DB, start listening
├── executorServer.ts   # Separate server for code execution
├── config/
│   ├── env.ts          # Zod-validated env vars — import from here, never process.env directly
│   └── database.ts     # Prisma client singleton
├── middleware/
│   ├── auth.ts         # JWT verification — adds req.user
│   ├── validate.ts     # Zod request validation wrapper
│   ├── rateLimiter.ts  # Rate limit configs
│   ├── errorHandler.ts # Centralized error handler (last middleware)
│   └── requestLogger.ts
├── routes/             # Route handlers — thin, delegate to services
├── services/           # Business logic — all logic lives here
├── types/              # Shared TypeScript types
└── utils/
    ├── apiResponse.ts  # successResponse() / errorResponse()
    └── logger.ts       # Structured logger
```

## API Response Shape

Always use the helpers from `utils/apiResponse.ts`. Never return raw objects or ad-hoc shapes.

```typescript
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// Success
res.json(successResponse({ user, token }))

// Client errors
res.status(400).json(errorResponse('VALIDATION_ERROR', 'Email is required'))
res.status(401).json(errorResponse('UNAUTHORIZED', 'Invalid token'))
res.status(404).json(errorResponse('NOT_FOUND', 'Problem not found'))

// Server errors
res.status(500).json(errorResponse('INTERNAL_ERROR', 'Unexpected error'))
```

## Route Pattern (Thin Routes)

Routes validate input, call a service, and return a response. No business logic in routes.

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

## Service Pattern (Fat Services)

All business logic lives in `services/`. Services use Prisma directly and are pure functions (no req/res).

```typescript
// services/problems.service.ts
import { prisma } from '../config/database.js'
import type { Problem } from '@prisma/client'

export async function getProblemById(id: number): Promise<Problem | null> {
  return prisma.problem.findUnique({ where: { id } })
}
```

Throw typed errors from services; let `errorHandler.ts` catch and format them.

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

Use `validate({ params, body, query })` middleware — all three keys are optional.

## Auth Middleware

```typescript
import { authenticate } from '../middleware/auth.js'

// Protected route — req.user is set after this middleware runs
router.get('/me', authenticate, async (req, res) => {
  const { userId } = req.user!
  // ...
})
```

JWT access tokens: short-lived (15 min). Refresh tokens use token families to detect reuse attacks.
See `services/auth.service.ts` for the full rotation flow.

## Environment Variables

Never use `process.env.FOO` directly in routes or services. Always import from `config/env.ts`:

```typescript
import { env } from '../config/env.js'

env.PORT           // number
env.DATABASE_URL   // string
env.JWT_SECRET     // string
env.NODE_ENV       // 'development' | 'production' | 'test'
```

All vars are Zod-validated at startup. Missing vars crash the process immediately.

## Database (Prisma)

```bash
# From repo root
npm run db:migrate -w @codecraft/api    # create + apply migration
npm run db:generate -w @codecraft/api   # regenerate Prisma client after schema change
npm run db:seed -w @codecraft/api       # seed dev data
npm run db:studio -w @codecraft/api     # open Prisma Studio GUI
```

- Always use the `prisma` singleton from `config/database.ts`.
- Use `@@map` for snake_case table names (e.g. `@@map("refresh_tokens")`).
- Add `@@index` for foreign keys and frequently filtered columns.
- Never write raw SQL strings — use Prisma's query API.

## Testing with Vitest

```bash
# From repo root
npm run test:api                          # run once
npm run test:watch -w @codecraft/api      # watch mode
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

Test services in isolation by mocking `config/database.js`. Test routes with `supertest`.

## Security Rules

- Every route that reads/writes user data **must** use `authenticate` middleware.
- Rate limiting is applied in `app.ts` — do not bypass or remove it for new routes.
- Passwords: always hash with bcryptjs, minimum 12 rounds. Never log or return them.
- Tokens: store only **hashed** refresh tokens in the DB. Never log raw JWTs.
- CSRF: `csrf.ts` middleware protects state-changing routes — do not skip it.
- SQL injection: always use Prisma — never string-interpolate into queries.
- Input: always validate with `validate()` middleware before accessing `req.body` or `req.params`.

## ESM Import Rules

This package uses `"type": "module"`. All local imports **must** include `.js` extension:

```typescript
// ✅ Correct
import { prisma } from '../config/database.js'
import { env } from '../config/env.js'
import { successResponse } from '../utils/apiResponse.js'

// ❌ Will fail at runtime
import { prisma } from '../config/database'
```

This applies to all relative imports. Third-party imports (e.g. `from 'express'`) do not need `.js`.

## Memory Protocol

After implementing any API feature, create a memory entry per the root `CLAUDE.md` Memory Protocol:

**File:** `docs/memory/YYYY-MM-DD-<kebab-feature-name>.md`

See root `CLAUDE.md` for the required template. This is mandatory.
