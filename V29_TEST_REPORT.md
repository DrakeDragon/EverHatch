# Everhatch v29 — Living Anatomy Motion: Test Report

## Scope implemented

- Added localized 2D illustrated mesh deformation to everyday feeding, drinking, petting, cuddling, grooming, playing, stretching and calling, plus the existing magic-trick presentation path.
- Motion zones around the head/neck, wings, chest, forelegs, hindlegs and tail bend independently using the correct species, five-stage growth appearance and one of six original coats.
- Uses existing 370×310 transparent illustrated WebP source poses and pre-verified alpha bounds for each species/age. No save schema changes or new persistent fields.
- Added transitions over existing illustrated rest/sleeping poses, with progressive fade and deformation.
- Added an optional standalone side-by-side `anatomy-studio.html` for inspecting all combinations without modifying any game saves.
- Repaired a pre-existing v28 JavaScript bond-feedback issue found while integrating the new motion system.
- Rendering is time-based and throttled to approximately 30 FPS; respects `prefers-reduced-motion`.

## Automated validation completed

- `node --check` of the game's inline JavaScript: **pass**.
- JavaScript syntax of standalone Anatomy Studio: **pass**.
- Fresh-game boot, selection and hatching in headless Chromium: **pass**.
- All 150 species × stage × coat combinations correctly selected in isolated browser test; all corresponding base pose files were present: **pass**.
- Live simulated feeding increased hunger from 32 to approximately 47 and activated the new canvas: **pass**.
- Sleeping and waking toggled the original game state; rest transition canvas activated: **pass**.
- Five sampled species/age/coat care deformations rendered with 0 asset load failures: **pass**.
- A Stage 5 Wyvern Mighty Cry trick preview rendered with the anatomical motion layer: **pass**.
- Pet reaction feedback worked in focused companion view: **pass**.
- At a 320 px wide viewport, 200% font sizing plus View & Pet had no horizontal page overflow: **pass**.
- Standalone Anatomy Studio loaded and rendered selected Phoenix / rare coat / Ascendant artwork: **pass**.
- No page JavaScript errors detected in the test scenarios above.

## Important limitations / still open

- Mesh deformation is a substantial improvement over whole-image translation, **not** a fully independent 2D skeletal rig, multi-angle animation, or manually drawn animation sequence. Fine anatomy such as jaw opening, individual feather movement, every hoof articulation, and wing-fold occlusion still needs bespoke layered illustration and rigging.
- Existing equipped-companion animated SVG fallback remains in place to preserve visibly worn accessories; it does not use this mesh.
- The animations added here affect care and trick performances. Flight races still use the game's older four-frame flying artwork.
- There are no new original illustrated animation sheets in v29; the improvement is the motion engine and its connection to existing illustrations.
- Physical iPhone, GitHub Pages deployment, long-term game progression, and full save migration testing remain outstanding.
