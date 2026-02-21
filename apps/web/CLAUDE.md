# apps/web — Next.js Frontend Rules

## Tech Stack
- Next.js 16 with App Router (`app/` directory)
- React 19 with Server Components by default
- TailwindCSS v4 (no `tailwind.config.js` — config lives in CSS via `@theme`)
- TypeScript strict mode
- Framer Motion for animations
- Monaco Editor for code editing
- TanStack React Query v5 for server state
- Zod v4 for client-side validation

## App Router Conventions

```
apps/web/src/app/
├── (auth)/          # Route group: login, register pages
├── (app)/           # Route group: authenticated app pages
├── layout.tsx       # Root layout (fonts, providers)
├── page.tsx         # Landing page
└── globals.css      # TailwindCSS v4 entry + custom properties
```

### Server vs Client Components

Default to Server Components. Only add `'use client'` when you need:
- `useState`, `useEffect`, event handlers
- Browser APIs
- React Query hooks

```tsx
// ✅ Server Component (default — no directive needed)
export default async function Page() {
  const data = await fetch('/api/...').then(r => r.json())
  return <div>{data.title}</div>
}

// ✅ Client Component (only when needed)
'use client'
import { useState } from 'react'
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Data Fetching

- Server Components: `fetch()` directly — Next.js handles caching
- Client Components: TanStack React Query hooks from `src/hooks/`
- API base URL from `src/lib/api-client.ts` — never hardcode URLs

```typescript
// ✅ Use the existing hooks
import { useProblems } from '@/hooks/use-problems'
const { data, isLoading, error } = useProblems()

// ✅ Use the api client for custom fetches
import { apiClient } from '@/lib/api-client'
```

## Neo-Brutalist Design System

### Color Tokens (defined in globals.css via @theme)
- `--color-primary`: coral #FF6B6B
- `--color-secondary`: turquoise #4ECDC4
- `--color-accent`: yellow #FFE66D
- `--color-dark`: #1A1A1A (borders, text)
- `--color-bg`: cream #FFFEF9

### TailwindCSS v4 Usage

No `tailwind.config.js`. Custom tokens defined via `@theme` in globals.css.

```tsx
// ✅ Use design system tokens
<button className="btn bg-primary text-white shadow-brutal">
  Click Me
</button>

// ✅ Use cn() for conditional classes (from src/lib/cn.ts)
import { cn } from '@/lib/cn'
<div className={cn('card p-6', isActive && 'border-primary')}>

// ❌ Never inline styles for design-system properties
<button style={{ border: '3px solid black' }}>Bad</button>

// ❌ Never off-palette colors
<div className="bg-purple-500 text-gray-600">Bad</div>
```

### Custom Utility Classes (defined in globals.css)

```
.btn            base button: border, padding, font-display, transition
.btn:hover      translate 2px, shadow reduces
.btn:active     translate 6px, shadow disappears
.card           border-3, border-dark, shadow-brutal, bg-white
.card-hover     adds hover lift transition
.shadow-brutal      6px 6px 0 0 #000
.shadow-brutal-lg   8px 8px 0 0 #000
.shadow-brutal-sm   3px 3px 0 0 #000
```

### Animation Guidelines

- Buttons: `translate-x-[2px] translate-y-[2px]` on hover, `[6px]` on active
- Cards: subtle hover lift with `duration-200`
- Framer Motion for page transitions and complex sequences
- Durations: `duration-150` (snappy) to `duration-300` (smooth)
- Stagger list items: 50–100ms delay increments

## Component Patterns

### File Structure

```
src/components/
├── ui/              # Design system primitives (Button, Card, Input...)
├── auth/            # Auth-specific components
├── dashboard/       # Dashboard feature components
├── landing/         # Landing page sections
├── practice/        # Code practice workspace
├── animations/      # Reusable animation wrappers
└── providers/       # React context providers
```

### TypeScript

```typescript
// ✅ Always type props explicitly with an interface
interface Props {
  problem: Problem
  onSelect: (p: Problem) => void
  className?: string
}

// ✅ Use Zod for form and API response validation
import { z } from 'zod'
const schema = z.object({
  title: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
})
type Data = z.infer<typeof schema>

// ❌ No 'any'. Use 'unknown' and narrow with guards.
```

### Fonts

Configured in `src/lib/fonts.ts`, applied as CSS variables in `layout.tsx`:
- `--font-display`: Syne (headings)
- `--font-mono`: JetBrains Mono (code)
- Body: system font stack

## Testing with Playwright

```bash
# From repo root
npm run test:e2e              # headless
npm run test:e2e:ui           # interactive debug mode
npm run test:e2e:headed       # see the browser
```

- Test user flows, not internal state or component implementation.
- Prefer accessible selectors: `page.getByRole()`, `page.getByText()`.
- For ambiguous matches: use `.first()`, `.nth()`, or `{ exact: true }`.
- Never test Vue-era patterns (this is React/Next.js).
