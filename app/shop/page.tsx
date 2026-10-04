import { ShopCatalogue } from "@/components/shop/shop-catalogue";
import { getProducts } from "@/lib/get-products";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#fdfbfa]">
       <div className="relative h-[140px] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

        <div className="absolute left-1/2 top-1/2 h-[140px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[90px]" />
      </div>
      <ShopCatalogue products={products} />
    </main>
  );
}
