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
