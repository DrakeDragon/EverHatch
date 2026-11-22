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
