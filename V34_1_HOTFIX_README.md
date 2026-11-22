# Everhatch v34.1 — Wyvern Idle Neck Hotfix

This release repairs intermittent patches appearing near the Wyvern neck/crest during idle animation. The facial art layer was rendered only when a small periodic motion crossed a hard visibility threshold, then disappeared again. This change removes passive idle crest cutout drawing and fades the patch in and out during intentional reactions.

## Smallest possible GitHub update

If your existing GitHub Pages site already uses Everhatch v34, replace only:

    assets/faces-v33/facial-runtime.js

No other file needs changing, and saves, growth progression, artwork assets and text-size settings are untouched.

To update from the GitHub website: open your repository, go into `assets`, then `faces-v33`, use **Add file → Upload files**, choose the replacement `facial-runtime.js`, and commit the replacement to your publishing branch. Upload the file itself, NOT the .zip. It must keep the exact same name and location. If GitHub asks to overwrite/replace, approve the replacement.

On GitHub Desktop: replace the same local file, then Commit to main and Push origin.

If you are on v33 or earlier, install the full v34.1 build instead of the one-file patch.

After updating, close/reopen the game or hard-refresh the page to clear cached JavaScript. Use your current live save; it should remain where it is, but export a save backup first as a precaution.
