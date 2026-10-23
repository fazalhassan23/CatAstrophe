# Changelog

Notable product changes are recorded here. Dates use YYYY-MM-DD. Package versions and save-schema versions are independent. Future work goes under Unreleased; completed releases receive a dated version entry.

## Unreleased

### Layout

- Removed story-photo letterbox backgrounds. Photos now open a viewport-filling modal with an uncropped image, Back to story/Close button, Escape/backdrop dismissal, scroll locking and focus restoration. Browser-verified opening, closing and Escape; existing 68 tests pass.

- Added phone/tablet/landscape layouts, short-height menu treatment, mobile input sizing, touch panning and safe-area-aware header padding. Measured home, collection and story layouts at eight viewport sizes; see docs/RESPONSIVE-QA.md for results and limitations.

- Compacted the home screen with wider panel spacing, a three-column navigation grid, grouped control hints and a shorter dedication. The home frame uses available viewport height; gameplay retains its existing proportions. Verified no internal menu overflow in the narrow demo.

- Compacted flight results into a four-column score strip, an inline nickname/submit form, and primary retry/menu actions. Detailed stats/adventure and the full leaderboard are expandable; leaderboard loading is deferred until opened and expands after submission.

- Tidied panel spacing, heading sizes, menu navigation, story reading layout and leaderboard column widths. Character cards now group portraits/name/traits with compact, separate Meet links; removed oversized inherited roster-button styling from story links. Kept the approved character artwork unchanged. Full suite: 68 passing tests; collection and story navigation checked in the demo.

### Character artwork

- Matched playable designs to family references: Luna's smaller orange-and-white kitten silhouette, Coco's grey coat, white facial blaze/chest fluff and golden eyes, and Pepe's sandy coat, large ears, white markings, green-gold eyes and dark tail tip. Removed Pepe's inherited bow tie. Shared renderer updates menu portraits, roster and flights; physics and saved IDs are unchanged.

### Added

- An optional Our cats page and free Meet links for Luna, Coco, and Pepe, with family photos, individual stories, a gentle introduction to loss/missing-pet themes, and a dedication. Photos are included in the standalone offline build.

### Character names

- Renamed Biscuit to Luna (The Little Spark), Mochi to Coco (The Gentle Soul), and Sir Pounce to Pepe (The Little Lion). Updated descriptions and current contributor/gameplay references. Internal IDs, flight traits, unlock costs, saves and database values stay compatible. Pepe's story says he went missing; it does not presume he died.

### Changed

- Added flapping wings for obstacle and chasing pigeons, respecting reduced motion. Restored the previous cat and fish artwork after visual feedback; their original movement and silhouettes are retained.

- Simplified opening instructions and four practice lessons with shorter, literal language, numbered steps and encouraging retries/completion.
- Adapted menu and lesson control prompts for coarse-pointer/touch versus keyboard devices.
- Explained hearts as extra chances (maximum two), Zoomies as a quick dash, and protection/power messages in plain language.
- Replaced discouraging result copy with helpful retry tips and a friendly cat-adventure report; clarified sidebar controls and beginner goals.

### Documentation

- Added GIT-HANDOFF.md describing the current batch, rationale, compatibility, required assets, validation and safe Git/deployment steps for the next maintainer or AI.

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

## Stage 1 follow-up — 2026-10-23 (unreleased)

- Added shared personality motion profiles: Luna preview hops/ear twitches, Coco slow blinks/breathing/tail sway, Pepe alert ears and brief tail flicks. Approved markings and flight physics stay unchanged.
- Fixed Pepe’s dark tail tip to follow the tail transform. Explicit reduced-motion settings keep decorative cat poses static in all render contexts.
- Added four rendering/profile regressions; see docs/IMPROVEMENT-CHECKLIST.md for staged scope and outstanding checks.
