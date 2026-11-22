# EVERHATCH: Raise Your Legend — v34
## The Living Animation Refinement (post-v33)

A carefully scoped finishing pass for motion continuity and source-art-compatible joint and mouth details. This is a complete playable update of the v33 game, **not a promise that every motion is now hand-animated AAA quality**.

### What changed
- **150 feather-soft joint-glaze textures:** source-color-derived artwork at the five articulation pivots for 5 species × 5 growth stages × 6 coats. These softly bridge cutout seams while body parts move; at rest the original painting is unchanged.
- **150 palette-matched mouth interior paintings:** small localized mouth textures, with different coloring and contours for bird beaks, the Pegasus muzzle, and the Wyvern jaw. The age- and coat-specific v33 facial cutouts remain intact.
- **Motion director timing:** body parts move with different anticipation, peak and follow-through timing rather than reaching maximum displacement together. Return-to-rest poses remain neutral.
- **Interaction recovery:** feeding now settles into a satisfied reaction; playing, cuddling, washing and drinking receive gentler facial recovery. Waking runs an articulated stretch when appropriate.
- **Current-creature preloading:** loads only the active companion's age and coat, helping the first interaction start promptly.
- **Offline facial geometry:** additional `assets/faces-v33/manifest.js` allows facial tools to read geometry without depending on a JSON fetch when opened locally.
- **`refinement-studio.html`:** side-by-side comparison of the prior choreography and v34 staged motion, with all species, ages, coats, actions and part textures available.

### Preserve these original mechanics
No new save fields. No changes to feeding costs, bonuses, bond XP, personality, growth, trick unlocks, flight collision/physics, the illustrated lore, or the core game progression. The existing `aerie_save_v1` key is retained. Settings/text size keep their existing key.

### Deployment
1. **Export your current game save code before updating.**
2. Unzip, and upload `index.html` together with the **entire** `assets/` directory to the existing GitHub Pages folder.
3. Keep the exact same GitHub Pages URL/path and browser profile so your existing local save remains associated with the same origin.
4. Optional: upload `refinement-studio.html` to try the before-and-after comparison.
5. On your phone, test *Care → View & Pet* at 200% text size, then Feed, Play, Rest/Wake and a Magic Theater trick.

### Artistic and technical limitations
- This is a cutout-rig and source-art-derived joint finishing pass, **not** custom multi-angle painted animation for all movements. Some poses and seams will still need artist redrawing to reach AAA animation quality.
- Equipped creatures continue to use the earlier renderer so visible accessories are not dropped.
- Full multi-stage flight sprites remain a separate future production task.
- The test suite uses headless Chromium and simulated local storage, not physical iOS devices or live GitHub Pages hosting. Verify saves and performance on real devices.

### Included production tools
- `refinement-studio.html`: v34 before/after motion comparison
- `articulation-studio.html`, `facial-studio.html`, `expression-studio.html` and other previous studios
- `V34_TEST_REPORT.md`, `V34_TEST_REPORT.json`, `ANIMATION_PRODUCTION_AUDIT.md`

---

# Everhatch v30 — Articulated Creature Rig Foundation

**Playable update based on v29 Living Anatomy.** This is a substantial mechanical art-production pass, not a claim that every species has finished AAA frame-by-frame animation.

## What's new

- **Griffin and Wyvern** now use separate transparent body-part cutout rigs in the Care screen and trick performances.
- For each of these two species: **five life stages × six coat palettes = 30 rigs**, so **60 rigged appearances total**.
- Each rig has **six disjoint source-art layers** (`base`, `head/neck`, `wing`, `tail`, `forelimb`, `hindlimb`) with their own anchor/pivot positions, plus an additional automatically painted joint/socket support layer.
- **360 disjoint layer images + 60 hinge-underpaint images**; age, coat and original illustration markings are preserved.
- Feeding, playing, petting, grooming, stretching, calls, flight-like trick choreography and impacts now drive the independent layer pivots instead of just translating a single character image.
- The new **`articulation-studio.html`** lets you choose a species, age, coat, action and speed, then compare the original art with the layered motion and inspect all parts.
- The other three species—Hippogriff, Phoenix, Pegasus—continue using the existing v29 localized-deformation engine. Fully illustrated equipped-creature rigs remain a future task; the original visible-equipment renderer is preserved.
- No new gameplay costs, rewards, unlock requirements, save keys or permanent settings.

## Deployment

1. Export your current in-game save code as a precaution.
2. Extract this ZIP and upload **`index.html` plus the entire `assets/` directory** to the **same GitHub Pages site**.
3. Keep the original path and browser profile to retain the same origin for your existing local saves.
4. `articulation-studio.html` is an optional inspection tool; it is not required to play the game.
5. For large text and accessible petting, use the in-game **View & Pet** mode. Its previous settings remain intact.

## Quality and limitations

This is **independently pivoted 2D cutout animation**, with source-pixel-exact rest reconstruction—not hand-authored multi-angle anatomy or skeletal painting. Joints may still show seams when parts move, despite the carefully prepared overlap/underpaint. Some nuanced jaw, feather and hoof movement still needs separately painted animation layers. Full physical-device and GitHub Pages tests remain outstanding.

See `V30_TEST_REPORT.md` and `V30_RIG_PIXEL_VALIDATION.json` for verified coverage and test results.

---

# EVERHATCH: Raise Your Legend — v29 (Living Anatomy Motion)

This is a **playable, in-progress anatomical motion build**, not a claim that full AAA frame-by-frame animation is complete. It preserves the original game and its local save format.

## New in v29 — Living Anatomy Motion

- Illustrated art bends in localized motion zones around the head/neck, wings, chest, front/rear legs and tail during care and trick performances.
- All **5 species × 5 life stages × 6 coats** use the matching art in the new animation layer; the 600 prior motion poses remain included.
- More expressive feeding, drinking, petting, cuddling, grooming, playing, stretching and calling movements.
- Careful rest/wake transitions layered over existing illustrated sleeping art.
- The existing trick choreography and magical effects continue, now with localized body deformation when the illustrated renderer is available.
- Added **`anatomy-studio.html`**: a standalone side-by-side original/animated art viewer with action, species, age, coat and playback speed selectors.
- Corrected a previously introduced JavaScript problem in the bond-feedback layer.
- Mobile-friendly ~30 FPS cap and reduced-motion support; no changes to the persistent save structure.
- Important: these are **deformations of existing art**, not newly painted 2D limb sequences or a segmented skeletal rig. Equipment retains the original SVG renderer.

See `V29_TEST_REPORT.md` for exact checks and limitations.


## Install

Upload **both** `index.html` and the entire `assets/` directory to the same GitHub Pages address you already use. Keep the same domain and path so browser saves retain their original local-storage location. Export a save code as a backup before replacing your deployed game.

Open `anatomy-studio.html` to compare original and animated anatomy. Open `animation-studio.html` to view the previous isolated 600-pose collection. This extra page is a production-quality inspector and doesn't affect game saves. If sharing the production studio online, upload it alongside `index.html` and `assets/`.

## New in v24

- 600 coat-and-stage-specific pose images, keyed by 5 species × 5 growth stages × 6 coat variations × 4 key poses.
- Newly illustrated Wyvern Hatchling and Fledgling pose atlases, cleaned for edge spill and recolored for all six coats.
- The other species and older forms retain their existing painterly illustration style, with localized mesh-warp pose studies instead of adult sprite substitution.
- Animated pose sequences wired into everyday care and trick displays.
- Preserves the previous 23 trick definitions, signature effects, five species, hatching, flight gameplay, nutrition, all new v21 food and care features, 20 regions, Bestiary and adjustable text sizing.
- A quality-audit document clearly tracks remaining hand-animation work.

## Limitations

This is not the final hand-drawn animation library. Most older-stage pose studies come from artistically warped existing images; many trick effects and flight frames still need proper full-body, species-specific animation. Equipped creatures retain the original renderer. See `ANIMATION_PRODUCTION_AUDIT.md`.

## Verification

- JavaScript syntax check passed.
- 600/600 motion WebP assets exist and contain visible pixels.
- Browser-tested new age-and-coat-specific care poses (feeding, playing) and a Legend-stage Wyvern trick preview using embedded assets.
- Standalone Animation Production Studio loaded images and ran without JavaScript errors in a 390-pixel browser viewport.
- Live GitHub Pages and physical phone acceptance testing remains outstanding.


Version 25: Species-pass animation continuity update. All care and trick animations now use species-specific and stage-aware motion sequences across all 150 appearance variations, with an added animation-matrix reference page.


Version 26: Premium species animation pass I. Griffin and wyvern care/trick scenes now use enhanced sequencing and premium overlay FX across all stages and coats.


## v27 — Premium Species Pass II (verified scope)
- Corrected a JavaScript scope bug in the previous premium pass that could prevent v26 from starting.
- Added a curated, painted young-Hippogriff key-pose collection: 7 approved anatomical source poses, recolored for six existing coat slots (42 assets). Rejected cropped art is not used. Older Hippogriff stages retain the existing correct age artwork.
- Added dynamic species-specific care and signature-trick choreography/effects to Hippogriff, Phoenix and Pegasus across all life stages and coat slots. These effects are procedural, not hand-drawn limb animation.
- Kept the 600-pose continuity matrix, five stages/six coats, all prior food/care systems, saves, accessibility and lore.
- This is an animation production build, not a final AAA-animated release; see the refreshed audit.


Version 28: Bond and rest polish pass. Added focus-mode pet feedback, species-specific bond flavor text, and sleep/wake visual overlays so companions feel more alive during quiet care moments.


# v31 — All Five Articulated Species

- Added 90 additional cutout rigs: Hippogriff, Phoenix and Pegasus, five life stages and six coat colors each.
- Full library now covers 150 variants with 6 matching art layers and 1 joint-support socket texture each.
- Runtime supports five species with species-specific joint-motion parameters.
- Articulation Studio v31 lets you inspect and play every species.
- No save keys, progression, creature statistics, unlocks or economy changes.
- Equipped-creature artwork still uses the original renderer so accessories remain visible.
- The rigs are source-art cutouts, not hand-painted multi-angle animation. Artist-grade joint overlap cleanup and physical-device review are still required.

## v32 — Living Expressions & Personality

- 600 coat- and age-matched, non-destructive expression overlays (blink, affectionate, curious, guarded), all five species, all five growth stages, six coats.
- Facial details follow the articulated head pivot in the v31 cutout renderer; idle companions also blink on their illustrated portrait.
- Care interactions trigger appropriate short-lived expressions without altering save-data or gameplay rewards.
- Care screen includes a read-only mood interpretation from existing hunger, joy, rest, and personality trait values.
- Includes `expression-studio.html` for side-by-side original/expression QA of all 150 appearances.
- Respects OS reduced-motion setting. Equipped companions retain their original renderer without facial overlays, pending equipment-rig production.
- Facial overlays are a production improvement, not full hand-authored AAA mouth/eyelid/pupil tracking rigs.


## v33 — Living Faces & Expressions

Adds 600 small age-and-coat-matched eye, iris, lower-jaw and crest/ear textures, plus an animated facial-runtime. Creature interactions now drive subtle pupil tracking, mouth/beak openings, and ear/crest gestures; the v32 blink art remains layered above. The feature is visual-only and has no save-schema changes. The new `facial-studio.html` provides a focused QA preview. These are source-derived cutouts and programmed articulation, not bespoke hand-painted multi-angle expressions.
