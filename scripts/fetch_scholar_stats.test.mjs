import assert from "node:assert/strict"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { hasMetricChanges, parseProfile } from "./fetch_scholar_stats.mjs"

const profileHtml = `
  <div id="gsc_prf_in">Zhixiang&nbsp; Ren</div>
  <table id="gsc_rsb_st"><tbody>
    <tr><th>Citations</th><td class="gsc_rsb_std">11,687</td><td>5,432</td></tr>
    <tr><th>h-index</th><td class="gsc_rsb_std">32</td><td>20</td></tr>
    <tr><th>i10-index</th><td class="gsc_rsb_std">54</td><td>12</td></tr>
  </tbody></table>
`

test("extracts only all-time metrics and rounds total citations down to hundreds", () => {
  assert.deepEqual(parseProfile(profileHtml), {
    author_name: "Zhixiang Ren",
    total_citations: 11600,
    h_index: 32,
    i10_index: 54,
  })
})

test("rejects bot checks and incomplete metrics", () => {
  assert.throws(() => parseProfile('<div class="g-recaptcha"></div>'), /bot-check/)
  assert.throws(() => parseProfile('<table id="gsc_rsb_st"></table>'), /missing/)
})

test("ignores timestamp-only changes but detects metric changes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "scholar-test-"))
  const outputPath = join(directory, "scholar.json")
  const snapshot = {
    source: "Google Scholar",
    author_key: "ec_pCdEAAAAJ",
    author_name: "Zhixiang Ren",
    total_citations: 11600,
    h_index: 32,
    i10_index: 54,
    updated_at: "2026-09-01T00:00:00+00:00",
    is_placeholder: false,
  }

  try {
    await writeFile(outputPath, JSON.stringify(snapshot))
    assert.equal(
      await hasMetricChanges({ ...snapshot, updated_at: "2026-09-28T00:00:00+00:00" }, outputPath),
      false,
    )
    assert.equal(await hasMetricChanges({ ...snapshot, total_citations: 11700 }, outputPath), true)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
