# Security and crawler policy

This public academic site prioritizes accessibility to people, search engines, academic indexes, and compliant AI retrieval agents. It does not use CAPTCHAs, browser fingerprint blocking, JavaScript challenges, or content cloaking.

## Controls included in this repository

- The public email address is stored as reversed content fragments and emitted to HTML only as an XOR-obfuscated byte stream.
- The visible Email label is rendered from geometric SVG glyph paths. It contains no SVG `<text>` node, character entity, or SVG link; the enclosing accessible link retains only a non-sensitive `aria-label`.
- Mouse access requires a short sequence of trusted pointer samples with minimum duration and path length before the email link is unlocked. Trusted touch and keyboard paths remain available for mobile and assistive navigation.
- The published HTML, JSON-LD, and `llms.txt` do not contain a continuous email address or static `mailto:` URL.
- Astro's build-time Content Security Policy hashes the site's inline scripts and styles and emits a CSP meta policy in each HTML page.
- `npm run build` audits both source material and generated output for plain email addresses, private-key formats, environment files, backup files, and private/draft directories.
- `robots.txt` allows legitimate indexing while reserving `/_internal_trap/`, `/private/`, and `/drafts/`. These directives are advisory and are not access control.
- Private drafts, credentials, internal slides, proprietary data, and unpublished assets must never be placed in `public/` or committed to this repository.

The SVG outline, email transformation, and movement gate raise the cost of text extraction, regex harvesting, and naive direct-click automation. They do not provide cryptographic secrecy: the decoder ships to every browser, and determined automation can use OCR, reproduce realistic trusted input, or observe the resulting navigation.

## GitHub Pages limitation

GitHub Pages does not expose application middleware, request logs, programmable WAF rules, per-IP rate limiting, or temporary IP bans to this project. A honeypot path cannot enforce a block on GitHub Pages by itself.

## Optional edge protection

If a custom domain is placed behind a CDN or reverse proxy, configure controls there:

1. Exempt verified search-engine and academic crawler traffic.
2. Apply a quiet rate limit such as 30 requests per 10 seconds per IP to repeated HTML/path enumeration, returning HTTP 429.
3. Log requests to `/_internal_trap/` and, after confirming they are not monitoring probes, temporarily block abusive sources.
4. Avoid whole-site managed challenges and CAPTCHA pages.
5. Test `robots.txt`, `llms.txt`, the sitemap, the homepage, and social-preview assets after every rule change.

Edge-provider settings are deployment infrastructure and are not created by this static repository.

## Build dependency boundary

The deployed site is static and does not expose Astro's development server or a Node.js application runtime. The repository uses Astro 7.3.2, Tailwind CSS 4.3.3 through the Vite plugin, and Sharp 0.35.4. This migration resolves the former critical AVIF dependency advisory.

`npm audit` currently reports a moderate transitive advisory in `fflate` through Satori. npm's automated remedy requires a forced Satori downgrade, which is not accepted because it would regress the build-time OG pipeline. The OG generator processes only trusted repository-controlled fonts, portrait imagery, and content; it does not accept user-supplied ZIP input. Maintainers must:

- build only trusted repository content and image assets;
- never expose `astro dev` or `astro preview` to an untrusted network;
- review Satori releases for a compatible transitive fix;
- never run `npm audit fix --force` as routine cleanup;
- review dependency changes and keep GitHub Actions pinned to explicit major versions.
