# CodeCraft - Coding Interview Platform

A distinctive, neo-brutalist coding interview preparation platform built with Vue 3, TypeScript, TailwindCSS, and Zod.

## Features

- **6 Curated Problems** - Classic interview questions with varying difficulty levels
- **Multi-Language Support** - Write solutions in JavaScript, TypeScript, or Python
- **Live Code Editor** - Terminal-style editor with syntax highlighting
- **Test Runner** - Execute test cases and get immediate visual feedback
- **Smart Filtering** - Search and filter problems by difficulty and category
- **Bold Design** - Neo-brutalist aesthetic with thick borders, bold shadows, and playful colors

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Zod** for schema validation
- **Vite** for lightning-fast development

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Vue components
│   ├── Header.vue
│   ├── ProblemList.vue
│   ├── ProblemWorkspace.vue
│   ├── ProblemDescription.vue
│   ├── CodeEditor.vue
│   └── TestRunner.vue
├── data/               # Mock data
│   └── problems.ts
├── types/              # TypeScript types & Zod schemas
│   └── index.ts
├── App.vue             # Main app component
├── main.ts             # App entry point
└── style.css           # Global styles
```

## Design Philosophy

CodeCraft breaks away from typical coding platform aesthetics with:

- **Neo-Brutalist Design** - Thick black borders, bold drop shadows, paper-cut effects
- **Playful Color Palette** - Coral, turquoise, and yellow accents on warm cream backgrounds
- **Geometric Typography** - Syne for display, JetBrains Mono for code
- **Tactile Interactions** - Satisfying button states and smooth transitions
- **Terminal-Inspired Editor** - Dark background with green text for that classic coding feel

## Future Enhancements

- Implement actual code execution (consider using WebAssembly or sandboxed environments)
- Add user authentication and progress tracking
- Integrate with Monaco Editor for advanced IDE features
- Add solution discussions and hints system
- Implement difficulty-based progression system
- Add more problems across different categories

## License

MIT
