# Everhatch: publish a complete game update with one ZIP

The GitHub Pages site is built from the repository's `main` branch at the root. A complete Everhatch release has thousands of assets; updating only `index.html` is not sufficient.

## Publish v34.1

1. Download `Everhatch-v34_1-Complete.zip` from the ChatGPT conversation where the v34.1 fix was created. **Keep the ZIP intact; do not extract it.**
2. Open [New GitHub Release](https://github.com/DrakeDragon/EverHatch/releases/new).
3. Enter a **new tag**, for example `v34.1-full`, target `main`, and title `Everhatch v34.1 — Wyvern fix and complete artwork`.
4. Drag the single ZIP into **Attach binaries by dropping them here**. Wait for GitHub to finish uploading it.
5. Click **Publish release**.
6. Open [GitHub Actions](https://github.com/DrakeDragon/EverHatch/actions/workflows/install-everhatch-release.yml) and check the latest run named **Install a complete Everhatch game release**. It should download the ZIP, verify the ~3,989 files, install everything into the root of `main`, and commit the deployment.
7. Once Actions and GitHub Pages have completed, refresh the published game and test Wyvern idle, feeding, tricks and your saved companion.

Future updates: attach **one** complete `Everhatch-*.zip` to a new GitHub Release. You should not have to manually upload thousands of files again.

The automated installer keeps the `.github` folder, your existing `CNAME` (if any), and other existing repository files that are not part of the game ZIP. It does not change the game's browser save key. Still export an in-game save backup before updating.

If Actions reports a permission error on `git push`, open Repository Settings → Actions → General → Workflow permissions and ensure the workflow's token can write repository contents. GitHub account settings and organization policies may override that permission.

If GitHub Actions is disabled, enable Actions for this repository. The workflow will not deploy until the release ZIP is attached and published.
