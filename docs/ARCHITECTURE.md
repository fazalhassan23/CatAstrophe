# Architecture and extension guide

## Runtime boundaries

The browser owns physics, local progression, menus and rendering. A Vercel Function handles optional scores; Neon stores public rankings and replay/rate metadata. The server does not own fish balances, purchases, unlocks, or the live simulation.

Browser load order is core → mischief → training → save → audio → render → leaderboard → app. Modules expose globals such as `CatCore` and `CatBoard`; core/save/mischief/training also support CommonJS for Node tests. Preserve order when adding scripts. The build embeds files in `index.html` order.

| File | Ownership |
| --- | --- |
| `src/core.js` | `C`, RNG, `ROSTER`, Run lifecycle, physics, gates/items, collision, scoring, worlds, abilities, rescues |
| `src/mischief.js` | Optional pounce targets, pot→bell→pigeon chain, warning/evasion and crime counters |
| `src/training.js` | Four action-driven safe lessons, retries, completion |
| `src/save.js` | Defaults/normalization, Store, currencies/unlocks, settlement, missions, achievements, UTC Daily seed |
| `src/render.js` | Procedural characters/scenery/hazards, animations and particles |
| `src/audio.js` | Synthesized WebAudio effects/music |
| `src/leaderboard.js` | Optional API requests, tickets, form/table and retries |
| `src/app.js` | Menus, input ownership, HUD, loop and event feedback, storage synchronization |
| `server/leaderboard.cjs` | Injectable API logic, signing, validation, SQL |
| `api/leaderboard.mjs` | Neon/environment adapter for production |

## Lifecycle and timing

`Run.state` is playing, paused or over; practice completion also sets complete. App `mode` distinguishes menus, collection, settings, results, lab and tutorial completion. These are distinct: settings opened from pause must not advance simulation.

Starting creates a fresh Run. Flap changes velocity immediately. `step(dt)` handles timers, movement, hazard collisions/passing, collectibles, mischief and boundaries. `end()` emits game over once; practice gently recovers instead. The app drains events for audio, messages and particles, then settles eligible completed runs once. Restart creates a new object rather than recycling temporary state.

The animation loop accumulates elapsed time and advances fixed **1/120-second steps**. Ordinary slow frames catch up up to half a second; longer stalls pause. Start/resume reset clock/accumulator. Gameplay timers freeze while paused. Rendering has presentation time; reduced motion must retain gameplay visibility and protection cues.

`Run.rand` generates the course. `rewardRand` separately selects mystery rewards. Mischief placement does not consume course RNG. Do not let rendering, optional pickups or cosmetic randomness change the Daily route.

`emit(type,data)` queues feedback; `drain()` removes it once. Events include flap, fish, power, pass, warning, near, rescue, world, mischief, over, practice and graduated. Handle DOM/audio feedback outside core.

## Geometry

`Run.shapes(gate)` defines collision shapes used by the renderer. Most hazards use circle-to-rectangle distance; fans use a circular rule. The toaster base is a separate solid shape. Keep visible solid artwork and collision geometry aligned. Near misses are flagged while close and credited only after clearance; protected/ignored hits are ineligible.

## Local persistence

LocalStorage key: **`catastrophe-v1`**. Save schema version 1 is independent of the package version. Fields include records/currencies, unlocked/selected cats/outfits, totals, missions/achievements, per-date Daily best, walkthrough completion and settings. Normalization rejects invalid individual fields while retaining valid unrelated progression.

The app holds a stable reference to `Store.data`. Write reconciliation merges currency deltas, unioned completion/unlock lists, maximum records/Daily scores, and locally changed settings/scalars against current storage. Purchases/settlement refresh before checks. Storage events refresh relevant screens. This reduces stale-tab data loss but cannot guarantee atomic cross-process transactions.

Settlement requires over, ignores tutorial/lab, and uses a WeakSet to credit each Run once. Do not settle every frame. Refreshing mid-flight loses unbanked fish; completed results/settings save immediately. Origin/profile changes can produce separate local saves; local progression is not cloud synchronized.

## Extension recipes

### New cat

Add a `ROSTER` entry with name, copy, cost and gravity/flap/speed multipliers, plus a distinct renderer appearance. Menus reuse that renderer. Test unlocks, normalization and route safety. Update server cat validation and migrate the database CHECK constraint before the cat submits scores. Daily deliberately forces Luna.

### New hazard/world

Update generation/type sequence, collision shapes, artwork, warnings and game-over copy. Test corridor safety across seeds, impact, near misses, armor/rescue and boundary interactions. New worlds also require transition arrays, palettes, audio and route coverage; arrays currently assume three worlds.

### New power or mischief

For powers, implement collection, spawn schedule, timer/consumption, HUD and artwork. Test expiration, pause, duplicate pickup, caps and restart. For mischief, extend TARGETS, strike/reaction logic, art and crime reports. Preserve optional safe contact and independent course randomness. Every point source must fit score accounting.

### Saved field or online change

Update defaults, normalization and merge semantics; test old saves and stale tabs. Online changes require coordinated API validation, SQL, UI, tests and operations docs. Board-size changes require both the API SELECT limit and SQL pruning limit. Credentials stay server-only. Practice lessons must use real actions, offer retries and never bank persistent rewards.

## Cozy home scene

CatArt.home draws the decorative room and all three approved cats into .home-room using the existing loop. The canvas is not the input surface: adjacent native buttons expose selection/lock state to keyboard and assistive technology. Owned cat selection goes through Store.selectCat; locked selection opens collection and never buys automatically. The room honors reduced motion and shares the same character pose profiles as other previews. src/app.js owns UI state; render.js does not read/write saves.

## Flight-mode boundary

Run(seed, cat, {mode}) defaults to classic; relaxed changes generation/travel and starting rescues while retaining core flap physics. App session flightStyle selects mode; Daily and walkthrough override to classic. Store.settle handles relaxedBest separately and returns before progression settlement. Browser leaderboard UI excludes relaxed and the API rejects explicit non-classic mode payloads; this does not make client-submitted mode cryptographically trustworthy. Any future relaxed online board needs a distinct server-owned ticket/board contract.

## Milestone records

CatSave.MILESTONES defines eight badges; milestoneProgress reads either cumulative totals or best-flight records. Save records passed/seconds/combo/cleanPassed normalize independently and merge by maximum across stale snapshots. Existing achievement IDs remain the earned set, merged by union. Store.settle updates records only after tutorial/lab/Relaxed exclusion, collects newly earned definitions into report.milestones, then writes once. The app uses this report for a static result banner and shows all progress on the Milestones screen. New badges add no currency; mission settlement remains unchanged.


### Discovery system
Load discoveries.js after core.js and before constructing runs. Run owns an optional CatDiscovery.System; it receives gate spawns and fixed-step displacement after mischief updates. System only tracks collectible coordinates and cosmetic found IDs, never RNG/collision/reward state. Renderer draws trails and ambient effects independently. Store normalizes/merges the three known discovery IDs and saves them only during eligible Relaxed settlement. Tests: tests/discoveries.cjs.


### Pickup collision versus hazard collision
CatCore.pickupTouches sweeps relative collectible/cat movement against an expanded central-body ellipse. Item collection runs after magnetic attraction; discovery stars share the helper. It deliberately differs from C.r=15 for hazards. Rescue teleport positions reset the sweep origin. See tests/pickups.cjs for geometry, award and lifecycle regressions.
