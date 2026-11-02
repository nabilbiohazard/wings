import assert from "node:assert/strict";
import test from "node:test";
import { matchesProductCategory } from "../lib/product-category.ts";

test("shop categories match Persian WooCommerce names and encoded slugs", () => {
  for (const [selected, name] of [["necklace", "گردنبند"], ["bracelet", "دستبند"], ["earrings", "گوشواره"], ["charms", "چارم‌ها"]]) {
    const product = { category: encodeURIComponent(name), categories: [] };
    assert.equal(matchesProductCategory(product, selected), true);
    assert.equal(matchesProductCategory({ category: "unrelated", categories: [{ slug: "custom-slug", name }] }, selected), true);
    assert.equal(matchesProductCategory(product, "all"), true);
  }
});

test("all category memberships are checked without matching product names or unrelated categories", () => {
  const product = { category: "other", categories: [{ slug: "necklaces", name: "Necklaces" }, { slug: "special", name: "Special" }] };
  assert.equal(matchesProductCategory(product, "necklace"), true);
  assert.equal(matchesProductCategory(product, "special"), true);
  assert.equal(matchesProductCategory(product, "bracelet"), false);
  assert.equal(matchesProductCategory({ category: "%invalid", categories: [] }, "charms"), false);
});
