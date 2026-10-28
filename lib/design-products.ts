import type { Product } from "./types";
import { isCharmProduct } from "./charm-products";
import { designRules } from "./design-rules";

export type DesignProduct = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "image"
  | "price"
  | "category"
  | "categories"
  | "isInStock"
  | "hasOptions"
>;

export function isCustomizable(
  product: Pick<Product, "name" | "category" | "categories">,
) {
  if (isCharmProduct(product)) return false;
  const text = `${product.name} ${product.category} ${product.categories?.map((item) => `${item.name} ${item.slug}`).join(" ") || ""}`;
  if (/لباس|پوشاک|clothing|apparel|\bdress\b|\bshirt\b/i.test(text))
    return false;
  return /گردنبند|دستبند|گوشواره|necklace|bracelet|earring/i.test(text);
}

export function toDesignProduct(product: Product): DesignProduct {
  const rules = designRules(product);
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    price: product.price,
    category:
      rules.kind === "other"
        ? (product.categories?.[0]?.name ?? product.category)
        : rules.label,
    categories: product.categories,
    isInStock: product.isInStock,
    hasOptions: product.hasOptions,
  };
}

export function customizationHref(productId: number) {
  return `/custom-design?product=${productId}`;
}
