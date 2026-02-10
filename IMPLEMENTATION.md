# CodeCraft Frontend Rewrite - Implementation Notes

## Overview

This is a complete frontend rewrite focused on **clinical precision** and **cognitive minimalism**. The design competes with Apple Developer tools, Linear, and Vercel dashboard through surgical UI reduction.

## Design Philosophy

- **Neutral First**: Single accent color (blue) used only for focus states
- **Typography Hierarchy**: All hierarchy communicated through size and weight, not color
- **Quiet Interface**: The UI disappears when you're coding
- **Keyboard Native**: Every action accessible via keyboard
- **No Decoration**: Zero non-functional animations or visual flourishes

## Folder Structure

```
src/
├── design-system/           # Core design tokens and components
│   ├── tokens.css          # CSS variables for colors, spacing, typography
│   └── components/
│       ├── Button.vue      # Primary, secondary, ghost variants
│       ├── Card.vue        # Interactive cards
│       ├── Text.vue        # Typographic components (h1-h4, body, muted)
│       ├── Divider.vue     # Horizontal/vertical dividers
│       └── Container.vue   # Max-width containers
│
├── views/                  # Full-page views
│   ├── Landing.vue         # Minimal landing (1 CTA)
│   ├── Dashboard.vue       # Resume + progress + problem list
│   └── Practice.vue        # Split-pane coding interface
│
├── components/
│   └── practice/           # Practice page components
│       ├── ProblemPanel.vue   # Left: Problem description
│       └── EditorPanel.vue    # Right: Code editor + test output
│
├── router/
│   └── index.ts            # Vue Router configuration
│
├── composables/
│   └── useLocalStorage.ts  # Local storage helper
│
├── utils/
│   └── problemUtils.ts     # Problem slug utilities
│
├── data/
│   └── problems.ts         # Problem dataset
│
├── types/
│   └── index.ts            # TypeScript types + Zod schemas
│
├── App.vue                 # Root component with theme management
└── main.ts                 # Application entry point
```

## Pages Implemented

### 1. Landing (`/`)
- One-sentence value prop
- Primary CTA: "Start practicing"
- Secondary CTA: "View problems"
- **2 clicks to start coding**

### 2. Dashboard (`/dashboard`)
- **Resume Section**: Last attempted + suggested next problem
- **Progress Section**: Text-only completion stats
- **All Problems**: Quick access list
- Zero charts, zero gamification

### 3. Practice (`/practice/:slug`)
- **Split Pane**: Adjustable problem/editor layout
- **Focus Mode**: Hides navigation, shows only problem
- **Editor**: Calm syntax (minimal highlighting), subtle line numbers
- **Output**: Text-first pass/fail feedback

## Key Features

### Keyboard Shortcuts
- `⌘B` / `Ctrl+B`: Toggle focus mode
- `⌘Enter` / `Ctrl+Enter`: Run tests
- `Escape`: Exit focus mode
- `⌘⇧T` / `Ctrl+Shift+T`: Toggle dark mode

### Adjustable Split Pane
- Drag the center divider to resize panels
- Clamped to 30-70% range for usability
- Smooth dragging with visual feedback

### Focus Mode
- Problem fills entire viewport
- Editor and navigation hidden
- Keyboard shortcut to toggle
- Ideal for reading problem deeply

### Dark Mode
- Full light/dark theme support
- Syncs with system preference
- Persists to localStorage
- All design tokens respect theme

## Design System Tokens

### Colors
- Background, surface, borders defined for light/dark
- Single accent color (blue) for interactive states
- Text hierarchy: primary, secondary, tertiary, disabled
- Semantic colors: success (green), error (red)

### Typography
- Sans: System font stack (SF Pro, Segoe UI, etc.)
- Mono: JetBrains Mono for code
- Sizes: xs (12px) → 4xl (36px)
- Weights: normal (400), medium (500), semibold (600)

### Spacing
- Consistent scale: 4px base unit
- Named tokens: space-1 (4px) → space-16 (64px)

### Motion
- Single easing: `cubic-bezier(0.2, 0, 0, 1)`
- Durations: 150ms (fast), 200ms (normal), 250ms (slow)
- Transitions on interactive elements only

## Component Variants

### Button
- `primary`: Dark background, for primary actions
- `secondary`: Bordered, for secondary actions
- `ghost`: Transparent, for tertiary actions
- Sizes: sm, md, lg

### Card
- `interactive`: Hover state for clickable cards
- Padding: none, sm, md, lg

### Text
- Elements: h1, h2, h3, h4, p, span
- Variants: h1, h2, h3, h4, body, body-sm, muted
- Weights: normal, medium, semibold

## Backend Integration TODOs

The following features require backend implementation:

1. **Code Execution Engine**
   - Sandboxed JavaScript/TypeScript/Python runtime
   - WebAssembly or API-based execution
   - Security isolation for user code

2. **User Authentication**
   - Auth provider integration
   - Session management
   - Protected routes

3. **Progress Tracking**
   - Store completed problems
   - Track last attempted problem
   - Sync across devices

4. **Problem Data**
   - Database schema for problems
   - CRUD operations
   - Problem versioning

5. **Test Runner**
   - Execute user code against test cases
   - Capture stdout/stderr
   - Timeout handling
   - Memory limits

## Performance Considerations

- Code splitting via Vue Router
- Lazy-loaded route components
- Minimal dependencies (only Vue + Vue Router + Zod)
- CSS variables for instant theme switching
- No runtime CSS-in-JS overhead

## Accessibility

- Semantic HTML throughout
- ARIA labels on icon-only buttons
- Keyboard navigation for all interactions
- Focus indicators on all interactive elements
- WCAG AA color contrast in both themes

## Testing Strategy

### E2E Tests to Write
1. Landing → Dashboard → Practice flow
2. Problem selection and code editing
3. Test execution and results display
4. Focus mode toggle
5. Split pane resizing
6. Keyboard shortcuts
7. Theme switching
8. URL routing and deep linking

### Example Test
```typescript
test('user can start coding in 2 clicks', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Start practicing' }).click()
  await page.getByText('#1').click()
  await expect(page.locator('textarea')).toBeVisible()
})
```

## Design Principles Applied

### 1. Cognitive Load Minimization
- One primary CTA per screen
- Clear hierarchy without color dependency
- Generous whitespace
- Predictable layouts

### 2. One-Action Resume
- Dashboard immediately shows last problem
- Single click to continue coding
- No navigation maze

### 3. Focus-First Coding
- Editor visually recedes
- Problem description is primary
- Focus mode for deep reading
- No distractions during practice

### 4. Competing with Pro Tools
- Apple-level polish in details
- Linear-style minimal aesthetics
- Vercel-grade performance feel
- No "coding bootcamp" vibe

## What Was Removed

From the original neo-brutalist design:
- Thick borders and bold shadows
- Gradients and glassmorphism
- Floating orbs and ambient backgrounds
- Decorative animations
- Playful colors (coral, turquoise, yellow)
- Multiple accent colors
- Welcome screen statistics cards
- Feature badges with emojis

## What Was Added

New clinical precision features:
- True light/dark mode
- Keyboard-first navigation
- Adjustable split pane
- Focus mode for problem reading
- Minimal design system
- Semantic routing
- System font stack
- Single accent color

## Future Enhancements

1. **Monaco Editor Integration**
   - Full IDE features
   - IntelliSense
   - Multi-cursor editing
   - Find/replace

2. **Advanced Test Output**
   - Diff view for failed tests
   - Performance metrics
   - Memory usage

3. **Problem Filters**
   - Category filtering
   - Difficulty filtering
   - Search with highlighting

4. **Progress Visualization**
   - Minimal progress indicators
   - Completion percentages
   - Streak tracking (text-only)

5. **Code Sharing**
   - Shareable solution URLs
   - Solution discussions
   - Community hints

## Acceptance Criteria ✓

- [x] User can start coding in ≤ 2 clicks
- [x] Practice screen quieter than VS Code
- [x] Removing any UI element would reduce clarity
- [x] No gamification elements
- [x] No decorative animations
- [x] ≤ 1 primary CTA per screen
- [x] Light and dark modes exist
- [x] Keyboard navigation works end-to-end

---

**Implementation Status**: Complete - Ready for backend integration
