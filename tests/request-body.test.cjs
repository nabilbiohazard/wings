const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const moduleResult = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/commerce-server.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
  exports: moduleResult.exports, Buffer, process,
  require: name => ['server-only', 'next/headers', './request-origin'].includes(name) ? {} : require(name),
});
const { readBody } = moduleResult.exports;
test('JSON reader enforces media type, object shape and streamed byte limits', async () => {
  const request = body => new Request('https://shop.example/api/contact', { method: 'POST', headers: {'Content-Type':'application/json'}, body });
  assert.deepEqual(JSON.stringify(await readBody(request('{"name":"Alice"}'))), '{"name":"Alice"}');
  await assert.rejects(readBody(new Request('https://shop.example', {method:'POST', body:'{}'})), e => e.status === 415);
  for (const body of ['null', '[]', '123', '{']) await assert.rejects(readBody(request(body)), e => e.status === 400);
  let cancelled = false;
  const stream = new ReadableStream({ pull(controller) { controller.enqueue(new Uint8Array(9)); }, cancel() { cancelled = true; } });
  await assert.rejects(readBody(new Request('https://shop.example', {method:'POST', headers:{'Content-Type':'application/json'}, body:stream, duplex:'half'}), 16), e => e.status === 413);
  assert.equal(cancelled, true);
});
