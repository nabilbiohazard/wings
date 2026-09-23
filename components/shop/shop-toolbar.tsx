"use client";

import { useEffect, useRef, useState } from "react";

import { categories } from "@/lib/products";
import { useShop } from "../shop-provider";

const filters = [
  {
    id: "all" as const,
    name: "همه",
  },
  ...categories,
];

const sortOptions = [
  {
    id: "newest",
    name: "جدیدترین",
  },
  {
    id: "popular",
    name: "محبوب‌ترین",
  },
  {
    id: "price-low",
    name: "ارزان‌ترین",
  },
  {
    id: "price-high",
    name: "گران‌ترین",
  },
] as const;

type SortId = (typeof sortOptions)[number]["id"];

export function ShopToolbar() {
  const { category, setCategory } = useShop();

  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortId>("newest");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedSort =
    sortOptions.find((item) => item.id === sort) ?? sortOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSortOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-12 flex flex-col gap-8">
      {/* CATEGORY FILTER */}

      <div className="flex flex-wrap justify-end gap-3">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={`rounded-full px-6 py-3 text-sm transition-all duration-300 ${
              category === item.id
                ? "bg-black text-white shadow-lg"
                : "bg-black/[0.04] text-black hover:bg-black hover:text-white"
            }`}
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

          <div ref={dropdownRef} className="relative">
            {/* DROPDOWN BUTTON */}

            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              className="
                flex min-w-[155px] items-center justify-between gap-4
                rounded-full border border-black/10
                bg-transparent px-5 py-2.5
                text-sm text-black
                outline-none
                transition-all duration-300
                hover:border-black/20
              "
              aria-expanded={sortOpen}
            >
              <span>{selectedSort.name}</span>

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className={`shrink-0 transition-transform duration-300 ${
                  sortOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* DROPDOWN MENU */}

            <div
              className={`absolute right-0 top-[calc(100%+10px)] z-50 w-full min-w-[175px] origin-top-right overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.12)] transition-all duration-200 ${
                sortOpen
                  ? "visible translate-y-0 scale-100 opacity-100"
                  : "invisible -translate-y-2 scale-[0.98] opacity-0"
              }`}
            >
              {sortOptions.map((item) => {
                const active = sort === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSort(item.id);
                      setSortOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-right text-sm transition-all duration-200 ${
                      active
                        ? "bg-black text-white"
                        : "text-black/70 hover:bg-black/[0.05] hover:text-black"
                    }`}
                  >
                    <span>{item.name}</span>

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}