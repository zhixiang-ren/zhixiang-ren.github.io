# Zhixiang Ren · Academic Homepage

[English](./README.md) | [简体中文](./README.zh-CN.md)

A bilingual, data-driven academic homepage for **Zhixiang Ren**. It combines a concise professional profile with recent publications, verified academic identifiers, build-time citation metrics, recruitment information, and machine-readable metadata in a fast static site.

Built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/), the project is designed for low-maintenance deployment on GitHub Pages.

> **Using an AI coding assistant?** Read [`AGENTS.md`](./AGENTS.md) before changing the project. It contains the architecture, implementation constraints, design invariants, and verification routines intended for agents.

## Highlights

- **One bilingual page** — English and Chinese use the same validated content sources, with persistent language and light/dark theme controls.
- **Content-first maintenance** — profile, biography, experience, services, honors, recruitment, and publications use Astro's Content Layer rather than page templates.
- **Academic publication workflow** — all publications are maintained in one Markdown file; a local command can import DOI or arXiv metadata, authors, venue information, links, and BibTeX.
- **Static Scholar metrics** — a weekly Action persists validated citation metrics in Git, and the site renders them without visitor-side requests to Google Scholar.
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

Requires Node.js **22.12.0 or newer** and npm **10.8.2 or newer**. Scholar refresh also uses the system `curl` executable for SOCKS5 proxy support. Python and Ruff are optional, needed only for the separate Git-history maintenance utility. The checked-in `.nvmrc` defines the site's Node version.

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
| `npm run check`                     | Check Prettier, Astro/TypeScript, and Scholar parser    |
| `npm run check:web`                 | Check Prettier formatting and Astro/TypeScript          |
| `npm run format`                    | Format code, content data, and documentation            |
| `npm run add-paper -- <DOI\|arXiv>` | Import one publication into the shared publication file |
| `npm run fetch:scholar`             | Refresh local Scholar metrics                           |

## Day-to-day content maintenance

Most editorial changes require no component work:

| Update                                                  | File                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Name, domains, academic roles, identifiers, and links   | [`src/content/identity.yaml`](./src/content/identity.yaml)                           |
| Current role, organization, and professional experience | [`src/content/experience.yaml`](./src/content/experience.yaml)                       |
| English and Chinese slogan, metadata, and biography     | [`src/content/profile.md`](./src/content/profile.md)                                 |
| Editorial and reviewing service                         | [`src/content/academic-services.yaml`](./src/content/academic-services.yaml)         |
| Representative honors                                   | [`src/content/representative-honors.yaml`](./src/content/representative-honors.yaml) |
| Recruitment and collaboration message                   | [`src/content/open-positions.md`](./src/content/open-positions.md)                   |
| Complete publication dataset                            | [`src/content/publications.md`](./src/content/publications.md)                       |
| Fallback Scholar statistics                             | [`src/content/scholar.json`](./src/content/scholar.json)                             |

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

The script validates all metrics before atomically replacing `src/content/scholar.json`; unchanged metrics leave the file untouched. Local requests fall back to `socks5h://127.0.0.1:7897` when direct access fails. Scholar may occasionally return a CAPTCHA; scheduled syncs preserve the last valid dataset instead of publishing zero or partial values. If the local snapshot changes, commit it with your work.

Operational details are in [`docs/deployment.md`](./docs/deployment.md).

### Replace the portrait

Convert a PNG/JPEG to WebP with the existing Sharp dependency. For a profile portrait, an **800px maximum width**, preserved aspect ratio, Lanczos3 downsampling, and the default WebP quality of 82 are a practical balance of detail and transfer size:

```sh
npm run convert:image -- path/to/new-photo.png --output src/assets/zhixiang-ren-YYYYMMDD.webp --max-width 800
```

The converter will not overwrite an existing file. Point both `src/pages/index.astro` and `src/pages/og/default.png.ts` at the new versioned asset, keeping the earlier WebP available for rollback. Then check:

- desktop and mobile crops;
- light and dark themes;
- the generated `/og/default.png` preview.

The homepage and Open Graph generator use the same source portrait. Run `npm run convert:image -- --help` for general image dimensions and quality options.

### Generate a Google Scholar avatar

Create a square upload asset from the same portrait without stretching the subject. The current photo already has enough horizontal space, so a full-width square crop avoids background-edge streaks:

```sh
npm run generate:scholar-avatar -- --input src/assets/zhixiang-ren-20260928.webp --output resources/scholar-avatar-20260928.png --subject-scale 1 --vertical-position 0.15
```

The script writes a versioned offline upload asset under `resources/`, outside Astro's source graph and deployment output. For portraits that need more side room, reduce `--subject-scale` below 1 to extend the edge background. `--vertical-position` controls the crop without moving or stretching the subject. The previous portrait and square upload remain in place. Run `npm run generate:scholar-avatar -- --help` for all options.

## Deployment

The workflow in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml):

- builds and deploys every push to `master`;
- attempts a Scholar refresh every Monday at 00:00 UTC and commits changed metrics to `master` before deployment;
- preserves the last valid metrics if that refresh fails;
- supports manual runs;
- handles both GitHub user sites and repository subpaths.

For first-time setup:

1. Change this checkout's `origin` from the upstream template to the final repository.
2. Push the project with `master` as the default branch.
3. In **Settings → Pages**, select **GitHub Actions** as the source.
4. Optionally provide a usable remote proxy URL through the `SCHOLAR_PROXY_URL` Actions secret.

See [`docs/deployment.md`](./docs/deployment.md) for deployment and failure behavior. Never commit proxy credentials.

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

## Participation

This is a maintainer-led personal site. Factual corrections and website bug reports are welcome; unsolicited code pull requests are not requested. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the appropriate channels and [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) for discussion standards. If repository Issues are disabled, use the homepage Email control for corrections. Do not report vulnerabilities publicly; follow [`SECURITY.md`](./SECURITY.md).

## Credits and license

The visual foundation is adapted from [Astro Sphere](https://github.com/markhorn-dev/astro-sphere). Content-collection patterns and the initial 404 structure were informed by [Academic Portfolio Astro](https://github.com/rubzip/academic-portfolio-astro).

Both upstream projects use the MIT License, and their notices are retained in [`LICENSE`](./LICENSE).

- **Source code:** the reusable website engine, components, styles, scripts, build configuration, and workflows are released under the [MIT License](./LICENSE).
- **Content and media:** the portrait, personal identity and likeness, and original biographical, research, and recruitment copy are not licensed under MIT and may not be reused without prior permission. See [`CONTENT-NOTICE.md`](./CONTENT-NOTICE.md) for the exact boundary and third-party-material notes.
