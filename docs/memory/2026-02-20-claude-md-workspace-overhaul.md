# CLAUDE.md Workspace Overhaul — Implementation Summary
**Date:** 2026-02-20
**Branch:** dev

## What Was Built
Replaced the outdated root CLAUDE.md (which still described Vue 3 + Vite) with accurate
rules for a Next.js 16 / Express 4 monorepo. Added per-app CLAUDE.md files for `apps/web`
and `apps/api`. Created a persistent `docs/memory/` system so agents can log and recall
feature history across sessions.

## Files Changed
- `CLAUDE.md` — full rewrite: correct tech stack, monorepo workspace commands, memory
  protocol, production data policy, before-commit checklist, cross-references to sub-app files
- `apps/web/CLAUDE.md` — created: Next.js App Router conventions, React 19 Server/Client
  component rules, TailwindCSS v4 (no tailwind.config.js), neo-brutalist design system,
  error/loading boundary patterns, Framer Motion guidelines, Playwright testing
- `apps/api/CLAUDE.md` — created: Express thin-route/fat-service pattern, Zod v3 positional
  validate() signature, ApiError throw pattern, asyncHandler requirement, req.user.id shape,
  Prisma commands, JWT auth, ESM .js import rules, security checklist
- `docs/memory/README.md` — created: memory folder documentation, naming convention,
  template, agent protocol (write after every feature, read last 3–5 at session start,
  append-only)

## Architecture Decisions
- Per-app CLAUDE.md files keep rules scoped and prevent a single bloated file. Each app
  has different tech stacks and conventions that would overwhelm a shared doc.
- Memory files are append-only (never edit past entries) to preserve an honest audit trail.
- The memory protocol is embedded in root CLAUDE.md as mandatory, not a suggestion, and
  is cross-referenced from each sub-app file to ensure agents see it regardless of which
  CLAUDE.md they read first.
- docs checked against the real codebase: validate() signature, req.user shape, asyncHandler
  usage, and ApiError pattern were all corrected to match what actually exists in source.

## How to Test
Open a new Claude Code session and verify the agent reads the correct tech stack (Next.js/
React, not Vue). Ask it to create a new API route — it should use asyncHandler, throw
ApiError on not-found, and import with .js extensions.

## Known Limitations / Follow-ups
- [ ] ADR 0001 still references Vue 3 component structure — should be deprecated or updated
- [ ] Consider adding a CLAUDE.md to any future `packages/` shared libs
- [ ] Consider a Claude Code hook to auto-create memory entries on feature completion
