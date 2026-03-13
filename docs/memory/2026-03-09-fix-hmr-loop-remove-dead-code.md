# Fix Infinite Refresh Loop & Remove Dead Code — Implementation Summary
**Date:** 2026-03-09
**Branch:** dev

## What Was Built
Fixed the infinite HMR refresh loop caused by 9 `@keyframes` defined inside the `@theme` block in `globals.css`. Moved 2 used keyframes (`fadeIn`, `zenShimmer`) to top-level and deleted 7 unused keyframes. Also removed 9 unused component files (dead code) including abandoned Three.js components and unused landing page effects.

## Files Changed
- `apps/web/src/app/globals.css` — Moved `fadeIn` and `zenShimmer` keyframes out of `@theme` to top-level; deleted 7 unused keyframes and 8 unused `--animate-*` tokens
- `apps/web/src/components/landing/blur-text.tsx` — Deleted (unused)
- `apps/web/src/components/landing/tilted-card.tsx` — Deleted (unused)
- `apps/web/src/components/landing/spotlight-card.tsx` — Deleted (unused)
- `apps/web/src/components/landing/liquid-ether.tsx` — Deleted (unused Three.js fluid sim)
- `apps/web/src/components/backgrounds/dot-grid.tsx` — Deleted (unused, referenced missing keyframe)
- `apps/web/src/components/three/hero-scene.tsx` — Deleted (unused)
- `apps/web/src/components/three/zen-canvas.tsx` — Deleted (unused)
- `apps/web/src/components/three/zen-background.tsx` — Deleted (unused)
- `apps/web/src/components/three/floating-particles.tsx` — Deleted (unused)
- `apps/web/src/components/three/` — Directory removed (empty after deletions)

## Architecture Decisions
- **Root cause:** Tailwind v4's `@theme` block is for design tokens only. `@keyframes` inside `@theme` causes Turbopack to re-emit the block each HMR cycle, detecting false changes → infinite loop. This is the 4th instance of this bug pattern in this repo.
- **Only moved actually-used keyframes:** `fadeIn` (used in tooltip.tsx) and `zenShimmer` (used in skeleton.tsx). The other 7 were dead code.
- **Kept animation tokens that reference moved keyframes:** `--animate-fade-in` and `--animate-shimmer` remain in `@theme` as valid design tokens (they're just shorthand references, not keyframe definitions).

## How to Test
1. `npm run dev` — page loads without infinite refresh
2. `npm run build` — production build succeeds
3. `npm run type-check` — no TypeScript errors
4. Verify tooltip and skeleton animations still work (they use the preserved keyframes)

## Known Limitations / Follow-ups
- 4 pre-existing lint warnings remain (unrelated to this change)
- The `backgrounds/` directory still has other files; only `dot-grid.tsx` was removed
