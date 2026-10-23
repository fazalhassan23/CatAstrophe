# Improvement checklist

Updated 2026-10-23. Work proceeds one stage at a time; review each stage before starting the next.

## 1. Cat personalities
- [x] Luna: subtle ear twitches and small preview-only hops.
- [x] Coco: slow blinks, gentle breathing and relaxed tail sway.
- [x] Pepe: alert ear movements, brief tail flicks; retain his determined expression.
- [x] Preserve approved markings, silhouettes, costumes and stable IDs.
- [x] Use shared profiles for portraits, roster and flight; no flight-path changes.
- [x] Honor reduced motion and add bounded/finite/static rendering regressions.
- [ ] Final visual review with owner.
- [ ] Physical mobile performance check (no new assets, timers or listeners were added).

## 2. Cozy home screen
- [x] Three cats together in a welcoming room (procedural window, plant, shelf and rug).
- [x] Semantic cat-selection buttons, persistent owned selection, lock costs; Play, stories, settings and scores retained.
- [ ] Phone/tablet/landscape visual review (browser launcher currently unavailable).

## 3. Beginner difficulty
- [ ] Assess opening gaps and warning time.
- [ ] Gradual challenge and optional relaxed mode.
- [ ] Separate relaxed scores from competitive boards.

## 4. Personal milestones
- [ ] Achievable goals and brief encouraging celebrations.
- [ ] Persist progress and prevent duplicate rewards.

## 5. Discovery and variety
- [ ] Weather/scenery variations and cat-specific surprises.
- [ ] Prototype secret paths; preserve readable hazards and simple controls.

## Every stage
- [x] Stage 1 regressions and full suite/build: 72 tests passed.
- [ ] UI review and mobile layout checks appropriate to the change.
- [ ] Changelog and Git handoff updated.
- [ ] Owner reviews before the next stage.

### Stage 1 verification limit
Browser review could not run: the browser automation launcher failed while enumerating an unrelated BitLocker-locked D: drive. No browser/UI review or hardware performance result is claimed. The implementation is ready for visual review; do not start Stage 2 until the owner reviews it.

### Stage 2 verification — 2026-10-23
75 tests pass and the standalone build succeeds. New tests cover safe locked-cat navigation without purchases, persistent owned selection and the chosen cat in the next flight, and all three cats/static reduced-motion room rendering. Responsive rules were added for short and landscape layouts, but no new browser/layout/performance result is claimed: both browser inspection attempts failed at launcher/kernel startup. Owner authorized proceeding to Stage 2; Stage 3 has not started.
