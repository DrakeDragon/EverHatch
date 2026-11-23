# EverHatch v43 — Creature Animation QA and Release Gates

**Scope:** All five companion species (Griffin, Hippogriff, Phoenix, Pegasus, Wyvern), five artwork/rig stages (0–4), and six coat variants (0–5): 150 metadata combinations. The interactive gameplay may display different stage names, depending on species. Stage 0 uses complete newborn illustrations rather than older-creature head/jaw rigs.

## Automated checks completed

- Validated all 150 rig metadata entries and all 150 corresponding facial geometry entries (bbox, eye/jaw/crest rectangles, head/wing/tail pivots); zero metadata geometry failures.
- Parsed the full inline JavaScript after v43 edits; syntax valid.
- Executed the in-game `qaRoster()` logic against the real repo metadata. It reported 150/150 valid rig geometries and 150/150 valid facial geometries, five families, three unique idle behaviors per family, and no catalog issues.
- Injected a simulated duplicate live-rig state; the audit correctly flagged `duplicate-live-rigs`.
- Verified the existing local save key `aerie_save_v1` and the stable-mode flag remain unchanged.
- New facial changes: expression cross-fading; transparent neutral gaze, constrained to source eye bounds; smoothed jaw/crest; corrected wary-expression mapping.
- New movement changes: smoothed idle-to-interaction transitions, original-art fallback preserved, same existing animation frame director.
- New opt-in QA button in Motion Lab, with `window.EVERHATCH_ANIMATOR.qa()` for programmatic inspection.

**Not yet verified:** actual decoding of every source PNG/WebP across all models; 150 visual animations on real devices; browser performance on low-end phones; successful live Pages rollout. Metadata completeness is not equivalent to full visual QA.

## Test the experimental animation

Open:

https://drakedragon.github.io/EverHatch/?v=43&rig=1&face=1&personality=1&motionlab=1

The normal, nonexperimental URL is:

https://drakedragon.github.io/EverHatch/?v=43

Open an incognito/private browser session before testing new species or stage controls, to keep your everyday creature's existing local save separate. If testing stage progression with `&debug=1`, use private browsing: debug stage changes can update the saved state within that session.

## Manual acceptance checklist

1. For **each species**, examine the hatchling/newborn and its older illustrated stages. Confirm the correct coat and stage, no missing or incorrectly sized companion, and no movement seam splitting the body.
2. Across coats **0–5**, inspect head rotation, wing flex, tail follow-through, and the species' three unique idle habits. Confirm no image swaps or mismatched paint patches.
3. Exercise **feed, pet, cuddle, groom, play, wake, call, and a learned trick**. Confirm one visible creature, natural anticipation and recovery, no snapping when care interrupts an idle habit.
4. For illustrated older stages, press **Blink, Happy, Curious, Talk**, then **Habit, Nuzzle, Playful**, plus **Head, Wing, Tail, All 3**. Confirm the source eye/beak/muzzle artwork follows the moving head and returns smoothly to its original image.
5. Test sleep/wake, equipment changes, expeditions, switching tabs, rotation, navigating out of and back to the page, and iOS background/resume. The original art should remain visible when experimental rig is unavailable.
6. In the **QA** panel, confirm catalog `150/150` and facial `150/150`; when a valid older creature is ready, live rig count should normally be **1** and face count at most **1**. Newborn stage 0 is a deliberate rig fallback when facial mode is enabled; count 0 is expected.
7. Try reduced-motion accessibility settings. No flashing/jitter, no hidden creature, no extra director loops.
8. Confirm normal stable mode plays as before and reloads the saved creature.

## Release gates before promoting v43 animation to default

- Real-phone visual checks pass for every species, including representative edge-case coat/stage pairs.
- No reported missing artwork, visible seams, double eyes, mouth flashing, or animation snap during interactions.
- No unexplained animation failures or extra concurrent directors in QA diagnostics.
- Idle animations do not block input, claim buttons, pet hotspots, or alter gameplay rewards.
- Save data remains compatible. Keep opt-in flags until those results are confirmed.

**Status:** v43 code and programmatic metadata checks completed. Visual/device approval pending.
