"use client";

import { products } from "@/lib/products";

import { ProductCard } from "../product-card";

import { Reveal } from "../reveal";

import { useShop } from "../shop-provider";

import { Icon } from "../icon";

export function ShopGrid() {
  const { category } = useShop();

  const filteredProducts = products.filter(
    (product) => category === "all" || product.category === category,
  );

  return (
    <Reveal>
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}

                product={product}
              />
            ))}
          </div>

          {/* BOTTOM MESSAGE */}

          <div className="mt-20 flex items-center justify-center gap-5 text-sm text-black/50">
            <span className="h-px flex-1 bg-black/10" />

            <span>هر تکه، شروع یک داستان تازه ✦</span>

            <span className="h-px flex-1 bg-black/10" />
          </div>
        </>
      ) : (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[32px] bg-black/[0.03] text-center">
          <Icon
            name="search"

            size={45}
          />

          <h3 className="mt-6 text-xl font-medium">محصولی پیدا نشد</h3>

          <p className="mt-3 max-w-sm text-sm leading-8 text-black/60">
            دسته‌بندی دیگری را امتحان کن، شاید قطعه‌ی مورد علاقه‌ات آنجا منتظر تو باشد.
          </p>
        </div>
      )}
    </Reveal>
  );
}
