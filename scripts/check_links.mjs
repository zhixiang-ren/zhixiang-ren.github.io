#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises"
import { extname, relative, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import process from "node:process"
import * as cheerio from "cheerio"
import YAML from "yaml"

const root = resolve(import.meta.dirname, "..")
const dist = resolve(root, "dist")
const publications = resolve(root, "src/content/publications.md")
const timeoutMs = 6_000
const concurrency = 8

function externalUrl(value) {
  try {
    const url = new URL(value)
    if (!["https:", "http:"].includes(url.protocol)) return null
    if (["localhost", "127.0.0.1", "::1"].includes(url.hostname)) return null
    return url.href
  } catch {
    return null
  }
}

async function htmlFiles(directory) {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = resolve(directory, entry.name)
    if (entry.isDirectory()) result.push(...(await htmlFiles(absolute)))
    else if (extname(entry.name) === ".html") result.push(absolute)
  }
  return result
}

export async function collectLinks() {
  const links = new Map()
  const add = (value, source) => {
    const url = externalUrl(value)
    if (url && !links.has(url)) links.set(url, source)
  }
  for (const file of await htmlFiles(dist)) {
    const $ = cheerio.load(await readFile(file, "utf8"))
    $("a[href]").each((_, node) => add($(node).attr("href"), relative(root, file)))
  }
  // Include archive-only publications that do not appear in the homepage HTML.
  const content = await readFile(publications, "utf8")
  const closing = content.lastIndexOf("\n---")
  const papers = YAML.parse(content.slice(4, closing))?.papers ?? []
  for (const [index, paper] of papers.entries())
    for (const value of Object.values(paper.links ?? {}))
      add(value, `src/content/publications.md paper ${index + 1}`)
  return links
}

async function request(url, method) {
  const response = await fetch(url, {
    method,
    redirect: "follow",
    headers: {
      "User-Agent": "ZhixiangRenAcademicSite-LinkAudit/1.0",
      ...(method === "GET" ? { Range: "bytes=0-0" } : {}),
    },
    signal: AbortSignal.timeout(timeoutMs),
  })
  await response.body?.cancel()
  return response.status
}

export async function probeLink(url, requester = request) {
  try {
    const headStatus = await requester(url, "HEAD")
    if (headStatus >= 200 && headStatus < 400) return { kind: "ok", status: headStatus }
    // HEAD is often blocked or incorrectly reports 404 on academic publishers.
    if (headStatus !== 429) {
      const getStatus = await requester(url, "GET")
      if (getStatus >= 200 && getStatus < 400) return { kind: "ok", status: getStatus }
      if (getStatus === 404 || getStatus === 410) return { kind: "broken", status: getStatus }
      return { kind: "unverified", status: getStatus }
    }
    return { kind: "unverified", status: headStatus }
  } catch (error) {
    return { kind: "unverified", reason: error.message }
  }
}

export async function checkLinks() {
  const entries = [...(await collectLinks()).entries()]
  let next = 0
  const results = []
  await Promise.all(
    Array.from({ length: Math.min(concurrency, entries.length) }, async () => {
      while (next < entries.length) {
        const [url, source] = entries[next++]
        results.push({ url, source, ...(await probeLink(url)) })
      }
    }),
  )
  const broken = results.filter((result) => result.kind === "broken")
  const unverified = results.filter((result) => result.kind === "unverified")
  for (const result of broken)
    console.warn(
      `::warning::Broken external link (${result.status}): ${result.url} [${result.source}]`,
    )
  for (const result of unverified.slice(0, 5))
    console.info(
      `Unverified external link (${result.status ?? result.reason}): ${result.url} [${result.source}]`,
    )
  if (unverified.length > 5) console.info(`...and ${unverified.length - 5} more unverified links.`)
  console.log(
    `External link audit: ${results.length} unique URLs; ${broken.length} broken, ${unverified.length} unverified (network, rate limit, or publisher restrictions).`,
  )
  // A third-party server must not turn a valid static-site release into a failed deployment.
  return { checked: results.length, broken, unverified }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  checkLinks().catch((error) => {
    console.error(`Link audit could not run: ${error.message}`)
    process.exitCode = 1
  })
}
