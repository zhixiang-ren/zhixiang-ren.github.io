import assert from "node:assert/strict"
import test from "node:test"
import { probeLink } from "./check_links.mjs"

test("a working HEAD response avoids a second request", async () => {
  const calls = []
  const result = await probeLink("https://example.org/paper", async (_, method) => {
    calls.push(method)
    return 200
  })
  assert.deepEqual(result, { kind: "ok", status: 200 })
  assert.deepEqual(calls, ["HEAD"])
})

test("a publisher that blocks HEAD can still be verified with GET", async () => {
  const result = await probeLink("https://example.org/paper", async (_, method) =>
    method === "HEAD" ? 403 : 206,
  )
  assert.deepEqual(result, { kind: "ok", status: 206 })
})

test("only a GET-confirmed 404 is reported as broken", async () => {
  const result = await probeLink("https://example.org/missing", async () => 404)
  assert.deepEqual(result, { kind: "broken", status: 404 })
})

test("rate limiting and network failures remain unverified", async () => {
  assert.deepEqual(await probeLink("https://example.org", async () => 429), {
    kind: "unverified",
    status: 429,
  })
  const failure = await probeLink("https://example.org", async () => {
    throw new Error("network unavailable")
  })
  assert.deepEqual(failure, { kind: "unverified", reason: "network unavailable" })
})
