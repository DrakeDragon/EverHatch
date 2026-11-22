# Everhatch v30 — Test Report

## Passed

- Main inline JavaScript, rig-runtime JS, and Articulation Studio JS syntax checks (Node.js v22).
- All 60 Griffin/Wyvern age×coat model sets load in Chromium: six transparent part layers plus source image (and hinge artwork).
- All 60 source pictures reconstructed from six nonoverlapping part layers at **0.0 mean visible-pixel error** in an independent Pillow pixel-diff test.
- No blank cutout layers after the body-core segmentation correction.
- Fresh-game boot, selected creature creation and hatching in headless Chromium.
- Real feeding increased hunger from approximately 32% to 47%, activated the v30 cutout canvas, and did not start the previous v29 mesh for a Griffin.
- Griffin Stage 5 rare coat, Wyvern Stage 1 alternate coat, Wyvern Stage 5 rare coat triggered the correct rig artwork in a running game.
- Phoenix continued to use the existing v29 anatomical mesh renderer.
- Wyvern Ember Puff preview started the v30 cutout rig alongside the retained cinematic effects.
- At a 320px-wide simulated phone, 200% text size and View & Pet were accessible with no horizontal overflow.
- Articulation Studio loaded Griffin and rare-coat Ascendant Wyvern models and displayed both original and moving-layer previews with no page JavaScript errors.
- No missing requested assets and no browser JavaScript errors in the above tests.

## Not verified

- Physical-device iPhone FPS, thermal or long-session memory behavior.
- Real GitHub Pages deployment.
- All possible 23 tricks through full mastery progression, every accessory combination and all save-migration paths.
- Artist-level quality of every frame. Source-derived masks still need human-guided occlusion cleanup to eliminate occasional seams.

## Rendering limitations

v30 creates real transparent 2D cutout *parts* from previously illustrated source poses. It is a major step beyond moving a single image, but it is not a production-complete skeletal-rig library or a substitute for new hand-painted 3D-looking motion frames.
