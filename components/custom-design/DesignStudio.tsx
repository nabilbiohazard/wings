"use client";

import { CharmBuilder } from "./CharmBuilder";
import { useSavedDesigns } from "@/lib/saved-designs";
import type { DesignProduct } from "@/lib/design-products";

export function DesignStudio({ products, initialProduct, initialDesignId, catalogueFailed, requestedUnavailable }: {
  products: DesignProduct[];
  initialProduct: DesignProduct | null;
  initialDesignId?: string;
  catalogueFailed: boolean;
  requestedUnavailable: boolean;
}) {
  const designs = useSavedDesigns();
  const design = designs.find((item) => item.id === initialDesignId && item.product.id === initialProduct?.id);
  return <CharmBuilder key={`${initialProduct?.id ?? "empty"}-${design?.id ?? "new"}`} products={products} initialProduct={initialProduct} initialCharms={design?.charms} catalogueFailed={catalogueFailed} requestedUnavailable={requestedUnavailable} />;
}
