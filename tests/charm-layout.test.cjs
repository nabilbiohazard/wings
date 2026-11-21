const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpile(fs.readFileSync(filename, "utf8"), {
      module: ts.ModuleKind.CommonJS,
    }),
    filename,
  );
const {
  parseCharmLayout,
  placementSlots,
  nearestSlot,
} = require("../lib/charm-layout.ts");
const { mapWooProduct } = require("../lib/woo-mapper.ts");
const Parser = require("php-parser");
const layout = {
  version: 1,
  image: "https://example.org/bracelet.webp",
  maxCharms: 2,
  slots: [
    { x: 100, y: 200 },
    { x: 400, y: 500, rotation: 20 },
  ],
};

test("saved layouts override BC-2 defaults, control images, and snap to the closest slot", () => {
  const product = mapWooProduct({
    id: 88,
    name: "BC-2",
    sku: "BC-2",
    price: "9900",
    meta_data: [{ key: "_wings_charm_layout", value: layout }],
  });
  assert.equal(product.price, 990);
  assert.equal(product.image, layout.image);
  assert.deepEqual(placementSlots(product), layout.slots);
  assert.equal(
    nearestSlot(placementSlots(product), { x: 380, y: 470 }).rotation,
    20,
  );
  assert.equal(placementSlots({ name: "BC-2" }).length, 11);
  assert.equal(placementSlots({ name: "BC-1" }), undefined);
});

test("malformed, duplicate, and out-of-range saved layouts are rejected", () => {
  for (const value of [
    null,
    {},
    { ...layout, version: 2 },
    { ...layout, maxCharms: 3 },
    { ...layout, slots: [] },
    { ...layout, image: "javascript:alert(1)" },
    { ...layout, slots: [{ x: -1, y: 20 }] },
    { ...layout, slots: [{ x: 20, y: Infinity }] },
    { ...layout, slots: [layout.slots[0], layout.slots[0]] },
    { ...layout, slots: [{ x: 1, y: 2, rotation: NaN }] },
  ])
    assert.equal(parseCharmLayout(value), undefined);
});

test("packaged BC-2 defaults match all finalized storefront positions", () => {
  const defaults = JSON.parse(
    fs.readFileSync("wordpress/wings-commerce/assets/bc2-layout.json"),
  );
  assert.deepEqual(defaults.slots, placementSlots({ name: "BC-2" }));
  assert.equal(defaults.maxCharms, 11);
});

test("WordPress plugin PHP files parse successfully", () => {
  const parser = new Parser({ parser: { phpVersion: "7.4" } });
  for (const file of ["charm-layouts.php", "designs.php", "wings-commerce.php"])
    parser.parseCode(
      fs.readFileSync(`wordpress/wings-commerce/${file}`, "utf8"),
      file,
    );
});
