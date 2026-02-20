# ADR 0001: Frontend Feature-Oriented Architecture

## Status
Accepted

## Context
The frontend had several large route views containing UI markup, state, and side effects in one file. This made onboarding and change-scoping expensive, and caused regressions when touching shared behavior.

## Decision
Adopt a feature-oriented structure where route views are orchestration wrappers and feature modules own state and screen composition.

### Structure
- `src/views/*`:
  - Thin route wrappers only.
- `src/features/<feature>/`:
  - `*Screen.vue` for composed feature UI.
  - `use*Page.ts` for feature state and actions.
  - Optional `queries/` and `api/` subfolders for server-state concerns.
- `src/contracts/*`:
  - Shared Zod contracts and inferred types for API payloads.

### Enforcement
- File-size guard for `src/views/*.vue` via `scripts/check-file-size.mjs`.
- Explicit exemption: `Landing.vue` (marketing page layout/styling is intentionally denser).

## Consequences
### Positive
- Reduced route-level complexity and merge conflicts.
- Better testability for feature logic in composables.
- Clear ownership boundaries for future feature work.

### Tradeoffs
- More files to navigate.
- Requires discipline to keep route views thin and avoid logic drift back into route files.
