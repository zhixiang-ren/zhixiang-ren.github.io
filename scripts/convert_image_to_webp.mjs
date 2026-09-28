import { lstat, mkdir, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import sharp from "sharp"

const usage = `Usage:
  npm run convert:image -- <input> [options]

Options:
  --output <path>      Output WebP (default: next to input, same basename)
  --max-width <px>     Maximum width without upscaling (default: 1600)
  --max-height <px>    Maximum height without upscaling (default: 1600)
  --quality <1-100>    WebP quality (default: 82)
  --help               Show this help

Portrait example:
  npm run convert:image -- photo.png --output src/assets/portrait-20260928.webp --max-width 800`

function parseArguments(argv) {
  const options = {
    input: undefined,
    output: undefined,
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 82,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === "--help" || argument === "-h") {
      console.log(usage)
      process.exit(0)
    }

    if (["--output", "--max-width", "--max-height", "--quality"].includes(argument)) {
      const value = argv[++index]
      if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value`)
      if (argument === "--output") options.output = path.resolve(value)
      else if (argument === "--max-width") options.maxWidth = Number(value)
      else if (argument === "--max-height") options.maxHeight = Number(value)
      else options.quality = Number(value)
    } else if (argument.startsWith("-")) {
      throw new Error(`Unknown option: ${argument}`)
    } else if (!options.input) {
      options.input = path.resolve(argument)
    } else {
      throw new Error(`Unexpected argument: ${argument}`)
    }
  }

  if (!options.input) throw new Error(`An input image is required.\n${usage}`)
  options.output ??= path.join(
    path.dirname(options.input),
    `${path.parse(options.input).name}.webp`,
  )
  if (options.input === options.output) throw new Error("Input and output must be different files")
  if (path.extname(options.output).toLowerCase() !== ".webp") {
    throw new Error("Output path must end in .webp")
  }
  for (const [name, value] of [
    ["--max-width", options.maxWidth],
    ["--max-height", options.maxHeight],
  ]) {
    if (!Number.isInteger(value) || value < 1 || value > 10000) {
      throw new Error(`${name} must be an integer between 1 and 10000`)
    }
  }
  if (!Number.isInteger(options.quality) || options.quality < 1 || options.quality > 100) {
    throw new Error("--quality must be an integer between 1 and 100")
  }
  return options
}

async function convert({ input, output, maxWidth, maxHeight, quality }) {
  try {
    await lstat(output)
    throw new Error(`Output already exists; choose a new filename to preserve it: ${output}`)
  } catch (error) {
    if (error.code !== "ENOENT") throw error
  }

  const original = await sharp(input).metadata()
  if (!original.width || !original.height) throw new Error("Could not read source dimensions")

  await mkdir(path.dirname(output), { recursive: true })
  const result = await sharp(input)
    .rotate()
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true,
    })
    .toColourspace("srgb")
    .webp({ quality, effort: 6 })
    .toFile(output)
  const [sourceStat, outputStat] = await Promise.all([stat(input), stat(output)])

  console.log(`Generated ${output}`)
  console.log(
    `${original.width}x${original.height} ${Math.round(sourceStat.size / 1024)} KiB -> ${result.width}x${result.height} ${Math.round(outputStat.size / 1024)} KiB (WebP quality ${quality})`,
  )
}

try {
  await convert(parseArguments(process.argv.slice(2)))
} catch (error) {
  console.error(`WebP conversion failed: ${error.message}`)
  process.exitCode = 1
}
