#!/usr/bin/env node
/** Refresh the validated Google Scholar snapshot without changing ordinary builds. */

import { execFile } from "node:child_process"
import { randomUUID } from "node:crypto"
import { readFile, rename, unlink, writeFile } from "node:fs/promises"
import { dirname, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"
import * as cheerio from "cheerio"

const execFileAsync = promisify(execFile)
const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const OUTPUT_PATH = resolve(PROJECT_ROOT, "src/content/scholar.json")
const DEFAULT_AUTHOR_KEY = "ec_pCdEAAAAJ"
const DEFAULT_LOCAL_PROXY = "socks5h://127.0.0.1:7897"
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
const METRIC_FIELDS = [
  "source",
  "author_key",
  "author_name",
  "total_citations",
  "h_index",
  "i10_index",
  "is_placeholder",
]

function parseNumber(value) {
  const digits = value.replace(/[^0-9]/g, "")
  if (!digits) throw new Error(`Invalid metric value: ${JSON.stringify(value)}`)
  return Number.parseInt(digits, 10)
}

export function parseProfile(html) {
  const lowered = html.toLowerCase()
  if (
    lowered.includes("our systems have detected unusual traffic") ||
    lowered.includes("g-recaptcha")
  ) {
    throw new Error("Google returned a bot-check page")
  }

  const $ = cheerio.load(html)
  const authorName = $("#gsc_prf_in").text().replace(/\s+/g, " ").trim()
  const metrics = new Map()

  $("#gsc_rsb_st tr").each((_, row) => {
    const cells = $(row)
      .children("td, th")
      .map((_, cell) => $(cell).text().replace(/\s+/g, " ").trim())
      .get()
    if (cells.length >= 2) metrics.set(cells[0].toLowerCase(), cells[1])
  })

  const required = ["citations", "h-index", "i10-index"]
  const missing = required.filter((key) => !metrics.has(key))
  if (missing.length) throw new Error(`Scholar metrics table is missing: ${missing.join(", ")}`)
  if (!authorName) throw new Error("Scholar profile is missing the author name")

  return {
    author_name: authorName,
    total_citations: Math.floor(parseNumber(metrics.get("citations")) / 100) * 100,
    h_index: parseNumber(metrics.get("h-index")),
    i10_index: parseNumber(metrics.get("i10-index")),
  }
}

async function fetchProfile(authorKey, proxyUrl) {
  const url = new URL("https://scholar.google.com/citations")
  url.search = new URLSearchParams({ hl: "en", user: authorKey }).toString()
  const args = [
    "--silent",
    "--show-error",
    "--location",
    "--fail",
    "--compressed",
    "--max-time",
    "25",
    "--retry",
    "1",
    "--user-agent",
    USER_AGENT,
    "--header",
    "Accept-Language: en-US,en;q=0.9",
  ]
  if (proxyUrl) args.push("--proxy", proxyUrl)
  args.push(url.toString())

  try {
    const { stdout } = await execFileAsync("curl", args, {
      timeout: 35_000,
      maxBuffer: 8 * 1024 * 1024,
      encoding: "utf8",
    })
    return stdout
  } catch (error) {
    // execFile's default error message includes the full command and may expose proxy credentials.
    const detail = proxyUrl
      ? `curl failed via proxy (status ${error.code ?? "unknown"})`
      : error.stderr?.trim() || `curl exited with status ${error.code ?? "unknown"}`
    throw new Error(detail)
  }
}

export async function hasMetricChanges(data, outputPath = OUTPUT_PATH) {
  try {
    const previous = JSON.parse(await readFile(outputPath, "utf8"))
    return METRIC_FIELDS.some((field) => previous[field] !== data[field])
  } catch (error) {
    if (error.code === "ENOENT" || error instanceof SyntaxError) return true
    throw error
  }
}

async function writeAtomically(data) {
  const temporaryPath = `${OUTPUT_PATH}.${randomUUID()}.tmp`
  try {
    await writeFile(temporaryPath, `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" })
    await rename(temporaryPath, OUTPUT_PATH)
  } finally {
    await unlink(temporaryPath).catch((error) => {
      if (error.code !== "ENOENT") throw error
    })
  }
}

async function refresh(authorKey, proxyUrl) {
  const attempts = [{ label: "direct", proxy: null }]
  if (proxyUrl) attempts.push({ label: "proxy", proxy: proxyUrl })

  const errors = []
  for (const { label, proxy } of attempts) {
    try {
      const metrics = parseProfile(await fetchProfile(authorKey, proxy))
      console.log(`Google Scholar fetch succeeded via ${label}`)
      return {
        source: "Google Scholar",
        author_key: authorKey,
        ...metrics,
        updated_at: new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00"),
        is_placeholder: false,
      }
    } catch (error) {
      errors.push(`${label}: ${error.message}`)
    }
  }
  throw new Error(errors.join("; "))
}

async function main() {
  const unknownArgs = process.argv.slice(2).filter((argument) => argument !== "--allow-stale")
  if (unknownArgs.length) throw new Error(`Unknown argument: ${unknownArgs[0]}`)

  const allowStale = process.argv.includes("--allow-stale")
  const authorKey = (process.env.SCHOLAR_AUTHOR_KEY || DEFAULT_AUTHOR_KEY).trim()
  const configuredProxy = (process.env.SCHOLAR_PROXY_URL || "").trim()
  const proxyUrl = configuredProxy || (process.env.CI === "true" ? null : DEFAULT_LOCAL_PROXY)

  let result
  try {
    result = await refresh(authorKey, proxyUrl)
  } catch (error) {
    if (allowStale) {
      try {
        await readFile(OUTPUT_PATH)
        console.warn(
          `::warning::Google Scholar sync failed; keeping existing metrics. ${error.message}`,
        )
        return
      } catch (readError) {
        if (readError.code !== "ENOENT") throw readError
      }
    }
    throw new Error(`Google Scholar sync failed: ${error.message}`)
  }

  if (!(await hasMetricChanges(result))) {
    console.log("Google Scholar metrics are unchanged; keeping the checked-in snapshot")
    return
  }

  await writeAtomically(result)
  console.log(
    `Updated ${relative(PROJECT_ROOT, OUTPUT_PATH)} for ${result.author_name} (${authorKey})`,
  )
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
