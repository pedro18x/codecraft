# DB Backup and Restore

## Backup Policy
- Managed PostgreSQL automated daily backups enabled.
- Retention target: minimum 7 days.
- Weekly logical dump to object storage for defense-in-depth.

## Weekly Restore Drill
1. Create temporary database instance.
2. Restore latest snapshot or logical dump.
3. Run migration status check:
   - `npm -C server run db:generate`
   - `npx -C server prisma migrate status`
4. Run basic integrity queries:
   - user count
   - problem count
   - refresh token count
5. Run API smoke against restored DB in isolated environment.
6. Record drill result in operations log.

## Emergency Restore
1. Freeze writes (maintenance mode or API disable).
2. Restore selected snapshot to replacement database.
3. Update API and executor `DATABASE_URL`.
4. Run readiness checks:
   - `/health`
   - `/ready`
5. Validate login and one execution flow.
6. Re-enable traffic.

## Data Retention
- Submissions and test results retained for product analytics and progress history.
- Expired/revoked refresh tokens cleaned up by scheduled job:
  - `npm -C server run cleanup:refresh-tokens`
- Retention windows should be reviewed quarterly.
