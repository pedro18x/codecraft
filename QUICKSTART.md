# CodeCraft - Quick Start Guide

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:5173

## Build for Production

```bash
npm run build
npm run preview
```

## Type Checking

```bash
npm run type-check
```

## Testing

```bash
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run tests with UI
npm run test:e2e:headed   # Run tests in browser
```

## Keyboard Shortcuts

### Global
- `⌘⇧T` / `Ctrl+Shift+T` - Toggle dark/light theme

### Practice Page
- `⌘B` / `Ctrl+B` - Toggle focus mode
- `⌘Enter` / `Ctrl+Enter` - Run tests
- `Escape` - Exit focus mode

## URL Structure

- `/` - Landing page
- `/dashboard` - Dashboard with problem list and progress
- `/practice/two-sum` - Practice page for "Two Sum" problem
- `/practice/valid-parentheses` - Practice page for "Valid Parentheses" problem
- etc.

## Adding New Problems

Edit `src/data/problems.ts` and add a new problem following the schema:

```typescript
{
  id: 7,
  title: 'New Problem',
  difficulty: 'Medium',
  categories: ['Array', 'String'],
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
  hints: ['Hint 1', 'Hint 2']
}
```

## Customizing Design Tokens

Edit `src/design-system/tokens.css` to customize:
- Colors (light and dark mode)
- Spacing scale
- Typography
- Motion timing
- Border radius
- Shadows

## Backend Integration

The following areas need backend implementation:

1. **Code Execution** (`src/components/practice/EditorPanel.vue`)
   - Replace mock `runTests()` function with actual code execution
   - Implement sandboxed JavaScript/TypeScript/Python runtime

2. **User Progress** (`src/views/Dashboard.vue`)
   - Replace `completedProblemIds` with actual user data
   - Implement progress tracking API

3. **Authentication**
   - Add auth provider
   - Protect routes
   - Sync user data

4. **Problem Management**
   - Move problems from static file to database
   - Implement CRUD operations

## Design System Components

All components are in `src/design-system/components/`:

- `Button.vue` - Primary, secondary, ghost variants
- `Card.vue` - With interactive hover state
- `Text.vue` - h1-h4, body, body-sm, muted
- `Container.vue` - Max-width containers
- `Divider.vue` - Horizontal/vertical dividers

Usage example:

```vue
<Button variant="primary" size="md">Click me</Button>
<Card interactive padding="lg">Card content</Card>
<Text as="h1" variant="h1" weight="semibold">Heading</Text>
```

## Project Structure

```
src/
├── design-system/       # Design tokens and components
├── views/              # Page views (Landing, Dashboard, Practice)
├── components/         # Feature components
├── router/             # Vue Router setup
├── composables/        # Vue composables
├── utils/              # Utility functions
├── data/               # Static data
└── types/              # TypeScript types
```

## Production Checklist

- [ ] Replace mock test runner with real code execution
- [ ] Implement user authentication
- [ ] Add progress tracking backend
- [ ] Move problems to database
- [ ] Write E2E tests
- [ ] Add error tracking (Sentry)
- [ ] Optimize bundle size
- [ ] Add analytics
- [ ] Configure CDN
- [ ] Set up monitoring

---

**Status**: Frontend complete, ready for backend integration
