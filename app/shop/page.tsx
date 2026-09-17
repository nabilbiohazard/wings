import { ShopHero } from "@/components/shop/shop-hero";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { ShopGrid } from "@/components/shop/shop-grid";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-white">
      <ShopHero />

      <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:py-24">
        <ShopToolbar />

        <ShopGrid />
      </section>
    </main>
  );
}
