"use client";

import { categories } from "@/lib/products";

import { useShop } from "../shop-provider";

const filters = [
  {
    id: "all" as const,
    name: "همه",
  },
  ...categories,
];

export function ShopToolbar() {
  const { category, setCategory } = useShop();

  return (
    <div className="mb-12 flex flex-col gap-8">
      {/* CATEGORY FILTER */}

      <div className="flex flex-wrap justify-end gap-3">
        {filters.map((item) => (
          <button
            key={item.id}

            onClick={() => setCategory(item.id)}

            className={`duration-300" rounded-full px-6 py-3 text-sm transition-all ${
              category === item.id
                ? "bg-black text-white shadow-lg"
                : "bg-black/[0.04] text-black hover:bg-black hover:text-white"
            } `}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* TOOLBAR */}

      <div className="flex flex-col gap-5 border-y border-black/10 py-6 text-right sm:flex-row sm:items-center sm:justify-between">
        {/* RESULT COUNT */}

        <p className="text-sm text-black/50">نمایش محصولات وینگز</p>

        {/* SORT */}

        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-black/50">مرتب سازی:</span>

          <select className="rounded-full border border-black/10 bg-transparent px-5 py-2 text-sm outline-none">
            <option>جدیدترین</option>

            <option>محبوب‌ترین</option>

            <option>ارزان‌ترین</option>

            <option>گران‌ترین</option>
          </select>
        </div>
      </div>
    </div>
  );
}
