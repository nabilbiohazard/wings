import woo from "./woocommerce";
import { mapWooProduct } from "./woo-mapper";
import type { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  const response = await woo.get("products", {
    per_page: 20,
    status: "publish",
  });
  return response.data.map(mapWooProduct);
}
