"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import type { CharmData } from "./Charm";
import { PaletteCharm } from "./Charm";

const PAGE_SIZE = 18;
const ALL_CATEGORIES = "همه";
const collator = new Intl.Collator("fa", { numeric: true, sensitivity: "base" });

function normalizeSearch(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replaceAll("ي", "ی")
    .replaceAll("ك", "ک")
    .replaceAll("‌", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function persianDigits(value: number) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

export function CharmPalette({
  charms,
  selectedCharmId,
  onSelect,
}: {
  charms: CharmData[];
  selectedCharmId?: string;
  onSelect: (charm: CharmData) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const charm of charms) {
      const name = charm.category ?? "سایر";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [charms]);

  const filteredCharms = useMemo(() => {
    const terms = normalizeSearch(search).split(/\s+/).filter(Boolean);
    const matches = charms.filter((charm) => {
      if (category !== ALL_CATEGORIES && (charm.category ?? "سایر") !== category) {
        return false;
      }
      const searchable = normalizeSearch(
        [charm.name, charm.id.replaceAll("-", " "), charm.category, ...(charm.keywords ?? [])]
          .filter(Boolean)
          .join(" "),
      );
      return terms.every((term) => searchable.includes(term));
    });

    if (sort !== "default") {
      matches.sort((a, b) =>
        sort === "name-asc"
          ? collator.compare(a.name, b.name)
          : collator.compare(b.name, a.name),
      );
    }
    return matches;
  }, [charms, search, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredCharms.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleCharms = filteredCharms.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function resetFilters() {
    setSearch("");
    setCategory(ALL_CATEGORIES);
    setSort("default");
    setPage(1);
  }

  function goToPage(nextPage: number) {
    setPage(nextPage);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div dir="rtl" className="space-y-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <label htmlFor="charm-search" className="mb-2 block text-sm font-medium text-neutral-700">
          جست‌وجوی چارم
        </label>
        <div className="relative">
          <Search aria-hidden="true" size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="charm-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="نام یا موضوع چارم را بنویسید..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pe-10 ps-10 text-sm text-neutral-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              aria-label="پاک کردن جست‌وجو"
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-neutral-500">دسته‌بندی</span>
          {(search || category !== ALL_CATEGORIES || sort !== "default") && (
            <button type="button" onClick={resetFilters} className="text-xs font-medium text-amber-700 hover:underline">
              پاک کردن فیلترها
            </button>
          )}
        </div>
        <div role="group" className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="دسته‌بندی چارم‌ها">
          {[{ name: ALL_CATEGORIES, count: charms.length }, ...categories].map(({ name, count }) => (
            <button
              key={name}
              type="button"
              aria-pressed={category === name}
              onClick={() => {
                setCategory(name);
                setPage(1);
              }}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition ${
                category === name
                  ? "border-neutral-800 bg-neutral-800 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-amber-400 hover:text-neutral-900"
              }`}
            >
              {name} <span className={category === name ? "text-white/70" : "text-neutral-400"}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={resultsRef} className="flex scroll-mt-6 items-center justify-between gap-3">
        <p role="status" className="text-sm text-neutral-600">
          {persianDigits(filteredCharms.length)} چارم پیدا شد
        </p>
        <label className="flex items-center gap-2 text-xs text-neutral-500">
          مرتب‌سازی
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs text-neutral-700 outline-none focus:border-amber-500"
          >
            <option value="default">پیش‌فرض</option>
            <option value="name-asc">نام: الف تا ی</option>
            <option value="name-desc">نام: ی تا الف</option>
          </select>
        </label>
      </div>

      {visibleCharms.length ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-3">
          {visibleCharms.map((charm) => (
            <PaletteCharm key={charm.id} charm={charm} selected={selectedCharmId === charm.id} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-10 text-center">
          <p className="text-sm font-medium text-neutral-700">چارمی با این جست‌وجو پیدا نشد.</p>
          <p className="mt-1 text-xs text-neutral-500">نام دیگری بنویسید یا فیلترها را پاک کنید.</p>
          <button type="button" onClick={resetFilters} className="mt-4 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs text-neutral-700 hover:border-amber-400">
            نمایش همهٔ چارم‌ها
          </button>
        </div>
      )}

      {pageCount > 1 && (
        <nav aria-label="صفحه‌های چارم‌ها" className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-700 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={15} /> قبلی
          </button>
          <label className="flex items-center gap-1 text-xs text-neutral-500">
            صفحهٔ
            <select
              aria-label="انتخاب صفحهٔ چارم‌ها"
              value={currentPage}
              onChange={(event) => goToPage(Number(event.target.value))}
              className="rounded-lg border border-neutral-200 bg-white px-1 py-1.5 text-xs text-neutral-700"
            >
              {Array.from({ length: pageCount }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {persianDigits(index + 1)}
                </option>
              ))}
            </select>
            از {persianDigits(pageCount)}
          </label>
          <button
            type="button"
            disabled={currentPage === pageCount}
            onClick={() => goToPage(currentPage + 1)}
            className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-700 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            بعدی <ChevronLeft size={15} />
          </button>
        </nav>
      )}
    </div>
  );
}
