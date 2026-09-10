import { getEntry } from "astro:content"
import type { APIRoute } from "astro"

const escapeXML = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")

const identityEntry = await getEntry("identity", "identity")
const profileEntry = await getEntry("profile", "profile")
const publicationsEntry = await getEntry("publications", "publications")

if (!identityEntry || !profileEntry || !publicationsEntry) {
  throw new Error("Missing profile or publication content required for RSS")
}

const profile = identityEntry.data
const bio = profileEntry.data
const papers = [...publicationsEntry.data.papers].sort(
  (left, right) => right.date.getTime() - left.date.getTime(),
)
const basePath = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`
const siteURL = new URL(basePath, import.meta.env.SITE)
const feedURL = new URL(`${basePath.replace(/^\/+/, "")}rss.xml`, import.meta.env.SITE)

const items = papers
  .map((paper) => {
    const title = paper.title.en
    const destination = paper.links.doi ?? paper.links.arxiv ?? paper.links.paper ?? siteURL.href
    const authors = paper.authors.map((author) => author.name).join(", ")
    const publication = [paper.venue, paper.status?.en, String(paper.date.getUTCFullYear())]
      .filter(Boolean)
      .join(" · ")
    const description = [authors, publication, paper.abstract].filter(Boolean).join("\n\n")
    const guid = paper.links.doi ?? paper.links.arxiv ?? `${paper.date.toISOString()}:${title}`

    return `    <item>
      <title>${escapeXML(title)}</title>
      <link>${escapeXML(destination)}</link>
      <guid isPermaLink="false">${escapeXML(guid)}</guid>
      <pubDate>${paper.date.toUTCString()}</pubDate>
      <description>${escapeXML(description)}</description>
    </item>`
  })
  .join("\n")

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXML(`${profile.name.en} · Recent Papers`)}</title>
    <link>${escapeXML(siteURL.href)}</link>
    <description>${escapeXML(bio.description.en)}</description>
    <language>en</language>
    <atom:link href="${escapeXML(feedURL.href)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

export const GET: APIRoute = () =>
  new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
