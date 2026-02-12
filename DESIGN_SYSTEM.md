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
Dark neo-brutalism here relies on gray edge contrast instead of white outlines.

- Base surfaces
  - `--dark-bg`: `#080808`
  - `--dark-surface-1`: `#101010`
  - `--dark-surface-2`: `#161616`
  - `--dark-surface-3`: `#1D1D1D`
  - `--dark-surface-elevated`: `#242424`
- Borders
  - `--dark-border`: `#3A3A3A`
  - `--dark-border-strong`: `#4B4B4B`
- Text
  - `--dark-text-primary`: `#F2F2F2`
  - `--dark-text-secondary`: `#CFCFCF`
  - `--dark-text-muted`: `#9B9B9B`
  - `--dark-text-disabled`: `#6F6F6F`
- Dark accents
  - `--dark-accent-primary`: `#E07272`
  - `--dark-accent-secondary`: `#5DB8B1`
  - `--dark-accent-warning`: `#D5C15F`
  - `--dark-accent-danger`: `#DF6666`
  - `--dark-accent-info`: `#BDBDBD`

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
