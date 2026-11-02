import type { Product } from "./types";

function categoryKey(value: string) {
  try { value = decodeURIComponent(value); } catch { /* Preserve malformed slugs. */ }
  return value.normalize("NFKC").toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\s\u200c\u200d_-]/g, "");
}

const aliases: Record<string, string[]> = {
  necklace: ["necklace", "necklaces", "گردنبند", "گردنبندها"],
  bracelet: ["bracelet", "bracelets", "دستبند", "دستبندها"],
  earrings: ["earring", "earrings", "گوشواره", "گوشوارهها"],
  charms: ["charm", "charms", "چارم", "چارمها"],
};

export function matchesProductCategory(product: Pick<Product, "category" | "categories">, selected: string) {
  if (selected === "all") return true;
  const values = [product.category, ...(product.categories?.flatMap((item) => [item.slug, item.name]) ?? [])].map(categoryKey);
  const key = categoryKey(selected);
  if (values.includes(key)) return true;
  return (aliases[selected] ?? []).some((alias) => values.includes(categoryKey(alias)));
}
