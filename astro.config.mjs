import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"
import { unified } from "@astrojs/markdown-remark"
import tailwindcss from "@tailwindcss/vite"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

// https://astro.build/config
const site = process.env.SITE_URL || "http://localhost:4321"
const base = process.env.BASE_PATH || "/"

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  security: {
    csp: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
})
