import type { Product } from "./types";
import { isCharmProduct } from "./charm-products";

export type DesignProduct = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "image"
  | "price"
  | "category"
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
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    price: product.price,
    category: product.categories?.[0]?.name ?? product.category,
    isInStock: product.isInStock,
    hasOptions: product.hasOptions,
  };
}

export function customizationHref(productId: number) {
  return `/custom-design?product=${productId}`;
}
