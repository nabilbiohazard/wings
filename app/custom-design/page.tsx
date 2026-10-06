import { HeaderBackdrop } from "@/components/header-backdrop";
import { DesignStudio } from "@/components/custom-design/DesignStudio";
import { getProducts } from "@/lib/get-products";
import { toDesignProduct } from "@/lib/design-products";
export const metadata = {
  title: "Charm Builder",
};

export default async function CharmBuilderPage({ searchParams }: {
  searchParams: Promise<{ product?: string | string[]; design?: string | string[] }>;
}) {
  const query = await searchParams;
  const requestedId = typeof query.product === "string" ? Number(query.product) : undefined;
  const { products, failed } = await getProducts()
    .then((items) => ({ products: items.filter((product) => product.isInStock !== false).map(toDesignProduct), failed: false }))
    .catch(() => {
      console.error("Design catalogue could not be loaded.");
      return { products: [], failed: true };
    });
  const initialProduct = products.find((product) => product.id === requestedId) ?? null;
  return (
    <main className="min-h-screen bg-white">
       <HeaderBackdrop />
      <DesignStudio products={products} initialProduct={initialProduct} initialDesignId={typeof query.design === "string" ? query.design : undefined} catalogueFailed={failed} requestedUnavailable={Boolean(query.product && !initialProduct && !failed)} />
    </main>
  );
}

