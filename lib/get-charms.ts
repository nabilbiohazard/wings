import "server-only";
import woo from "./woocommerce";
import { getProducts } from "./get-products";
import { charmCategoryIds, isCharmProduct } from "./charm-products";
import type { CharmCategory } from "./charm-products";
import type { CharmData } from "@/components/custom-design/Charm";

type WooVariation = {
  id: number;
  status: string;
  price: string;
  stock_status: string;
  purchasable?: boolean;
  image?: { src?: string };
  attributes: { name: string; option: string }[];
};
async function pages<T>(
  path: string,
  params: Record<string, unknown> = {},
): Promise<T[]> {
  const first = await woo.get(path, { per_page: 100, page: 1, ...params });
  const items: T[] = first.data;
  const count = Number(first.headers?.["x-wp-totalpages"] || 1);
  for (let page = 2; page <= count; page++) {
    const response = await woo.get(path, { per_page: 100, page, ...params });
    items.push(...response.data);
  }
  return items;
}
export async function getCharms(): Promise<CharmData[]> {
  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      pages<CharmCategory>("products/categories", { hide_empty: false }),
    ]);
    const ids = charmCategoryIds(categories);
    const result: CharmData[] = [];
    for (const product of products.filter((item) =>
      isCharmProduct(item, ids),
    )) {
      const image =
        product.image === "/images/product-placeholder.jpg"
          ? ""
          : product.image;
      if (product.hasOptions) {
        const variations = await pages<WooVariation>(
          `products/${product.id}/variations`,
        );
        for (const variation of variations.filter(
          (item) => item.status === "publish",
        )) {
          const src = variation.image?.src || image;
          result.push({
            id: `woo-${variation.id}`,
            product_id: variation.id,
            name: `${product.name} · ${variation.attributes.map((item) => `${item.name}: ${item.option || "انتخاب نشده"}`).join("، ")}`,
            image: src,
            price: Number(variation.price) / 10,
            category: "چارم‌ها",
            attachment: { x: 50, y: 30 },
            available:
              Boolean(src) &&
              variation.price !== "" &&
              variation.stock_status === "instock" &&
              variation.purchasable !== false &&
              variation.attributes.every((item) => Boolean(item.option)),
          });
        }
      } else if (!product.type || product.type === "simple") {
        result.push({
          id: `woo-${product.id}`,
          product_id: product.id,
          name: product.name,
          image,
          price: product.price,
          category: "چارم‌ها",
          attachment: { x: 50, y: 30 },
          available:
            Boolean(image) &&
            product.isInStock !== false &&
            product.isPurchasable !== false,
        });
      }
    }
    return result;
  } catch {
    throw new Error("دریافت چارم‌های فروشگاه انجام نشد؛ دوباره تلاش کنید.");
  }
}
