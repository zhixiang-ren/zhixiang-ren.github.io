# GitHub Pages deployment

The site renders citation metrics from `src/content/scholar.json`. A scheduled GitHub Action attempts to refresh that file in the build workspace from Zhixiang Ren's public Google Scholar profile before Astro builds the static site. Nothing is fetched in a visitor's browser.

## Failure behavior

Google Scholar may block automated requests or return a CAPTCHA. The updater therefore:

1. requests the profile directly;
2. retries through `socks5h://127.0.0.1:7897` when running locally;
3. validates that citations, h-index, and i10-index were all parsed before replacing the JSON;
4. keeps the existing JSON unchanged when a scheduled GitHub Action cannot fetch valid data.

The write is atomic, so a partial response cannot corrupt the checked-in fallback data.

## Repository settings

1. Push this project to the final GitHub repository with `master` as its default branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Optional: if a remote SOCKS5 proxy is available to GitHub Actions, add its complete URL as the Actions secret `SCHOLAR_PROXY_URL`. Do not use `127.0.0.1` for a remote runner.

The workflow deploys cached data on pushes to `master`. It attempts a fresh Scholar scrape once a week on Monday at 00:00 UTC, and also supports a manual run for diagnostics. It detects whether the repository is a user site (`owner.github.io`) or a project site and sets Astro's base path accordingly.

## Local refresh

```sh
npm run fetch:scholar
npm run build
```

The default author key is `ec_pCdEAAAAJ`. Override it only when testing another profile:

```sh
SCHOLAR_AUTHOR_KEY=another_key npm run fetch:scholar
```
