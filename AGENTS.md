# AGENTS.md

This file is the operating manual for coding agents and contributors working on this repository. It describes the current product decisions, architecture, maintenance routines, invariants, and release checks. Read it before changing code or content.

## 1. Scope and instruction precedence

- This file applies to the entire `my-academic-site/` repository.
- A more deeply nested `AGENTS.md`, if one is added later, overrides this file only for files under its directory.
- Follow the user's current request first, then this file, then the general conventions in the two READMEs.
- Preserve unrelated local changes. The working tree may already contain intentional edits.
- Use `apply_patch` for hand-authored file changes. Do not replace whole files mechanically when a focused patch is sufficient.
- Do not delete archived/reference implementations merely because they are not mounted. In particular, keep the experimental Penrose component unless the user explicitly asks to remove it.

## 2. Project purpose and current product state

This is a bilingual, single-page academic profile for Zhixiang Ren (任智祥). It is an information-dense executive-summary style homepage rather than a lab portal, blog, or multi-page publication database.

The current public page contains:

1. A profile column with portrait, name, current role, organization, Scholar metrics, academic links, focus areas, and recruitment.
2. A main column with an AI-for-Science headline and biography.
3. One combined `Experience` timeline covering the Ph.D. and later appointments. Public dates display years only.
4. `Services & Honors`.
5. Ten featured recent papers, sourced from one Markdown file.
6. A site-wide micro-footer with a fading hairline, copyright, technology credit, and build month.

The page deliberately does **not** contain:

- a primary navigation pill or multi-page navigation;
- a team/people section;
- separate research pillar cards;
- a latest-news section;
- a traditional full-screen cover image;
- a live Penrose background;
- visitor-side Scholar/API calls;
- a visible email address in the initial HTML.

Do not reintroduce any of those elements unless the user explicitly changes the product direction.

## 3. Design intent

The visual direction is restrained Apple/OpenAI/DeepMind/Linear-style editorial design adapted to a senior academic profile. The hierarchy should feel authoritative, calm, compact, and readable rather than decorative or template-like.

### Core principles

- **Content before spectacle.** Identity, research positioning, recent papers, and recruitment must be immediately understandable.
- **Negative space is intentional.** Do not fill wide-screen side margins with decorative objects.
- **Typography drives hierarchy.** Use Geist Sans for headings/body and Geist Mono only for metrics, dates, compact metadata, and technical labels.
- **Color is an accent, not a surface.** Blue is reserved for quiet ambient light, publication metadata, timeline dots, and subtle hover feedback. Emerald is reserved for recruitment.
- **No card-on-card fatigue.** Avoid adding nested bordered boxes. Cards should exist only where they clarify a distinct object.
- **No zebra striping.** Publication rows remain transparent at rest and receive a faint blue hover treatment on desktop.
- **No hover displacement for editorial content.** Prefer color, inset light, or border changes over large translation or drop shadows.
- **Dark mode uses zinc, not dead black.** The base is `zinc-950` (`#09090b`), with restrained `zinc-900` translucent surfaces.
- **Light mode is cool and quiet.** The base is `zinc-50`; avoid stark white blocks unless they are translucent.
- **Hairlines are subtle.** Borders normally use `zinc-200/70–80` in light mode and `zinc-800/60–80` in dark mode.
- **Motion must be optional and short.** Respect `prefers-reduced-motion`; do not add continuous ambient animation.

### Background system

The production background is CSS-only and has no runtime animation:

- `ambient-spotlight`: one low-opacity, top-centered cool neutral/blue glow that fades before long-form content.
- `bg-grid-dots`: a faint 24px dot matrix constrained by a radial mask near the top center.
- Wide-screen outer margins remain visually empty.
- Do not extend the glow or dots down through the full publication list.

The former Canvas Penrose implementation is preserved at:

```text
src/components/experiments/PenroseHero.astro
```

It is intentionally unmounted because its line density reduced long-form readability. Treat it as an experiment/reference, not a production dependency.

### Footer system

`SiteFooter.astro` is the footer for the whole page, not part of Recent Papers. It must remain outside the page `<main>` in `Layout.astro` so Flexbox pushes it to the actual document bottom.

The footer currently uses:

- a `max-w-4xl` alignment matching the page grid;
- `.footer-hairline`, a 1px line brightest at the center and transparent at both edges;
- an extremely subtle upward neutral glow;
- automatically generated UTC build year/month;
- identical typography for copyright, machine-readable links, build credit, and update date;
- a distinct `Source` link for this personal-site repository plus low-emphasis `llms.txt` and RSS entry points beside the copyright line; the profile GitHub link remains the separate research-team code destination.

Do not add a footer-level BibTeX download unless explicitly requested. Each publication already exposes its reviewed BibTeX record inline, so an aggregate footer export would duplicate the current workflow.

## 4. Responsive behavior is intentionally different

Desktop and mobile are not simple scaled copies. Several layout decisions are breakpoint-specific and must remain so.

### Desktop (`md` and above)

- The top section uses a 4/12 profile column and an 8/12 main column.
- The portrait is larger and vertically composed; the name and role sit below it inside the same Bento profile card.
- Metrics are a two-cell subtle Bento block.
- Academic links use a 2×2 grid with icons and labels.
- Focus areas are individual subdued pills.
- Recruitment stays in the left column.
- Experience and Services & Honors stay in the right column.
- Recent Papers breaks out below both columns and uses the full `max-w-4xl` content width.

### Mobile (below `md`)

- Profile identity is a compact, borderless horizontal header with a 64px portrait.
- Metrics are an inline text treatment rather than a large card.
- The four academic links fit in one row and maintain iOS-friendly minimum touch targets (`min-h-11`, approximately 44px).
- Focus areas become a compact natural text flow rather than bordered pills.
- The information order is deliberately:
  1. profile and links;
  2. slogan and biography;
  3. recruitment;
  4. recent papers;
  5. experience;
  6. services and honors;
  7. global footer.
- This ordering is implemented with separate responsive component instances and Tailwind `order-*`/visibility classes. Do not collapse them into one DOM location without rechecking both layouts.
- Service rows lose the outer desktop card shell and use typographic dividers.
- Publication hover effects are desktop-only (`md:hover:*`) because touch devices have no meaningful persistent hover.

Whenever changing layout, verify both a desktop viewport and a modern iPhone-sized viewport (roughly 390×844 CSS pixels). A desktop improvement must not silently undo the mobile-specific hierarchy, and vice versa.

## 5. Technology and runtime constraints

- Astro 7.3.2, static output, and Vite 8.
- Tailwind CSS 4 through `@tailwindcss/vite`. Theme tokens and the class-based dark variant live in `src/styles/global.css`; do not restore the removed `@astrojs/tailwind` integration or a JavaScript Tailwind config without a concrete need.
- TypeScript strict mode.
- Astro Content Layer collections with explicit local `glob()` loaders and Zod 4 validation. Import `z` from `astro/zod` in content schemas.
- Scholar metrics remain an atomic JSON handoff from Python, but Astro consumes them through the built-in `file()` loader and validates the complete record before rendering. Do not bypass this collection with a raw JSON import.
- Geist Variable and Geist Mono are bundled locally with `@fontsource-variable`.
- The primary Geist Sans Latin variable font is the only preloaded font. Real Geist italic outlines are loaded on demand; Mono and non-Latin subsets must not be preloaded without measurement. Chinese glyphs intentionally use the explicit local-system fallback stack in `global.css` rather than shipping a multi-megabyte CJK webfont.
- Markdown supports math through `remark-math` and `rehype-katex`. KaTeX CSS is not global because the current public pages contain no formulas; import `katex/dist/katex.min.css` only in a page or component that actually renders KaTeX markup.
- Markdown syntax highlighting is intentionally disabled in `astro.config.mjs`: the current site has no rendered code blocks, and Shiki's generated inline styles conflict with the native hash-based CSP. Re-enable it only with an explicit CSP-compatible highlighting strategy.
- Astro 7's default Markdown processor is intentionally replaced with the official `@astrojs/markdown-remark` unified processor so the existing remark/rehype math plugins remain supported.
- Astro's native build-time CSP is enabled. Keep public scripts and styles local and verify the generated CSP meta tag after adding any inline, external, or dynamically injected resource. Theme and language bootstrap logic intentionally lives in local external files under `public/js/`; do not move it back into classic inline scripts, which production CSP will block.
- No React, Vue, Svelte, or other client framework is used.
- Client JavaScript is intentionally limited to theme/language behavior, protected email interaction, and intent-based external-link preconnection.
- Package manager of record: **npm**. Keep `package-lock.json` authoritative; do not introduce pnpm/yarn lockfiles.
- Minimum Node version: 22.12.0. Use the checked-in `.nvmrc` when NVM is available.
- Python is needed only for Scholar refresh; the fetcher depends on the system `curl` executable and otherwise uses the standard library.

## 6. Quick start

From the repository root:

```sh
npm install
npm run dev
```

Default development URL:

```text
http://localhost:4321
```

Useful commands:

```sh
npm run dev:network       # expose the dev server to the local network
npm run check             # Prettier + Astro/content diagnostics + tsc --noEmit
npm run check:all         # frontend checks + Ruff checks (requires Ruff 0.11.7)
npm run format            # apply Prettier to supported repository files
npm run format:py         # apply Ruff fixes and formatting to Python scripts
npm run build             # privacy audits + check + production build
npm run preview           # preview dist/ locally
npm run preview:network   # expose production preview to the local network
npm run fetch:scholar     # refresh Google Scholar metrics locally
npm run add-paper -- ...  # import DOI/arXiv metadata
```

If port 4321 is occupied, Astro selects another port. Check the command output rather than assuming the URL. Do not start duplicate background servers when an existing one can be reused or restarted.

## 7. Repository map and ownership

```text
.
├── .github/workflows/deploy.yml       # Pages build, weekly Scholar refresh, deployment
├── public/
│   ├── favicon.svg                    # site favicon
│   └── js/
│       ├── theme.js                   # early theme initialization and header state
│       └── language.js                # CSP-safe language initialization and toggle state
├── scripts/
│   ├── audit_release.mjs              # source/output privacy and secret audit
│   ├── fetch_publication_metadata.mjs # DOI/arXiv importer
│   ├── fetch_scholar_stats.py         # resilient Scholar scraper
│   ├── generate_scholar_avatar.mjs    # reusable square/circular-safe portrait generator
│   └── llmtxt-instructions.md         # internal editorial guidance for llms.txt
├── src/
│   ├── content.config.ts              # Content Layer loaders and all collection schemas
│   ├── assets/
│   │   ├── fonts/                    # vendored Geist TTFs for Satori
│   │   └── zhixiang-ren.webp         # pre-optimized production portrait
│   ├── components/
│   │   ├── AcademicIcon.astro         # social/academic link icon set
│   │   ├── BaseHead.astro             # canonical, OG, favicon, JSON-LD hooks
│   │   ├── ExperienceTimeline.astro   # year-only full-width timeline
│   │   ├── OutlinedEmailLabel.astro   # geometric SVG label; no text node
│   │   ├── RecentPapers.astro         # publication list and BibTeX disclosure
│   │   ├── RecruitmentCard.astro      # shared responsive recruitment callout
│   │   ├── SiteFooter.astro           # global micro-footer
│   │   └── experiments/PenroseHero.astro
│   ├── content/
│   │   ├── academic-services.yaml     # editorial and reviewing work
│   │   ├── experience.yaml            # appointments and education
│   │   ├── identity.yaml              # identity, roles, domains, and links
│   │   ├── open-positions.md          # bilingual recruitment copy
│   │   ├── profile.md                 # bilingual slogan and biography
│   │   ├── publications.md            # complete publication dataset
│   │   └── representative-honors.yaml # selected awards
│   ├── data/scholar.json              # last validated static Scholar metrics
│   ├── layouts/Layout.astro            # global shell, controls, background, email runtime
│   ├── pages/
│   │   ├── 404.astro                  # bilingual error page
│   │   ├── index.astro                # data composition and homepage markup
│   │   ├── llms.txt.ts                # generated factual LLM profile route
│   │   ├── og/default.png.ts           # pre-rendered social preview endpoint
│   │   └── robots.txt.ts              # base-path-aware crawler policy
│   └── styles/global.css              # theme, background, shared component classes
├── astro.config.mjs                   # site/base configuration, Markdown processor, and Vite integration
├── tsconfig.json                      # strict TS and @ aliases
├── README.md                          # English maintainer documentation
├── README.zh-CN.md                    # Chinese maintainer documentation
├── SECURITY.md                        # security model and hosting limits
└── GITHUB_PAGES.md                    # Pages deployment operations
```

## 8. Content architecture: one bilingual source per subject

The project intentionally avoids separate English and Chinese files. Localized values use this shape:

```yaml
en: English text
zh: 中文文本
```

Keep both values together and update both in the same change. This prevents translation drift and excessive file count.

`src/content.config.ts` is the schema and loader contract. Read it before editing data. If a new field is needed:

1. update the Zod schema;
2. update the relevant content file;
3. update every consumer (`index.astro`, a component, JSON-LD, and/or `llms.txt.ts`);
4. run `npm run build` so missing consumers or invalid data surface immediately.

Keep `src/content/` flat: each collection currently owns exactly one clearly named source file. Do not reintroduce one-file subdirectories unless a collection genuinely grows to multiple entries.

Do not bypass the Content Layer by importing raw YAML with an ad hoc parser or copying business content into `index.astro`.

### Content source table

| Subject                                      | Single source of truth                   | Consumers                                 |
| -------------------------------------------- | ---------------------------------------- | ----------------------------------------- |
| Identity, role, organization, domains, links | `src/content/identity.yaml`              | homepage, JSON-LD, footer, `llms.txt`     |
| Headline and biography                       | `src/content/profile.md`                 | homepage, `llms.txt`                      |
| Experience                                   | `src/content/experience.yaml`            | timeline, JSON-LD alumni data, `llms.txt` |
| Editorial/reviewing service                  | `src/content/academic-services.yaml`     | homepage, `llms.txt`                      |
| Representative honors                        | `src/content/representative-honors.yaml` | homepage, JSON-LD, `llms.txt`             |
| Recruitment                                  | `src/content/open-positions.md`          | desktop/mobile card, `llms.txt`           |
| Publications                                 | `src/content/publications.md`            | desktop/mobile list, `llms.txt`           |
| Citation metrics                             | `src/data/scholar.json`                  | metrics block, `llms.txt`                 |

### Editorial rules

- Use verified, public facts only.
- Use absolute years/date ranges rather than “recently” or “currently” in archival fields.
- Use `SmartLogic Tech` as the English organization name.
- Use `Chief AI Scientist`, not `AI Chief Scientist`.
- Use standard English academic-homepage prose, not literal Chinese-to-English wording.
- Keep the biography concise and avoid repeating metrics, appointments, honors, or services already visible elsewhere.
- English publication titles are canonical. The UI intentionally displays the official English title in both languages.
- Preserve journal titles such as _Nature_, _Science_, and _Nature Machine Intelligence_ as italicized inline Markdown in biography content. `index.astro` safely renders this limited inline emphasis.
- Do not add private project details, phone numbers, unpublished results, confidential affiliations, or internal files.

## 9. Publications routine

All papers live in `src/content/publications.md`.

Do not split publications into one Markdown file per paper. The owner explicitly prefers a single maintainable list.

Each item supports:

- `date`
- bilingual `title` (the renderer currently uses `title.en` in both languages)
- structured authors and `principal: true`
- full `venue`
- optional ISO 4 `venueShort`
- bilingual `status`
- optional `abstract`
- optional formatted `bibtex`
- `source`: `crossref`, `arxiv`, or `manual`
- optional DOI/arXiv/paper/code links
- `featured`

### Display behavior

- `index.astro` filters `featured: true`, sorts descending by date, and displays the newest ten.
- Published work shows the official short journal title when available. Do not force uppercase; ISO 4 capitalization and punctuation are meaningful.
- Preprints show the repository/platform name such as `arXiv` or `bioRxiv`; never present a bioRxiv preprint as a published paper.
- A preprint DOI link is labelled with the repository name instead of the misleading generic label `DOI`.
- Code links appear before BibTeX.
- BibTeX uses native `<details>`/`<summary>` for keyboard accessibility and is formatted into one field per line.
- Recent Papers has no large colored outer panel and no zebra striping.
- Desktop row hover uses only a very faint cold-blue surface and 1px inset rim light; it does not translate vertically.

### Import a DOI or arXiv record

```sh
npm run add-paper -- 10.1038/example-doi --dry-run
npm run add-paper -- 2603.12808 --zh-title "中文标题"
npm run add-paper -- 2603.12808 --not-featured
npm run add-paper -- 2603.12808 --check
```

The importer:

1. normalizes DOI/arXiv URLs and identifiers;
2. queries Crossref or the official arXiv Atom endpoint;
3. retrieves title, authors, date, abstract, venue, links, and BibTeX;
4. marks Zhixiang Ren as principal by normalized name or ORCID;
5. prefers Crossref's official short container title;
6. falls back to the open `abbrevIso`/LTWA service for ISO 4 abbreviations;
7. retains the full venue rather than guessing when abbreviation lookup fails;
8. rejects duplicate identifiers;
9. atomically appends to the single publication file.

`--dry-run` prints candidate YAML without writing. `--check` validates remote metadata without printing YAML or changing files. Always inspect imported author names, publication status, venue casing, links, and BibTeX before publishing. Automatically retrieved metadata is not automatically authoritative.

For bioRxiv or other repositories not directly handled by the importer, add/review the item manually and set the platform, status, and label semantics accurately.

## 10. Scholar metrics routine

The site never requests Google Scholar from a visitor's browser. It renders the last validated build-time snapshot in:

```text
src/data/scholar.json
```

Local refresh:

```sh
npm run fetch:scholar
```

Resilient refresh:

```sh
python3 scripts/fetch_scholar_stats.py --allow-stale
```

Behavior and invariants:

- Default author key: `ec_pCdEAAAAJ`.
- Override only for deliberate testing with `SCHOLAR_AUTHOR_KEY`.
- The parser requires citations, h-index, and i10-index before writing.
- Total citations are rounded down to the nearest hundred; the UI appends `+`.
- Writes are atomic.
- Local direct access falls back to `socks5h://127.0.0.1:7897`.
- In CI, there is no localhost fallback. An optional complete remote proxy URL may be supplied as the `SCHOLAR_PROXY_URL` secret.
- `--allow-stale` keeps the previous JSON and exits successfully if Google blocks the request, returns CAPTCHA, times out, or provides incomplete data.
- Never replace failed metrics with zeroes, partial values, guesses, or OpenAlex counts. Different services have different coverage.

GitHub Actions attempts a refresh on scheduled/manual runs and uses the checked-in validated snapshot on ordinary pushes.

## 11. Language, theme, and client behavior

English and Chinese share the same generated page. This is not a two-route locale system.

- `.lang-en` and `.lang-zh` visibility is controlled by `html[lang="zh-CN"]` in `global.css`.
- The language preference is stored in `localStorage` under `site-language`.
- The language button updates `document.title` and uses the native View Transitions API when supported.
- Language initialization and button binding live in `public/js/language.js`; this must remain a local external script because the production CSP blocks classic inline handlers.
- Reduced-motion users receive an immediate change with no transition.
- Theme initialization lives in `public/js/theme.js` so the correct theme is applied early and flash is minimized.
- Theme and language controls remain in a fixed, empty top utility bar with a masked gradient blur behind them.
- At desktop widths (`min-width: 768px`), the root font size is intentionally `125%`, reproducing a 125% browser-zoom composition through rem scaling. Mobile remains at the browser-default 16px root size. Keep component dimensions in rem-based Tailwind utilities when they should participate in this scaling.
- Do not add central navigation back into that header.

When adding localized UI copy, include both spans:

```astro
<span class="lang-en">English</span>
<span class="lang-zh">中文</span>
```

Avoid client-side content fetching or duplicated locale routes unless the product requirements change substantially.

## 12. Email privacy and accessibility invariants

The public contact address must remain usable while avoiding a continuous address or static `mailto:` in source and generated output.

Current defense-in-depth:

1. `identity.yaml` stores separately reversed local/domain fragments.
2. `index.astro` reconstructs the address at build time only long enough to emit an XOR-obfuscated numeric byte stream.
3. `OutlinedEmailLabel.astro` renders the visible word as geometric SVG paths, not SVG `<text>`.
4. `Layout.astro` decodes only after trusted pointer movement, touch, or keyboard intent.
5. The generated `href` resets after 30 seconds.
6. Release audits reject continuous plain email addresses and static output `mailto:` links.

Do not:

- put a complete email address in Markdown, YAML comments, JSON-LD, `llms.txt`, tests, documentation examples under `src/` or `public/`, or visible markup;
- replace the outline SVG with `<text>`, entities, an image containing metadata, or a direct link;
- block keyboard or touch users while tightening mouse heuristics;
- claim this is cryptographic protection. It raises scraping cost but cannot stop targeted OCR or sophisticated automation.

If the approved email changes, update the reversed fragments in `identity.yaml`, regenerate/update the outline label if its visible word changes, and run the full build audit.

## 13. Machine-readable output and SEO

The static build produces:

- canonical, Open Graph, and Twitter metadata through `BaseHead.astro`;
- a pre-rendered 1200×630 `/og/default.png` generated from Content Collections, the local portrait, and local Geist TTF files through Satori/resvg;
- `Person` JSON-LD from the same verified profile collections;
- a sitemap via `@astrojs/sitemap`;
- `/robots.txt` from `src/pages/robots.txt.ts`;
- `/llms.txt` from `src/pages/llms.txt.ts`;
- `/rss.xml` from `src/pages/rss.xml.ts`, generated from the canonical publications collection;
- a bilingual `/404.html`.

### `llms.txt`

`llms.txt` is generated, not manually maintained. It must remain factual, compact, and consistent with the public page. It may include verified identifiers and links, but contact must direct users to the homepage Email button.

Do not use it for prompt injection, hidden instructions, marketing superlatives, private information, or claims absent from the visible site. When changing a schema or public fact, check whether `llms.txt.ts` and JSON-LD need corresponding updates.

### `robots.txt`

The site intentionally permits standards-compliant search, academic, and AI crawlers. Reserved trap/private/draft paths are advisory only. GitHub Pages cannot enforce IP bans, bot fingerprinting, or rate limits from this repository.

Do not disallow `/_astro/`; rendering assets must remain crawlable for reliable indexing and page rendering.

### RSS

`rss.xml` is a static build-time feed of publications, not a separate hand-maintained dataset. Keep it sourced from `src/content/publications.md`, prefer DOI/arXiv/paper destinations in that order, and retain deployment-aware URLs for GitHub Pages subpaths.

### Open Graph image

`src/pages/og/default.png.ts` is a build-time endpoint, not a production image service. It must stay deterministic and network-free: read profile data through Content Collections and use only local portrait/font assets. `BaseHead.astro` publishes an absolute image URL plus width, height, MIME type, and alt metadata. If the endpoint path or dimensions change, update both places together and visually inspect the generated PNG.

### Base paths

All generated URLs and public assets must work both at `/` and at a GitHub project subpath. Use `Astro.site`, `import.meta.env.BASE_URL`, and the existing helpers rather than hardcoding production origins.

## 14. GitHub Pages and CI/CD

Workflow: `.github/workflows/deploy.yml`.

Triggers:

- push to `main`;
- Monday 00:00 UTC schedule;
- manual `workflow_dispatch`.

Behavior:

- Push builds use the checked-in Scholar snapshot and do not scrape.
- Scheduled/manual builds set up Python and attempt `fetch_scholar_stats.py --allow-stale`.
- The workflow detects user-site versus project-site repository names and exports `SITE_URL`/`BASE_PATH`.
- `withastro/action` installs and builds the site.
- `actions/deploy-pages` deploys the artifact.

Required repository setting: **Settings → Pages → Source: GitHub Actions**.

Optional secret: `SCHOLAR_PROXY_URL` containing a complete remotely reachable proxy URL. Never use local `127.0.0.1:7897` on a hosted runner and never commit proxy credentials.

When editing the workflow, preserve stale-metric deployment behavior: a Scholar outage must not block an otherwise valid site release.

## 15. Build, verification, and visual QA

Every meaningful change must end with:

```sh
npm run build
```

That command performs, in order:

1. source privacy/secret audit;
2. Prettier format verification;
3. `astro check` component/content validation;
4. `tsc --noEmit` TypeScript validation;
5. static production build to `dist/`;
6. generated-output privacy audit.

Run `npm run check:all` when modifying `scripts/fetch_scholar_stats.py`. The GitHub Pages workflow runs Ruff lint and format checks on every build, independently of the frontend build command.

Do not report completion if the build fails. Read the first relevant error, correct it, and rerun the full command.

### Visual QA checklist

For layout/style changes, inspect at minimum:

- desktop light mode;
- desktop dark mode;
- an iPhone-sized narrow viewport in light mode;
- the same narrow viewport in dark mode when colors or borders changed;
- top of page and the actual document bottom;
- both English and Chinese;
- open BibTeX disclosure for at least one paper;
- long titles/author lists for overflow;
- theme/language controls after scrolling;
- keyboard focus on links, language/theme controls, Email, and BibTeX.

Also verify:

- no horizontal scroll below 768px;
- at least 44px mobile tap targets for the four academic links and theme control;
- portrait crop still includes comfortable headroom and hands on desktop without exposing the unwanted lower crop;
- footer remains below content rather than appearing midway through the page;
- dot matrix/glow remain subtle and confined to the upper area;
- publication rows are transparent at rest and have no zebra pattern.

For content-only changes, build validation is still mandatory; visual QA can focus on the affected language and component.

## 16. Release privacy audit

`scripts/audit_release.mjs` scans `src/` and `public/` before build and `dist/` afterward.

It rejects:

- continuous plain email addresses;
- static output `mailto:` URLs;
- internal `llmtxt-instruction.md` / `llmtxt-instructions.md` guidance under publishable source roots or generated output;
- private-key headers;
- `.env`, key, certificate, database, backup, credential, and common SSH-secret files;
- directories named `private`, `draft`, `drafts`, `internal`, `backup`, or `backups` under audited roots.

Do not weaken the audit to make a build pass. Remove or restructure the unsafe content instead. If a legitimate new text file trips the audit, decide whether it belongs outside `src/`/`public/` before considering any narrowly scoped rule change.

Never put unpublished manuscripts, proprietary datasets, internal slides, credentials, or confidential drafts under `public/`; anything there becomes directly downloadable.

## 17. Common modification recipes

### Change biography or headline

1. Edit both languages in `src/content/profile.md`.
2. Keep publication names wrapped in single `*` when italics are desired.
3. Confirm the summary does not duplicate metrics/services/honors unnecessarily.
4. Check homepage and generated `/llms.txt`.
5. Run `npm run build`.

### Change a role or add experience

1. Edit `src/content/experience.yaml`.
2. Use `YYYY` or `YYYY-MM`; the public timeline displays the year portion.
3. Include Ph.D. and later experience only unless requirements change.
4. Verify chronology and JSON-LD alumni output.
5. Run the build.

### Add or correct a publication

1. Prefer `npm run add-paper -- <identifier> --dry-run`.
2. Review official status, venue, ISO 4 abbreviation, author order, principal flag, links, and BibTeX.
3. Append/import into the single `publications.md` file.
4. Add a verified code repository only when its README or publication explicitly establishes the match.
5. Keep `featured: true` only if it belongs in the ten-paper homepage selection.
6. Run the build and open the BibTeX drawer.

### Replace the portrait

1. Keep the asset under `src/assets/` and import it so Astro emits a hashed deployment URL.
2. The current WebP is already manually optimized. Render `portrait.src` with a native `<img>` to avoid a second lossy encode; keep eager loading, high fetch priority, and metadata-derived intrinsic dimensions.
3. Compress any replacement before commit and update the OG endpoint's file path/MIME type together with the page import.
4. Update `object-position` if needed.
5. Check desktop, mobile, and generated OG crops separately; they intentionally use different framing.
6. Preserve the `portrait-tone` treatment unless the design direction changes: light mode uses restrained color control, dark mode additionally reduces luminance, and only fine-pointer desktop hover returns to the unfiltered image. Mirror the dark-mode treatment in the Sharp pipeline inside the OG endpoint so the static social card and site remain consistent.

### Change theme/background styling

1. Work in `src/styles/global.css` and existing layout layers.
2. Preserve zinc base colors and CSS-only static background behavior.
3. Keep side margins empty and fade all top effects before papers.
4. Test both themes and reduced motion.
5. Do not remount Penrose as an incidental styling change.

## 18. Known trade-offs and non-goals

- The site is on Astro 7.3.2, Tailwind CSS 4.3.3, and Sharp 0.35.4. The former critical AVIF dependency advisory is resolved. `npm audit` still reports a moderate transitive `fflate` advisory through Satori; the current automated remedy is a forced Satori downgrade, so do not run `npm audit fix --force`. OG generation consumes only trusted, repository-controlled fonts, content, and portrait assets; reassess the advisory when Satori publishes a compatible fix.
- The project uses one bilingual DOM rather than separate locale pages. This keeps maintenance compact but means both language strings ship in the same HTML.
- Email obfuscation deters bulk harvesting; it does not provide secrecy.
- Scholar scraping is inherently brittle. The correct failure mode is stale validated data, not failed deployment or fabricated numbers.
- Publication metadata APIs can contain errors. Human review remains required.
- GitHub Pages provides no application-level WAF, rate limiting, server logs, or dynamic honeypot blocking.
- There is no full publications archive route yet; `featured: false` stores data without homepage display.
- There is no CMS. The Git repository and typed content files are the editorial system.
- There is no client framework, and adding one for simple UI behavior is out of scope.

## 19. Reference projects and licensing

The visual foundation originated from `astro-sphere`. Content Collection patterns, the early 404 structure, and timeline ideas were informed by `academic-portfolio-astro`.

The reference checkout may exist beside this repository as `../temp-academic-ref`, but production code must not import files from it. If a reference asset or implementation is actually used:

1. copy/adapt it into this repository;
2. remove unused dependencies and template-specific assumptions;
3. preserve applicable MIT attribution in `LICENSE`;
4. make the production build self-contained;
5. document any important adaptation in the README when it affects maintenance.

Do not depend on the sibling reference directory in build scripts, imports, or GitHub Actions.

The root `LICENSE` is the unmodified MIT software license. `CONTENT-NOTICE.md` defines the separate boundary for identity, portrait, original biographical/research/recruitment prose, bibliographic facts, linked papers, and third-party fonts. Do not move the content exclusions into the MIT text, describe the entire repository as MIT-licensed, or replace the content notice with a Creative Commons license without explicit authorization from the relevant rights holders.

## 20. Definition of done

A change is complete only when all applicable items are true:

- The requested behavior/content is implemented in the correct source of truth.
- English and Chinese remain synchronized where applicable.
- Desktop-specific and mobile-specific layout contracts are preserved.
- Accessibility paths still work.
- Machine-readable output and JSON-LD remain factually consistent.
- Email/privacy invariants are intact.
- No unrelated files or user changes were overwritten.
- `npm run build` completes successfully, including both privacy audits.
- Layout changes were visually inspected at representative desktop and iPhone widths.
- Documentation is updated when a maintenance routine, schema, dependency, or deployment behavior changes.
