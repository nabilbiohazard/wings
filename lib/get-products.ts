import woo from "./woocommerce";
import { mapWooProduct } from "./woo-mapper";
import type { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  const perPage = 100;
  const firstPage = await woo.get("products", {
    per_page: perPage,
    page: 1,
    status: "publish",
  });

  const reportedPages = Number(firstPage.headers?.["x-wp-totalpages"] ?? 1);
  const totalPages = Number.isFinite(reportedPages) ? Math.max(1, reportedPages) : 1;
  const products: Product[] = firstPage.data.map(mapWooProduct);

  // WooCommerce caps each response at 100 products. Fetch the remaining pages
  // in small groups so the filters see the complete catalogue.
  for (let start = 2; start <= totalPages; start += 4) {
    const pages = await Promise.all(
      Array.from({ length: Math.min(4, totalPages - start + 1) }, (_, index) =>
        woo.get("products", { per_page: perPage, page: start + index, status: "publish" }),
      ),
    );
    products.push(...pages.flatMap((page) => page.data.map(mapWooProduct)));
  }

  return products;
}
