# CodeCraft

CodeCraft is a coding interview practice platform with a Vue frontend and a Node/Express API backed by PostgreSQL.

## Production MVP Architecture

- Frontend: Vite + Vue 3 (deploy target: Vercel)
- API: Express + Prisma (deploy target: Render/Fly)
- Executor: dedicated isolated execution service (separate process/service)
- Database: managed PostgreSQL
- Auth: httpOnly cookie sessions (access + refresh), refresh-token rotation
- Security baseline: CORS allowlist, Helmet, CSRF double-submit token
- Observability: structured request logs with request ID, telemetry events

## Repository Layout

- `/Users/pedroernesto/Desktop/testeclaude/src`: frontend app
- `/Users/pedroernesto/Desktop/testeclaude/src/features`: feature-owned screens/state
- `/Users/pedroernesto/Desktop/testeclaude/src/contracts`: shared API/domain contracts
- `/Users/pedroernesto/Desktop/testeclaude/server/src`: API and executor service code
- `/Users/pedroernesto/Desktop/testeclaude/server/src/services`: backend business logic layer
- `/Users/pedroernesto/Desktop/testeclaude/server/src/routes/schemas`: route validation schemas
- `/Users/pedroernesto/Desktop/testeclaude/server/prisma`: Prisma schema and migrations
- `/Users/pedroernesto/Desktop/testeclaude/e2e`: Playwright tests
- `/Users/pedroernesto/Desktop/testeclaude/docs/ops`: release, rollback, backup/restore runbooks
- `/Users/pedroernesto/Desktop/testeclaude/docs/adr`: architecture decisions
- `/Users/pedroernesto/Desktop/testeclaude/.github/workflows`: CI/CD workflows

## Local Development

### 1) Install dependencies

```bash
npm ci
npm -C server ci
```

### 2) Configure env files

```bash
cp /Users/pedroernesto/Desktop/testeclaude/.env.example /Users/pedroernesto/Desktop/testeclaude/.env
cp /Users/pedroernesto/Desktop/testeclaude/server/.env.example /Users/pedroernesto/Desktop/testeclaude/server/.env
```

### 3) Generate Prisma client

```bash
npm -C server run db:generate
```

### 4) Run services

```bash
npm run dev                     # frontend
npm -C server run dev           # API
npm -C server run dev:executor  # dedicated executor (recommended)
```

## Quality Gates

```bash
npm run type-check
npm run lint -- --quiet
npm run check:file-size
npm run build
npm -C server run build
npm run test:e2e
```

## Auth and Security Notes

- Browser storage does not hold auth tokens.
- API uses cookie-based auth with `httpOnly` cookies.
- CSRF protection is enabled on mutating routes via `X-CSRF-Token` + csrf cookie.
- In production, VM executor fallback is disabled.

## Telemetry Events

Core product events captured:

- `lp_cta_clicked`
- `signup_started`
- `signup_completed`
- `first_problem_started`
- `code_executed`
- `problem_completed`

## Operations Docs

- Rollback: `/Users/pedroernesto/Desktop/testeclaude/docs/ops/ROLLBACK_RUNBOOK.md`
- Backups/restore: `/Users/pedroernesto/Desktop/testeclaude/docs/ops/DB_BACKUP_RESTORE.md`
- Release checklist: `/Users/pedroernesto/Desktop/testeclaude/docs/ops/RELEASE_CHECKLIST.md`
- ADR 0001 (frontend architecture): `/Users/pedroernesto/Desktop/testeclaude/docs/adr/0001-frontend-feature-architecture.md`
- ADR 0002 (backend service layer): `/Users/pedroernesto/Desktop/testeclaude/docs/adr/0002-backend-service-layer.md`
