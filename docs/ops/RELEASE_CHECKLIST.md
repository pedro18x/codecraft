# MVP Release Checklist

## Pre-merge Gate
- [ ] CI green: type-check, build, server build, lint, e2e-smoke
- [ ] No lint errors (`npm run lint -- --quiet`)
- [ ] No tokens in browser storage usage
- [ ] Auth cookie flags verified in production config

## Pre-tag Gate
- [ ] `/health` and `/ready` validated in staging
- [ ] Executor service reachable and authenticated
- [ ] CSRF flow verified (`/api/auth/csrf` + mutating route)
- [ ] Rollback runbook reviewed
- [ ] Backup restore drill completed this week

## Tag + Deploy
- [ ] Create semver tag (`vX.Y.Z`)
- [ ] Confirm `Deploy Production` workflow succeeds
- [ ] Confirm frontend production URL healthy
- [ ] Confirm API and executor deploy hooks succeeded

## Post-deploy Smoke
- [ ] Landing -> register/login -> dashboard
- [ ] Run code execution on one problem
- [ ] Submit one successful run and one failing run
- [ ] Verify telemetry events:
  - `lp_cta_clicked`
  - `signup_started`
  - `signup_completed`
  - `first_problem_started`
  - `code_executed`
  - `problem_completed`
- [ ] Confirm no sustained 5xx/503 spike
