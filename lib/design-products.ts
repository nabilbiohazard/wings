import type { Product } from "./types";

export type DesignProduct = Pick<Product, "id" | "name" | "slug" | "image" | "price" | "category" | "isInStock">;

export function toDesignProduct(product: Product): DesignProduct {
  return { id: product.id, name: product.name, slug: product.slug, image: product.image, price: product.price, category: product.categories?.[0]?.name ?? product.category, isInStock: product.isInStock };
}

export function customizationHref(productId: number) {
  return `/custom-design?product=${productId}`;
}
