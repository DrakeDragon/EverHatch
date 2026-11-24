# EverHatch v47 — Asher's Behind-Ear Seam

## User-confirmed progress and new screenshot

The user confirmed that v45 fixed Asher's rear foot, and v46 fixed the lower neck/chest separation. An iPhone screenshot in the conversation then showed a smaller remaining slit along the **upper rear head edge behind the ears/horns** during idle, cuddling, feeding, and other care actions.

The observed opening is visually distinct from the lower throat seam: it sits at the nearly vertical posterior edge of the moving head illustration. This report is about Asher's existing saved Wyvern. Do not reset the save.

## Implemented v47 repair (Wyvern-specific)

- Keep the curved v46 lower-neck mask, v45 planted-foot ownership, existing motion angles, equipment support, reduced-motion setting, and original image fallback unchanged.
- After source-pixel ownership is determined, locate the **leftmost moving-head pixel in each row** of the upper rear-head zone (from approximately the top of the artwork plus 17 source px, to 13 source px above the annotated head pivot). This follows the posterior mask shape rather than using a fixed vertical line.
- In an approximately 11-source-pixel strip along that edge, taper the head opacity and transfer complementary alpha into the nonrotating body. Composite alpha is preserved at neutral pose using the alpha-over equation, so the result reconstructs the original art.
- Build a separate, small **bridgeEar** source-matched backing from at most 31 source pixels across the existing moving head edge. It is drawn stationary under the moving head, above the torso, and fades in as the head rotates. It contains neither a second face nor the full head.
- Only construct this layer for a Wyvern; other four species keep their existing model behavior.
- Pre-decode the extra generated image before hiding the original safe source. New Motion Lab counters: **ear blend** and **ear support**.

## Tests performed

1. All inline JavaScript parses.
2. Source-code structural safeguards confirmed that the foot and lower neck corrections remain present, the Classic mode remains available, and the saved creature key `aerie_save_v1` is unchanged.
3. Executed the v47 pixel-ownership production loop with a deterministic synthetic illustration. With Wyvern settings, 396 pixels received tapered upper-ear overlap; the head remained movable, the rear foot remained body-owned, and neutral-pose alpha recomposed exactly. With Griffin settings, no new upper-ear blending occurred.
4. Verified `bridgeEar` is optional, is decoded before binding, starts at zero opacity, and receives a head-angle-driven opacity value during movement.

**Still unverified:** The visual appearance on the user's exact iPhone, coat, stage and animation frame; GitHub Pages deployment timing. A successful code commit is not proof the rendered seam has vanished.

## Phone test

- Normal game, preserved Wyvern: https://drakedragon.github.io/EverHatch/?v=47&motion=live
- Optional isolated head/QA controls: https://drakedragon.github.io/EverHatch/?v=47&motion=live&motionlab=1
- Fallback: Settings → Creature motion → Classic, or https://drakedragon.github.io/EverHatch/?v=47&motion=classic

Test a short idle cycle, then cuddle and feed. Specifically watch behind the ears and at the upper frill root. Confirm lower neck and rear foot remain fixed. If a slit persists, capture a screenshot at peak rotation; continue refining only the Wyvern posterior head region, without increasing global head angle.
