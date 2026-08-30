import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Best in Daman landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Best in Daman — Get seen in Daman\.<\/title>/i);
  assert.match(html, /Get seen/);
  assert.match(html, /24-hour Homepage Spotlight/);
  assert.match(html, /Submit for review/);
  assert.match(html, /Browse by/);
  assert.match(html, /Food &amp; drink|Food & drink/);
  assert.match(html, /No campaigns live yet/);
  assert.doesNotMatch(html, /outbid|auction|standing bids|pay the difference/i);
});

test("server-renders a trust page", async () => {
  const response = await render("/policies/guidelines");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Advertising guidelines/);
  assert.match(html, /Destination quality/);
});

test("server-renders the public directory page", async () => {
  const response = await render("/directory");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /All local/);
  assert.match(html, /Search by name or what you need/);
  assert.match(html, /Food &amp; drink|Food & drink/);
  assert.match(html, /Harbour &amp; Lime Café|Harbour & Lime Café/);
  assert.match(html, /Preview mode/);
});
