"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Check, ArrowLeft } from "lucide-react";
import type { DesignProduct } from "@/lib/design-products";
import { persianNumber } from "@/lib/products";
import styles from "./product-picker.module.css";

export function ProductPicker({ products, selectedId, hasDesign, failed, onSelect, onClose }: {
  products: DesignProduct[];
  selectedId?: number;
  hasDesign: boolean;
  failed: boolean;
  onSelect: (product: DesignProduct) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const normalize = (value: string) => value.toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/\u200c/g, " ");
  const filtered = products.filter((product) => (category === "all" || product.category === category) && normalize(product.name).includes(normalize(query.trim())));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 9));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * 9, currentPage * 9);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <dialog ref={dialogRef} className={styles.dialog} dir="rtl" aria-labelledby="product-picker-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <div><p>اولین قدم برای یک انتخاب شخصی</p><h2 id="product-picker-title">روی کدام محصول طراحی کنیم؟</h2></div>
          <button type="button" onClick={onClose} aria-label="بستن انتخاب محصول"><X size={20} /></button>
        </header>
        {hasDesign && <p className={styles.notice}>با انتخاب محصول دیگری، چارم‌های طرح فعلی پاک می‌شوند.</p>}
        <div className={styles.filters}>
          <label className={styles.search}><Search size={18} aria-hidden="true" /><input autoFocus type="search" placeholder="جست‌وجوی محصول…" aria-label="جست‌وجوی محصول" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label>
          <select aria-label="دسته‌بندی محصولات" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option value="all">همهٔ محصولات</option>{categories.map((name) => <option key={name} value={name}>{name}</option>)}</select>
        </div>
        <div className={styles.results}>
          <div className={styles.grid}>{visible.map((product) => <button key={product.id} type="button" className={styles.product} onClick={() => onSelect(product)} aria-label={`انتخاب ${product.name}`}>
            <div className={styles.image}>{product.image ? <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 640px) 45vw, 280px" className="object-contain" /> : <span aria-hidden="true">✦</span>}{selectedId === product.id && <span className={styles.selected}><Check size={16} /> انتخاب فعلی</span>}</div>
            <div className={styles.details}><span>{product.category === "all" ? "وینگز گالری" : product.category}</span><h3>{product.name}</h3><div><p>{persianNumber(product.price)} <small>تومان</small></p><span className={styles.choose}>انتخاب <ArrowLeft size={14} /></span></div></div>
          </button>)}</div>
          {!visible.length && <div className={styles.empty}><span aria-hidden="true">✦</span><h3>{failed ? "دریافت محصولات انجام نشد." : "محصولی پیدا نشد."}</h3><p>{failed ? "برای دریافت دوبارهٔ محصولات، صفحه را تازه کن." : products.length ? "عبارت یا دسته‌بندی دیگری را امتحان کن." : "در حال حاضر محصول موجودی برای انتخاب نداریم."}</p>{failed && <button type="button" onClick={() => window.location.reload()}>تلاش دوباره</button>}</div>}
        </div>
        <footer className={styles.footer}><span>{filtered.length.toLocaleString("fa-IR")} محصول موجود</span>{pageCount > 1 && <nav aria-label="صفحه‌های محصولات"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>قبلی</button><span>{currentPage.toLocaleString("fa-IR")} / {pageCount.toLocaleString("fa-IR")}</span><button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>بعدی</button></nav>}<Link href="/shop">دیدن فروشگاه</Link></footer>
      </div>
    </dialog>
  );
}
