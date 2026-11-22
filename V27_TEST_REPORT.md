# Everhatch v27 — Test report

## Automated checks performed

- Extracted all inline game JavaScript and passed `node --check` with no syntax errors.
- Loaded the title screen in headless Chromium with image assets routed from the local package. No page JavaScript errors.
- Started and hatched a test companion in an isolated browser session. No page JavaScript errors.
- Iterated all 150 combinations (five species × five life stages × six coat slots), checking that the game selected the requested species, stage, coat, and existing age-and-coat motion asset path.
- Visually ran Hippogriff Rear and Cry, Phoenix Flame Dance, and Pegasus Starlit Gallop previews with their stage- and coat-specific animation files, plus distinct procedural cinematic effects. No page JavaScript errors.
- Verified the standalone Animation Production Studio loads four rendered Hippogriff action images with the Sunforged coat selected and no horizontal overflow.
- On a compact 320 px browser viewport, set text to 200% and opened the View & Pet companion view without horizontal overflow.
- Validated 600 motion assets: no missing images, no blank images, consistent 370 × 310 px dimensions.

## Limitations

- Automated Chromium testing cannot substitute for testing on an actual iPhone or other devices.
- No exhaustive multi-day progression or save migration test is included in this pass.
- Animation production remains in progress. The young Hippogriff adds seven newly illustrated original key poses (42 coat-color derivatives). Most other action poses rely on older adapted artwork, and Phoenix and Pegasus improvements in this pass are procedural effects and timing, not full anatomical redraws.
- Equipped creatures retain the original renderer to preserve visible accessories.
