"use client";

import { useState } from "react";
import { BaseSelector, type BaseOption } from "./base-selector";
import { CharmSelector } from "./charm-selector";
import { DesignSummary } from "./design-summary";
import { LivePreview } from "./live-preview";
import {
  ProductTypeSelector,
  type ProductType,
} from "./product-type-selector";

export function CustomBuilder() {
  const [productType, setProductType] = useState<ProductType>("necklace");
  const [selectedBase, setSelectedBase] = useState<BaseOption | null>(null);
  const [selectedCharms, setSelectedCharms] = useState<string[]>([]);

  function handleProductTypeChange(type: ProductType) {
    setProductType(type);
    setSelectedBase(null);
    setSelectedCharms([]);
  }

  function handleBaseChange(base: BaseOption) {
    setSelectedBase(base);
    setSelectedCharms([]);
  }

  function handleAddToCart() {
    if (!selectedBase) return;

    /*
      مرحله بعد اینجا به WooCommerce وصل می‌شود.

      اطلاعاتی که برای Cart داریم:
      productType
      selectedBase
      selectedCharms
    */
  }

  return (
    <section id="builder" className="scroll-mt-28">
      <ProductTypeSelector
        value={productType}
        onChange={handleProductTypeChange}
      />

      <BaseSelector
        productType={productType}
        value={selectedBase}
        onChange={handleBaseChange}
      />

      <CharmSelector
        productType={productType}
        selectedBase={selectedBase}
        value={selectedCharms}
        onChange={setSelectedCharms}
      />

      <LivePreview
        productType={productType}
        selectedBase={selectedBase}
        selectedCharms={selectedCharms}
      />

      <DesignSummary
        productType={productType}
        selectedBase={selectedBase}
        selectedCharms={selectedCharms}
        onAddToCart={handleAddToCart}
      />
    </section>
  );
}