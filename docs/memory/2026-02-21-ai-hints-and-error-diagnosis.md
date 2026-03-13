# AI Hints & Error Diagnosis — Implementation Summary
**Date:** 2026-02-21
**Branch:** dev

## What Was Built
On-demand AI assistant in the practice workspace with two modes: progressive hints (3-level escalation from conceptual nudge → approach → code scaffold) and error diagnosis (AI reads user code + failing test + error message and explains what's wrong without fixing it). Backed by OpenRouter free-tier LLMs streamed over SSE.

## Files Changed
- `apps/api/src/config/env.ts` — added `OPENROUTER_API_KEY` Zod field
- `apps/api/src/config/openrouter.ts` — OpenAI client pointed at OpenRouter, `AI_MODELS` fallback array
- `apps/api/src/routes/schemas/ai.schema.ts` — `AiHintRequestSchema` with discriminated hint/diagnose fields
- `apps/api/src/services/ai.service.ts` — prompt building, SSE streaming, model fallback, abort-on-close
- `apps/api/src/services/ai.service.test.ts` — 8 unit tests covering prompt guards, sentinel boundary, level routing, model fallback
- `apps/api/src/middleware/rateLimiter.ts` — added `aiHintLimiter` (10 req/user/hour, in-memory)
- `apps/api/src/routes/ai.ts` — `POST /hint` route: authenticate → aiHintLimiter → validate → streamAiHint
- `apps/api/src/routes/index.ts` — registered `/api/ai`
- `apps/web/src/hooks/use-hint.ts` — raw fetch SSE hook with AbortController, stacked entry history
- `apps/web/src/components/practice/HintPanel.tsx` — collapsible panel, Get Hint → Go deeper → Max depth reached
- `apps/web/src/app/(app)/practice/[slug]/page.tsx` — HintPanel wired below test results

## Architecture Decisions

**OpenRouter over direct Anthropic/OpenAI**: Free tier via `meta-llama/llama-3.3-70b-instruct:free` with `mistralai/mistral-7b-instruct:free` fallback. Zero cost for the project.

**`stream: true as const` + `Extract<Union, AsyncIterable<unknown>>`**: The `openai` SDK `completions.create` has two overloads; `true` (widened boolean) returns the union. `as const` narrows to literal `true`, selecting the streaming overload. The `Extract` utility avoids importing the SDK's internal `Stream` class (which has `#private` fields that cause mismatch).

**Single `onClose` ref outside retry loop**: Registering `res.on('close', onClose)` inside the loop would accumulate one listener per model attempt. A `currentStream` ref is updated each iteration; `onClose` always aborts the current stream.

**Prompt injection guard**: User code is wrapped in `<USER_CODE_START>` / `<USER_CODE_END>` sentinel boundaries. The system prompt explicitly instructs the model to treat that content as untrusted data, never as instructions.

**Rate limiter uses `req.rateLimit?.resetTime`**: `express-rate-limit` with `standardHeaders: true` populates `req.rateLimit.resetTime` with the actual window expiry timestamp — more accurate than `Date.now() + 1 hour` approximation.

## API Contracts

```
POST /api/ai/hint
Authorization: JWT cookie
Content-Type: application/json

{
  problemId: number
  mode: 'hint' | 'diagnose'
  hintLevel?: 1 | 2 | 3          // required when mode === 'hint'
  code?: string                   // required when mode === 'diagnose'
  language?: 'javascript' | 'typescript' | 'python'
  failingTestCase?: { input: string; expectedOutput: string }
  errorMessage?: string
}

Response: text/event-stream
data: {"token": "..."}   // one per chunk
data: {"done": true}     // success terminal
data: {"error": "RATE_LIMITED", "retryAfter": 3600}
data: {"error": "MODEL_UNAVAILABLE"}
```

## How to Test

```bash
# Unit tests
npm run test:api

# Manual: add OPENROUTER_API_KEY to apps/api/.env, start servers, open any problem
# Click "AI Assistant ▼" → "Get Hint" → text streams in
# Click "Go deeper →" twice → button becomes "Max depth reached" (disabled)
# Run tests with failing case → "Diagnose Error" button appears
# Click "Stop ✕" mid-stream → stream cancels
```

## Known Limitations / Follow-ups
- No persistent hint history — entries are lost on page navigation or refresh
- Rate limit is in-memory; resets on API server restart (acceptable for dev/small scale)
- Python language support stubbed as "soon" in the editor but the AI service accepts it
- No Playwright E2E tests for the hint flow yet (deferred)
