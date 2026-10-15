# Deployment, API and database operations

## Environments and build

Production is https://catastrophe-rho.vercel.app/ in Vercel project `catastrophe`, backed by Neon. Do not put resource credentials in docs or Git. Existing Vercel configuration runs `npm run build`, publishes `dist`, and rewrites `/` to `/cat-astrophe.html`. API files live at repository root under `api/`; they are deployed as functions, not embedded in the static HTML.

`npm start` serves the repository locally with no API execution. For full-stack development, install/use Vercel CLI, link to the intended project, and run `vercel dev` with **development-only** environment variables. Configure a separate Neon database/branch for Development and Preview. The initial integration exposed the database to all environments; verify and separate those assignments before running untrusted preview code. Never test destructive changes against Production.

Required server variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string; integration normally provisions it |
| `LEADERBOARD_SECRET` | Random HMAC secret signing flight tickets and hashing rate-limit keys |

Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and store it as a Vercel Secret. Never prefix database/signing values with browser-exposed names. `.env.example` contains placeholders; local secret files are ignored. Rotate the signing secret deliberately: all outstanding tickets signed with the old value become invalid.

## Release procedure

1. Run `npm ci`, `npm test`, `npm run build`; review source/dist differences and changelog.
2. Apply any compatible additive SQL migration to the intended database, preserving existing scores.
3. Commit/push to the configured Production branch (currently main). Confirm Vercel picked the expected commit.
4. Redeploy after changing environment variables; old deployments do not acquire new values automatically.
5. Wait for Ready, then test the production domain: board read, completed real flight, nickname submit, fresh read and Daily board.
6. Remove only the QA submission you created, by its exact run ID. Leave real players' rows untouched.

Rollback code through Vercel's deployment controls if needed. Schema/environment changes remain in place; inspect compatibility before rollback. Export/backup before destructive SQL; check Neon plan-specific backup/recovery availability rather than assuming it is enabled.

## API contract: `/api/leaderboard`

All responses are JSON with `Cache-Control: no-store`. The client aborts requests after eight seconds. Secrets/connection strings never appear in responses.

| Request | Response / behavior |
| --- | --- |
| `GET ?board=classic` | `{board:"classic", date:"all", rows:[{id,name,score,cat}]}` |
| `GET ?board=daily` | Same shape, current UTC date; at most 100 rows |
| `POST {action:"start",board:"classic"}` | `{token}`; also accepts daily |
| `POST {token,name,score,seconds,cat}` | `{id,accepted}`; accepted false means this ticket was already submitted |

The game requests a ticket at the start of a real flight; it is not a login. Classic tickets expire after 24h. Daily tickets additionally expire at UTC midnight. The server derives board/date/run ID from the signed ticket rather than trusting submitted values.

Names are trimmed/NFKC-normalized and restricted to 1–20 letters/numbers/spaces/dots/dashes/underscores. Scores must be positive integers ≤1,000,000, seconds finite between zero and 86,400, simulation duration no more than ticket age +2s, and score ≤100+100×seconds. Cat must be in the allowlist; Daily requires Biscuit. UI excludes practice/dev runs, but this is not server replay verification. A modified client can fabricate plausible scores. Use stronger verification/moderation before offering competitive prizes.

POST checks a supplied Origin against Host; absent Origin is allowed. This is not authentication. Database-backed rate limiting shares 20 POST requests/minute per HMAC-hashed IP across ticket starts and submissions. GET is not covered by this limiter; use Vercel platform controls for broader abuse protection. Raw IPs are not stored by this application's tables, but infrastructure logs may have their own policies.

| Status | Meaning |
| --- | --- |
| 200 | Success, including accepted:false for a replay |
| 400 | Invalid JSON/body/board/name/cat/score/ticket |
| 403 | Supplied Origin mismatch |
| 405 | Unsupported method; GET/POST allowed |
| 429 | Rate limit; retry in a later minute |
| 503 | Missing configuration, database/query failure, or temporary service failure |

## Schema and retention

`database/schema.sql` is idempotent for existing tables/indexes and replaces function definitions. It does not automatically alter existing table columns/constraints; future schema changes need explicit migrations.

| Object | Purpose |
| --- | --- |
| `cat_scores` | Ranked score rows: UUID, board/date, public name, score, cat, timestamp |
| `cat_submissions` | Used ticket IDs; prevents resubmitting even after a score is pruned |
| `cat_limits` | Hashed client keys, minute window, request counts |
| `cat_submit_score(...)` | Transactional insert/deduplication/pruning using advisory transaction lock |
| `cat_rate_limit(text)` | Atomic minute counter and stale-key cleanup |

Each Classic/date partition retains 100 flights, ordered score descending, timestamp ascending, UUID ascending. Accepted means the submission was processed, not that it ranked. Daily scores older than 30 days and used IDs older than 25 hours are cleaned during score submissions; rate rows older than a day are cleaned during rate checks. Cleanup is opportunistic, not a scheduled job, so inactive databases can retain old metadata longer.

The top-100 database function was applied live after the initial release. Older scores already pruned under top-20 cannot be reconstructed from this database. Changing the limit later requires API SELECT, SQL pruning, UI text, tests and docs to agree.

## Safe maintenance

Use read-only mode for inspection. Example diagnostics:

```sql
SELECT board, flight_date, count(*) FROM cat_scores GROUP BY board, flight_date;
SELECT run_id, name, score, cat, created_at FROM cat_scores
WHERE board='classic' ORDER BY score DESC, created_at, run_id LIMIT 100;
SELECT position('LIMIT 100' in pg_get_functiondef(
 'cat_submit_score(uuid,text,text,text,integer,text)'::regprocedure))>0 AS retains_top_100;
```

For moderation, record the exact run ID and reason, then delete only that score in a deliberate write session. Keep its used-ticket ledger entry to prevent immediate replay. Never clear whole tables to remove one nickname. No administrative UI or profanity filtering currently exists.

The Vercel embedded Query editor may reject multiple commands in one prepared statement. Use Neon's full SQL editor, execute each statement separately (keep full dollar-quoted functions intact), or run the schema in one block:

```sql
DO $init$ BEGIN EXECUTE $schema$
-- Paste the complete contents of database/schema.sql here.
$schema$; END $init$;
```

Return the editor to read-only afterward. Never paste secrets into SQL results/screenshots shared publicly.

## Troubleshooting

- Local board says it needs the online build: `npm start`/file URLs have no API. Use deployed site or full-stack dev.
- 503/not connected: verify both server variables in the correct environment, then redeploy. Inspect Vercel function logs without exposing secrets.
- Missing table/function: run schema in the database selected by that deployment's URL; check the right Neon branch.
- Board still shows 20: confirm deployed commit, API LIMIT and database function; refreshing cannot deploy local code.
- Ticket expired: start a new flight; old Daily tickets expire at midnight UTC.
- Score rejected: inspect duration, positive score, nickname and cat requirements. Do not bypass validation to accept a suspect score.
- 429: allow the minute window to reset. Shared networks share the IP-based limit.
- Unlocks disappeared on a new URL: local progress is origin/profile-specific; online score names are not save accounts.
- `npm ci` fails: check supported Node version and lockfile consistency. Do not fix it by deleting the lockfile without understanding the dependency change.
