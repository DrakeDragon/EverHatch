# Everhatch v34 — Regression QA

## Asset and animation coverage
- New joint glazes: **150**
- New mouth interiors: **150**
- Invalid or blank new files: **0**
- Loaded rigs + facial data in headless Chromium: **150/150**
- All restored their unchanged neutral source illustration: **150/150**
- All showed changed mid-action body motion: **150/150**

## Gameplay and accessibility tests
- Real Play action: articulated care canvas present **True**, facial rig frames: **16**
- Real free feeding: hunger increased to about **35%**, articulated care canvas **True**
- Post-feeding satisfied reaction triggered: **True**
- Sleep and wake: **True / True**, wake stretch action **wake**
- Trick preview: started **True**, articulated trick canvas **True**
- Equipment uses original accessory renderer: **True**
- 320-pixel-wide screen at 200% text: document width **320**, focus mode **True**, body-spot buttons **4**
- OS reduced-motion mode respected: **True**
- Simulated save keys: **aerie.text-size.v1, aerie_save_v1**
- Browser JavaScript exceptions: **0**, missing asset requests: **0**

## Scope of these checks
The complete 150-combination sweep checks asset loading and 2D render coverage, not every possible authored gameplay progression scenario. The saved data was inspected using a simulated local-storage environment; this does not demonstrate that live GitHub Pages or a physical iPhone has been tested. This package is a playable animation-refinement candidate, not a certified full AAA animation library.
