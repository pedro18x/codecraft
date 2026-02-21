# Feature Memory

This folder contains one markdown file per implemented feature, written by the
AI agent at the end of every implementation session.

## Purpose

- **Persistent context across sessions** — the agent reads recent memory files to
  understand what was recently built and why.
- **Human-readable changelog** — developers can skim this folder to understand
  what changed without reading git blame.
- **Decision log** — captures *why* choices were made, not just *what* changed.

## Naming Convention

```
YYYY-MM-DD-<kebab-case-feature-name>.md
```

Examples:
- `2026-02-20-jwt-refresh-token-rotation.md`
- `2026-02-21-monaco-editor-integration.md`
- `2026-02-22-leaderboard-pagination.md`

## Template

```markdown
# [Feature Name] — Implementation Summary
**Date:** YYYY-MM-DD
**Branch:** <branch-name>

## What Was Built
[1-3 sentences describing the feature from the user's perspective]

## Files Changed
- `path/to/file.tsx` — [what changed and why]
- `path/to/file.ts` — [what changed and why]

## Architecture Decisions
[Key decisions: why this approach over alternatives, trade-offs accepted]

## API Contracts (if applicable)
**Endpoint:** `METHOD /api/path`
**Request:** `{ field: type }`
**Response:** `{ field: type }`

## How to Test
[Commands or steps to verify the feature works]

## Known Limitations / Follow-ups
- [ ] Edge case not handled: ...
- [ ] Performance: ...
```

## Agent Protocol

1. **Always write a memory file** after completing a feature implementation.
2. **Read the last 3–5 memory files** at the start of a new session to restore context.
3. Memory files are **append-only** — never edit a past entry. If revisiting a feature,
   create a new entry with the current date.
4. Use the exact naming convention — this makes chronological sorting work automatically.
