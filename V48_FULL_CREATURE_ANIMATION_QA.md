# EverHatch v48 — Whole-Roster Animation Seam Polish

## Goal

The user approved the v47 Wyvern ("Asher") neck, ear, and foot fixes after live iPhone testing. v48 applies anatomy-specific joint continuity work to the other **four** families without overwriting the approved Wyvern head/neck/foot geometry.

## Production changes in `index.html`

The new `anatomySeams` profile registry provides separate settings for **Griffin, Hippogriff, Phoenix, Pegasus**:

- A sloping, feathered **head-to-neck contour** rather than the old straight cut;
- A source-color-matched stationary **throat collar** shaped for each family;
- A small **posterior head/crest/mane backing** under the moving head, with a taper and neutral-pose alpha restoration;
- Family-specific **wing and tail root socket sizes**, restricted to genuinely moving part pixels to avoid static duplicate art;
- Earlier fading-in of the throat and posterior-head supports as the head rotates.

These are not the same geometry copied across four creatures. The Griffin and Hippogriff use different neck-feather profiles; Phoenix uses a flame-plumage contour; Pegasus uses a longer mane/neck taper.

The existing `wyvernNeck` branch, v47 rear-ear edge scan, lower throat blending, head/wing/tail pivots, and v45 foot-anchoring logic are retained. The game still uses the same animation director and keeps the original artwork fallback. Normal save key `aerie_save_v1`, Classic rollback, reduced-motion behavior, and equipped-creature rendering are unchanged.

The dynamic scene code can expose `EVERHATCH_ANIMATOR.anatomicalProfiles()` for profile inspection. `boneCounters.seamFamilies` records successful per-species model preparations.

## Checks completed

1. **JavaScript syntax:** all inline scripts parse successfully after v48 edits.
2. **Catalog:** GitHub rig and facial metadata have 150 entries each (all five species × five stages × six coats).
3. **Deterministic pixel-ownership test:** 20 test cases across all five families and four illustrated stages (coat 0 geometry). Each preserved the original alpha at rest, kept the paws in the stationary body, and retained nonempty head, wing and tail parts. Four non-Wyvern families all generated nonzero lower-neck and rear-head blending.
4. **Approved Wyvern regression:** v48 and the exact v47 source generated identical core, moving head, wing, and tail pixel-ownership arrays in the stage-2 synthetic fixture; their planted-foot, neck-merge, and rear-head blend counts also matched.
5. **Backing layer generation test:** the production sprite-layer generation block executed on 20 synthetic stage fixtures. Each produced a nonempty posterior-ear/mane/crest layer, a throat support and a wing/tail root support.
6. **Actual repository asset spot-check:** eight early-stage assets/masks (four stage-1 coat-0 growth illustrations and corresponding head masks) and eight late-stage rare-coat assets/masks (four stage-4 coat-5 growth illustrations and corresponding head masks) were found in GitHub.

## Limits and acceptance criteria

The synthetic tests verify ownership and structural properties; **they do not guarantee the appearance of every real WebP edge or its appearance on an actual phone**. The 150-entry catalog count is not the same as validating 150 rendered animations. I did not visually confirm every creature or coat combination on an iPhone or independently confirm GitHub Pages cache propagation.

Normal test:
https://drakedragon.github.io/EverHatch/?v=48&motion=live

Optional Motion Lab:
https://drakedragon.github.io/EverHatch/?v=48&motion=live&motionlab=1

Classic rollback:
https://drakedragon.github.io/EverHatch/?v=48&motion=classic

### Manual QA checklist

- For each of **Griffin, Hippogriff, Phoenix, Pegasus**, watch a complete idle cycle, then feed, pet, cuddle, and play. The head must remain connected to the throat and the upper rear head/crest/mane must not leave a floating gap.
- Test head, wing, and tail separately in Motion Lab; check that none pulls a foot, wing tip, or facial feature away from its parent body part.
- Include early and late illustrated stages and at least one coat-5 variation. Confirm the generated supports match the current coat color.
- Verify face blinking, jaw motion, equipped gear positioning, and tab/sleep/wake transitions stay stable.
- Re-open the user's **existing Wyvern/Asher** without resetting its save; confirm the known-good foot, lower neck, and behind-ear seams remain fixed.
- In-game QA should identify the current rendering path. If a rig cannot be prepared safely, the original illustrated creature should remain visible.

**Status:** v48 code committed and programmatic checks passed. Real-device visual approval for the four additional species is pending. Preserve the v47 Wyvern geometry in subsequent passes until the user reports otherwise.
