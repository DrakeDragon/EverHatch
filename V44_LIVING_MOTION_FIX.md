# EverHatch v44 — Fixing Stiff Wyvern and All-Creature Movement

## User-reported defect

On November 23, 2026 the player reported that a long-running Wyvern on iPhone remained stable but moved as one rigid illustration leaning forward during interactions. There was no disappearing art, no gameplay crash, and no obvious save issue.

## Verified causes in the v43 source

1. `boneEnabled` required `?rig=1` or `?anatomy=1`. The ordinary game defaulted to whole-body movement. **This was the primary reason prior animation releases were not visible in normal play.**
2. Even when the rig was active, the illustrated body received some of the whole-wrapper tilt, reducing the perceived independence of the head/wing/tail.
3. `growthKind()` returned `null` whenever the creature had any equipment equipped. This prevented the illustrated rig entirely for equipped creatures, including long-running Wyverns.
4. Certain affection/play personality offsets opposed the base action and partly canceled head, wing, or tail movement.

## v44 code changes

- All grown, unequipped creatures now use the existing illustrated, source-matched head/wing/tail rig by default, with facial expressions and species personality enabled.
- Original art is still retained as fallback when masks fail or performance suffers.
- Equipped creatures retain their existing procedural appearance **and their gear**, but now animate independent `.hd`, two `.wflap` groups, and a newly grouped `.eh-proc-tail`. Equipped headgear and wing ornaments follow those moving groups. This uses the same animation director, no added RAF.
- Global lean for creatures using independent joints is reduced markedly, letting the joints carry the reaction.
- Coordinated affection/play offsets prevent head and tail movement from canceling out, notably Wyvern petting and playful tail movements.
- Newborns keep separate preexisting whole-illustration expression poses; no adult anatomy is grafted onto a 320×320 hatchling.
- A **Creature motion** toggle is available in Settings: Living (default) or Classic. Classic mode restores original animation and can also be forced through `?motion=classic`. This setting uses its own local preference key and does not change save schema. `?motion=live` forces the living path.
- The v44 Motion Lab QA panel reports whether the active renderer is illustrated separate joints, equipped SVG separate joints, newborn artwork, or fallback.

## Code and metadata checks performed

- Complete inline JavaScript parsed successfully after changes.
- Repository rig and facial geometry catalogs both contain 150 matching combinations (five species × five stages × six coats); no missing metadata pairs.
- Ten modeled procedural SVG renders, spanning every creature species and early/late stages, preserved balanced group tags and the movable head, both wings, tail, and four equipment locations in a structural test with stub art functions.
- Motion-preference tests passed for default Living, persisted Classic, forced Live, and forced Classic.
- Confirmed existing save key `aerie_save_v1` unchanged.
- Confirmed reduced-motion and source-art fallback guards remain present.

## What is NOT independently confirmed yet

No live-device visual, frame-rate, or asset-decoding acceptance test was performed on the owner's iPhone. Real phone experience could still reveal poorly joined illustrated layers or lag. Do not claim that all 150 models have been visually tested. GitHub commits do not by themselves confirm GitHub Pages deployment.

## Recommended real phone smoke test

1. Open https://drakedragon.github.io/EverHatch/?v=44&motion=live
2. Continue the **same saved Wyvern**, without switching nests or restarting. Feed, pet, play, and perform a learned trick. Look for an independently rotating head, wings, and tail rather than an overall lean.
3. If the Wyvern wears gear, keep it equipped and confirm the **equipped SVG separate joints** path is active.
4. For detailed diagnostics, open https://drakedragon.github.io/EverHatch/?v=44&motion=live&motionlab=1 then tap QA. Look for `Rendering: illustrated separate joints` or `Rendering: equipped SVG separate joints`. Test Head, Wing, Tail, Nuzzle, and Playful.
5. If animation looks wrong, switch Settings → Creature motion → Classic or open https://drakedragon.github.io/EverHatch/?v=44&motion=classic to restore the earlier stable behavior. This does not remove creature progress.

**Next development priority:** Review a real iPhone test or recording, fine-tune joint silhouettes and layering per coat and stage, and refine equipment-specific motion and facial responses without sacrificing visual quality or saves.
