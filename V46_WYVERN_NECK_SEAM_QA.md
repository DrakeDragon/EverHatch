# EverHatch v46 — Screenshot-Grounded Wyvern Neck Seam Repair

## User-reported issue
On an iPhone, the player's long-running pale/silver Wyvern (Asher) displayed a straight, horizontal-looking separation between the animated head/upper neck and the torso during idle and care animations. The rear paw/foot separation reported earlier was resolved in v45 and must remain fixed.

## Screenshot evidence
The screenshot visibly shows the moving head/neck section ending in an unusually straight edge across the front of the lower neck/chest, with a narrow gap exposing background. This is consistent with the hard horizontal head ownership boundary in v45: `y > neckPivotY + 12 * scaleY`. The screenshot does not establish the exact saved stage/coat ID; do not claim that it does.

## Changes in v46
1. **Wyvern-only curved neck ownership contour.** Removed the single straight crop line; use a gently sloping contour from shoulder toward throat. Other creature species' masks remain unchanged.
2. **Tapered transition instead of hard cut.** Over the last ~12 mapped source-image pixels of Wyvern head movement, distribute matching source pixels between moving head and stationary body. Use alpha-over mathematics to preserve the original neutral illustration opacity: `coreA = (sourceA - headA) * 255 / (255 - headA)` (with the full-opacity denominator case handled).
3. **Body-anchored neck support.** The Wyvern's existing source-colored `bridgeHead` is expanded and offset toward the throat, limited to nearby pixels assigned to the moving head to avoid adding an entire phantom head.
4. **Earlier seam coverage.** The throat support fades in promptly during the smallest head movements, including idle.
5. **Do not touch rear-foot anchoring.** Existing foot/body ownership, leg masks, gear rendering, head/wing/tail motion, and save schema remain intact.
6. **QA data.** `neckBlendPixels` is available in Motion Lab diagnostics.

## Automated evidence
- Full inline JavaScript syntax checked.
- Synthetic execution of the real v46 pixel-ownership loop: 377 source pixels received neck blending in the test fixture; neutral-pose alpha reconstructed exactly; the hind foot remained planted, the head still moved, and the tail tip stayed independently animated.
- Existing original-art fallback, Classic mode, and local save key `aerie_save_v1` were preserved.

## Required phone confirmation
Open https://drakedragon.github.io/EverHatch/?v=46&motion=live, continue the **same saved Wyvern**, observe idle, then pet, feed, and play. Confirm the straight neck cut and translucent gap are gone and the rear foot remains attached. No re-hatching or save reset is needed.

If a seam remains, use https://drakedragon.github.io/EverHatch/?v=46&motion=live&motionlab=1 and open **QA** to read rendering mode and neck-overlap count. A short screenshot or recording of the exact stage during movement will narrow the remaining issue.

If needed, Settings → Creature motion → Classic or https://drakedragon.github.io/EverHatch/?v=46&motion=classic restores the safe unarticulated movement without deleting progress.

**Limit:** No live iPhone visual acceptance test has been performed here. Code checks and synthetic tests validate logic but cannot guarantee the seam is invisible in the user's device rendering.
