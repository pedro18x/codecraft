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
Dark mode uses a neutral black/gray base with restrained accent usage.

- Base surfaces
  - `--dark-bg`: `#0A0A0A`
  - `--dark-surface-1`: `#111111`
  - `--dark-surface-2`: `#171717`
  - `--dark-surface-3`: `#1F1F1F`
  - `--dark-surface-elevated`: `#262626`
- Borders
  - `--dark-border`: `#333333`
  - `--dark-border-strong`: `#4A4A4A`
- Text
  - `--dark-text-primary`: `#F5F5F5`
  - `--dark-text-secondary`: `#D4D4D4`
  - `--dark-text-muted`: `#A3A3A3`
  - `--dark-text-disabled`: `#737373`
- Dark accents
  - `--dark-accent-primary`: `#FF6B6B`
  - `--dark-accent-secondary`: `#4ECDC4`
  - `--dark-accent-warning`: `#FFE66D`
  - `--dark-accent-danger`: `#FF5C5C`

All component states consume semantic tokens (`--color-*`, `--button-*`) that remap in dark mode, so light theme visuals stay unchanged while dark mode gets a distinct accent system.

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
