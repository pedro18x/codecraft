# Rollback Runbook

## Scope
- Frontend: Vercel
- API: Render (or Fly equivalent)
- Executor: Render (or Fly equivalent)

## Trigger Conditions
- Elevated 5xx error rate for 5+ minutes
- p95 latency above SLO for 10+ minutes
- Auth/session failures after deployment
- Executor unavailable errors (`EXECUTOR_UNAVAILABLE`) sustained

## Frontend Rollback (Vercel)
1. Open Vercel project deployments.
2. Identify last known good deployment before incident.
3. Promote that deployment to production.
4. Confirm homepage, login, dashboard navigation, and practice route load.

## API Rollback (Render)
1. Open Render service deployment history for API.
2. Redeploy the previous healthy commit/image.
3. Verify `/health` returns 200 and `/ready` returns 200.
4. Verify auth endpoints: `/api/auth/login`, `/api/auth/refresh`, `/api/auth/me`.

## Executor Rollback
1. Open executor service deployment history.
2. Redeploy previous healthy version.
3. Verify `/health` returns 200.
4. Execute one smoke request through API `/api/execute`.

## Post-Rollback Validation
1. Login from clean browser session.
2. Run one practice execution and one submission.
3. Confirm telemetry events and request logs include request IDs.
4. Confirm no spike in 401/403/503 after rollback.

## Incident Notes
- Record deployment IDs rolled back.
- Record time to mitigation.
- Open follow-up issue with root cause and permanent fix.
