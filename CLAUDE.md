# CodeCraft - Project Guide for AI Assistants

## Project Overview

**CodeCraft** is a neo-brutalist coding interview preparation platform built with Vue 3, TypeScript, TailwindCSS, and Zod. The platform features a distinctive design aesthetic with thick borders, bold shadows, and playful colors that stand apart from typical coding platforms.

## Architecture & Design Philosophy

### Tech Stack
- **Framework**: Vue 3 with Composition API and `<script setup>` syntax
- **Language**: TypeScript with strict type checking
- **Styling**: TailwindCSS with custom neo-brutalist design system
- **Validation**: Zod for runtime schema validation
- **Testing**: Playwright for E2E tests
- **Build**: Vite for fast development and optimized production builds
- **Linting**: ESLint with Vue and TypeScript rules

### Design Principles

1. **Neo-Brutalist Aesthetic**
   - Thick black borders (3-4px) on all interactive elements
   - Bold drop shadows (`shadow-brutal`, `shadow-brutal-lg`, `shadow-brutal-sm`)
   - High-contrast color palette (coral #FF6B6B, turquoise #4ECDC4, yellow #FFE66D)
   - Warm cream background (#FFFEF9) instead of pure white
   - Tactile button interactions (shadow shifts on hover/click)

2. **Typography System**
   - Display/Headers: Syne (bold, geometric, distinctive)
   - Code: JetBrains Mono (readable, technical)
   - Body: System font stack for performance

3. **Component Philosophy**
   - Small, focused components with single responsibilities
   - Props down, events up for predictable data flow
   - Composition API for better TypeScript inference
   - Co-located types using TypeScript interfaces

## Code Style & Best Practices

### Vue 3 Conventions

```vue
<!-- ✅ GOOD: Use <script setup> with TypeScript -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Problem } from '@/types'

interface Props {
  problem: Problem
}

interface Emits {
  (e: 'select', value: Problem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<!-- ❌ BAD: Don't use Options API for new components -->
<script>
export default {
  props: ['problem'],
  data() {
    return { count: 0 }
  }
}
</script>
```

### TypeScript Patterns

```typescript
// ✅ GOOD: Use Zod schemas for validation and type inference
import { z } from 'zod'

export const ProblemSchema = z.object({
  id: z.number(),
  title: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
})

export type Problem = z.infer<typeof ProblemSchema>

// ✅ GOOD: Use Partial for optional record values
interface Props {
  starterCode: Partial<Record<Language, string>>
}

// Access with fallback
const code = props.starterCode[lang] || ''

// ❌ BAD: Assuming all record values are present
interface Props {
  starterCode: Record<Language, string>
}

const code = props.starterCode[lang] // TypeScript error if undefined
```

### Component Organization

```
src/
├── components/          # Vue components
│   ├── Header.vue      # App header with branding
│   ├── ProblemList.vue # Sidebar with search/filters
│   ├── ProblemWorkspace.vue  # Main workspace container
│   ├── ProblemDescription.vue # Problem details
│   ├── CodeEditor.vue  # Code input area
│   └── TestRunner.vue  # Test execution and results
├── data/               # Static data and mocks
│   └── problems.ts     # Problem set
├── types/              # TypeScript types and Zod schemas
│   └── index.ts        # Centralized type definitions
├── App.vue             # Root component
├── main.ts             # Application entry point
└── style.css           # Global styles and Tailwind imports
```

### Styling Guidelines

```vue
<!-- ✅ GOOD: Use Tailwind utilities and custom classes -->
<template>
  <button class="btn bg-primary text-white shadow-brutal">
    Click Me
  </button>
</template>

<!-- ✅ GOOD: Use custom utility classes for consistency -->
<div class="card p-6 shadow-brutal">
  <h2 class="font-display font-bold text-xl">Title</h2>
</div>

<!-- ❌ BAD: Don't use inline styles for things in the design system -->
<button style="border: 3px solid black; box-shadow: 6px 6px 0 black;">
  Click Me
</button>

<!-- ❌ BAD: Don't use generic colors that break the aesthetic -->
<div class="bg-purple-500 text-gray-600">
  Generic Design
</div>
```

### Custom Tailwind Classes

```css
/* Reusable button component */
.btn {
  @apply px-6 py-3 font-display font-bold border-3 border-dark
         transition-all duration-150 cursor-pointer select-none;
}

.btn:hover {
  @apply translate-x-[2px] translate-y-[2px];
  box-shadow: 4px 4px 0px 0px #000000;
}

.btn:active {
  @apply translate-x-[6px] translate-y-[6px];
  box-shadow: 0px 0px 0px 0px #000000;
}

/* Card component */
.card {
  @apply border-3 border-dark shadow-brutal bg-white;
}

.card-hover {
  @apply transition-all duration-200 cursor-pointer;
}

.card-hover:hover {
  @apply translate-x-[2px] translate-y-[2px];
  box-shadow: 4px 4px 0px 0px #000000;
}
```

## Testing Strategy

### E2E Testing with Playwright

```typescript
// ✅ GOOD: Test user flows, not implementation details
test('should complete problem workflow', async ({ page }) => {
  // Navigate to app
  await page.goto('/')

  // Select a problem
  await page.locator('button:has-text("#1")').click()

  // Write code
  const editor = page.locator('textarea')
  await editor.fill('function solution() { return 42; }')

  // Run tests
  await page.getByRole('button', { name: /Run Tests/ }).click()

  // Verify results
  await expect(page.getByText('Test Case 1')).toBeVisible()
})

// ❌ BAD: Don't test internal state or implementation
test('should update reactive variable', async ({ page }) => {
  // This tests Vue internals, not user experience
})
```

### Testing Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI (interactive debugging)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## Development Workflow

### Starting Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

### Before Committing

```bash
# 1. Type check
npm run type-check

# 2. Lint code
npm run lint:fix

# 3. Run tests
npm run test:e2e

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

### Adding New Problems

1. Add problem data to `src/data/problems.ts`
2. Follow the `ProblemSchema` structure from `src/types/index.ts`
3. Include all required fields:
   - Unique ID
   - Title and difficulty
   - Categories (for filtering)
   - Description and examples
   - Test cases
   - Starter code for all 3 languages
   - Optional hints

```typescript
{
  id: 7,
  title: 'New Problem',
  difficulty: 'Medium',
  categories: ['Array', 'Dynamic Programming'],
  description: 'Problem description...',
  examples: [
    {
      input: 'nums = [1,2,3]',
      output: '6',
      explanation: 'Sum is 6'
    }
  ],
  constraints: [
    '1 <= nums.length <= 1000',
  ],
  testCases: [
    {
      input: '[1,2,3]',
      expectedOutput: '6',
    }
  ],
  starterCode: {
    javascript: 'function solve(nums) {\n  // Your code here\n}',
    typescript: 'function solve(nums: number[]): number {\n  // Your code here\n}',
    python: 'def solve(nums: list[int]) -> int:\n    # Your code here\n    pass',
  },
  hints: ['Consider using...']
}
```

## Common Patterns

### State Management

```typescript
// ✅ GOOD: Use refs for component state
const selectedProblem = ref<Problem | null>(null)
const searchQuery = ref('')

// ✅ GOOD: Use computed for derived state
const filteredProblems = computed(() => {
  return problems.filter(p =>
    p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// ❌ BAD: Don't use reactive() for simple state
const state = reactive({ selectedProblem: null })
```

### Event Handling

```vue
<!-- ✅ GOOD: Type-safe event emits -->
<script setup lang="ts">
interface Emits {
  (e: 'select', problem: Problem): void
  (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

const handleClick = () => {
  emit('select', problem)
}
</script>

<!-- ❌ BAD: Untyped emits -->
<script setup>
const emit = defineEmits(['select'])
</script>
```

### Watchers

```typescript
// ✅ GOOD: Watch specific properties
watch(() => props.problem, (newProblem) => {
  userCode.value = newProblem.starterCode[selectedLanguage.value] || ''
}, { immediate: true })

// ✅ GOOD: Watch refs directly
watch(selectedLanguage, (newLang) => {
  // Handle language change
})

// ❌ BAD: Don't watch entire props object
watch(props, () => {
  // This triggers on any prop change
})
```

## Performance Considerations

1. **Code Splitting**: Vite automatically splits components
2. **Lazy Loading**: Use `defineAsyncComponent` for heavy components
3. **Computed Caching**: Prefer `computed()` over methods for expensive calculations
4. **Event Delegation**: Use parent event handlers when possible
5. **Virtual Scrolling**: Consider for large problem lists (future enhancement)

## Accessibility

1. **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)
2. **ARIA Labels**: Add labels to icon-only buttons
3. **Keyboard Navigation**: All interactive elements should be keyboard accessible
4. **Focus States**: Maintain visible focus indicators
5. **Color Contrast**: Ensure text meets WCAG AA standards (4.5:1 for body text)

## Troubleshooting

### HMR Not Working
```bash
# Restart dev server
# Stop: Ctrl+C
npm run dev
```

### Type Errors After Adding New Types
```bash
# Restart TypeScript server in your editor
# VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Build Fails with TypeScript Errors
```bash
# Check for strict type issues
npm run type-check

# Common fixes:
# - Add fallback for potentially undefined values: value || ''
# - Use Partial<> for records with optional keys
# - Add proper return types to functions
```

### Tests Failing
```bash
# Run tests in UI mode to debug
npm run test:e2e:ui

# Common issues:
# - Strict mode violations (multiple elements match selector)
# - Use exact: true for button names
# - Use .first() or .nth() for duplicate elements
```

## Vibe-Coding Best Practices

### What is Vibe-Coding?

Vibe-coding is about maintaining a **consistent aesthetic vision** throughout development. Every line of code should reinforce the design system.

### The CodeCraft Vibe

1. **Bold & Confident**: Use thick borders, strong shadows, high contrast
2. **Playful but Professional**: Bright colors, fun interactions, but organized layout
3. **Tactile & Physical**: Elements feel like paper cutouts you can touch
4. **Distinctive**: Never generic, always memorable

### Maintaining the Vibe

```vue
<!-- ✅ GOOD: Reinforces the neo-brutalist aesthetic -->
<button class="btn bg-primary text-white shadow-brutal-lg border-4 border-dark">
  <span class="font-display font-bold text-lg">Submit</span>
</button>

<!-- ❌ BAD: Generic, breaks the aesthetic -->
<button class="rounded-lg bg-blue-500 text-white px-4 py-2 shadow-md">
  Submit
</button>

<!-- ✅ GOOD: Distinctive color choices -->
<div class="bg-success/20 border-3 border-dark">
  <span class="text-dark font-display font-bold">✓ Test Passed</span>
</div>

<!-- ❌ BAD: Generic success styling -->
<div class="bg-green-100 text-green-800 rounded p-2">
  <span>✓ Test Passed</span>
</div>
```

### Animation & Interaction Guidelines

- **Buttons**: Translate 2px on hover, 6px on active (shadow adjusts accordingly)
- **Cards**: Subtle hover lift (translate 2px, shadow from brutal to brutal-sm)
- **Transitions**: Use `duration-150` to `duration-300` for snappy feel
- **Easing**: `ease-out` for entrances, `ease-in` for exits
- **Stagger**: Use `animation-delay` for list items (50-100ms increments)

## Future Enhancements

### Planned Features
- [ ] Code execution engine (sandboxed JavaScript/Python runtime)
- [ ] User authentication and progress tracking
- [ ] Solution discussions and community hints
- [ ] Difficulty-based progression system
- [ ] More problems across categories
- [ ] Monaco Editor integration for advanced IDE features
- [ ] Syntax highlighting for code display
- [ ] Dark mode variant (keeping neo-brutalist style)
- [ ] Mobile-optimized layout improvements
- [ ] Video explanations for problems

### Integration Opportunities
- **Code Execution**: WebAssembly, Web Workers, or API-based sandboxes
- **Database**: Supabase or Firebase for user data
- **Analytics**: PostHog or Plausible for privacy-friendly tracking
- **Monitoring**: Sentry for error tracking

## Contributing Guidelines

When contributing to this project:

1. **Maintain the Aesthetic**: Every new component should feel like it belongs
2. **Write Tests**: Add E2E tests for new user-facing features
3. **Type Everything**: No `any` types unless absolutely necessary
4. **Follow Conventions**: Use existing patterns for consistency
5. **Document Decisions**: Update this file when adding major features

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev/)
- [Playwright Testing](https://playwright.dev/)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)

---

**Remember**: CodeCraft isn't just another coding platform—it's a bold, distinctive experience. Every component, every interaction, every color choice should reinforce that identity. Code with confidence, design with intention, and maintain the vibe! 🎨✨
