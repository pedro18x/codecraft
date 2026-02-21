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
npm run test:e2e      # Playwright E2E tests in apps/web
npm run build         # production build must succeed
```

## See Also

- `apps/web/CLAUDE.md` — Next.js/React/styling rules
- `apps/api/CLAUDE.md` — Express/Prisma/auth rules
- `docs/memory/` — history of implemented features
- `docs/plans/` — implementation plans
- `docs/adr/` — architecture decision records
