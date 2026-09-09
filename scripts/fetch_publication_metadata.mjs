import { readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const PUBLICATIONS_FILE = path.resolve("src/content/publications.md")
const PROFILE_ORCID = "0000-0002-4104-3790"
const PROFILE_NAMES = new Set(["zhixiang ren", "ren zhixiang"])
const USER_AGENT = "ZhixiangRenAcademicSite/1.0 (+https://github.com/AI-HPC-Research-Team)"

const usage = `Usage:
  npm run add-paper -- <DOI|arXiv ID> [options]

Options:
  --zh-title <title>  Set the Chinese title (defaults to the official title)
  --not-featured      Import without showing the paper on the homepage
  --check             Validate remote metadata without printing or writing YAML
  --dry-run           Print the generated YAML without changing the file
  --help              Show this help

Examples:
  npm run add-paper -- 10.1038/s41586-024-00000-0 --zh-title "中文标题"
  npm run add-paper -- 2603.12808 --dry-run`

function parseArguments(argv) {
  const options = { input: "", zhTitle: "", featured: true, check: false, dryRun: false }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === "--help" || value === "-h") {
      console.log(usage)
      process.exit(0)
    }
    if (value === "--dry-run") options.dryRun = true
    else if (value === "--check") options.check = true
    else if (value === "--not-featured") options.featured = false
    else if (value === "--zh-title") {
      options.zhTitle = argv[index + 1] ?? ""
      index += 1
      if (!options.zhTitle) throw new Error("--zh-title requires a value")
    } else if (value.startsWith("--zh-title=")) options.zhTitle = value.slice(11)
    else if (value.startsWith("-")) throw new Error(`Unknown option: ${value}`)
    else if (!options.input) options.input = value
    else throw new Error(`Unexpected argument: ${value}`)
  }
  if (!options.input) throw new Error("Provide a DOI or arXiv identifier")
  return options
}

function normalizeIdentifier(input) {
  const decoded = decodeURIComponent(input.trim())
  const withoutQuery = decoded.split(/[?#]/, 1)[0]
  const doi = withoutQuery
    .replace(/^doi:\s*/i, "")
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
    .trim()
  if (/^10\.\d{4,9}\/.+/i.test(doi)) return { type: "doi", value: doi }

  const arxiv = withoutQuery
    .replace(/^arxiv:\s*/i, "")
    .replace(/^https?:\/\/(?:www\.)?arxiv\.org\/(?:abs|pdf)\//i, "")
    .replace(/\.pdf$/i, "")
    .replace(/v\d+$/i, "")
    .trim()
  if (/^(?:\d{4}\.\d{4,5}|[a-z-]+(?:\.[a-z-]+)?\/\d{7})$/i.test(arxiv)) {
    return { type: "arxiv", value: arxiv }
  }
  throw new Error(`Unrecognized DOI or arXiv identifier: ${input}`)
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "User-Agent": USER_AGENT, ...options.headers },
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText} from ${new URL(url).hostname}`)
  return response
}

const cleanText = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const decodeXml = (value = "") =>
  value
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([\da-f]+);/gi, (_, number) => String.fromCodePoint(Number.parseInt(number, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")

const xmlValue = (xml, tag) => {
  const escapedTag = tag.replace(":", "\\:")
  const match = xml.match(
    new RegExp(`<${escapedTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedTag}>`, "i"),
  )
  return match ? cleanText(decodeXml(match[1])) : ""
}

function formatBibtex(value) {
  const text = value.trim()
  const firstComma = text.indexOf(",")
  const closingBrace = text.lastIndexOf("}")
  if (!text.startsWith("@") || firstComma < 0 || closingBrace <= firstComma) return text

  const fields = []
  let current = ""
  let depth = 0
  for (const character of text.slice(firstComma + 1, closingBrace)) {
    if (character === "{") depth += 1
    if (character === "}") depth -= 1
    if (character === "," && depth === 0) {
      if (current.trim()) fields.push(current.trim())
      current = ""
    } else {
      current += character
    }
  }
  if (current.trim()) fields.push(current.trim())
  if (!fields.length) return text
  return `${text.slice(0, firstComma).trim()},\n${fields.map((field) => `  ${field}`).join(",\n")}\n}`
}

function dateFromParts(parts) {
  const [year, month = 1, day = 1] = parts ?? []
  if (!year) return new Date().toISOString().slice(0, 10)
  return [year, String(month).padStart(2, "0"), String(day).padStart(2, "0")].join("-")
}

function isPrincipalAuthor(author) {
  const normalizedName = author.name
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  const normalizedOrcid = (author.orcid ?? "").replace(/^https?:\/\/orcid\.org\//i, "")
  return normalizedOrcid === PROFILE_ORCID || PROFILE_NAMES.has(normalizedName)
}

async function abbreviateVenue(title) {
  try {
    const response = await request(
      `https://abbreviso.toolforge.org/abbreviso/a/${encodeURIComponent(title)}?lang=all`,
    )
    return cleanText(await response.text())
  } catch (error) {
    console.warn(
      `ISO 4 abbreviation was not available; retaining the full journal title (${error.message})`,
    )
    return ""
  }
}

async function fetchBibtex(doi) {
  try {
    const response = await request(`https://doi.org/${encodeURIComponent(doi)}`, {
      headers: { Accept: "application/x-bibtex" },
    })
    return formatBibtex(await response.text())
  } catch (error) {
    console.warn(`BibTeX was not available; continuing with core metadata (${error.message})`)
    return ""
  }
}

async function fetchCrossref(doi) {
  const response = await request(`https://api.crossref.org/works/${encodeURIComponent(doi)}`)
  const payload = await response.json()
  const item = payload?.message
  if (!item || !Array.isArray(item.title)) throw new Error("Crossref returned incomplete metadata")
  const dateParts =
    item["published-print"]?.["date-parts"]?.[0] ??
    item["published-online"]?.["date-parts"]?.[0] ??
    item.issued?.["date-parts"]?.[0]
  const authors = (item.author ?? [])
    .map((author) => ({
      name: [author.given, author.family].filter(Boolean).join(" ").trim(),
      orcid: author.ORCID ?? "",
    }))
    .filter((author) => author.name)
  if (!authors.length) throw new Error("Crossref returned no authors")
  const isPreprint = item.type === "posted-content" || item.subtype === "preprint"
  const venue = isPreprint
    ? cleanText(
        item.institution?.[0]?.name || item["container-title"]?.[0] || item.publisher || "Preprint",
      )
    : cleanText(item["container-title"]?.[0] || item.publisher || "Published work")
  const crossrefVenueShort = cleanText(item["short-container-title"]?.[0] || "")
  const hasUsefulCrossrefShort =
    crossrefVenueShort &&
    crossrefVenueShort.localeCompare(venue, undefined, { sensitivity: "base" }) !== 0
  const venueShort = isPreprint
    ? ""
    : hasUsefulCrossrefShort
      ? crossrefVenueShort
      : await abbreviateVenue(venue)
  return {
    source: "crossref",
    date: dateFromParts(dateParts),
    title: cleanText(item.title[0]),
    authors,
    venue,
    venueShort,
    statusEn: isPreprint ? "Preprint" : "Published",
    statusZh: isPreprint ? "预印本" : "已发表",
    abstract: cleanText(item.abstract),
    bibtex: await fetchBibtex(doi),
    links: { doi: `https://doi.org/${doi}` },
  }
}

function arxivBibtex(metadata, arxivId, category) {
  const family =
    metadata.authors[0]?.name
      .split(/\s+/)
      .at(-1)
      ?.replace(/[^a-z0-9]/gi, "") || "paper"
  const keyword =
    metadata.title
      .split(/\s+/)
      .find((word) => word.length > 4)
      ?.replace(/[^a-z0-9]/gi, "") || "work"
  const key = `${family}${metadata.date.slice(0, 4)}${keyword}`
  return `@misc{${key},\n  title = {${metadata.title}},\n  author = {${metadata.authors.map(({ name }) => name).join(" and ")}},\n  year = {${metadata.date.slice(0, 4)}},\n  eprint = {${arxivId}},\n  archivePrefix = {arXiv}${category ? `,\n  primaryClass = {${category}}` : ""}\n}`
}

async function fetchArxiv(arxivId) {
  const response = await request(
    `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(arxivId)}`,
  )
  const xml = await response.text()
  const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/i)?.[1]
  if (!entry) throw new Error("arXiv returned no matching entry")
  const title = xmlValue(entry, "title")
  const published = xmlValue(entry, "published").slice(0, 10)
  const authors = [...entry.matchAll(/<author>([\s\S]*?)<\/author>/gi)]
    .map((match) => ({ name: xmlValue(match[1], "name"), orcid: "" }))
    .filter((author) => author.name)
  if (!title || !published || !authors.length) throw new Error("arXiv returned incomplete metadata")
  const doi = xmlValue(entry, "arxiv:doi")
  const category = entry.match(/<category\s+term=["']([^"']+)["']/i)?.[1] ?? ""
  const metadata = {
    source: "arxiv",
    date: published,
    title,
    authors,
    venue: "arXiv",
    venueShort: "",
    statusEn: "Preprint",
    statusZh: "预印本",
    abstract: xmlValue(entry, "summary"),
    links: {
      arxiv: `https://arxiv.org/abs/${arxivId}`,
      ...(doi ? { doi: `https://doi.org/${doi}` } : {}),
    },
  }
  return { ...metadata, bibtex: arxivBibtex(metadata, arxivId, category) }
}

const quote = (value) => JSON.stringify(value.replace(/[\u0000-\u001f]/g, " "))

function yamlBlock(value, indentation = 6) {
  if (!value) return ""
  const spaces = " ".repeat(indentation)
  return `\n    bibtex: |-\n${value
    .split("\n")
    .map((line) => `${spaces}${line}`)
    .join("\n")}`
}

function toYaml(metadata, options) {
  const authors = metadata.authors
    .map((author) => {
      const principal = isPrincipalAuthor(author) ? ", principal: true" : ""
      return `      - { name: ${quote(author.name)}${principal} }`
    })
    .join("\n")
  const links = Object.entries(metadata.links)
    .map(([name, url]) => `      ${name}: ${quote(url)}`)
    .join("\n")
  return `  - date: ${metadata.date}
    title:
      en: ${quote(metadata.title)}
      zh: ${quote(options.zhTitle || metadata.title)}
    authors:
${authors}
    venue: ${quote(metadata.venue)}
${metadata.venueShort ? `    venueShort: ${quote(metadata.venueShort)}\n` : ""}    status: { en: ${quote(metadata.statusEn)}, zh: ${quote(metadata.statusZh)} }
    source: ${metadata.source}${metadata.abstract ? `\n    abstract: ${quote(metadata.abstract)}` : ""}${yamlBlock(metadata.bibtex)}
    links:
${links}
    featured: ${options.featured}`
}

function duplicateNeedle(identifier) {
  return identifier.type === "doi"
    ? `https://doi.org/${identifier.value}`.toLowerCase()
    : `https://arxiv.org/abs/${identifier.value}`.toLowerCase()
}

async function appendToCollection(snippet, identifier) {
  const existing = await readFile(PUBLICATIONS_FILE, "utf8")
  if (existing.toLowerCase().includes(duplicateNeedle(identifier))) {
    throw new Error(`${identifier.value} already exists in publications.md`)
  }
  const closingFence = existing.lastIndexOf("\n---")
  if (!existing.startsWith("---\n") || closingFence < 4 || !existing.includes("\npapers:\n")) {
    throw new Error("publications.md does not contain the expected frontmatter and papers array")
  }
  const updated = `${existing.slice(0, closingFence).trimEnd()}\n\n${snippet}\n---${existing.slice(closingFence + 4)}`
  const temporary = `${PUBLICATIONS_FILE}.tmp`
  await writeFile(temporary, updated, "utf8")
  await rename(temporary, PUBLICATIONS_FILE)
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  const identifier = normalizeIdentifier(options.input)
  console.log(
    `Fetching ${identifier.type === "doi" ? "Crossref" : "arXiv"} metadata for ${identifier.value}...`,
  )
  const metadata =
    identifier.type === "doi"
      ? await fetchCrossref(identifier.value)
      : await fetchArxiv(identifier.value)
  const snippet = toYaml(metadata, options)
  if (options.check) {
    console.log(
      `Validated: ${metadata.title} · ${metadata.date.slice(0, 4)} · ${metadata.venueShort || metadata.venue} · ${metadata.authors.length} authors${metadata.bibtex ? " · BibTeX" : ""}`,
    )
    return
  }
  if (options.dryRun) {
    console.log(`\n${snippet}\n`)
    return
  }
  await appendToCollection(snippet, identifier)
  console.log(`Added “${metadata.title}” to src/content/publications.md`)
  if (!options.zhTitle)
    console.warn(
      "Chinese title defaults to the official title; translate the zh field before publishing if needed.",
    )
  if (!metadata.authors.some(isPrincipalAuthor))
    console.warn(
      "Zhixiang Ren was not identified automatically; review the authors and principal flag.",
    )
}

main().catch((error) => {
  console.error(`Failed to add publication: ${error.message}`)
  process.exitCode = 1
})
