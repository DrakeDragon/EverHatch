# Everhatch v33 — Living Faces QA

## What actually shipped
- Face-specific artwork derived from the game's original illustrations for 5 species × 5 growth stages × 6 coats (150 appearances).
- Four small transparent textures per appearance: lower jaw or beak, mane/ear/crest segment, subtle underpaint for an existing iris, and the matching original pupil region (600 WebP textures).
- In-game facial motion (lower muzzle/beak opening, subtle gaze shift, ear/crest twitch). It is anchored to the same head pivot as the existing v31 body rig.
- Care/trick reactions (chewing, delighted play, guarded looks, calls/roars, yawn) attached to existing interactions and without changing reward or save mechanics.
- A separate `facial-studio.html` to preview any supported variation.

## Automated tests performed
- All 600 WebP assets exist, decode and have visible alpha pixels; all 150 facial geometry entries exist.
- Chromium test renders all 150 models on a canvas with open-mouth, shifted-gaze and crest motion; no exceptions.
- Real Play action triggered the new facial reaction while the care rig was active.
- Real feeding consumed an available food and increased hunger, triggering chewing reaction while the care rig was active.
- Existing mood label remained visible.
- 200% font size at a simulated 320-pixel viewport: no horizontal overflow.
- View & Pet focus still opens and all four body-spot buttons are present.
- Reduced-motion emulation disables automatic facial movement.
- No missing asset requests or JavaScript page errors in tested flows.
- Node syntax check for inline JS and external facial runtime passed.

## Limitations / acceptance work
- Lower jaws, pupils and crests are source-art-derived cutouts with subtle animated offsets. This is not a complete hand-painted phoneme, lip-sync, or multi-angle facial rig.
- Equipped companions still use the legacy body renderer to show accessories correctly.
- Physical iPhone testing and live GitHub Pages save persistence remain outstanding.
- The cross-species stage test harness swapped game state directly before all companion art was fully prepared; therefore the successful 150-model canvas test confirms asset/drawing coverage, not exhaustive human-played progression at each stage.
- Earlier animations and their remaining visual limitations are unchanged outside the areas listed above.
