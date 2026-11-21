import test from "node:test";
import assert from "node:assert/strict";
import { isAllowedRequestOrigin } from "../lib/request-origin.ts";
import { sanitizePostContent } from "../lib/blog-content.ts";
import { allowContactRequest } from "../lib/contact-rate-limit.ts";

test("production origin checks fail closed for missing, malformed or insecure configuration", () => {
  const request = new Request("https://attacker.example/api/contact", {headers: {origin: "https://attacker.example"}});
  for (const config of [undefined, "invalid", "http://attacker.example", "https://shop.example"]) {
    assert.equal(isAllowedRequestOrigin(request, config, false), false);
  }
});
test("CMS HTML drops scripts, event handlers, dangerous URLs and relative frames", () => {
  const html = sanitizePostContent('<p>Safe</p><script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">click</a><iframe src="/account"></iframe>');
  assert.ok(html.includes('<p>Safe</p>'));
  assert.doesNotMatch(html, /<script|onerror|javascript:|src="\/account"/i);
});
test("contact limit cannot be bypassed with untrusted forwarded headers and expires", () => {
  const old = process.env.TRUSTED_CLIENT_IP_HEADER;
  delete process.env.TRUSTED_CLIENT_IP_HEADER;
  try {
    for (let i = 0; i < 5; i++) assert.equal(allowContactRequest(new Request('https://shop.example', {headers: {'x-forwarded-for': String(i)}}), 1000), true);
    assert.equal(allowContactRequest(new Request('https://shop.example'), 1000), false);
    assert.equal(allowContactRequest(new Request('https://shop.example'), 601000), true);
  } finally {
    if (old === undefined) delete process.env.TRUSTED_CLIENT_IP_HEADER;
    else process.env.TRUSTED_CLIENT_IP_HEADER = old;
  }
});
