# Everhatch v31 — Articulated Creature Production Test Report

## Passed in this environment

- 150 of 150 species × life-stage × coat articulated cutout models loaded and rendered in headless Chromium.
- Six source-art cutout layers and one joint-support image per model: **1,050** rig textures in all.
- Independent source-image composition check across all 150 models: **0 visible-pixel difference at rest** in Pillow (see `V31_RIG_PIXEL_VALIDATION.json`).
- Verified independent care and signature trick presentations across six newly articulated Hippogriff, Phoenix and Pegasus cases, including older Ascendant stages and rare coats.
- The new rig superseded the prior v29 mesh for those tested species; no JavaScript page errors or missing asset requests.
- Original equipment renderer remained the fallback with accessories equipped.
- On a simulated 320 px-wide phone, 200% text-size View & Pet stayed usable without horizontal overflow.
- Articulation Studio tested for all five species; model previews and six individual layer previews loaded.
- Existing `aerie_save_v1` key and v2 data structure remain unchanged. A simulated browser-storage save wrote 1,721 bytes in the test fixture.
- `index.html` inline script and `assets/rig/rig-runtime.js` passed syntax validation.

## Limitations

- The browser sandbox blocks cross-origin canvas pixel reads and real site-origin localStorage, so canvas visual-pixel identity was verified separately in Pillow and save writing was exercised using a browser-side storage stub. Persistence across reload on a deployed site is not verified by this test.
- Physical iPhone performance, heat, reduced-motion acceptance and GitHub Pages deployment remain untested.
- While the cutout joints rotate independently, some seams and occlusions still need manually drawn bridge pieces. This is not a completed AAA-quality hand-drawn motion library.
- Flight minigame still uses its existing four-frame species flight art; these new rigs cover companion care and trick presentation.
- Equipped companions intentionally retain the older renderer, preserving accessories until new equipment overlay rigs are ready.

## Production verdict

**v31 animation-engine coverage complete for all 150 appearances.** Final art-quality signoff remains open for individual facial, hoof, feather and scale animations, cinematic flight, equipment attachments and mobile acceptance.
