# GitHub Pages deployment

The site renders citation metrics from the checked-in `src/content/scholar.json`. A scheduled GitHub Action attempts to refresh that file from Zhixiang Ren's public Google Scholar profile. When validated metrics change, it commits the snapshot to `master` and then builds and deploys that same revision. Push builds use the persisted snapshot; nothing is fetched in a visitor's browser.

## Failure behavior

Google Scholar may block automated requests or return a CAPTCHA. The updater therefore:

1. requests the profile directly;
2. retries through `socks5h://127.0.0.1:7897` when running locally;
3. validates that citations, h-index, and i10-index were all parsed before replacing the JSON;
4. keeps the existing JSON unchanged when a scheduled GitHub Action cannot fetch valid data;
5. leaves the file untouched when the verified metrics have not changed, avoiding timestamp-only commits.

The write is atomic, so a partial response cannot corrupt the checked-in fallback data. The sync job alone receives `contents: write`; build and deployment jobs do not. A failed bot push is reported as a failed sync instead of silently deploying an unpersisted count. The next build checks out `master` again after sync, so its static output matches the saved JSON. GitHub's `GITHUB_TOKEN` does not trigger a second push workflow when it commits the snapshot.

## Repository settings

1. Push this project to the final GitHub repository with `master` as its default branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Optional: if a remote SOCKS5 proxy is available to GitHub Actions, add its complete URL as the Actions secret `SCHOLAR_PROXY_URL`. Do not use `127.0.0.1` for a remote runner.

The workflow deploys the checked-in snapshot on pushes to `master`. It attempts a fresh Scholar scrape once a week on Monday at 00:00 UTC, and also supports a manual run to refresh and deploy immediately. A successful refresh with changed metrics creates a small `github-actions[bot]` commit. Before a local content push, pull the latest `master` so the automated snapshot is included. The workflow detects whether the repository is a user site (`owner.github.io`) or a project site and sets Astro's base path accordingly.

## Local refresh

```sh
npm run fetch:scholar
npm run build
```

If metrics changed, review and commit `src/content/scholar.json` with your other local changes. A failed fetch leaves the previous snapshot intact when using `python scripts/fetch_scholar_stats.py --allow-stale`.

The default author key is `ec_pCdEAAAAJ`. Override it only when testing another profile:

```sh
SCHOLAR_AUTHOR_KEY=another_key npm run fetch:scholar
```
