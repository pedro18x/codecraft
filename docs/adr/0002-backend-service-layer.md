# ADR 0002: Backend Route-Service Separation

## Status
Accepted

## Context
Execution, submissions, progress, and leaderboard logic was implemented directly in route handlers. This duplicated orchestration (notably between execute and submissions) and made isolated testing difficult.

## Decision
Adopt thin routes with dedicated service modules for business logic.

### Service Modules
- `server/src/services/execution.service.ts`
  - Problem lookup, executor invocation, executor error mapping, execution telemetry.
- `server/src/services/submissions.service.ts`
  - Submission persistence, progress upsert, completion telemetry.
- `server/src/services/progress.service.ts`
  - Progress list and stats aggregation.
- `server/src/services/leaderboard.service.ts`
  - Leaderboard aggregation query and mapping.
- `server/src/services/code.service.ts`
  - Saved-code parameter parsing and persistence.

### Validation Extraction
Route-level request schemas are defined in `server/src/routes/schemas/*` and reused by `validate(...)` middleware.

## Consequences
### Positive
- Lower cognitive load in routes.
- Shared execution path between guest and authenticated flows.
- Easier unit/integration testing of core behavior.

### Tradeoffs
- More cross-file navigation for simple endpoints.
- Requires consistency in response-shape ownership at the route layer.
