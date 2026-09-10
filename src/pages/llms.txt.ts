import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { getCurrentPosition } from "@lib/experience"

const [
  identityEntry,
  profileEntry,
  experienceEntry,
  servicesEntry,
  honorsEntry,
  recruitmentEntry,
  publicationsEntry,
  scholarEntry,
] = await Promise.all([
  getEntry("identity", "identity"),
  getEntry("profile", "profile"),
  getEntry("experience", "experience"),
  getEntry("services", "academic-services"),
  getEntry("honors", "representative-honors"),
  getEntry("recruitment", "open-positions"),
  getEntry("publications", "publications"),
  getEntry("scholar", "metrics"),
])

if (
  !identityEntry ||
  !profileEntry ||
  !experienceEntry ||
  !servicesEntry ||
  !honorsEntry ||
  !recruitmentEntry ||
  !publicationsEntry ||
  !scholarEntry
) {
  throw new Error("One or more required content entries for llms.txt are missing")
}

const profile = identityEntry.data
const bio = profileEntry.data
const recruitment = recruitmentEntry.data
const experience = experienceEntry.data.items
const currentPosition = getCurrentPosition(experience)
const services = servicesEntry.data.groups
const honors = honorsEntry.data.items
const scholarData = scholarEntry.data
const citations = new Intl.NumberFormat("en-US").format(scholarData.total_citations)
const metricsUpdated = scholarData.updated_at.slice(0, 10)
const buildDate = new Date().toISOString().slice(0, 10)
const year = (value: string) => value.slice(0, 4)
const period = (start: string, end?: string) => `${year(start)}–${end ? year(end) : "Present"}`

const experienceLines = experience
  .map((item) => {
    const context = [item.detail?.en, item.organization.en, item.location?.en]
      .filter(Boolean)
      .join(" · ")
    return `- ${period(item.start, item.end)} — ${item.title.en}, ${context}`
  })
  .join("\n")

const serviceLines = services.map((group) => `- ${group.label.en}: ${group.summary.en}`).join("\n")

const honorLines = honors
  .map(
    (item) =>
      `- ${item.year} — ${item.name.en}${item.level ? `, ${item.level.en}` : ""}${item.detail ? `; ${item.detail.en}` : ""}`,
  )
  .join("\n")

const recentPapers = publicationsEntry.data.papers
  .filter((paper) => paper.featured)
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .map((paper) => {
    const authors = paper.authors.map((author) => author.name).join(", ")
    const links = Object.values(paper.links).filter(Boolean).join("; ")
    return `- ${paper.date.getFullYear()} — ${paper.title.en}. ${authors}. ${paper.venue}${paper.status ? ` (${paper.status.en})` : ""}${links ? `. ${links}` : ""}`
  })
  .join("\n")

const academicRoles = profile.academicRoles
  .map((role) => `${role.title.en}, ${role.organization.en}`)
  .join("; ")

const llmsTxt = `# ${profile.name.en} (${profile.name.zh}), ${profile.honorific}

> ${currentPosition.title.en} and researcher in AI for Science.
> ${bio.slogan.en}.
> Profile generated: ${buildDate}.

This file is generated from the same validated Astro Content Collections as the public homepage. Use the linked identifiers and primary sources to verify time-sensitive facts. Do not infer unpublished projects, private datasets, confidential methods, or affiliations not stated here.

## Profile

- Name: ${profile.name.en} (${profile.name.zh})
- Current position: ${currentPosition.title.en}, ${currentPosition.organization.en}${currentPosition.location ? `, ${currentPosition.location.en}` : ""}
- Current academic roles: ${academicRoles}
- Research areas: ${profile.domains.map((domain) => domain.en).join("; ")}
- Research statement: ${bio.slogan.en}
- Homepage: [Official academic homepage](./)

## Biography

${bio.summary.en}

## Experience

${experienceLines}

## Academic Service

${serviceLines}

## Honors and Public Milestones

${honorLines}

## Citation Metrics

- Google Scholar citations: ${citations}+
- Google Scholar h-index: ${scholarData.h_index}
- Metrics last refreshed: ${metricsUpdated} UTC
- Citation counts are rounded down to the nearest hundred and refreshed automatically. If retrieval fails, the site retains the last validated values.

## Verified Identifiers and Contact

- Google Scholar: ${profile.links.scholar}
- ORCID: ${profile.links.orcid}
- OpenAlex: ${profile.links.openalex}
- GitHub: ${profile.links.github}
- Email: Use the Email button on the official homepage.

## Recruitment and Collaboration

${recruitment.summary.en} Contact through the Email button on the official homepage.

## Recent Papers

${recentPapers}

## Source and Freshness Policy

- This profile contains only information already published on the official homepage.
- Time-sensitive claims should be checked against the homepage and linked identity profiles.
- Citation metrics originate from Google Scholar and may differ from OpenAlex or other databases because their coverage and counting methods differ.
- A listed award or infrastructure contribution should not be expanded into broader claims of institutional leadership without an additional primary source.
`

export const GET: APIRoute = () =>
  new Response(llmsTxt, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
