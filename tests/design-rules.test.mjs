import assert from "node:assert/strict";
import test from "node:test";
import { designRules } from "../lib/design-rules.ts";

test("single-charm categories only restrict bracelets among necklaces and bracelets", () => {
  for (const [kind, name] of [
    ["necklace", "گردنبند"],
    ["bracelet", "دستبند"],
  ]) {
    const base = {
      name: "محصول جدید",
      category: "all",
      categories: [{ name, slug: encodeURIComponent(name) }],
    };
    assert.equal(designRules(base).kind, kind);
    assert.equal(designRules(base).single, false);
    const single = {
      ...base,
      categories: [
        ...base.categories,
        {
          name: `${name}-تک-چارم`,
          slug: encodeURIComponent(`${name}-تک-چارم`),
        },
      ],
    };
    assert.equal(designRules(single).single, kind === "bracelet");
    assert.deepEqual(
      designRules(single).anchor,
      kind === "necklace"
        ? { x: 300, y: 578, rotation: 0 }
        : { x: 298, y: 472, rotation: 0 },
    );
    assert.equal(
      designRules({ ...single, categories: single.categories.toReversed() })
        .single,
      kind === "bracelet",
    );
    assert.equal(
      designRules({ ...base, name: `${name} تک چارم` }).single,
      false,
      "Current categories override a misleading product name",
    );
  }
});

test("encoded and English category slugs and legacy snapshots remain usable", () => {
  assert.equal(
    designRules({
      name: "New",
      category: encodeURIComponent("گردنبند-تک-چارم"),
    }).single,
    false,
  );
  assert.equal(
    designRules({ name: "New", category: "single-charm-bracelet" }).single,
    true,
  );
  assert.equal(
    designRules({ name: "گردنبند تک‌چارم", category: "" }).single,
    false,
  );
  assert.equal(
    designRules({ name: "New", category: "necklace" }).single,
    false,
  );
});
