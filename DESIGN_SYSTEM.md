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
Dark mode uses a dedicated, non-inverted palette tuned for contrast on deep blue-black surfaces.

- Base surfaces
  - `--dark-bg`: `#0F1115`
  - `--dark-surface-1`: `#161A22`
  - `--dark-surface-2`: `#1D2330`
  - `--dark-surface-3`: `#252D3D`
- Borders
  - `--dark-border`: `#353F52`
  - `--dark-border-strong`: `#4A5670`
- Text
  - `--dark-text-primary`: `#EEF2FF`
  - `--dark-text-secondary`: `#B7C0D4`
  - `--dark-text-muted`: `#8E99B0`
- Dark-only accents
  - `--dark-accent-primary`: `#7C9BFF`
  - `--dark-accent-secondary`: `#4DD4AC`
  - `--dark-accent-warning`: `#F6C760`
  - `--dark-accent-danger`: `#FF7A90`
  - `--dark-accent-info`: `#78C4FF`

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
