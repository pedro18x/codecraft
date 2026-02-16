# LP Animations + Guest Feature — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the landing page visually stunning and modern-yet-zen by wiring the existing 3D background components (currently built but unused), adding a React Bits Aurora shader to the hero section, and adding "Continue as guest" links on auth pages.

**Architecture:**
- The `ZenBackground` (R3F floating particles) and `HeroGeometry` (R3F distorted icosahedron) already exist in `src/components/three/` but are never rendered on the landing page — they just need to be wired in.
- The React Bits Aurora component uses the `ogl` WebGL library (separate canvas element, no conflict with R3F's canvas) to render a GLSL-based flowing gradient shader.
- The "continue as guest" feature is a single `<Link>` added to both auth pages — pure UI, no logic changes.

**Tech Stack:** Next.js App Router, React, Framer Motion, React Three Fiber + Drei, `ogl` (new dep for Aurora), Tailwind v4 CSS custom properties

---

## Phase 1: Guest Feature (Quick Win)

### Task 1: Add "Continue as guest" to Login and Register Pages

**Files:**
- Modify: `codecraft-next/src/app/(auth)/login/page.tsx`
- Modify: `codecraft-next/src/app/(auth)/register/page.tsx`

**Step 1: Add guest link to login page**

Read `codecraft-next/src/app/(auth)/login/page.tsx` first.

Inside the `<Card>`, after the existing `<p>` that has "No account yet? Create one", add:

```tsx
<p className="mt-3 text-center text-xs text-[var(--color-text-tertiary)]">
  Just browsing?{' '}
  <Link href="/dashboard" className="text-[var(--color-primary)] hover:underline font-medium">
    Continue as guest
  </Link>
</p>
```

**Step 2: Add guest link to register page**

Read `codecraft-next/src/app/(auth)/register/page.tsx` first.

Same pattern — add after the "Already have an account? Sign in" paragraph:

```tsx
<p className="mt-3 text-center text-xs text-[var(--color-text-tertiary)]">
  Just browsing?{' '}
  <Link href="/dashboard" className="text-[var(--color-primary)] hover:underline font-medium">
    Continue as guest
  </Link>
</p>
```

Ensure `Link` from `next/link` is already imported in both files (it is).

**Step 3: Type-check**

```bash
cd /Users/pedroernesto/Desktop/testeclaude/codecraft-next && npm run type-check
```

Expected: no errors.

**Step 4: Commit**

```bash
git add src/app/\(auth\)/login/page.tsx src/app/\(auth\)/register/page.tsx
git commit -m "feat: add 'Continue as guest' link on login and register pages"
```

---

## Phase 2: Wire Existing 3D Components to Landing Page

### Task 2: Add ZenBackground (Floating Particles) to Landing Page

**Files:**
- Modify: `codecraft-next/src/app/page.tsx`

**Context:** `ZenBackground` renders a fixed, full-screen R3F canvas at `z-index: -1`. It already exists and is complete — it just needs to be imported and rendered once on the landing page. It renders 100 coral-tinted floating particles that slowly rotate.

**Step 1: Read the current page.tsx**

Read `codecraft-next/src/app/page.tsx` to see the current content.

**Step 2: Add ZenBackground**

Import and add `<ZenBackground />` as the first child inside the root div:

```tsx
import { ZenBackground } from '@/components/three/zen-background'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <ZenBackground />   {/* ← fixed behind everything */}
      <NavBar />
      <Hero />
      <HowItWorks />
      <FinalCta />
      <footer>...</footer>
    </div>
  )
}
```

**Step 3: Type-check**

```bash
npm run type-check
```

Expected: no errors.

**Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire ZenBackground (floating particles) to landing page"
```

---

### Task 3: Integrate HeroGeometry 3D Scene Into Hero Section

**Files:**
- Modify: `codecraft-next/src/components/landing/hero.tsx`

**Context:** `HeroGeometry` is an animated distorted icosahedron (coral, 12% opacity) that tracks the mouse and floats. It's meant to live behind the hero text. We'll use `ZenCanvas` but scoped to the hero section only (not fixed/full-screen) — use `position: absolute` to keep it within the hero bounds.

**Step 1: Read the current hero.tsx**

Read `codecraft-next/src/components/landing/hero.tsx`.

**Step 2: Add hero-scoped canvas**

The hero section already has `relative overflow-hidden`. Add a canvas wrapper inside it, before the content div:

```tsx
import { ZenCanvas } from '@/components/three/zen-canvas'
import { HeroGeometry } from '@/components/three/hero-scene'

// Inside Hero() return:
<section className="relative pt-24 pb-20 px-[var(--app-shell-gutter)] text-center overflow-hidden">
  {/* 3D background scoped to hero */}
  <div
    aria-hidden="true"
    style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
  >
    <ZenCanvas>
      <ambientLight intensity={0.5} />
      <HeroGeometry />
    </ZenCanvas>
  </div>

  {/* Content above the 3D layer */}
  <div className="relative z-10 max-w-[var(--max-width-prose)] mx-auto grid gap-6">
    {/* existing content unchanged */}
  </div>
</section>
```

Note: `ZenCanvas` uses `position: fixed` by default. Override this inline for the hero-scoped usage by passing a className or overriding the style. Read `zen-canvas.tsx` to see its exact implementation — you may need to create a `HeroCanvas` variant that uses `position: absolute` instead of `position: fixed`.

If `ZenCanvas` has a `style` prop or `className` that allows override, use it. Otherwise create `src/components/three/hero-canvas.tsx`:

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, type ReactNode } from 'react'

export function HeroCanvas({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
```

**Step 3: Type-check**

```bash
npm run type-check
```

Expected: no errors.

**Step 4: Commit**

```bash
git add src/components/landing/hero.tsx src/components/three/hero-canvas.tsx
git commit -m "feat: integrate HeroGeometry 3D scene into landing hero section"
```

---

## Phase 3: React Bits Aurora Background

### Task 4: Install `ogl` and Create Aurora Component

**Files:**
- Create: `codecraft-next/src/components/landing/aurora-background.tsx`

**Context:** React Bits' Aurora component uses the `ogl` library (28KB WebGL abstraction) to render a GLSL fragment shader that produces a flowing aurora borealis gradient effect. It takes `colorStops` (array of 3 hex colors), `amplitude`, `blend`, and `speed` props.

**Step 1: Install `ogl`**

```bash
cd /Users/pedroernesto/Desktop/testeclaude/codecraft-next && npm install ogl
```

Check install succeeded:
```bash
node -e "require('ogl')" 2>&1 || echo "not found"
```

**Step 2: Copy Aurora source from React Bits**

Navigate to https://reactbits.dev/backgrounds/aurora in a browser and copy the component source code.

Create `src/components/landing/aurora-background.tsx` with the copied source, converted to TypeScript:

- Add `'use client'` at the top (required for browser WebGL APIs)
- Rename the file export to `AuroraBackground`
- The component renders a `<canvas>` element filling its container

Key props to use for zen aesthetic:
```tsx
<AuroraBackground
  colorStops={["#C75B3A", "#4A5D52", "#2B3B35"]}  // rust, moss, dark
  amplitude={0.8}
  blend={0.4}
  speed={0.5}  // slow = zen
/>
```

**Step 3: Verify it renders**

Temporarily add it to `src/app/page.tsx` to confirm it displays.

**Step 4: Commit**

```bash
git add src/components/landing/aurora-background.tsx package.json package-lock.json
git commit -m "feat: add React Bits Aurora background component (ogl shader)"
```

---

### Task 5: Integrate Aurora Into Hero Section

**Files:**
- Modify: `codecraft-next/src/components/landing/hero.tsx`

**Context:** Place the Aurora component as a full-bleed background behind the hero text. It should sit below the HeroGeometry canvas (z-index ordering: aurora at 0, hero canvas at 1, content at 10).

**Step 1: Read current hero.tsx**

Read the file to see its exact state after Task 3.

**Step 2: Layer Aurora under the hero canvas**

Update the hero section to stack layers:

```tsx
<section className="relative pt-24 pb-20 px-[var(--app-shell-gutter)] text-center overflow-hidden">
  {/* Layer 1: Aurora gradient shader */}
  <div
    aria-hidden="true"
    style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.35 }}
  >
    <AuroraBackground
      colorStops={['#C75B3A', '#4A5D52', '#171614']}
      amplitude={0.8}
      blend={0.4}
      speed={0.4}
    />
  </div>

  {/* Layer 2: R3F hero geometry (icosahedron) */}
  <div
    aria-hidden="true"
    style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
  >
    <HeroCanvas>
      <ambientLight intensity={0.5} />
      <HeroGeometry />
    </HeroCanvas>
  </div>

  {/* Layer 3: Content */}
  <div className="relative z-10 max-w-[var(--max-width-prose)] mx-auto grid gap-6">
    {/* existing badge, h1, p, buttons — unchanged */}
  </div>
</section>
```

Aurora opacity at 0.35 keeps it subtle and zen. The rust/moss/dark colors match the design tokens.

**Step 3: Type-check + build**

```bash
npm run type-check && npm run build 2>&1 | tail -15
```

Expected: clean build.

**Step 4: Commit**

```bash
git add src/components/landing/hero.tsx
git commit -m "feat: layer Aurora gradient shader under hero 3D scene"
```

---

## Phase 4: Scroll-Triggered Parallax Polish

### Task 6: Add Framer Motion Scroll Parallax to How It Works

**Files:**
- Modify: `codecraft-next/src/components/landing/how-it-works.tsx`

**Context:** The How It Works cards already have `whileInView` scroll reveals. Enhance the section heading with a parallax vertical drift using Framer Motion `useScroll` + `useTransform`, so it shifts subtly as you scroll into view. This adds depth without weight.

**Step 1: Read current how-it-works.tsx**

Read the file to see its exact state.

**Step 2: Add scroll parallax to section heading**

```tsx
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [24, -24])

  return (
    <section ref={ref} className="py-20 px-[var(--app-shell-gutter)]">
      <div className="max-w-[var(--max-width-content)] mx-auto">
        <motion.h2
          style={{ y }}  // ← parallax drift
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="..."
        >
          How it works
        </motion.h2>
        {/* cards unchanged */}
      </div>
    </section>
  )
}
```

The `y` transform drifts the heading from +24px (above viewport) to -24px (scrolled past) — subtle, elegant.

**Step 3: Type-check**

```bash
npm run type-check
```

**Step 4: Commit**

```bash
git add src/components/landing/how-it-works.tsx
git commit -m "feat: add Framer Motion scroll parallax to How It Works heading"
```

---

## Phase 5: Final Verification

### Task 7: Build Verification

**Files:** None

**Step 1: Type-check**

```bash
cd /Users/pedroernesto/Desktop/testeclaude/codecraft-next && npm run type-check
```

Expected: zero errors.

**Step 2: Production build**

```bash
npm run build 2>&1 | tail -20
```

Expected: all 8 routes compile, no TypeScript errors.

**Step 3: Visual check points**

Start dev server: `npm run dev -- -p 3001`

Check at `http://localhost:3001`:
- [ ] Landing hero shows Aurora gradient layer (subtle rust/moss tones)
- [ ] HeroGeometry icosahedron visible above Aurora, follows mouse
- [ ] Floating particles visible in background globally
- [ ] How It Works cards scroll-reveal + heading parallax
- [ ] `/login` shows "Just browsing? Continue as guest" link
- [ ] `/register` shows "Just browsing? Continue as guest" link
- [ ] Guest link navigates to `/dashboard`
- [ ] No console errors (especially no "two WebGL contexts" warnings)

**Step 4: Final commit**

```bash
git add -A && git commit -m "chore: final build verification — LP animations + guest feature complete"
```

---

## Execution Order Summary

| # | Task | Files | New Dep |
|---|------|-------|---------|
| 1 | Guest link on auth pages | login/page.tsx, register/page.tsx | — |
| 2 | Wire ZenBackground to LP | page.tsx | — |
| 3 | HeroGeometry into hero section | hero.tsx, hero-canvas.tsx | — |
| 4 | Install `ogl` + Aurora component | aurora-background.tsx | `ogl` |
| 5 | Layer Aurora in hero section | hero.tsx | — |
| 6 | Scroll parallax on How It Works | how-it-works.tsx | — |
| 7 | Build verification | — | — |

**New dependencies:** `ogl` only (28KB, zero transitive deps)
