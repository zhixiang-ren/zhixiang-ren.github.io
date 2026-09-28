#!/usr/bin/env node
import { readFile, rename, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import process from "node:process"
import YAML from "yaml"
import {
  fetchArxiv,
  fetchCrossref,
  normalizeIdentifier,
  toYaml,
} from "./fetch_publication_metadata.mjs"

const root = resolve(import.meta.dirname, "..")
const sourcePath = resolve(root, "src/data/publication-sources.yaml")
const outputPath = resolve(root, "src/content/publications.md")

function key(identifier) {
  return `${identifier.type}:${identifier.value.toLowerCase()}`
}

function validateEntry(entry, index) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry))
    throw new Error(`papers[${index}] must be an object`)
  const allowed = new Set(["doi", "arxiv", "code", "featured"])
  for (const field of Object.keys(entry))
    if (!allowed.has(field)) throw new Error(`papers[${index}] has unsupported field ${field}`)
  if (Boolean(entry.doi) === Boolean(entry.arxiv))
    throw new Error(`papers[${index}] needs exactly one DOI or arXiv ID`)
  const identifier = normalizeIdentifier(String(entry.doi ?? `arxiv:${entry.arxiv}`))
  if (entry.doi && identifier.type !== "doi") throw new Error(`papers[${index}] has invalid DOI`)
  if (entry.arxiv && identifier.type !== "arxiv")
    throw new Error(`papers[${index}] has invalid arXiv ID`)
  if (entry.code !== undefined) {
    if (typeof entry.code !== "string" || new URL(entry.code).protocol !== "https:")
      throw new Error(`papers[${index}] code must be an HTTPS URL`)
  }
  if (entry.featured !== undefined && typeof entry.featured !== "boolean")
    throw new Error(`papers[${index}] featured must be true or false`)
  return identifier
}

function readSnapshot(raw) {
  const opening = raw.indexOf("\n  - date:")
  const closing = raw.lastIndexOf("\n---")
  if (!raw.startsWith("---\n") || opening < 0 || closing < opening)
    throw new Error("publications.md has an unexpected frontmatter layout")
  const prefix = raw.slice(0, opening)
  const suffix = raw.slice(closing + 4)
  const chunks = raw.slice(opening + 1, closing).split(/\n\s*\n(?=  - date:)/)
  const records = new Map()
  for (const chunk of chunks) {
    const paper = YAML.parse(`papers:\n${chunk}`).papers[0]
    const input = paper.links?.doi ?? paper.links?.arxiv
    if (!input) throw new Error(`Snapshot paper ${paper.title?.en} has no DOI/arXiv link`)
    const identifier = normalizeIdentifier(input)
    if (records.has(key(identifier))) throw new Error(`Duplicate snapshot ID: ${key(identifier)}`)
    records.set(key(identifier), { chunk, paper })
  }
  return { prefix, suffix, records }
}

async function fetchPaper(identifier) {
  return identifier.type === "doi" ? fetchCrossref(identifier.value) : fetchArxiv(identifier.value)
}

function snapshotMatches(record, entry) {
  return (
    (record.paper.links?.code ?? null) === (entry.code ?? null) &&
    record.paper.featured === (entry.featured ?? true) &&
    record.paper.title?.zh === record.paper.title?.en
  )
}

async function main() {
  const args = process.argv.slice(2)
  const addIndex = args.indexOf("--add")
  const codeIndex = args.indexOf("--code")
  const addValue = addIndex >= 0 ? args[addIndex + 1] : null
  const code = codeIndex >= 0 ? args[codeIndex + 1] : undefined
  const dryRun = args.includes("--dry-run")
  const check = args.includes("--check")
  const refresh = args.includes("--refresh")
  const allowed = new Set([
    "--add",
    "--code",
    "--dry-run",
    "--check",
    "--refresh",
    "--not-featured",
  ])
  for (const [index, arg] of args.entries()) {
    if ((addIndex >= 0 && index === addIndex + 1) || (codeIndex >= 0 && index === codeIndex + 1))
      continue
    if (!allowed.has(arg)) throw new Error(`Unknown argument: ${arg}`)
  }
  if ((addIndex >= 0 && !addValue) || (codeIndex >= 0 && !code))
    throw new Error("--add and --code require values")
  if (check && (addValue || refresh || dryRun))
    throw new Error("--check cannot be combined with --add, --refresh or --dry-run")
  if ((code || args.includes("--not-featured")) && !addValue)
    throw new Error("--code and --not-featured require --add")

  const source = YAML.parse(await readFile(sourcePath, "utf8"))
  if (!Array.isArray(source?.papers)) throw new Error("publication-sources.yaml needs papers array")
  const seen = new Set()
  for (const [index, entry] of source.papers.entries()) {
    const identifier = validateEntry(entry, index)
    if (seen.has(key(identifier))) throw new Error(`Duplicate source ID: ${key(identifier)}`)
    seen.add(key(identifier))
  }
  let added = null
  if (addValue) {
    const identifier = normalizeIdentifier(addValue)
    if (seen.has(key(identifier)))
      throw new Error(`${identifier.value} already exists in source YAML`)
    added = {
      [identifier.type]: identifier.value,
      ...(code ? { code } : {}),
      ...(args.includes("--not-featured") ? { featured: false } : {}),
    }
    validateEntry(added, source.papers.length)
    source.papers.push(added)
  }

  const previous = await readFile(outputPath, "utf8")
  const snapshot = readSnapshot(previous)
  if (check && !added) {
    if (source.papers.length !== snapshot.records.size)
      throw new Error("Source/snapshot count differs")
    for (const entry of source.papers) {
      const record = snapshot.records.get(key(validateEntry(entry, 0)))
      if (!record || !snapshotMatches(record, entry))
        throw new Error(
          `Snapshot is stale for ${entry.doi ?? entry.arxiv}; run npm run sync:papers`,
        )
    }
    console.log(`Publication source and snapshot agree (${source.papers.length} papers).`)
    return
  }

  const chunks = []
  for (const entry of source.papers) {
    const identifier = validateEntry(entry, 0)
    const cached = snapshot.records.get(key(identifier))
    if (cached && !refresh && snapshotMatches(cached, entry)) {
      chunks.push(cached.chunk)
      continue
    }
    // Updating an editorial override requires no external request.
    if (cached && !refresh) {
      const paper = structuredClone(cached.paper)
      paper.title.zh = paper.title.en
      if (entry.code) paper.links.code = entry.code
      else delete paper.links.code
      paper.featured = entry.featured ?? true
      chunks.push(
        toYaml(
          {
            source: paper.source,
            date:
              typeof paper.date === "string" ? paper.date : paper.date.toISOString().slice(0, 10),
            title: paper.title.en,
            authors: paper.authors,
            venue: paper.venue,
            venueShort: paper.venueShort,
            statusEn: paper.status?.en,
            statusZh: paper.status?.zh,
            abstract: paper.abstract,
            bibtex: paper.bibtex,
            links: paper.links,
          },
          { featured: paper.featured },
        ),
      )
      continue
    }
    console.log(`Fetching ${identifier.type} metadata for ${identifier.value}...`)
    const metadata = await fetchPaper(identifier)
    if (entry.code) metadata.links.code = entry.code
    chunks.push(toYaml(metadata, { featured: entry.featured ?? true }))
  }
  const updated = `${snapshot.prefix}\n${chunks.join("\n\n")}\n---${snapshot.suffix}`
  if (dryRun) {
    console.log(
      added
        ? chunks.at(-1)
        : `Would ${refresh ? "refresh" : "synchronize"} ${chunks.length} papers`,
    )
    return
  }
  if (added) {
    const manifest = YAML.stringify(source)
    const temporary = `${sourcePath}.tmp`
    await writeFile(temporary, manifest, "utf8")
    await rename(temporary, sourcePath)
  }
  if (updated !== previous) {
    const temporary = `${outputPath}.tmp`
    await writeFile(temporary, updated, "utf8")
    await rename(temporary, outputPath)
    console.log(`Updated src/content/publications.md (${chunks.length} papers).`)
  } else console.log(`Publication snapshot is current (${chunks.length} papers).`)
}

main().catch((error) => {
  console.error(`Publication sync failed: ${error.message}`)
  process.exitCode = 1
})
