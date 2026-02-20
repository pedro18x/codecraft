# CodeCraft Implementation Notes

## Current Architecture

### Frontend
- Framework: Vue 3 + Vite + TypeScript
- Route views are thin wrappers under `src/views`
- Feature state and screen composition live under `src/features/*`
- Shared API contracts live under `src/contracts/*`
- Design primitives in `src/design-system` and reusable brutal components in `src/components/brutal`

### Backend
- Framework: Express + Prisma + PostgreSQL
- Route handlers in `server/src/routes/*` are thin and delegate to services
- Request schemas in `server/src/routes/schemas/*`
- Core business logic in `server/src/services/*`
- Executor orchestration centralized in `server/src/services/execution.service.ts`

## Maintainability Decisions
- `useTheme` is singleton-based to avoid repeated side effects.
- Auth top navigation extracted into `src/components/auth/AuthTopNav.vue`.
- App routes (`Dashboard`, `Profile`, `Leaderboard`, `Practice`) are decomposed into feature screens.
- File-size guard enforces route-view complexity (`npm run check:file-size`).
- Landing page is exempted from file-size guard due marketing-layout density.

## Testing Layout
- End-to-end tests are split by concern:
  - `e2e/landing.spec.ts`
  - `e2e/auth.spec.ts`
  - `e2e/dashboard.spec.ts`
  - `e2e/practice.spec.ts`
- Shared color/contrast helper: `e2e/helpers/color.ts`

## Quality Gates
Run before merge:

```bash
npm run type-check
npm run lint -- --quiet
npm run check:file-size
npm run build
npm -C server run build
npm run test:e2e
```

## ADR Index
- `docs/adr/0001-frontend-feature-architecture.md`
- `docs/adr/0002-backend-service-layer.md`
