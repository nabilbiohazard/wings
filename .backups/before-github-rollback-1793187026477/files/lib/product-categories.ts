import type { Product } from "./types";

export const productCategories = [
  { id: "all", name: "همه", aliases: [] },
  { id: "charms", name: "چارم", aliases: ["charm", "charms", "چارم", "چارم‌ها"] },
  { id: "necklace", name: "گردنبند", aliases: ["necklace", "necklaces", "گردنبند"] },
  { id: "bracelet", name: "دستبند", aliases: ["bracelet", "bracelets", "دستبند"] },
  { id: "earrings", name: "گوشواره", aliases: ["earring", "earrings", "گوشواره"] },
  { id: "rings", name: "انگشتر", aliases: ["ring", "rings", "انگشتر"] },
  { id: "piercing", name: "پیرسینگ", aliases: ["piercing", "piercings", "پیرسینگ"] },
  { id: "clothing", name: "پوشاک", aliases: ["clothing", "apparel", "clothes", "پوشاک", "لباس"] },
] as const;

export function normalizeProductCategory(value: string) {
  try { value = decodeURIComponent(value); } catch { /* Keep literal percent signs. */ }
  return value.toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\s\u200c_-]+/g, "").trim();
}

export function categoryId(value: string) {
  const normalized = normalizeProductCategory(value);
  return productCategories.find((item) =>
    normalizeProductCategory(item.id) === normalized ||
    item.aliases.some((alias) => normalizeProductCategory(alias) === normalized),
  )?.id ?? value;
}

export function matchesProductCategory(product: Product, category: string) {
  if (category === "all") return true;
  const selected = normalizeProductCategory(categoryId(category));
  return [
    product.category,
    ...(product.categories ?? []).flatMap(({ name, slug }) => [name, slug]),
  ].some((value) => normalizeProductCategory(categoryId(value)) === selected);
}
