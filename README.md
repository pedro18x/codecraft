# CodeCraft

CodeCraft is a full-stack coding interview practice platform built as a monorepo with a Next.js frontend and an Express API. It combines a polished landing page, authenticated practice flows, persistent progress tracking, and isolated code execution in a structure that is small enough for a portfolio project but still engineered like a real product.

## Highlights

- 62 seeded interview-style problems across multiple difficulty levels and topics
- Practice interface with Monaco editor, test execution, hints, focus mode, and saved code
- Cookie-based authentication with refresh-token rotation and CSRF protection
- User dashboard, profile progress, leaderboard, and admin management screens
- Split deployment model that fits Vercel for the web app and Render for backend services

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- API: Express 4, Prisma 6, PostgreSQL, Zod, Vitest
- Editor and UI: Monaco Editor, Framer Motion, React Query
- Security: Helmet, CORS allowlist, CSRF double-submit, rate limiting, httpOnly cookies
- Execution: dedicated executor service with Docker-based isolation support

## Repository Layout

```text
.
├── apps/
│   ├── api/              # Express API, Prisma schema, executor service
│   └── web/              # Next.js application
├── docs/                 # ADRs, plans, memory notes, ops docs
├── dev.sh                # Unified local dev script
├── init.sh               # First-time environment bootstrap
└── package.json          # Workspace entrypoint
```

## Core Product Areas

- Landing page with custom visuals and product overview
- Auth flows for register, login, logout, refresh, and admin login
- Problem dashboard with search, filters, status tracking, and difficulty views
- Practice page with editor persistence, result output, and progress updates
- Profile and leaderboard views
- Admin panel for problems, users, and submissions

## Local Setup

### Prerequisites

- Node.js 20+
- npm
- Docker Desktop or another way to run PostgreSQL locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment files

Copy the API example file and create the web env file:

```bash
cp apps/api/.env.example apps/api/.env
cat > apps/web/.env.local <<'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF
```

Recommended local API changes in `apps/api/.env`:

```env
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### 3. Start PostgreSQL

```bash
cd apps/api
docker compose up -d
cd ../..
```

### 4. Generate Prisma client, apply schema, and seed data

```bash
npm run db:generate -w @codecraft/api
npm run db:push -w @codecraft/api
npm run db:seed -w @codecraft/api
```

### 5. Start the application

Recommended:

```bash
./dev.sh
```

Manual alternative:

```bash
npm run dev:api
npm run dev
```

Default local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- API health: `http://localhost:3001/health`
- API readiness: `http://localhost:3001/ready`

## Development Commands

### Root commands

```bash
npm run dev
npm run dev:api
npm run build
npm run build:api
npm run type-check
npm run lint
npm run test:api
npm run test:e2e
```

### Helper scripts

```bash
./init.sh
./dev.sh
./dev.sh stop
./dev.sh restart
```

### API workspace commands

```bash
npm run dev:executor -w @codecraft/api
npm run db:generate -w @codecraft/api
npm run db:migrate -w @codecraft/api
npm run db:push -w @codecraft/api
npm run db:seed -w @codecraft/api
npm run db:studio -w @codecraft/api
npm run cleanup:refresh-tokens -w @codecraft/api
```

## Deployment Notes

CodeCraft is structured to deploy cleanly as separate services:

- Web app: Vercel
- API: Render
- Database: managed PostgreSQL
- Executor: separate service endpoint

Important production note:

- In development, the API can fall back to local execution paths.
- In production, code execution should be provided through `EXECUTOR_URL`; the dev-only VM fallback is intentionally disabled.

## Quality Checks

Before opening a PR or shipping a change:

```bash
npm run type-check
npm run lint
npm run build:api
npm run test:api
```

Optional, but useful when you are touching user flows:

```bash
npm run test:e2e
npm run build
```

## Architecture Notes

- `apps/web` is responsible for the landing page, authenticated app shell, admin UI, and client-side state orchestration.
- `apps/api` owns auth, problems, progress, leaderboard, submissions, saved code, admin routes, and telemetry.
- Prisma is the source of truth for persistence.
- The execution layer is intentionally separated from the main API so the heavy path stays explicit.

## Status

CodeCraft is built as a polished portfolio project rather than a large-scale SaaS product. The codebase still keeps strong fundamentals: typed boundaries, separated services, protected auth flows, and a deployment model that maps cleanly to Vercel plus Render.
