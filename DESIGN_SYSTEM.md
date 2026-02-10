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

## Dark Theme Palette
Dark mode is a black-first palette with neutral charcoal surfaces and warm contrast accents.

- `--color-background`: `#0f0f10`
- `--color-surface`: `#171719`
- `--color-surface-raised`: `#202124`
- `--color-surface-hover`: `#2a2b30`
- `--color-border-strong`: `#a39d92`
- `--color-shadow-strong`: `#746f66`
- `--color-coral`: `#c84a56`
- `--color-turquoise`: `#2fc2b5`
- `--color-yellow`: `#e8b93f`
- `--color-info`: `#5d6ec4`

Dark-mode button accents are mapped through dedicated button tokens (`--button-*`) so primary/secondary/ghost/danger buttons are tuned for black surfaces without reusing light-theme values.
Key dark button tones: primary `#a6414d`, secondary `#2f8f89`, danger `#8f313d`.

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
