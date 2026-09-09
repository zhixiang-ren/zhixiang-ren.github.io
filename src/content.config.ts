import { defineCollection } from "astro:content"
import { file, glob } from "astro/loaders"
import { z } from "astro/zod"

const localizedText = z.object({ en: z.string(), zh: z.string() })

const profile = defineCollection({
  loader: glob({ base: "./src/content", pattern: "identity.{yaml,yml}" }),
  schema: z.object({
    name: z.string(),
    nameZh: z.string(),
    honorific: z.string(),
    jobTitle: localizedText,
    organization: localizedText,
    location: localizedText,
    description: localizedText,
    portraitAlt: localizedText,
    domains: z.array(localizedText).min(1),
    academicRoles: z.array(localizedText),
    academicAffiliations: z.array(localizedText),
    links: z.object({
      scholar: z.url(),
      orcid: z.url(),
      openalex: z.url(),
      github: z.url(),
      email: z.object({
        localParts: z.array(z.string()).min(1),
        domainParts: z.array(z.string()).min(2),
      }),
    }),
  }),
})

const bio = defineCollection({
  loader: glob({ base: "./src/content", pattern: "profile.{md,mdx}" }),
  schema: z.object({
    slogan: localizedText,
    summary: localizedText,
  }),
})

const experience = defineCollection({
  loader: glob({ base: "./src/content", pattern: "experience.{yaml,yml}" }),
  schema: z.object({
    items: z.array(
      z.object({
        start: z.string().regex(/^\d{4}(?:-\d{2})?$/),
        end: z
          .string()
          .regex(/^\d{4}(?:-\d{2})?$/)
          .optional(),
        kind: z.enum(["appointment", "education"]),
        title: localizedText,
        organization: localizedText,
        location: localizedText.optional(),
        detail: localizedText.optional(),
      }),
    ),
  }),
})

const services = defineCollection({
  loader: glob({ base: "./src/content", pattern: "academic-services.{yaml,yml}" }),
  schema: z.object({
    groups: z.array(
      z.object({
        label: localizedText,
        role: localizedText.optional(),
        entries: z.array(localizedText).min(1),
      }),
    ),
  }),
})

const honors = defineCollection({
  loader: glob({ base: "./src/content", pattern: "representative-honors.{yaml,yml}" }),
  schema: z.object({
    label: localizedText,
    items: z.array(
      z.object({
        year: z.number().int(),
        name: localizedText,
        detail: localizedText.optional(),
      }),
    ),
  }),
})

const recruitment = defineCollection({
  loader: glob({ base: "./src/content", pattern: "open-positions.{md,mdx}" }),
  schema: z.object({
    label: localizedText,
    summary: localizedText,
  }),
})

const publications = defineCollection({
  loader: glob({ base: "./src/content", pattern: "publications.{md,mdx}" }),
  schema: z.object({
    papers: z
      .array(
        z.object({
          date: z.coerce.date(),
          title: localizedText,
          authors: z
            .array(
              z.object({
                name: z.string(),
                principal: z.boolean().default(false),
              }),
            )
            .min(1),
          venue: z.string(),
          venueShort: z.string().optional(),
          status: localizedText.optional(),
          abstract: z.string().optional(),
          bibtex: z.string().optional(),
          source: z.enum(["crossref", "arxiv", "manual"]).default("manual"),
          links: z
            .object({
              doi: z.url().optional(),
              arxiv: z.url().optional(),
              paper: z.url().optional(),
              code: z.url().optional(),
            })
            .default({}),
          featured: z.boolean().default(true),
        }),
      )
      .min(1),
  }),
})

const scholar = defineCollection({
  loader: file("src/data/scholar.json", {
    parser: (content) => ({ metrics: JSON.parse(content) }),
  }),
  schema: z.object({
    source: z.string(),
    author_key: z.string().min(1),
    author_name: z.string().min(1),
    total_citations: z.number().int().nonnegative(),
    h_index: z.number().int().nonnegative(),
    i10_index: z.number().int().nonnegative(),
    updated_at: z.iso.datetime({ offset: true }),
    is_placeholder: z.boolean(),
  }),
})

export const collections = {
  profile,
  bio,
  experience,
  services,
  honors,
  recruitment,
  publications,
  scholar,
}
