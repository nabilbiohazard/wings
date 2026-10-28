import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import Parser from "php-parser";
import { isAllowedRequestOrigin } from "../lib/request-origin.ts";
import {
  charmCategoryIds,
  isCharmCategory,
  isCharmProduct,
} from "../lib/charm-products.ts";
import {
  normalizePhone,
  digits,
  cartKey,
  validCart,
  money,
  cartPayload,
} from "../lib/commerce-types.ts";

test("commerce accepts the current development origin and enforces the production origin", () => {
  const configured = "https://shop.example";
  const request = (origin) =>
    new Request("http://localhost:3000/api/commerce/designs/prepare", {
      headers: origin ? { origin } : {},
    });
  assert.equal(
    isAllowedRequestOrigin(request("http://localhost:3000"), configured, true),
    true,
  );
  for (const origin of [
    undefined,
    "https://foreign.example",
    "http://localhost:3001",
  ]) {
    assert.equal(
      isAllowedRequestOrigin(request(origin), configured, true),
      false,
    );
  }
  assert.equal(
    isAllowedRequestOrigin(request("http://localhost:3000"), configured, false),
    false,
  );
  assert.equal(
    isAllowedRequestOrigin(request(configured), configured, false),
    true,
  );
  assert.equal(
    isAllowedRequestOrigin(request("http://localhost:3000"), undefined, false),
    true,
  );
});

test("normalizes Persian, Arabic, national and international mobile numbers", () => {
  for (const input of [
    "۰۹۱۲۱۲۳۴۵۶۷",
    "٠٩١٢١٢٣٤٥٦٧",
    "+98 912 123 4567",
    "00989121234567",
    "989121234567",
    "09121234567",
  ]) {
    assert.equal(normalizePhone(input), "09121234567");
  }
  for (const input of [
    "0912",
    "02112345678",
    "091212345670",
    "+12345678900",
    "x09121234567",
  ])
    assert.equal(normalizePhone(input), null);
  assert.equal(digits("۱۲٣۴"), "1234");
});

test("stored cart rejects corrupt quantities, prices, and product IDs", () => {
  const item = {
    id: 10,
    name: "گردنبند",
    image: "",
    quantity: 2,
    price: 20000,
  };
  const items = validCart([
    item,
    { ...item, id: 11, quantity: -1 },
    { ...item, id: 12, quantity: 100 },
    { ...item, id: "13" },
    { ...item, id: 14, price: NaN },
    { ...item, id: 15, variation_id: -5 },
    { ...item, id: 10, variation_id: 51 },
  ]);
  assert.equal(items.length, 2);
  assert.notEqual(cartKey(items[0]), cartKey(items[1]));
  assert.deepEqual(validCart(null), []);
  assert.equal(validCart([item, { ...item, quantity: 3 }]).length, 1);
});

test("WooCommerce decimal amounts convert rial exactly once", () => {
  assert.equal(money("250000", "IRR"), money("25000", "IRT"));
  assert.match(money("125.50", "USD"), /USD$/);
});

test("WordPress plugin parses with the declared PHP 7.4 minimum", () => {
  const parser = new Parser({
    parser: { phpVersion: "7.4" },
    ast: { withPositions: true },
  });
  const ast = parser.parseCode(
    fs.readFileSync(
      new URL(
        "../wordpress/wings-commerce/wings-commerce.php",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.ok(ast.children.length > 0);
  parser.parseCode(
    fs.readFileSync(
      new URL("../wordpress/wings-commerce/designs.php", import.meta.url),
      "utf8",
    ),
  );
});

test("design identity, placements and stacking order survive cart persistence without merging plain products", () => {
  const product = {
    id: 10,
    name: "گردنبند",
    slug: "necklace",
    category: "necklace",
    image: "/images/necklace.png",
    price: 25000,
  };
  const design = {
    version: 1,
    id: "saved",
    savedAt: "",
    product,
    charms: [
      {
        instanceId: "first",
        x: 300.25,
        y: 500.75,
        rotation: -27.5,
        charm: {
          id: "clover",
          name: "Clover",
          image: "/images/charms/clover.png",
          price: 10000,
        },
      },
    ],
  };
  const item = { ...product, quantity: 1, price: 35000, design };
  const other = structuredClone(item);
  other.design.charms[0].x = 301.25;
  assert.notEqual(cartKey(item), cartKey(other));
  assert.notEqual(cartKey(item), cartKey({ ...item, design: undefined }));
  const restored = validCart(
    JSON.parse(JSON.stringify([item, other, { ...item, design: undefined }])),
  );
  assert.equal(restored.length, 3);
  assert.equal(restored[0].design.charms[0].rotation, -27.5);
  const payload = cartPayload(restored[0]);
  assert.equal(payload.design.charms[0].x, 300.25);
  assert.equal(payload.design.charms[0].charm.price, undefined);
  item.design.charms[0].x = 400;
  assert.equal(restored[0].design.charms[0].x, 300.25);
});

test("server and designer use the same charm artwork catalogue", () => {
  const frontend = JSON.parse(
    fs.readFileSync(
      new URL("../lib/charm-catalogue.json", import.meta.url),
      "utf8",
    ),
  );
  const backend = JSON.parse(
    fs.readFileSync(
      new URL(
        "../wordpress/wings-commerce/charm-catalogue.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.deepEqual(frontend, backend);
});

test("WooCommerce charm category detection includes descendants and excludes unrelated products", () => {
  assert.equal(isCharmCategory("چارم‌ها"), true);
  assert.equal(isCharmCategory("%DA%86%D8%A7%D8%B1%D9%85"), true);
  assert.equal(isCharmCategory("charms"), true);
  assert.equal(isCharmCategory("گردنبند با چارم"), false);
  const ids = charmCategoryIds([
    { id: 100, name: "چارم", slug: "charms", parent: 0 },
    { id: 101, name: "فلزی", slug: "metal", parent: 100 },
    { id: 102, name: "طلایی", slug: "gold", parent: 101 },
    { id: 200, name: "لباس", slug: "clothing", parent: 0 },
  ]);
  assert.deepEqual([...ids].sort(), [100, 101, 102]);
  assert.equal(
    isCharmProduct(
      {
        category: "metal",
        categories: [{ id: 101, name: "فلزی", slug: "metal" }],
      },
      ids,
    ),
    true,
  );
  assert.equal(
    isCharmProduct(
      {
        category: "clothing",
        categories: [{ id: 200, name: "لباس", slug: "clothing" }],
      },
      ids,
    ),
    false,
  );
});
