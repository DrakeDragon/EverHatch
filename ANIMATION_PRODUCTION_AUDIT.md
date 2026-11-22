# Everhatch — Visual Animation Production Audit

**Build:** v27 · Premium Species Pass II (incremental animation production)

This audit separates validated technical coverage from finished hand-drawn animation quality. The game is still in production; **do not advertise the complete creature animation library as AAA finished**.

## Coverage

| Axis | Values |
|---|---:|
| Raiseable species | 5: Griffin, Hippogriff, Phoenix, Pegasus, Wyvern |
| Life stages | 5 per species |
| Existing coat options | 6 per species |
| Appearance combinations | 150 |
| New organized key-pose files | 600 (4 per appearance) |
| Blank or missing generated pose files | 0 |
| New individually generated Wyvern pose files in stage 0 and stage 1 | 48 |
| New Hippogriff action poses added in v27 | 7 unique young key poses, colorized to 42 stage-and-coat files
| Existing newborn expression poses normalized into the new motion matrix | 96 |
| Older-stage painted-art mesh pose studies | 456 |

### What now happens in the playable game

- **Care** — Feed, pet, play, groom, stretch, and related interactions can call age-and-coat-specific pose sequences.
- **Tricks** — the current trick presenter requests pose frames for the current species, exact life stage, and coat, rather than always showing one mature body. The existing magic effects and signature pass are retained.
- **Rest** — original species/age/coat sleeping assets remain available.
- **Flight** — original flight sprites are retained, but the current flight sequences still reuse age-independent art for several stages; this remains a hand-animation task.
- **Equipment** — the original creature renderer remains the fallback to keep equipped accessories visible and to preserve save compatibility.
- **Accessibility** — the View & Pet interaction and existing text-scale controls remain unchanged, and motion respects reduced-motion preference.

## The quality gap (required for real AAA-style polish)

Technical coverage of a pose matrix is **not** the same thing as full animation coverage.

1. Produce anatomically coherent, original **hand-illustrated poses** for Griffin, Hippogriff, Phoenix and Pegasus in all five stages. v27 provides only seven safe newly illustrated young-Hippogriff key poses; the remaining forms still require individual redrawing. Current older-stage motion is mesh-deformed existing art rather than newly drawn limb poses.
2. Redraw the **Wyvern Juvenile, Legend and Ascendant** action frames, which had edge clipping in a generated sheet. The release uses intact age-specific source-art deformations instead of clipped outputs.
3. Add a properly aligned multi-frame action atlas for each species and stage: idle, blinking, feeding, drinking, playing, grooming, affection, locomotion, sleeping, waking, takeoff, flight, landing and species signatures. The new four-pose sequence is only an initial key-pose foundation.
4. Provide distinctive motion timing and anatomy by creature; mechanical rotations and tweened sprite positions alone are not an acceptable final trick animation.
5. Align and inspect coats/markings frame to frame, plus equipment and special legendary effects, before expanding the atlas to every variant.
6. Test on iPhone portrait and landscape at 100–200% text size, and verify long-session save restoration, memory, performance and reduced motion.

## Quality acceptance criteria

- No adult silhouette appearing as a hatchling.
- No incorrect coat or mismatched eye colors between consecutive frames.
- No clipped wings, horns, tails, or magical trails.
- Correct view and bounding boxes across all ages.
- True poses show articulated movement, not only whole-image translation or rotation.
- Frame pacing and recovery are coherent for every move and species.
- Test each species × stage × coat × action with screenshot or visual acceptance.
- Motion stopped when creature sleeps, changes form, starts expedition, switches companion, or receives equipment.
- Preserve the original save key, progress, unlocked tricks, food, pantry and preferences.

Open `animation-studio.html` from the same directory as `index.html` and `assets/` to inspect all 150 visual combinations. The studio does not mutate gameplay saves.


## v27 production pass — what changed, what did not

- **Fixed a launch-blocking JavaScript scope regression** introduced by the earlier v26 premium overlay code: the v26 wrapper now runs inside the motion engine's shared closure instead of trying to access its private functions from a separate scope.
- **Hippogriff:** generated a five-stage contact sheet, rejected panels with clipped heads/wings, and used only seven reviewed safe source poses: four Hatchling plus three Fledgling. Recolored them to the six canonical coats for 42 replacement images. Older ages and the Fledgling cry pose still use the previous verified stage-specific images.
- **Phoenix:** dynamic flame ribbons, spark showers, and animated rings for Flame Dance/Cinderfall and selected care activities. No new illustrated anatomical Phoenix frames in this pass.
- **Pegasus:** dynamic cloud-footsteps, starlight, mane-trail curves and signature rhythm effects for Cloud Trot/Starlit Gallop. No new illustrated anatomical Pegasus frames in this pass.
- **Hippogriff animation timing:** updated feed, play, grooming, call and the two species signature tricks for the full stage/coat matrix.
- **Retained systems:** existing flight, hatching, equipment, all twenty regions, lore, free food, foraging, personality, save key, and accessible View & Pet/text sizing.
- **Reduced motion:** premium procedural effect loops do not start when the player requests reduced motion.

### Release criterion still open

Premium effects and seven clean anatomical poses do not amount to full AAA animation across 150 appearances. Full bespoke Phoenix, Pegasus, remaining Hippogriff, Griffin and Wyvern poses with aligned frame-by-frame articulation, transition timing, equipment overlays and iPhone acceptance remain in the backlog.


## v29 status update — Living Anatomy Motion
The new renderer applies localized head, wing, chest, limb and tail deformations to original illustrated creatures across 150 age-and-coat variations. This improves the illusion of body articulation, but bespoke character rigs and full keyframe animation still require future art. See `V29_TEST_REPORT.md`. Equipment fallback and existing race flight frames are not replaced.


## v30 — Articulated Creature Rig Foundation

**New verified coverage:** Griffin + Wyvern, five life stages × six coats per species = **60 six-layer cutout rigs** (360 independently stored body-part images) plus 60 hinge support images. At rest, every 370×310 model reconstructs the source artwork pixel-perfectly when composited over a reference background (visible RGB mean absolute error 0.0). All cutout layers contain visible pixels.

**Updated animation path:** Griffin and Wyvern care actions and trick performances use the new pivot-based 2D layered renderer. The prior v29 mesh is bypassed for those two species while the new rig runs. Hippogriff, Phoenix and Pegasus continue on v29 mesh; their cutout libraries remain a production dependency. The equipped-creature renderer is preserved as a fallback.

**Remaining before AAA sign-off:** manual joint/occlusion cleanup, separately painted mouth and eyelid animations, independent feather/scale and hoof motion, stage-specific rigging for the remaining species, equipped-body sprite layers, flight integration and performance tests on actual iPhones. The term *fully articulated* is not used as a completed-quality claim.


## v31 — Five-family cutout-rig coverage

Hippogriff, Phoenix, and Pegasus have joined Griffin and Wyvern in the pivoted six-layer 2D cutout engine. Ninety additional illustrated appearance combinations were separated into base, head, wing, tail, forelimb and hindlimb layers with a new joint-support image per combination. Existing sixty rigs were retained, bringing the totals to 150 models, 900 drawn layers, 150 sockets and 1,050 stored WebP rig textures. Five stages and six coats are supported per family.

Every model was recomposited over a common opaque background from its disjoint source-art layers with **0.0 mean visible-pixel error**; full results in `V31_RIG_PIXEL_VALIDATION.json`. Browser testing decoded and drew all 150 models, played selected care and signature-trick animations for the new families, confirmed equipped fallback, and exercised a narrow-phone 200% text case (see `V31_TEST_REPORT.md`).

Technical cutout coverage is not a claim of finished AAA animation quality. Gaps remain: independently painted facial expressions, deformations that need contour redraws, professional socket shading, multi-angle flight motions, equipment art layers, and full mobile tests. Save structure and gameplay progression are unchanged.

---

## v32 — Living Expressions and Personality (November 2026)

**New in this release:** original-image-matched facial overlays for each of 5 species × 5 stages × 6 existing coat variants × 4 facial states (600 validated WebP assets).

- States: blink, pleased/affectionate, curious/attentive, and wary/guarded.
- Facial overlays are drawn in the same source-image geometry as each age/coat art asset and follow the head-pivot transformation in the v31 layered cutout renderer.
- Idle companion portrait blinks occasionally. Feeding, petting, playing, cuddling, rest wake-ups and trick performances can trigger a short-lived facial expression without changing gameplay rewards or the save structure.
- Care shows a read-only, stage-appropriate mood summary derived from existing stats and personality traits.
- `expression-studio.html` offers side-by-side comparison and all 150 appearance selections; existing Articulation Studio remains available.
- 600 expression WebP images validated as correctly sized (370×310), decodable and nonblank. All four states successfully loaded in sampled browser and studio tests.
- Browser acceptance via embedded asset routing: no JavaScript page errors or missing asset requests, real Play action triggers a curious expression, v31 rig displays face texture during articulated movement, original save field structure untouched. The actual 200% text-size selector works at 320 px with no horizontal document overflow; View & Pet entered successfully with all four touch controls present. Reduced-motion test verified no automatic facial animation.

**Limits of this pass:** the textures are modified portions of the original illustrations, not new three-dimensional or skeletal facial rigs. Painted mouth-open frames, jaw articulation, independently adjustable pupils, expressive ear positions, equipment overlays, and refinement of some eyelid transitions still need dedicated art and phone review. Deployment, sustained iPhone performance, save persistence across real site reloads and full-game regression remain unverified.

## v33 — Articulated Faces & Personality
**Implemented:** 600 small, locally cropped coat/age-matched jaw, eye and crest/ear textures; subtle 2D mouth openings, eye-gaze offsets, tuft motion, and touch/care/trick cues. 150/150 appearance combinations passed canvas rendering.

**Still required for AAA acceptance:** independent painted jaw hinge and mouth interior for every species/growth stage; actual separately painted eyebrow, ear and crest angles; anatomical mouth opening for horse muzzles; authored expression in-between frames; physical mobile frame-time and memory profiling; testing of every game stage during ordinary player progression, including equipped bodies. This is a meaningful quality pass but not the end of facial art production.


## v34 continuity / refinement audit
- Verified v34 completeness: 150 joint-glaze and 150 mouth-interior WebP textures, matched by species/stage/coat.
- These are **soft source-art paint/glaze** and small procedural painting, not independent full animation angle sets.
- The v34 staged motion director changes head/wing/tail/limb timing, but uses existing v31 illustrated cutouts.
- Full hand-authored anatomical transitions, accessory-aware animated equipment, and all-age bespoke flight remain unfinished.
- No updated game-save schema.
- Headless browser coverage and result data in `V34_TEST_REPORT.json`.
