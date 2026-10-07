"use client";

import { useId, useMemo, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { PaletteCharm, type CharmData } from "./Charm";
import styles from "./builder-studio.module.css";

const PAGE_SIZE = 12;

function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replaceAll("ي", "ی")
    .replaceAll("ك", "ک")
    .replaceAll("‌", " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface CharmPaletteProps {
  charms: CharmData[];
  selectedCharmId?: string;
  counts: Record<string, number>;
  onSelect: (charm: CharmData) => void;
  onAdd: (charm: CharmData) => void;
}

export function CharmPalette({
  charms,
  selectedCharmId,
  counts,
  onSelect,
  onAdd,
}: CharmPaletteProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("همه");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const searchId = useId();

  const categories = useMemo(
    () => ["همه", ...new Set(charms.map((item) => item.category ?? "سایر"))],
    [charms],
  );

  const filtered = useMemo(() => {
    const terms = normalize(search).split(" ").filter(Boolean);
    const result = charms.filter((charm) => {
      if (category !== "همه" && (charm.category ?? "سایر") !== category) {
        return false;
      }

      const text = normalize(
        [
          charm.name,
          charm.id.replaceAll("-", " "),
          charm.category,
          ...(charm.keywords ?? []),
        ]
          .filter(Boolean)
          .join(" "),
      );

      return terms.every((term) => text.includes(term));
    });

    if (sort !== "default") {
      result.sort((a, b) =>
        sort === "asc"
          ? a.name.localeCompare(b.name, "fa", { numeric: true })
          : b.name.localeCompare(a.name, "fa", { numeric: true }),
      );
    }

    return result;
  }, [charms, search, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function resetFilters() {
    setSearch("");
    setCategory("همه");
    setSort("default");
    setPage(1);
  }

  function changePage(next: number) {
    setPage(Math.max(1, Math.min(next, pageCount)));
  }

  return (
    <div className={styles.palette}>
      <div className={styles.paletteFilters}>
        <div className={styles.paletteTitle}>
          <h2>کدام چارم شبیه توست؟</h2>
          <p>«افزودن» برای چیدمان خودکار؛ تصویر چارم برای انتخاب جای دلخواه.</p>
        </div>

        <label className={styles.searchBox} htmlFor={searchId}>
          <Search size={18} aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="جست‌وجوی نام یا موضوع..."
            aria-label="جست‌وجوی چارم"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              aria-label="پاک کردن جست‌وجو"
            >
              <X size={17} />
            </button>
          )}
        </label>

        <div
          className={styles.categories}
          role="group"
          aria-label="دسته‌بندی چارم‌ها"
        >
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={category === name}
              className={category === name ? styles.categoryActive : ""}
              onClick={() => {
                setCategory(name);
                setPage(1);
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <div className={styles.filterMeta}>
          <span>{filtered.length.toLocaleString("fa-IR")} چارم</span>
          <select
            value={sort}
            aria-label="مرتب‌سازی چارم‌ها"
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
          >
            <option value="default">ترتیب پیش‌فرض</option>
            <option value="asc">نام: الف تا ی</option>
            <option value="desc">نام: ی تا الف</option>
          </select>
        </div>
      </div>

      <div className={styles.paletteResults}>
        <div className={styles.charmGrid}>
          {visible.map((charm) => (
            <PaletteCharm
              key={charm.id}
              charm={charm}
              selected={selectedCharmId === charm.id}
              count={counts[charm.id] ?? 0}
              onSelect={onSelect}
              onAdd={onAdd}
            />
          ))}
        </div>

        {!visible.length && (
          <div className={styles.noResults}>
            <p>چارمی با این مشخصات پیدا نشد.</p>
            <button type="button" onClick={resetFilters}>
              نمایش همهٔ چارم‌ها
            </button>
          </div>
        )}

        {pageCount > 1 && (
          <nav className={styles.pagination} aria-label="صفحه‌های چارم‌ها">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
              aria-label="صفحهٔ قبلی"
            >
              <ChevronRight size={18} />
            </button>
            <span>
              {currentPage.toLocaleString("fa-IR")} از{" "}
              {pageCount.toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              disabled={currentPage === pageCount}
              onClick={() => changePage(currentPage + 1)}
              aria-label="صفحهٔ بعدی"
            >
              <ChevronLeft size={18} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
