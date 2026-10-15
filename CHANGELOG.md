# Changelog

Notable product changes are recorded here. Dates use YYYY-MM-DD. Package versions and save-schema versions are independent. Future work goes under Unreleased; completed releases receive a dated version entry.

## Unreleased

### Changed

- Added flapping wings for obstacle and chasing pigeons, respecting reduced motion. Restored the previous cat and fish artwork after visual feedback; their original movement and silhouettes are retained.

- Simplified opening instructions and four practice lessons with shorter, literal language, numbered steps and encouraging retries/completion.
- Adapted menu and lesson control prompts for coarse-pointer/touch versus keyboard devices.
- Explained hearts as extra chances (maximum two), Zoomies as a quick dash, and protection/power messages in plain language.
- Replaced discouraging result copy with helpful retry tips and a friendly cat-adventure report; clarified sidebar controls and beginner goals.

### Documentation

- Reorganized README and added contributor, architecture, gameplay and production operations references.
- Documented actual dependency requirements, full-stack versus static development, API contract, retention, security limitations and release/migration procedures.
- Added this maintained changelog; marked the old development log as historical.

## Post-0.3.0 update — 2026-10-15

This change shipped without a package version increment; package.json remains 0.3.0. It is recorded separately rather than inventing a historical release tag.

### Changed

- Expanded Classic and Daily leaderboards from top 20 to top 100 in UI, API queries and database pruning.
- Updated the live Neon submission function to retain 100 per board/date. Previously pruned scores are not recoverable.
- Expanded PostgreSQL regression coverage to insert 105 Classic scores and retain exactly the best 100; all 66 tests pass.

## 0.3.0 — 2026-10-15

### Added

- Global Classic and UTC Daily leaderboards with nickname submission, highlighted ranking, retries and graceful offline failure; originally top 20.
- Vercel API and Neon schema with signed flight tickets, input/plausibility checks, duplicate-submission protection, hashed-IP rate limits and transactional score pruning.
- PostgreSQL tests through PGlite, API/UI tests and detailed rescue regressions; 66 tests pass.

### Fixed

- Floor and ceiling contacts now honor active protection rather than consuming another rescue or killing immediately.
- Explicit rescue HUD `♥ n / 2` and full-cap pickup feedback.

### Changed

- Daily seeds/boards use UTC dates; previous-day tickets expire at midnight UTC.
- Added runtime Neon driver and development PGlite dependencies with a lockfile.

### Deployment

- Initialized connected Neon database, saved production signing secret and redeployed. Live score submission/readback and both boards verified; temporary QA score removed.

## 0.2.2 — 2026-10-15

### Fixed

- Reconciled stale-tab saves and refreshed purchase/settlement validation to reduce progress overwrites and duplicate charges/rewards.
- Separated mystery-reward RNG from seeded course RNG.
- Matched toaster-base collision to visible art.
- Fixed slow-frame simulation timing; stalls longer than half a second pause and resume resets the clock.
- Added eight regressions; 54 tests pass.

## 0.2.1 — 2026-10-15

### Fixed

- Missed practice pounces recharge after cooldown, preventing a stuck lesson.
- Reduced-motion protected cat remains visible with a static protection ring.
- Native form controls retain keyboard input; flight shortcuts are state-scoped.
- Added seven regressions; 46 tests pass.

## 0.2.0 — 2026-10-15

### Added

- Optional pot/toast/bell pounce targets, delayed pigeon consequences, telegraphed lanes, once-only rewards and crime report.
- Four-stage safe walkthrough with retries, pause/skip/replay and persisted completion, without banking practice rewards.
- New mischief/walkthrough coverage; 39 tests pass.

## Initial implementation — 2026-10-14 to 2026-10-15

No verified release tag/version is assigned here. Historical implementation notes live in DEVELOPMENT.md.

### Added

- Modular fixed-step flying-cat game with procedural art/audio, three cats, six hazards, three worlds, fish/powers, near misses, rescue mechanics and Giant Vacuum encounter.
- Local progression, missions, achievements, cosmetics, settings, seeded Daily flight, Flight Lab, tests and standalone HTML build.
