import type { APIRoute } from "astro"

const basePath = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`
const sitemapURL = new URL(`${basePath.replace(/^\/+/, "")}sitemap-index.xml`, import.meta.env.SITE)
const llmsURL = new URL(`${basePath.replace(/^\/+/, "")}llms.txt`, import.meta.env.SITE)
const blockedPaths = ["_internal_trap/", "private/", "drafts/"].map((path) => `${basePath}${path}`)
const disallowRules = blockedPaths.map((path) => `Disallow: ${path}`).join("\n")

const robotsTxt = `
# robots.txt for the academic homepage of Zhixiang Ren
# Public pages and rendering assets are available to search and AI crawlers.
User-agent: *
User-agent: Googlebot
User-agent: bingbot
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: PerplexityBot
User-agent: ClaudeBot
Allow: /
${disallowRules}

Sitemap: ${sitemapURL.href}
# LLM-readable academic profile: ${llmsURL.href}
`.trim()

export const GET: APIRoute = () => {
  return new Response(`${robotsTxt}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
