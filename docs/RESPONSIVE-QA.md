# Responsive layout checks

Checked 2026-10-22 using desktop browser viewport emulation. Dimensions below are CSS pixels representing common device classes, not certification of specific hardware/browser versions.

| Viewport | Representative class | Returning-player home menu | Home/collection/story horizontal overflow |
| --- | --- | --- | --- |
| 320×568 | Small/older phone | Fits without internal scroll | None |
| 360×800 | Compact Android phone | Fits | None |
| 375×667 | Short phone | Fits | None |
| 390×844 | Modern phone | Fits | None |
| 412×915 | Large Android phone | Fits | None |
| 768×1024 | Portrait tablet | Fits | None |
| 844×390 | Phone landscape | Fits in two-column menu | None |
| 1280×800 | Short desktop viewport | Fits | None |

## Adaptations

- Through 1050px, hide desktop sidebars and use one centered game/panel column.
- Menu/reading screens use available viewport height; active gameplay preserves the portrait canvas proportions.
- Short phones use a shorter masthead, reduced decorative space and compact margins. Smallest menu uses smaller padding rather than clipping instructions.
- Landscape phones use a two-column home menu. Collection/story panels remain vertically scrollable when content is longer than the screen.
- Text inputs use 16px font sizing to reduce automatic input zoom on mobile browsers. Important touch buttons have a 44px minimum target; header padding accounts for horizontal safe areas.
- Panels allow vertical touch panning, wrap text, and keep horizontal content within the screen. Full stories and expanded boards are intentionally scrollable.

## Validation limits

The full automated suite passes 68 tests. Browser measurements covered home, collection and Luna's story at all eight sizes. Returning-player home panel scrollHeight equals clientHeight at each size. The additional first-launch Skip Practice button was not separately measured in this browser pass; very short/zoomed views retain scrolling as a fallback.

Collection scrolls on 320×568, 375×667 and landscape; stories scroll on several sizes. No horizontal page overflow was measured in those flows. Native keyboards, notches, browser chrome changes, actual touch input and real iOS/Android devices still need human testing. A gameplay/report browser recheck was interrupted by automatic focus/stall pausing in automation; existing simulation and report tests passed, but this pass does not claim a completed interactive report check at every size.

Do not remove scrolling globally or hide overflow to force a fit: that can make stories, keyboard-focused fields and zoomed text unreachable. Keep text readable and allow long content to scroll vertically.


## Stage 5 — discovery and variety (2026-10-23)
Implemented gentle decorative rain, kitchen crumbs and dream fireflies behind hazards, plus Luna’s butterfly, Coco’s cloud and Pepe’s cozy box. Effects use simulation time and deterministic formulas, never course RNG; reduced motion suppresses the new ambient effects. Approved character artwork and physics are preserved.

Added optional three-star trails in Relaxed mode only, starting at obstacle ID 3 and every fourth obstacle thereafter, outside active encounters/practice/lab. Stars sit ahead of the next obstacle within its central corridor. They do not affect collision, score, fish, charge, hearts, currencies, missions or competitive rankings. This is a small secret-path prototype, not a branching world. Catching all three saves a per-cat keepsake after a completed flight. The Milestones screen includes a discovery journal; repeats do not duplicate saved keepsakes. A restarted or unfinished flight does not save a discovery.

Implementation: src/discoveries.js (optional system), src/core.js (spawn/update hooks), src/render.js (background and trail drawing), src/save.js (validated discoveries array and cross-tab union), src/app.js (journal/results), index.html (module order), tests/discoveries.cjs. No new dependencies, database schema or deployment environment variables. Rebuild dist/cat-astrophe.html before release.

Validation: 97 tests pass; npm run build succeeds. New regressions cover unchanged course generation/RNG, point-free collection for every cat, pause/expiry, mode exclusions, restart, old-save normalization, stale-tab merging, deterministic/bounded reduced-motion ambience and finite balanced canvas drawing. Browser automation remains blocked by launcher startup on an unrelated locked BitLocker D: drive. No current visual, responsive, physical-device performance or human difficulty sign-off is claimed. Review on narrow phones, landscape phones, tablets and desktop before publishing; confirm trail contrast, readable warnings, journal navigation and unobscured hazards.


## Progress collection usability follow-up — 2026-10-23
Code review found the combined eight-badge/three-keepsake list unnecessarily long on phones. Split Milestones into Badges and Keepsakes selectors with aria-pressed state; show three badges per page with disabled endpoint controls, a labeled page count, and a sticky Back action. Preserve 44px button targets, shared colors and typography, and scrolling as a fallback for small viewports or larger text. No gameplay/save format changes.

Changed src/app.js, style.css, tests/qa-regressions.cjs and rebuilt dist/cat-astrophe.html. The application-flow test now loads discoveries and the minimal DOM correctly replaces children when innerHTML changes; pagination, switching collections and returning without spending currency are covered. Full suite: 98 pass. Build succeeds. Browser startup was retried and still fails on the unrelated BitLocker-locked D: drive; visual/device checks remain pending. Do not describe static review as responsive browser sign-off. No commit, push or deployment performed.


### Visual review retry — 2026-10-23
Browser-control kernel reset and startup retry failed on unrelated locked BitLocker D: drive; native computer-use runtime also failed. Existing Chrome headless fallback attempted local server navigation, portable file navigation and direct document fixture; navigation aborted and fixture initialization did not yield a reliable game render. No viewport screenshots or responsive pass are claimed. Prior code-level validation remains 98 tests passing and build successful; visual/physical-device review is still pending.


## Live responsive review resumed — 2026-10-23
Unlocking D: allowed browser kernel startup. In-app preview loaded from http://127.0.0.1:4180/ (host preview server; isolated port 4177 was unreachable). Observed phone home and milestone screenshots at 390x844; milestone first page fit with zero internal overflow, and Next displayed badge page 2 correctly.

Measured home panel overflow before repair: 320x568:243px; 390x844:61px; 412x915:0px; 844x390:115px; 768x1024:0px; 1440x900:113px. No horizontal document overflow was measured. Desktop document had 67px vertical overflow; tall-phone/tablet document had 2px. Measurements were from actual rendered DOM, not estimates.

Applied style.css fixes: smaller decorative room/header rhythm for medium-height displays, two-column compact short-phone controls, simplified landscape grid, desktop panel height and page margins adjusted to viewport. Controls retain 44px minimum button targets (How to play summary retains existing 36px compact treatment). On short displays decorative intro/artwork/dedication are hidden; cat and difficulty buttons remain. Long story/collection content and expanded help retain scroll fallback for accessibility.

Validation: 98 tests pass; standalone build succeeds. Browser transport closed after CSS edit; reload/reset retries also report Transport closed. Therefore post-fix viewport measurements, keepsake/story/results screens, live gameplay feel and physical-device performance still need review. Do not mark full visual/mobile QA complete. No push/deploy. Source changes: style.css; rebuilt dist/cat-astrophe.html. This supersedes the earlier statement that browser could not start at all.


## Desktop animation preference fix — 2026-10-23
Reported: exhaust fans and other animations appear static on desktop. Source diagnosis: renderer.motion combined saved motion=true with OS prefers-reduced-motion, but Settings showed only the saved boolean; users could see a checked control while all decorative clocks were forced to zero. Desktop user's actual device preference could not be inspected because browser transport is disconnected, so this is a confirmed code defect and likely cause, not a verified device diagnosis.

Settings now reflect effective animation state. Explicitly changing Animations (fans, wings and cat movement) saves motionOverride=true, allowing user choice to take precedence over OS reduced motion. New/old saves still follow OS preference by default; false remains off. Use device motion preference clears the override and restores automatic handling. Fan rendering now independently honors static mode even if obstacle() receives a nonzero clock. No physics or scoring changes.

Files: src/app.js, src/save.js, src/render.js, tests/fan-animation.cjs, tests/qa-regressions.cjs, rebuilt dist/cat-astrophe.html. Validation: 102 tests pass; build succeeds. Tests cover advancing fan blade rotations, static reduced-motion blades, old/malformed preference defaults, explicit setting persistence and restoring device preference through actual application handlers. Visual confirmation on desktop remains pending due browser transport failure. Reload latest build and enable Settings → Animations to opt in when the device prefers reduced motion.
