import { HeaderBackdrop } from "@/components/header-backdrop";
import { ShopCatalogue } from "@/components/shop/shop-catalogue";
import { getProducts } from "@/lib/get-products";
import { connection } from "next/server";

export default async function ShopPage() {
  await connection();
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#fdfbfa]">
      <HeaderBackdrop />
      <div className="site-container">
        <ShopCatalogue products={products} />
      </div>
    </main>
  );
}
