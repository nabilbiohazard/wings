import { ShopHero } from "@/components/shop/shop-hero";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { ShopGrid } from "@/components/shop/shop-grid";
import { BrandMarquee } from "@/components/homepage/brand-marquee";

import { getProducts } from "@/lib/get-products";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white">
      <ShopHero />
      <BrandMarquee />

      <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:py-24">
        <ShopToolbar />

        <ShopGrid products={products} />
      </section>
    </main>
  );
}
