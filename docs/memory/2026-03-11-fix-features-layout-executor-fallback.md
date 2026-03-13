# Fix Features Layout + Executor Dev-Mode Fallback — Implementation Summary
**Date:** 2026-03-11
**Branch:** dev

## What Was Built
Equalized the three feature cards on the landing page (removed bento hero/normal distinction) and added dev-mode fallback for the code executor so it gracefully degrades to Docker/VM when the remote executor is unreachable.

## Files Changed
- `apps/web/src/components/landing/features.tsx` — Removed `bento` property from feature objects, removed col-span conditional, removed conditional glow/height on GlassCard. All three cards now render identically in a uniform 3-column grid.
- `apps/api/src/services/executor/index.ts` — In `getExecutor()`, replaced hard throw with production-only throw when HttpExecutor is unavailable; dev falls through to Docker → VM chain. In `getExecutorReadiness()`, same pattern: only returns false in production when remote is unavailable.

## Architecture Decisions
- Cards use `gridAutoRows: '1fr'` on the parent grid, so removing fixed heights lets CSS equalize them naturally.
- Executor fallback is gated on `NODE_ENV === 'production'` to keep production strict (fail-fast) while dev stays flexible.

## How to Test
1. `npm run dev` — visit landing page, confirm 3 equal-width, equal-height cards under "Built for focused practice"
2. `npm run dev:api` — with `EXECUTOR_URL` set to an unreachable service, "Run Tests" should fall back to VM executor
3. `npm run type-check` — 0 errors
4. `npm run test:api` — all tests pass
5. `npm run build` — production build succeeds

## Known Limitations / Follow-ups
- The `glow="none"` prop is passed explicitly; could be removed entirely if `GlassCard` defaults to no glow.
- Executor caching (`let executor`) means the fallback decision is made once per process lifetime. If the remote comes back online, a restart is needed.
