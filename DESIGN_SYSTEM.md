# CodeCraft Design System

## Visual Direction
CodeCraft uses a neo-brutalist systems UI language: heavy borders, directional hard shadows, high-contrast accents, and tactile interactions.

## Foundation Files
- `src/assets/styles/tokens.css`: source of truth for color/type/spacing/elevation/motion tokens.
- `src/assets/styles/brutal.css`: utility layer for brutal-specific patterns.
- `src/assets/styles/animations.css`: shared interaction and entrance animations.

## Typography
- Display: `Syne` (`700`, `800`)
- Body: `Plus Jakarta Sans` (`400`, `500`, `600`)
- Code: `JetBrains Mono` with ligatures

## Core Components
- Buttons, cards, inputs/textarea, badges
- Modal, toast stack, progress variants, tabs, dropdown
- Checkbox/radio, tooltip, skeleton, empty state

All components must ship with keyboard support, focus-visible styling, ARIA where relevant, and dark mode parity.

## Motion Rules
- Hover/active mechanics simulate physical movement against hard shadows.
- Micro-interactions: `120-220ms`.
- Panel transitions: `240-420ms`.
- `prefers-reduced-motion` is always respected.

## Editor Theme
Monaco theme config lives in `src/utils/monacoTheme.ts`.
