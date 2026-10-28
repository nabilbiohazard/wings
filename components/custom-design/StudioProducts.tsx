"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Search, Gem } from "lucide-react";
import type { DesignProduct } from "@/lib/design-products";
import { designRules } from "@/lib/design-rules";
import { persianNumber } from "@/lib/products";
import styles from "./studio-wizard.module.css";

export function StudioProducts({
  products,
  selected,
  failed,
  onSelect,
}: {
  products: DesignProduct[];
  selected: DesignProduct | null;
  failed: boolean;
  onSelect: (product: DesignProduct) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("همه");
  const categories = [
    "همه",
    ...new Set(products.map((product) => product.category)),
  ];
  const normalize = (value: string) =>
    value.normalize("NFKC").replace(/ي/g, "ی").replace(/ك/g, "ک").toLowerCase();
  const visible = products.filter(
    (product) =>
      (category === "همه" || product.category === category) &&
      normalize(product.name).includes(normalize(query)),
  );
  return (
    <div className={styles.products}>
      <div className={styles.productFilters}>
        <label className={styles.search}>
          <Search size={17} />
          <input
            aria-label="جست‌وجوی محصول"
            placeholder="دنبال چه محصولی می‌گردی؟"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div
          className={styles.categories}
          aria-label="دسته‌بندی محصولات"
          role="group"
        >
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.productScroll}>
        <div className={styles.productGrid}>
          {visible.map((product) => (
            <button
              key={product.id}
              type="button"
              className={styles.productCard}
              aria-label={`انتخاب ${product.name}`}
              aria-pressed={selected?.id === product.id}
              onClick={() => onSelect(product)}
            >
              <div className={styles.productImage}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 45vw, 280px"
                    className="object-contain"
                  />
                ) : (
                  <Gem size={44} strokeWidth={1} />
                )}
                {selected?.id === product.id && (
                  <span className={styles.selectedBadge}>
                    <Check size={16} /> انتخاب تو
                  </span>
                )}
              </div>
              <div className={styles.productInfo}>
                <small>{designRules(product).label}</small>
                <h2>{product.name}</h2>
                <strong>
                  {persianNumber(product.price)} <small>تومان</small>
                </strong>
              </div>
            </button>
          ))}
        </div>
        {!visible.length && (
          <div className={styles.empty}>
            <Gem size={36} strokeWidth={1} />
            <h2>{failed ? "محصولات دریافت نشدند" : "محصولی پیدا نشد"}</h2>
            <p>
              {failed
                ? "دوباره تلاش کن تا محصولات فروشگاه را دریافت کنیم."
                : "جست‌وجو یا دسته‌بندی را تغییر بده."}
            </p>
            <button
              type="button"
              onClick={() =>
                failed
                  ? window.location.reload()
                  : (setQuery(""), setCategory("همه"))
              }
            >
              {failed ? "تلاش دوباره" : "نمایش همه"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
