import { access, readdir, readFile } from "node:fs/promises"
import { extname, relative, resolve } from "node:path"

const projectRoot = resolve(import.meta.dirname, "..")
const mode = process.argv[2]
const sourceRoots = [resolve(projectRoot, "public"), resolve(projectRoot, "src")]
const outputRoots = [resolve(projectRoot, "dist")]
const roots = mode === "--output" ? outputRoots : mode === "--source" ? sourceRoots : []

if (roots.length === 0) {
  console.error("Usage: node scripts/audit_release.mjs --source|--output")
  process.exit(2)
}

const forbiddenDirectoryNames = new Set([
  "private",
  "draft",
  "drafts",
  "internal",
  "backup",
  "backups",
])
const forbiddenExtensions = new Set([
  ".env",
  ".pem",
  ".key",
  ".p12",
  ".pfx",
  ".bak",
  ".backup",
  ".sqlite",
  ".db",
])
const forbiddenFileNames = new Set([".netrc", ".npmrc", "credentials.json", "id_ed25519", "id_rsa"])
const internalInstructionFileNames = new Set(["llmtxt-instruction.md", "llmtxt-instructions.md"])
const textExtensions = new Set([
  ".astro",
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".txt",
  ".xml",
  ".yaml",
  ".yml",
])
const plainEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
const privateKeyHeader = /-----BEGIN (?:[A-Z0-9]+ )?PRIVATE KEY-----/
const findings = []

async function auditRequiredOutput() {
  const requiredFiles = [
    "404.html",
    "index.html",
    "llms.txt",
    "og/default.png",
    "robots.txt",
    "sitemap-index.xml",
  ]

  for (const file of requiredFiles) {
    try {
      await access(resolve(projectRoot, "dist", file))
    } catch {
      findings.push(`dist/${file}: required release artifact is missing`)
    }
  }

  try {
    const png = await readFile(resolve(projectRoot, "dist/og/default.png"))
    const hasPngSignature = png
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    const width = png.length >= 24 ? png.readUInt32BE(16) : 0
    const height = png.length >= 24 ? png.readUInt32BE(20) : 0

    if (!hasPngSignature || width !== 1200 || height !== 630) {
      findings.push(`dist/og/default.png: expected a 1200x630 PNG, received ${width}x${height}`)
    }
  } catch {
    // The missing-file finding above already reports this failure.
  }
}

async function auditDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = resolve(directory, entry.name)
    const displayPath = relative(projectRoot, fullPath)
    if (entry.isDirectory()) {
      if (forbiddenDirectoryNames.has(entry.name.toLowerCase()))
        findings.push(`${displayPath}: forbidden directory`)
      else await auditDirectory(fullPath)
      continue
    }
    const extension = extname(entry.name).toLowerCase()
    const normalizedName = entry.name.toLowerCase()
    if (internalInstructionFileNames.has(normalizedName)) {
      findings.push(`${displayPath}: internal instruction file must not be published`)
      continue
    }
    if (
      forbiddenExtensions.has(extension) ||
      forbiddenFileNames.has(normalizedName) ||
      normalizedName.startsWith(".env")
    ) {
      findings.push(`${displayPath}: forbidden file type`)
      continue
    }
    if (textExtensions.has(extension)) {
      const content = await readFile(fullPath, "utf8")
      if (plainEmail.test(content)) findings.push(`${displayPath}: contains a plain email address`)
      if (privateKeyHeader.test(content))
        findings.push(`${displayPath}: contains a private-key header`)
      if (mode === "--output" && /mailto:/i.test(content))
        findings.push(`${displayPath}: contains a static mailto link`)
    }
  }
}

for (const root of roots) await auditDirectory(root)
if (mode === "--output") await auditRequiredOutput()

if (findings.length > 0) {
  console.error(
    "Release privacy audit failed:\n" + findings.map((finding) => `- ${finding}`).join("\n"),
  )
  process.exit(1)
}

console.log(`Release privacy audit passed (${mode.slice(2)}).`)
