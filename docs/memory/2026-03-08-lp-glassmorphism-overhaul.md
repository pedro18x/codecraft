# Landing Page Glassmorphism Overhaul — Implementation Summary
**Date:** 2026-03-08
**Branch:** dev

## What Was Built
Rebuilt every section of the CodeCraft landing page into a glassmorphism dark-luxury aesthetic. Replaced the DotGrid background with a CSS perspective vanishing-point grid, rebuilt the Hero as a 2-column split layout with a glass editor preview card on the right, and applied `backdrop-blur` glass tokens to all section cards. Features were rearranged into a bento grid and a `GlassCard` reusable component was introduced to unify the glass formula across sections.

## Files Changed
- `apps/web/src/styles/tokens.css` — added 8 glassmorphism design tokens (`--glass-bg`, `--glass-border`, glow colors, `--shadow-glass`, `--shadow-glass-lg`)
- `apps/web/src/app/globals.css` — replaced `dotGridFade` keyframe with `gridScroll` and added `gradientBorder` keyframes
- `apps/web/src/app/page.tsx` — swapped `DotGrid` import/usage for `PerspectiveGrid`
- `apps/web/src/components/backgrounds/perspective-grid.tsx` — **created**: CSS perspective grid with `rotateX(78deg)` floor, animated scroll, horizon glow, and horizon line
- `apps/web/src/components/ui/glass-card.tsx` — **created**: reusable `forwardRef` wrapper with `backdrop-blur`, glow accent variants (`jade`/`rust`/`amber`), hoverable lift, and top-edge highlight
- `apps/web/src/components/ui/index.ts` — added `GlassCard` export
- `apps/web/src/components/landing/split-text.tsx` — **created**: word-by-word slide-up animation using overflow-clip technique with Framer Motion
- `apps/web/src/components/landing/hero.tsx` — full rebuild: 2-column split layout (`md:grid-cols-2`), left panel has `SplitText` headline + glass badge + CTAs, right panel has glass editor preview card with fake code and test results
- `apps/web/src/components/landing/stats-bar.tsx` — redesigned as single `GlassCard` pill with 1px vertical dividers between stats
- `apps/web/src/components/landing/how-it-works.tsx` — replaced plain surface cards with `GlassCard`, added dashed CSS connector line between steps on desktop, glowing step numbers
- `apps/web/src/components/landing/features.tsx` — replaced `SpotlightCard` grid with bento layout: first feature spans 2 of 3 columns with jade glow, two smaller cards follow
- `apps/web/src/components/landing/dashboard-preview.tsx` — browser chrome wrapper replaced with `GlassCard glow="jade"`; 1317-line internals untouched
- `apps/web/src/components/landing/final-cta.tsx` — replaced bordered section with animated gradient border wrapper (1px padding + `background-size: 300% 300%` cycling through jade/rust/amber)

## Architecture Decisions
- **Design tokens over Tailwind utilities for glass**: `--glass-bg`, `--glass-border`, etc. live in `tokens.css` not in the Tailwind `@theme` block — keeps glass values editable from one place and usable in inline styles without coupling to class generation.
- **`GlassCard` as `forwardRef`**: allows Framer Motion's `motion()` wrapper and parent refs to attach directly to the DOM node.
- **PerspectiveGrid is pure CSS**: no canvas/WebGL — `perspective` + `rotateX(78deg)` + `background-image` grid lines + `mask-image` fade. Cheap on GPU and works in all modern browsers.
- **Bento grid via `md:col-span-2`**: Tailwind's responsive class on the first feature card — simpler than a manual grid template override, and degrades gracefully to full-width on mobile.
- **Animated gradient border trick**: 1px `padding` on a wrapper whose `background` is an oversized gradient (`background-size: 300%`); the inner content covers with a solid background, leaving only the ring. No border property needed.
- **DotGrid not deleted**: the file `dot-grid.tsx` was not deleted as it may be used elsewhere in the codebase. Its import was only removed from `page.tsx`.

## API Contracts (if applicable)
N/A

## How to Test
```bash
npm run type-check   # 0 errors
npm run lint         # 18 pre-existing warnings, 0 errors, none from changed files
npm run build        # production build succeeds
npm run build:api    # API build unaffected
npm run dev          # open http://localhost:3001 and visually verify:
                     # - Perspective grid scrolls in the background
                     # - Hero is 2-column on desktop, stacked on mobile
                     # - SplitText words animate up on load
                     # - Glass editor preview card on right of hero
                     # - StatsBar is a single glass pill with vertical dividers
                     # - HowItWorks has glass cards + dashed connector line
                     # - Features shows bento (first card 2-wide)
                     # - DashboardPreview has jade glow on glass wrapper
                     # - FinalCta has animated gradient border cycling
```

## Known Limitations / Follow-ups
- `dot-grid.tsx` was not deleted — it is unused by `page.tsx` but kept in case it is referenced elsewhere; can be deleted after confirming no other imports.
- The bento layout has 3 features: card 0 (2-col), card 1 (1-col), card 2 (1-col, new row at 1/3 width). A 4th feature could fill the second row for a symmetric bento — deferred.
- `PerspectiveGrid` uses `animation: gridScroll` which moves the grid floor upward indefinitely; on very low-end devices this may consume unnecessary paint cycles. A `prefers-reduced-motion` guard could pause the animation.
