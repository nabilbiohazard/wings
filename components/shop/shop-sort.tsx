"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownWideNarrow, Check, ChevronDown } from "lucide-react";
import styles from "./shop-sort.module.css";

const options = [
  { value: "newest", label: "جدیدترین", description: "تازه‌ترین انتخاب‌های وینگز" },
  { value: "popular", label: "محبوب‌ترین", description: "بر اساس تعداد و امتیاز دیدگاه‌ها" },
  { value: "low", label: "ارزان‌ترین", description: "قیمت از کم به زیاد" },
  { value: "high", label: "گران‌ترین", description: "قیمت از زیاد به کم" },
] as const;
type Sort = typeof options[number]["value"];

export function ShopSort({ value, onChange }: { value: Sort; onChange: (value: Sort) => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    if (!open) return;
    items.current[options.findIndex((item) => item.value === value)]?.focus();
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, value]);
  return <div ref={root} className={styles.root} onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
  }}>
    <button ref={trigger} type="button" className={styles.trigger}
      aria-haspopup="menu" aria-expanded={open} aria-controls="shop-sort-menu"
      aria-label={`مرتب‌سازی: ${options.find((item) => item.value === value)?.label}`}
      onClick={() => setOpen(!open)}
      onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); } }}>
      <ArrowDownWideNarrow size={18} strokeWidth={1.5} />
      <span>{options.find((item) => item.value === value)?.label}</span>
      <ChevronDown size={15} className={open ? styles.rotated : undefined} />
    </button>
    {open && <div id="shop-sort-menu" role="menu" aria-label="مرتب‌سازی محصولات" className={styles.menu}
      onKeyDown={(event) => {
        const index = items.current.indexOf(document.activeElement as HTMLButtonElement);
        if (event.key === "Escape") { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
          items.current[next]?.focus();
        }
      }}>
      <p className={styles.heading}>ترتیب نمایش محصولات</p>
      {options.map((item, index) => <button key={item.value} ref={(element) => { items.current[index] = element; }}
        type="button" role="menuitemradio" aria-checked={value === item.value}
        className={styles.option} tabIndex={value === item.value ? 0 : -1}
        onClick={() => { onChange(item.value); setOpen(false); trigger.current?.focus(); }}>
        <span><strong>{item.label}</strong><small>{item.description}</small></span>
        <span className={styles.check}>{value === item.value && <Check size={14} />}</span>
      </button>)}
    </div>}
  </div>;
}
