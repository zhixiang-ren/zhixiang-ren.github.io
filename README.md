# Zhixiang Ren · Academic Homepage

[English](./README.md) | [简体中文](./README.zh-CN.md)

A bilingual, data-driven academic homepage for **Zhixiang Ren**. It combines a concise professional profile with recent publications, verified academic identifiers, build-time citation metrics, recruitment information, and machine-readable metadata in a fast static site.

Built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/), the project is designed for low-maintenance deployment on GitHub Pages.

> **Using an AI coding assistant?** Read [`AGENTS.md`](./AGENTS.md) before changing the project. It contains the architecture, implementation constraints, design invariants, and verification routines intended for agents.

## Highlights

- **One bilingual page** — English and Chinese use the same validated content sources, with persistent language and light/dark theme controls.
- **Content-first maintenance** — profile, biography, experience, services, honors, recruitment, and publications use Astro's Content Layer rather than page templates.
- **Academic publication workflow** — all publications are maintained in one Markdown file; a local command can import DOI or arXiv metadata, authors, venue information, links, and BibTeX.
- **Static Scholar metrics** — citation count and h-index are refreshed at build time and rendered without client-side requests to Google Scholar.
- **Search and AI discoverability** — the build produces a sitemap, `robots.txt`, generated `llms.txt`, Schema.org JSON-LD, canonical metadata, and a branded Open Graph card.
- **Release-ready static output** — responsive layouts, a bilingual 404 page, protected contact access, source/output privacy audits, and GitHub Pages automation are included.

## Technology

- Astro 7, TypeScript, Zod 4, and the Content Layer API
- Tailwind CSS 4 through its Vite plugin, with Geist Sans and Geist Mono
- Satori, resvg, and Sharp for the build-time Open Graph image
- Crossref and arXiv APIs for publication import
- Google Scholar scraper with validated stale-data fallback
- GitHub Actions and GitHub Pages

## Quick start

Requires Node.js **22.12.0 or newer** and npm **10.8.2 or newer**. The repository includes `.nvmrc`; run `nvm use` when using NVM.

```sh
npm install
npm run dev
```

Open `http://localhost:4321`. To test from a phone or another device on the same network, use:

```sh
npm run dev:network
```

Before publishing a change:

```sh
npm run build
npm run preview
```

`npm run build` validates content, runs Astro diagnostics, generates the static site in `dist/`, and audits both source and output for accidental disclosure.

## Common commands

| Command                             | Purpose                                                 |
| ----------------------------------- | ------------------------------------------------------- |
| `npm run dev`                       | Start the local development server                      |
| `npm run dev:network`               | Expose development preview to the local network         |
| `npm run build`                     | Run release audits, checks, and the production build    |
| `npm run preview`                   | Preview the generated production site                   |
| `npm run check`                     | Check Prettier formatting and Astro/TypeScript          |
| `npm run check:all`                 | Also check Python with Ruff 0.11.7                      |
| `npm run format`                    | Format code, content data, and documentation            |
| `npm run add-paper -- <DOI\|arXiv>` | Import one publication into the shared publication file |
| `npm run fetch:scholar`             | Refresh local Scholar metrics                           |

## Day-to-day content maintenance

Most editorial changes require no component work:

| Update                                                    | File                                                                                 |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Name, role, organization, domains, identifiers, and links | [`src/content/identity.yaml`](./src/content/identity.yaml)                           |
| English and Chinese slogan and biography                  | [`src/content/profile.md`](./src/content/profile.md)                                 |
| Professional and academic experience                      | [`src/content/experience.yaml`](./src/content/experience.yaml)                       |
| Editorial and reviewing service                           | [`src/content/academic-services.yaml`](./src/content/academic-services.yaml)         |
| Representative honors                                     | [`src/content/representative-honors.yaml`](./src/content/representative-honors.yaml) |
| Recruitment and collaboration message                     | [`src/content/open-positions.md`](./src/content/open-positions.md)                   |
| Complete publication dataset                              | [`src/content/publications.md`](./src/content/publications.md)                       |
| Fallback Scholar statistics                               | [`src/data/scholar.json`](./src/data/scholar.json)                                   |

Bilingual fields use `{ en: ..., zh: ... }`. Update both languages together. Publication titles intentionally remain in their official English form in both interface languages.

### Add a publication

Import metadata from a DOI or arXiv identifier:

```sh
npm run add-paper -- 10.1021/acs.jcim.5c03204
npm run add-paper -- 2603.12808
```

Inspect an entry without changing the content file:

```sh
npm run add-paper -- 2603.12808 --dry-run
npm run add-paper -- 10.1021/acs.jcim.5c03204 --check
```

The importer appends to the single `publications.md` collection and rejects duplicate identifiers. After import, review the publication status, author order, principal-author flag, venue abbreviation, BibTeX, and links. Add a code repository only after its README or publication confirms the association. Set `featured: false` when a paper should not appear in the ten-item homepage selection.

Crossref metadata distinguishes published work from repositories such as bioRxiv. Published journals prefer an official short title and fall back to an ISO 4 abbreviation service; failed optional lookups keep the full venue rather than guessing.

### Refresh citation metrics

```sh
npm run fetch:scholar
```

The script validates all metrics before atomically replacing `src/data/scholar.json`. Local requests fall back to `socks5h://127.0.0.1:7897` when direct access fails. Scholar may occasionally return a CAPTCHA; scheduled builds preserve the last valid dataset instead of publishing zero or partial values.

Operational details are in [`GITHUB_PAGES.md`](./GITHUB_PAGES.md).

### Replace the portrait

Replace [`src/assets/zhixiang-ren.webp`](./src/assets/zhixiang-ren.webp) with a compressed portrait using the same path and approximately the same **2:3** composition. Then check:

- desktop and mobile crops;
- light and dark themes;
- the generated `/og/default.png` preview.

The homepage and Open Graph generator use the same source portrait.

## Deployment

The workflow in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml):

- builds and deploys every push to `master`;
- attempts a Scholar refresh every Monday at 00:00 UTC;
- preserves the last valid metrics if that refresh fails;
- supports manual runs;
- handles both GitHub user sites and repository subpaths.

For first-time setup:

1. Change this checkout's `origin` from the upstream template to the final repository.
2. Push the project with `master` as the default branch.
3. In **Settings → Pages**, select **GitHub Actions** as the source.
4. Optionally provide a usable remote proxy URL through the `SCHOLAR_PROXY_URL` Actions secret.

See [`GITHUB_PAGES.md`](./GITHUB_PAGES.md) for deployment and failure behavior. Never commit proxy credentials.

## Generated and machine-readable output

The production build automatically creates:

- `/llms.txt` from the same profile, experience, publication, and metric data used by the page;
- `/rss.xml` as a build-time recent-publications feed sourced from the same publication data;
- `/robots.txt` and the sitemap with deployment-aware URLs;
- `/og/default.png`, a 1200×630 social preview generated from local content, fonts, and portrait assets;
- Schema.org `Person` JSON-LD and standard Open Graph/Twitter metadata.

These files should normally be updated through their source collections, not edited as generated artifacts.

## Security and privacy

This public academic site remains open to legitimate search, academic, and AI crawlers. Contact details are protected against simple static harvesting, and production builds audit common secrets and private artifacts. These controls reduce opportunistic collection; they are not a substitute for server-side rate limiting.

Read [`SECURITY.md`](./SECURITY.md) before changing contact handling, crawler policy, or deployment infrastructure.

## Credits and license

The visual foundation is adapted from [Astro Sphere](https://github.com/markhorn-dev/astro-sphere). Content-collection patterns and the initial 404 structure were informed by [Academic Portfolio Astro](https://github.com/rubzip/academic-portfolio-astro).

Both upstream projects use the MIT License, and their notices are retained in [`LICENSE`](./LICENSE).

- **Source code:** the reusable website engine, components, styles, scripts, build configuration, and workflows are released under the [MIT License](./LICENSE).
- **Content and media:** the portrait, personal identity and likeness, and original biographical, research, and recruitment copy are not licensed under MIT and may not be reused without prior permission. See [`CONTENT-NOTICE.md`](./CONTENT-NOTICE.md) for the exact boundary and third-party-material notes.
