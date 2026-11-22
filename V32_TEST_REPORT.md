# Everhatch v32 — Expressions & Personality, Test Results

## Passed

- JavaScript syntax validated for the main game inline script, v31 rig runtime, and v32 expression runtime.
- All **600** age- and coat-matched facial WebP images exist, decode and have nonblank alpha content at 370×310.
- Head-pivot facial overlays displayed during an articulated Gryphon/Griffin and Phoenix care-animation preview in Chromium.
- The real Play Together callback changed the companion's Joy and triggered the Curious expression while the articulated care renderer ran.
- The separate Expression Studio displayed a rare-coat, Ascendant Wyvern and the selected Affectionate overlay.
- Actual Settings text-size selector changed to **200%**, and at a simulated **320 px** viewport, the document had no horizontal overflow.
- View & Pet mode opened at maximum text size, with four petting hotspot buttons still present.
- OS reduced-motion preference prevented automatic facial animation.
- No page errors or missing assets were recorded in the embedded-asset browser tests.
- No modifications to the original save key (`aerie_save_v1`), save schema, or progression rules.

## Not verified

- Physical iPhone performance and touch feel.
- Persistence across real GitHub Pages reloads and storage migrations.
- Complete gameplay regression across all achievements, expeditions, flight and equipment.
- Artist acceptance of every facial position or rare-coat treatment; some eyelid patches remain provisional.

Source data: `V32_TEST_REPORT.json`. Browser testing used asset fulfillment from the local build and a test storage stub because direct sandbox navigation was blocked.
