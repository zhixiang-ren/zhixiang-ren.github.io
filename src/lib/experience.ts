import type { CollectionEntry } from "astro:content"

type ExperienceItem = CollectionEntry<"experience">["data"]["items"][number]

export const getCurrentPosition = (items: ExperienceItem[]) => {
  const position = items.find((item) => item.kind === "appointment" && !item.end)

  if (!position) throw new Error("Experience content must include one current appointment")

  return position
}
