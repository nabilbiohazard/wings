import type { Product } from "./types";

export type CharmCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
};
export function isCharmCategory(value: string) {
  try {
    value = decodeURIComponent(value);
  } catch {
    /* Keep a malformed slug as supplied. */
  }
  return /^(?:چارم(?:ها)?|charms?)$/i.test(
    value.normalize("NFKC").replace(/[\s\u200c_-]/g, ""),
  );
}
export function charmCategoryIds(categories: CharmCategory[]) {
  const ids = new Set(
    categories
      .filter(
        (item) => isCharmCategory(item.name) || isCharmCategory(item.slug),
      )
      .map((item) => item.id),
  );
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories)
      if (ids.has(category.parent) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
  }
  return ids;
}
export function isCharmProduct(
  product: Pick<Product, "category" | "categories">,
  ids?: ReadonlySet<number>,
) {
  return (
    isCharmCategory(product.category) ||
    Boolean(
      product.categories?.some(
        (category) =>
          ids?.has(category.id) ||
          isCharmCategory(category.name) ||
          isCharmCategory(category.slug),
      ),
    )
  );
}
