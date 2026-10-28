import { HeaderBackdrop } from "@/components/header-backdrop";
import { ShopCatalogue } from "@/components/shop/shop-catalogue";
import { getProducts } from "@/lib/get-products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فروشگاه وینگز | زیورآلات و چارم‌های دوست‌داشتنی",
  description:
    "گردنبند، دستبند، گوشواره و چارم‌های وینگز را کشف کن؛ انتخابی برای استایل و داستان شخصی تو.",
};

export default async function ShopPage() {
  const { products, failed } = await getProducts()
    .then((products) => ({ products, failed: false }))
    .catch(() => ({ products: [], failed: true }));

  return (
    <main className="min-h-screen bg-[#faf7f3]">
      <HeaderBackdrop />
      <div className="site-container">
        <ShopCatalogue products={products} failed={failed} />
      </div>
    </main>
  );
}
