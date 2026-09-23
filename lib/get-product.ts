import woo from "./woocommerce";
import { mapWooProduct } from "./woo-mapper";
import type { Product } from "./types";

export async function getProduct(slug: string): Promise<Product | null> {
  const response = await woo.get("products", { slug });
  const item = response.data?.[0];
  return item ? mapWooProduct(item) : null;
}
