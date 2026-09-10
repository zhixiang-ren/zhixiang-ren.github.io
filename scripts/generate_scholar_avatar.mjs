import { mkdir } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import sharp from "sharp"

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..")
const DEFAULT_INPUT = path.join(PROJECT_ROOT, "src/assets/zhixiang-ren.webp")
const DEFAULT_OUTPUT = path.join(PROJECT_ROOT, "resources/scholar-avatar.png")

const usage = `Usage:
  npm run generate:scholar-avatar -- [options]

Options:
  --input <path>          Source portrait (default: src/assets/zhixiang-ren.webp)
  --output <path>         Generated PNG (default: resources/scholar-avatar.png)
  --size <pixels>         Square output size (default: 800)
  --subject-scale <ratio> Foreground width as a fraction of the canvas (default: 0.86)
  --help                  Show this help`

function parseArguments(argv) {
  const options = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    size: 800,
    subjectScale: 0.86,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === "--help" || value === "-h") {
      console.log(usage)
      process.exit(0)
    }

    const nextValue = argv[index + 1]
    if (["--input", "--output", "--size", "--subject-scale"].includes(value) && !nextValue) {
      throw new Error(`${value} requires a value`)
    }

    if (value === "--input") {
      options.input = path.resolve(nextValue)
      index += 1
    } else if (value === "--output") {
      options.output = path.resolve(nextValue)
      index += 1
    } else if (value === "--size") {
      options.size = Number.parseInt(nextValue, 10)
      index += 1
    } else if (value === "--subject-scale") {
      options.subjectScale = Number.parseFloat(nextValue)
      index += 1
    } else if (value.startsWith("-")) {
      throw new Error(`Unknown option: ${value}`)
    } else {
      throw new Error(`Unexpected argument: ${value}`)
    }
  }

  if (!Number.isInteger(options.size) || options.size < 256 || options.size > 4096) {
    throw new Error("--size must be an integer between 256 and 4096")
  }
  if (
    !Number.isFinite(options.subjectScale) ||
    options.subjectScale < 0.65 ||
    options.subjectScale > 1
  ) {
    throw new Error("--subject-scale must be between 0.65 and 1")
  }

  return options
}

async function generateScholarAvatar({ input, output, size, subjectScale }) {
  const metadata = await sharp(input).metadata()
  if (!metadata.width || !metadata.height) throw new Error("Could not read source dimensions")

  await mkdir(path.dirname(output), { recursive: true })

  const subjectWidth = Math.round(size * subjectScale)
  const { data: resizedSubject, info: resizedInfo } = await sharp(input)
    .resize({ width: subjectWidth, fit: "inside" })
    .toBuffer({ resolveWithObject: true })
  if (resizedInfo.height < size) {
    throw new Error("The resized portrait is not tall enough to fill the square canvas")
  }

  const croppedSubject = await sharp(resizedSubject)
    .extract({
      left: 0,
      top: Math.round((resizedInfo.height - size) / 2),
      width: subjectWidth,
      height: size,
    })
    .toBuffer()

  const horizontalPadding = size - subjectWidth
  await sharp(croppedSubject)
    .extend({
      left: Math.floor(horizontalPadding / 2),
      right: Math.ceil(horizontalPadding / 2),
      top: 0,
      bottom: 0,
      extendWith: "copy",
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output)

  console.log(`Generated ${path.relative(PROJECT_ROOT, output)}`)
  console.log(
    `${metadata.width}x${metadata.height} source -> ${size}x${size} PNG; subject scale ${subjectScale}`,
  )
}

try {
  await generateScholarAvatar(parseArguments(process.argv.slice(2)))
} catch (error) {
  console.error(`Scholar avatar generation failed: ${error.message}`)
  process.exitCode = 1
}
