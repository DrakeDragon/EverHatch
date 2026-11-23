# EverHatch v45 — Joint-Integrity Repair

## Actual player observation

The owner's current long-running Wyvern on iPhone has functioning individual body-part movement, but the head visibly pulls away from the neck, and a hind/rear foot appears to separate from the leg during idle and interactions. The game remains stable, with no disappearing creature or reported save loss.

## Source evidence

Inspection of `assets/rig/wyvern-2-0-{head,wing,tail,hind,fore,base}.webp` showed a Wyvern fragment plus horizontal stretched color bands extending well outside the intended part. Earlier versions selected moving pixels almost entirely from mask alpha and used up to ~24°, 29°, and 34° of rotation. Those conditions permit accidentally assigned leg/foot pixels to move with a tail/wing, while a large head rotation pulls the cutout away from the torso.

## Implemented v45 code fixes

1. **Source-color mask verification.** A moving pixel now requires both nontransparent art and tolerably matching RGB at the original image coordinate. This rejects WebP color smears rather than blindly trusting mask alpha. When a required mask has too little accepted coverage, the original intact artwork remains visible instead.
2. **Plant the feet and legs.** Pixels in the foot-support band, and source-backed hind/fore leg pixels, are owned by the nonrotating core. This prevents tail/wing cutouts from carrying planted feet.
3. **Anchor the lower neck.** The lower neck belongs to the stationary torso, not the rotating head cutout. The upper head still moves.
4. **Joint-safe angle limits.** Articulated raster sprites are capped at ±7° head, ±14° wing, and ±10° tail. The equipped SVG drawing is capped at ±10° head, ±17° wing, and ±13° tail. This is conservative: avoid visual tearing over dramatic movement.
5. **Correct equipped SVG pivot points.** The procedural head hinge was relocated toward the lower neck (216,144), and the tail hinge moved to the tail's actual root (66,190). The body, gear, leg and paw continue as before.
6. **Improve joint underlays.** Source-colored head and wing/tail hinge overlays now appear earlier as the joint bends, to conceal small visual gaps.
7. **Keep diagnostics.** Motion Lab QA shows rejected mask pixels and planted-body pixels, in addition to current rendering mode.
8. **No save schema change.** The existing `aerie_save_v1` progress key and Settings → Living/Classic choice remain unchanged.

## Checks performed

- Full inline JavaScript syntax check passed.
- Metadata coverage: 150/150 stage/coat/species rig definitions and 150/150 face definitions present.
- Executed the production pixel-ownership loop on synthetic masks: a planted rear foot, leg and lower neck remain in the core while a valid tail tip and upper head retain independent motion; all pixels have exactly one owner.
- Executed the production color-match filter on synthetic trustworthy and corrupted mask pixels: accepted valid pixels, rejected eight injected bright-color spill pixels.
- Verified original artwork fallback, Classic rollback, and the unchanged game save key.

**Not yet verified:** Actual 150 raster outputs visually decoded on iPhone, the owner's precise current Wyvern/coat/stage art, live GitHub Pages CDN deployment, or real device appearance. Structural and synthetic tests are not a substitute for real phone QA.

## Phone acceptance test

Open https://drakedragon.github.io/EverHatch/?v=45&motion=live to continue the same saved Wyvern. Watch an idle cycle first; the rear foot should stay planted without separating from the leg, and the head should remain attached to the neck. Then pet, feed and play, and confirm the head, wings and tail move individually without opening visible gaps.

For QA details, use https://drakedragon.github.io/EverHatch/?v=45&motion=live&motionlab=1 and tap **QA**. Note the **Rendering** line: illustrated separate joints, equipped SVG separate joints, or original-art fallback. The panel reports the number of rejected mask pixels and planted body pixels.

If the updated joints still visually tear or the QA indicates fallback, use Settings → Creature motion → Classic or https://drakedragon.github.io/EverHatch/?v=45&motion=classic and provide a screenshot or short screen recording of the failing pose for more precise adjustments.

## Next acceptance gate

Do not increase animation angles again until the owner confirms the Wyvern's head/neck and rear paw remain visually continuous. After Wyvern acceptance, repeat the same visual tests on Griffin, Hippogriff, Phoenix and Pegasus, different coats, and growth stages.
