# Contributor guide

## Setup and workflow

Read the README, architecture and gameplay guides. Run `npm ci`, `npm test`, and `npm start` from the repository root. The original author's checkout is `C:\Users\fazal\OneDrive\Documents\Development\Cat-Astrophe`; other contributors should use their own clone.

1. Create a focused feature branch and reproduce the behavior before editing.
2. Use the architecture ownership map to find the right module. Keep simulation independent of DOM/audio.
3. Edit source, preserving offline play and old saves unless explicitly changing those contracts.
4. Add a meaningful regression for behavior changes. Exercise the actual module or handler instead of copying its algorithm into a test.
5. Run targeted tests, then the full suite. Rebuild after browser changes.
6. Play through the affected flow, including keyboard/pointer, pause/retry, and narrow screens when relevant.
7. Update documentation and the changelog. Commit the rebuilt dist artifact when it changes.

Do not commit credentials, `.env`, `.vercel`, or `node_modules`. `.env.example` contains placeholders only. No license is currently declared in the repository; ask the owner before redistribution beyond the intended collaboration.

There is no configured formatter, linter, TypeScript compiler, or frontend bundler. Follow nearby conventions and keep broad reformatting out of behavior changes.

## Tests

```powershell
npm test
node --test tests/lives.cjs tests/abilities.cjs
node --test tests/leaderboard.cjs tests/leaderboard-ui.cjs tests/database.cjs
node --test tests/qa-regressions.cjs
```

| Area | Test files |
| --- | --- |
| Physics, hazards, scoring, abilities, lives | `core.cjs`, `signature.cjs`, `abilities.cjs`, `lives.cjs` |
| Mischief, chain reactions and practice | `mischief.cjs` |
| Save compatibility, purchases, stale-tab writes, seeded courses | `save.cjs`, `qa-v022.cjs` |
| Actual app loop/input in minimal DOM; reduced-motion rendering | `qa-regressions.cjs` |
| Long routes, resets, timing and score accounting | `release.cjs` |
| Tickets, API validation, origins, rate responses | `leaderboard.cjs` |
| Text-safe rendering, retries and score form | `leaderboard-ui.cjs` |
| PostgreSQL schema, top-100 pruning, replay prevention and limits | `database.cjs` |

PGlite executes PostgreSQL locally and needs installed dev dependencies, not Neon. Minimal DOM tests do not replace a browser/device playtest. These tests are not Vercel load tests or rendering performance benchmarks.

## Manual checks

- Menu → flight → results → retry → menu; pause, tab switch and long stall.
- Walkthrough, early missed pounce, recharge, completion; no banked practice rewards.
- Heart pickup/cap, single deduction, protected floor/ceiling contact, expiry, final death, restart.
- Slider keyboard controls and a visible protected cat with motion disabled.
- Purchases/settings persist on reload; avoid changing another person's save for testing.
- Online score appears after a fresh read, and API failures preserve local play.
- Daily uses UTC and Biscuit; mystery collection does not change course geometry.

Use isolated browser profiles/storage fixtures for progression tests. Record actual checks and limitations; do not claim physical touch or cross-browser coverage from a desktop viewport screenshot.

## Review and releases

PR descriptions explain the trigger/problem, resulting behavior, tests and deployment/migration requirements. Identify environment-variable and SQL changes. A passing build does not mean the feature is live.

Going forward use semantic versions: patch for compatible fixes, minor for compatible features, major for breaking contracts. Add work under Unreleased, then move it into a dated version entry at release. Update `package.json` and `package-lock.json` together. Preserve historical changelog entries.

Prefer additive database migrations compatible with the running API: migrate first, deploy code second, remove obsolete schema in a later planned change. Redeploying old code does not reverse a database migration. See operations for production safety and rollback.
