# CAT-ASTROPHE!

An original flying-cat arcade game. Fresh modular implementation with procedural Canvas artwork and synthesized Web Audio. No external assets, downloads, accounts, paid services or API keys.

## Play

Open `dist/cat-astrophe.html` in a modern browser. Everything is embedded in that file.

For development, from this folder:

```powershell
npm start
```

Visit http://127.0.0.1:4173. Node.js is required for development commands; no npm install is necessary. The server binds only to the local computer. Browser saves are local to the URL/profile; the standalone file and localhost can have separate progress.

```powershell
npm test
npm run build
```

The build produces `dist/cat-astrophe.html` using Node's built-in libraries.

## Controls

- Space / Arrow Up / tap or click the sky: flap.
- X or the bottom-left button: Zoomies; Sir Pounce uses Air Pounce instead.
- P / Escape / pause button: pause. Switching tabs or losing focus also pauses.
- In yarn: tap three times to escape immediately, or wait 1.5 seconds.

Fish and near misses charge the ability. Zoomies costs 100%; Pounce costs 65%. Cooldown: 1.5 seconds. Dash gives a brief protected burst, not permanent safety.

## New: mischief and the beginner walkthrough

- Choose **Learn to fly** on first launch, or **Walkthrough** anytime. Four hands-on steps teach flapping, collecting fish, pouncing into a flowerpot, and avoiding the pigeon it wakes. Practice cannot kill you or earn currency. Fish and the pot follow your height; the pot waits nearby so there is no timing pressure. In regular flights, targets have fixed heights and you must aim and time the pounce.
- The walkthrough can be skipped immediately, paused, or restarted. Completion is saved; existing cats, fish and settings are preserved.
- Version 0.2.2 reconciles stale-tab saves, separates Daily course randomness from mystery rewards, adds collision to the visible toaster base, and catches up slow frames down to 10 FPS. Stalls longer than half a second pause the game. The suite contains 54 passing tests; prior tutorial, reduced-motion and keyboard fixes remain covered.
- In regular flights, optional dashed-ring targets appear after the first few hazards. Pounce into a flowerpot, steal toast, or ring a doorbell with X / the ability button. Flying past them is safe.
- Flowerpot → delayed bell → telegraphed pigeon. A dotted lane warns where the pigeon will fly. Avoid it for an extra reward. Toast gives a safe reward without a pigeon.
- Each target and evasion rewards once. The end-of-run **crime report** lists the actual pots smashed, toast stolen, bells rung, pigeons outsmarted and mischief points.

## Included in this release

- Original animated Biscuit, Mochi (20 fish), and Sir Pounce (45 fish). Different shapes, coats, movement, and trade-offs. Animated roster previews, including locked cats.
- Laundry, telegraphed pigeons, suction vacuums, bobbing toast, rotating fans with updrafts, and recoverable yarn traps.
- Neighborhood, Kitchen Dimension and Cat's Dream. A portal warning precedes each transition, palette changes are gradual, and dream gravity is lighter.
- Near misses award only after clearing a hazard. Multiplier capped at 5x, expires after 7 seconds. Protected collisions are ineligible.
- Fish, golden fish, mystery fish, catnip, magnet, cardboard armor, yarn currency, rescue hearts. All durations are simulation timers and freeze on pause.
- Yarn escape, one-impact box recovery, and limited emergency air-bounce rescues. Protection ends predictably; ceiling/ground remain dangerous without a rescue heart.
- Giant Vacuum event after nine cleared disasters: survive ten seconds of wide-corridor vacuum waves for 40 points and five fish.
- Fish bank, three-cat unlocks, aviator goggles, cardboard crown, five missions, achievements, records, seeded daily flight with Biscuit for equal physics.
- Independent saved effect/music volumes, mute, reduced-motion setting, procedural audio, mobile layout and one-action retry.
- Distance, cleared hazards, fish, near misses, world and event score breakdown.

## Source and assets

- `src/core.js`: deterministic physics, corridor generator, collisions, collectibles, recovery, abilities, world/event and scoring state.
- `src/mischief.js`: optional target generation, pounce hits, timed chain reactions and crime counters.
- `src/training.js`: guided practice and action-based lesson progression.
- `src/render.js`: all original art, characters, scenery, hazards, animations and capped particles.
- `src/audio.js`: synthesized effects and world-specific music patterns.
- `src/save.js`: versioned save validation, purchases, missions, achievements, daily seeds and once-only run settlement.
- `src/app.js`: menus, input, accessibility controls and the fixed-step animation loop.
- `style.css` and `index.html`: responsive shell.
- `tests/`: deterministic Node tests. `tools/`: local server and offline packager.

There are no external image or audio asset folders; artwork and sound are generated by the modules above.

## Developer tools

Open `http://127.0.0.1:4173/?dev=1`. Settings → Flight lab exposes reproducible live scenarios. Lab runs cannot earn progression. Press D during a developer run to display collision geometry and flight corridors. `?seed=123` reproduces normal obstacle sequences. Physics, spacing, gap and speed are configurable in `CatCore.C` at the top of `src/core.js`.

## Validation and limits

See `DEVELOPMENT.md` for phase-by-phase tests and remaining content. This is the first substantial playable release, not every item in the full wishlist. Extra roster members, additional mini-bosses, feather/vacuum-specific recoveries, charged flaps, and a larger cosmetic/mission catalogue are deferred. Physical touch devices and subjective sound quality still need human testing; mobile-size browser rendering and pointer input have been checked.

## Global leaderboard — v0.3.0

Online deployments support Classic and UTC Daily top-20 boards with nickname entry after a flight. Follow `LEADERBOARD-SETUP.md` to connect Neon and initialize the database. Offline play still works. Lives pickups and deductions now consistently honor protection at both obstacles and world boundaries; the HUD shows remaining rescues out of two. Validation: 66 tests pass, including embedded PostgreSQL schema tests and leaderboard UI/API checks.
