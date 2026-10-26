# CAT-ASTROPHE! development log

> Historical record: this file preserves implementation-time observations and test counts. Statements below about dependency-free setup, local-only scores, offline network behavior, paths, or release completeness describe the build at that time and may no longer apply. Start with README.md and CONTRIBUTING.md for current instructions, docs/OPERATIONS.md for online infrastructure, and CHANGELOG.md for versioned changes. References to QA reports outside this repository are archival and are not required to build or test a clone.

Fresh implementation. Old flappy-cat.html and obsolete notes were removed as requested. Source and generated standalone release live in this folder.

## Phase 1 — core
Implemented fixed 120 Hz simulation, configurable impulses and capped fall, five distinct hazards, seeded corridor-first generation, forgiving collision radius, original articulated Canvas cat, fish, points, single game-over, retry, sound synthesis, pause and focus loss.

Validation: seven Node tests passed; 10,000 corridor layouts checked. Browser playtest verified flap, pause/resume, fish, score, ground death, retry screen; rendered menu and flight visually inspected. No browser error logs returned. Enjoyment is subjective; human balancing feedback is still valuable. Physical touchscreen not yet tested.

Decision: dependency-free JavaScript/Canvas instead of Phaser/Vite. No existing engine to preserve; this environment supports Node and local serving. The distribution builds to one offline HTML, while source remains modular.

## Phase 2 — signature systems
Three cats with different silhouettes and physics; three worlds; near misses awarded only after clearing, 5x cap and 7s timeout; yarn tangle (three taps or timed escape); consumable cardboard protection; visual mood reactions. Thirteen engine tests passed. Roster and distinctive Mochi preview inspected in browser. Yarn escape verified through three real Space inputs in Flight Lab. World and cardboard logic tested in simulation; extended browser checks continue.

## Phase 3 — abilities
Catnip Rush (8s double fish and charged dash), Fish Magnet (7s attraction), Zoomies Dash (cost/cooldown), Cardboard Armor (8s or one collision), Sir Pounce's lower-cost upward burst, visible fan updrafts, rare rescue hearts. Nineteen engine tests passed. Browser Flight Lab verified magnet pulled a golden fish for 15 points and 5 fish, and catnip enabled a working X-key dash that consumed charge. No paid services.

## Phase 4 — progression
Versioned, sanitized saves; fish bank; three-cat unlocks; goggles and crown cosmetics; five missions; achievements; daily seed and best; saved settings. Twenty-four engine/save tests passed including once-only settlement, no duplicate purchases, malformed save recovery, and reload persistence in storage adapter. Browser reload/settings/unlock UI checks continue.

## Phase 5 — special encounter
A Giant Vacuum sequence starts after the ninth cleared hazard, with advance warning. Ten seconds of widened-corridor vacuum waves, a visible boss/countdown and once-only 40-point / five-fish reward. Engine tests verify duration, pause behavior and route safety. A live browser run survived the full event; the HUD showed the reward in the resulting score and fish totals.

## Phase 6 — polish
Articulated cat artwork; independent paw/tail animation, squash/stretch, eyes and mood expressions; smooth world palette transitions; near-miss slow motion; original particles and protected dash trail; visible magnet/nip effects; labeled power-up silhouettes. Synthesized effects and three music patterns; independent volume sliders, persistent mute, optional reduced motion. Checked phone viewport (390×844) and desktop (1280×900). Phone menu crowding was found and fixed; start and all menu actions now fit without scrolling in that tested phone viewport. Collections and results may scroll at small sizes.

## Phase 7 — release validation
- 30 deterministic tests pass. Includes 10,000 generated corridor layouts, collision causes, collectible deduplication, recovery consumption, ability expiration and charge, pause, world changes, score breakdown, malformed saves, once-only currency settlement, purchases and reloads.
- A simple flap controller navigates 120-second runs across 20 seeds with each of three cats (120 simulated minutes). Gate/item counts remain bounded.
- Fixed-step simulation tested with 30/60/120Hz frame schedules.
- 100 fresh-run resets tested; temporary buffs and objects do not carry over. UI listeners are registered once at startup.
- Browser checks: Space, Arrow Up, pointer input, pause/resume, game-over/retry, three-tap yarn escape, box consumption feedback, near miss (+15 and 22% charge), golden-fish magnet collection (+15 and five fish), catnip/X dash charge consumption, Dream scenery, Giant Vacuum survival, locked cat requirements, saved mute after reload, daily result persistence.
- Packaged standalone HTML served and played through repeated starts/crashes/retries. Daily best and achievement remained present after navigating to the standalone build. No captured browser error logs.
- Build: npm run build passes; produces a self-contained offline HTML with no external fetches or assets.
- Browser tab is left on the ready-to-play game. Local server listens on 127.0.0.1:4173.

## Scope and known limitations
This is the first substantial release described by the brief. No known critical defect was observed in tested scenarios; this is not proof across every browser/device.
- Deferred: remaining five roster cats; Pigeon King, laser, toy and dragon mini-bosses; feather-specific and vacuum-launch recoveries; held/charged flaps; more missions/cosmetics; extra future worlds.
- Recovery currently includes yarn escape, cardboard protection and earned rescue-heart air bounce.
- Unlock purchases, refunds/rejections and currency arithmetic were tested through the actual Store module, rather than by earning every unlock during a live browser session.
- Actual touch hardware, broad cross-browser compatibility, audio listening quality and human difficulty preference remain unverified.
- No external high-score service or shared leaderboard; progress is local to the browser origin.
- A refresh during a live run loses that run's unbanked fish. Completed results and settings save immediately.
- Developer Flight Lab is available only with ?dev=1, and laboratory runs cannot earn progression.

## Deliverables
Source: this folder. Generated release: dist/cat-astrophe.html. Artwork: src/render.js (procedural); sound: src/audio.js (synthesized). Launch/build instructions and controls: README.md.

## Follow-up — mischief and beginner onboarding (15 October 2026)

Implemented three optional pounce targets, a pot → bell → pigeon chain, a 1.65-second dotted flight-lane warning, once-only rewards, actual collision/evasion, and data-driven crime reports. Optional objects do not harm the player on normal contact. Their random-free placement preserves daily seeds and existing corridors; targets are suppressed during the Giant Vacuum encounter.

Added a four-step, replayable walkthrough: three flaps, three fish, a pounce into a pot, then pigeon evasion. Safe boundary bounces, guided fish/target height and a waiting practice pot reduce beginner frustration. Completion persists, skip is immediate, pause/resume/restart preserve intended state, and practice cannot bank rewards. Existing saves migrate with a false walkthroughComplete default; all existing progression remains intact.

39 automated tests pass. New checks cover optional contact, one-hit rewards, delayed bell, pigeon warning/collision/evasion, pause/reset cleanup, bounded generation, save compatibility, practice reward isolation and an entire walkthrough completed using real simulation inputs in under 30 simulated seconds. Existing two-minute route tests now load the mischief module too.

Browser validation: real X-key pot hit awarded 12 points plus two fish; a delayed bell produced the pigeon lane warning; the flight result displayed one pot smashed and one bell rung with a 12-point mischief subtotal. Beginner lesson controls, three-flap progression, three-fish progression, safe bounces, timing cues, pause and skip were exercised in the packaged browser build. Phone layout checked at 390×844; all lesson controls are visible. Captured browser error logs were empty. Final graduation is covered by the complete simulation test; this pass did not finish the entire walkthrough interactively in the browser. Physical touch hardware remains unverified.

Build/package updated to 0.2.0. Existing browser best score, fish bank and settings were retained during the checks. The first menu recommends Learn to fly until completion; Play now can skip practice, and Walkthrough remains available for replay. Menu/results panels may scroll on small screens. Future perks, secret rooms and a persistent rival remain deferred; this update implements the recommended mischief loop and beginner onboarding.

## QA fixes — version 0.2.1

Resolved all three findings from the 0.2.0 QA report: missed practice pounces recharge after cooldown even with a waiting target; reduced-motion protection uses a continuously visible cat and a static ring; native inputs/sliders keep their keys and flight shortcuts are state-scoped. Added seven regression tests. All 46 tests pass. The real app was exercised in a minimal DOM harness from early failed pounce to retry, graduation, completion save and clean real-flight start. Live packaged browser checks confirmed Arrow Up adjusts volume and the cat remains visible while protected with motion off. No browser errors captured. Original motion setting and effects volume restored. Full physical-touch/cross-browser coverage remains outstanding. Details: ../qa-2026-10-15/FIX-VERIFICATION.md.




## Stage 5 — discovery and variety (2026-10-23)
Implemented gentle decorative rain, kitchen crumbs and dream fireflies behind hazards, plus Luna’s butterfly, Coco’s cloud and Pepe’s cozy box. Effects use simulation time and deterministic formulas, never course RNG; reduced motion suppresses the new ambient effects. Approved character artwork and physics are preserved.

Added optional three-star trails in Relaxed mode only, starting at obstacle ID 3 and every fourth obstacle thereafter, outside active encounters/practice/lab. Stars sit ahead of the next obstacle within its central corridor. They do not affect collision, score, fish, charge, hearts, currencies, missions or competitive rankings. This is a small secret-path prototype, not a branching world. Catching all three saves a per-cat keepsake after a completed flight. The Milestones screen includes a discovery journal; repeats do not duplicate saved keepsakes. A restarted or unfinished flight does not save a discovery.

Implementation: src/discoveries.js (optional system), src/core.js (spawn/update hooks), src/render.js (background and trail drawing), src/save.js (validated discoveries array and cross-tab union), src/app.js (journal/results), index.html (module order), tests/discoveries.cjs. No new dependencies, database schema or deployment environment variables. Rebuild dist/cat-astrophe.html before release.

Validation: 97 tests pass; npm run build succeeds. New regressions cover unchanged course generation/RNG, point-free collection for every cat, pause/expiry, mode exclusions, restart, old-save normalization, stale-tab merging, deterministic/bounded reduced-motion ambience and finite balanced canvas drawing. Browser automation remains blocked by launcher startup on an unrelated locked BitLocker D: drive. No current visual, responsive, physical-device performance or human difficulty sign-off is claimed. Review on narrow phones, landscape phones, tablets and desktop before publishing; confirm trail contrast, readable warnings, journal navigation and unobscured hazards.


## Progress collection usability follow-up — 2026-10-23
Code review found the combined eight-badge/three-keepsake list unnecessarily long on phones. Split Milestones into Badges and Keepsakes selectors with aria-pressed state; show three badges per page with disabled endpoint controls, a labeled page count, and a sticky Back action. Preserve 44px button targets, shared colors and typography, and scrolling as a fallback for small viewports or larger text. No gameplay/save format changes.

Changed src/app.js, style.css, tests/qa-regressions.cjs and rebuilt dist/cat-astrophe.html. The application-flow test now loads discoveries and the minimal DOM correctly replaces children when innerHTML changes; pagination, switching collections and returning without spending currency are covered. Full suite: 98 pass. Build succeeds. Browser startup was retried and still fails on the unrelated BitLocker-locked D: drive; visual/device checks remain pending. Do not describe static review as responsive browser sign-off. No commit, push or deployment performed.


## Recognizable power-up artwork — 2026-10-26
Player feedback: collectibles looked like dots; the magnet glyph did not resemble a magnet. Replaced platform-dependent symbol glyphs inside identical circles with code-drawn objects: U-shaped horseshoe magnet with contrasting pole tips, open cardboard shield box, leafy catnip, wound yarn with loose thread, pink heart, and ribboned gift for surprise fish. Pale halos and compact cream nameplates provide contrast. Names now use MAGNET, SHIELD, CATNIP, YARN, HEART, SURPRISE instead of ambiguous internal IDs. Fish art is retained. Collection positions/radii, spawning, scoring and effects remain unchanged; only visual bobbing is frozen when reduced motion is enabled.

Added shared POWERUPS names/hints and friendly effect descriptions in How to play. Reusable tools/powerup-preview.html renders the actual item renderer at normal drawing size for future visual checks. This is a development review page, not a new game flow. Source: src/render.js, src/app.js; tests/powerup-art.cjs; rebuilt dist/cat-astrophe.html.

Validation: 105 tests pass; build succeeds. Browser visual review of all six icons at normal game drawing size completed through the local review page; distinct silhouette, nameplate and hint verified. Screenshot: C:/Users/fazal/Documents/Codex/2026-10-14/pla/outputs/powerup-icons.png. Tests cover six distinct geometry traces, friendly labels, finite coordinates, balanced drawing state, reduced-motion stability and original fish rendering. This does not constitute full moving-gameplay/physical-phone QA. No dependencies, database changes, commit, push or deployment.


## Collectible overlap and missed-pickup fix — 2026-10-26
Reported visible overlaps without collection. Confirmed causes: a 27px center-distance test was much smaller than the central rendered cat plus collectible artwork, and magnet collection used distance computed before attraction. Endpoint-only checks also omitted between-step contact.

Added CatCore.pickupTouches: swept relative movement against a body-sized ellipse centered at cat x+2/y-3 (30x34 central-body radii, expanded by collectible radius: fish/gold 12, power-ups 18, trail stars 8). Cosmetic labels, tails and halo extents are not pickup targets. Item checks occur after magnet movement, use old/new positions and remain once-only. Relaxed stars use the same helper. Hazard radius remains 15; obstacle collision rules unchanged. Rescue repositioning resets the pickup sweep origin to avoid collecting along a teleport. Visible pickup reach is intentionally more forgiving; existing score values/spawn RNG remain unchanged, but players may collect more reliably than previous builds.

Files: src/core.js, src/discoveries.js, tests/pickups.cjs, tests/abilities.cjs and rebuilt dist/cat-astrophe.html. Expiry test now disables spawning so accidental re-collection cannot refill a buff during its timer assertion. Validation: 112 tests pass; build succeeds. Coverage includes all item kinds/all cats, body edge and head overlaps, far-away rejection, horizontal/vertical sweeps, magnet pull from outside reach, paused/over exclusions, star rewards, once-only credit and rescue teleport exclusion. No visual browser/playthrough sign-off claimed for this collision fix. No database, dependency, commit, push or deploy changes.
