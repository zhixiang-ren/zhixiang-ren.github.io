import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { Resvg } from "@resvg/resvg-js"
import satori from "satori"
import sharp from "sharp"
import { getCurrentPosition } from "@lib/experience"

export const prerender = true

const WIDTH = 1200
const HEIGHT = 630
const asset = (path: string) => readFile(resolve(process.cwd(), path))

const node = (
  type: string,
  style: Record<string, string | number>,
  children?: unknown,
  attributes: Record<string, unknown> = {},
) => ({ type, props: { ...attributes, style, children } })

export const GET: APIRoute = async () => {
  const [identityEntry, profileEntry, experienceEntry, portrait, regular, semibold, mono] =
    await Promise.all([
      getEntry("identity", "identity"),
      getEntry("profile", "profile"),
      getEntry("experience", "experience"),
      asset("src/assets/zhixiang-ren.webp"),
      asset("src/assets/fonts/Geist-Regular.ttf"),
      asset("src/assets/fonts/Geist-SemiBold.ttf"),
      asset("src/assets/fonts/GeistMono-Medium.ttf"),
    ])

  if (!identityEntry || !profileEntry || !experienceEntry)
    throw new Error("Missing profile content for Open Graph image")

  const profile = identityEntry.data
  const bio = profileEntry.data
  const currentPosition = getCurrentPosition(experienceEntry.data.items)
  // Satori/resvg does not reliably decode WebP data URIs. Convert only the
  // in-memory OG composite input; the homepage still serves the original WebP.
  const portraitPng = await sharp(portrait)
    .modulate({ brightness: 0.92, saturation: 0.95 })
    // Match the dark-theme portrait treatment while keeping mid-tones stable.
    .linear(1.03, 128 * (1 - 1.03))
    .png()
    .toBuffer()
  const portraitData = `data:image/png;base64,${portraitPng.toString("base64")}`
  const tags = profile.domains.slice(0, 4).map((domain) => domain.en)
  const dots = Array.from({ length: 60 }, (_, index) => {
    const column = index % 12
    const row = Math.floor(index / 12)
    return node("div", {
      position: "absolute",
      left: 650 + column * 43,
      top: 45 + row * 43,
      width: 2,
      height: 2,
      borderRadius: 99,
      backgroundColor: `rgba(191, 219, 254, ${Math.max(0.025, 0.09 - row * 0.012)})`,
    })
  })

  const card = node(
    "div",
    {
      position: "relative",
      display: "flex",
      width: "100%",
      height: "100%",
      padding: 72,
      overflow: "hidden",
      color: "#f4f4f5",
      backgroundColor: "#09090b",
      fontFamily: "Geist",
    },
    [
      node("div", {
        position: "absolute",
        left: 285,
        top: -430,
        width: 1040,
        height: 820,
        backgroundImage:
          "radial-gradient(ellipse at center, rgba(96, 165, 250, 0.18) 0%, rgba(99, 102, 241, 0.07) 37%, rgba(9, 9, 11, 0) 72%)",
      }),
      ...dots,
      node("div", {
        position: "absolute",
        inset: 24,
        border: "1px solid rgba(161, 161, 170, 0.16)",
        borderRadius: 28,
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.035)",
      }),
      node(
        "div",
        {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        },
        [
          node(
            "div",
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              color: "#71717a",
              fontFamily: "Geist Mono",
              fontSize: 17,
              letterSpacing: "0.08em",
            },
            [
              node(
                "div",
                {
                  display: "flex",
                  alignItems: "center",
                  padding: "7px 13px",
                  color: "#bfdbfe",
                  backgroundColor: "rgba(59, 130, 246, 0.08)",
                  border: "1px solid rgba(96, 165, 250, 0.18)",
                  borderRadius: 999,
                },
                "ACADEMIC PROFILE",
              ),
              node(
                "div",
                { display: "flex", color: "#a1a1aa" },
                currentPosition.organization.en.toUpperCase(),
              ),
            ],
          ),
          node(
            "div",
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 54,
            },
            [
              node(
                "div",
                {
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  gap: 13,
                },
                [
                  node(
                    "div",
                    {
                      display: "flex",
                      fontSize: 68,
                      fontWeight: 600,
                      lineHeight: 1,
                      letterSpacing: "-0.045em",
                      color: "#fafafa",
                    },
                    profile.name.en,
                  ),
                  node(
                    "div",
                    {
                      display: "flex",
                      fontSize: 27,
                      fontWeight: 400,
                      lineHeight: 1.25,
                      color: "#d4d4d8",
                    },
                    currentPosition.title.en,
                  ),
                  node(
                    "div",
                    {
                      display: "flex",
                      maxWidth: 680,
                      marginTop: 8,
                      fontSize: 25,
                      fontWeight: 400,
                      lineHeight: 1.35,
                      color: "#a1a1aa",
                    },
                    bio.slogan.en,
                  ),
                ],
              ),
              node(
                "div",
                {
                  display: "flex",
                  width: 222,
                  height: 258,
                  padding: 7,
                  overflow: "hidden",
                  backgroundColor: "rgba(24, 24, 27, 0.76)",
                  border: "1px solid rgba(161, 161, 170, 0.22)",
                  borderRadius: 25,
                  boxShadow:
                    "0 24px 70px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
                },
                node(
                  "img",
                  {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "50% 34%",
                    borderRadius: 19,
                  },
                  undefined,
                  { src: portraitData, alt: "" },
                ),
              ),
            ],
          ),
          node(
            "div",
            {
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: "100%",
            },
            [
              node(
                "div",
                {
                  display: "flex",
                  gap: 9,
                  fontFamily: "Geist Mono",
                  fontSize: 14,
                  color: "#c4c4cc",
                },
                tags.map((tag) =>
                  node(
                    "div",
                    {
                      display: "flex",
                      padding: "7px 12px",
                      backgroundColor: "rgba(255, 255, 255, 0.035)",
                      border: "1px solid rgba(161, 161, 170, 0.14)",
                      borderRadius: 7,
                    },
                    tag,
                  ),
                ),
              ),
              node(
                "div",
                {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 5,
                  color: "#71717a",
                  fontFamily: "Geist Mono",
                  fontSize: 14,
                  letterSpacing: "0.04em",
                },
                [
                  node(
                    "div",
                    { display: "flex" },
                    [currentPosition.location?.en.toUpperCase(), "AI FOR SCIENCE"]
                      .filter(Boolean)
                      .join(" · "),
                  ),
                  node("div", { display: "flex", color: "#52525b" }, "ORCID 0000-0002-4104-3790"),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )

  const svg = await satori(card as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: "Geist", data: regular, weight: 400, style: "normal" },
      { name: "Geist", data: semibold, weight: 600, style: "normal" },
      { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
    ],
  })
  const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng()

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
