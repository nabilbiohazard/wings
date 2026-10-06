"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ProductCard } from "../product-card";
import { useShop } from "../shop-provider";

type Filters = { category: string; materials: string[]; min: string; max: string; stock: boolean; sale: boolean };
type Sort = "newest" | "popular" | "low" | "high";
const empty: Filters = { category: "all", materials: [], min: "", max: "", stock: false, sale: false };
const format = (value: number) => value.toLocaleString("fa-IR");
const normalize = (value: string) => value.toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\u200c\u200d]/g, " ").replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776)).replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632)).replace(/\s+/g, " ").trim();
const materialOptions = (product: Product) => product.attributes?.filter((attribute) => /جنس|material/i.test(attribute.name)).flatMap((attribute) => attribute.options) ?? [];
const parsePrice = (value: string) => Number(normalize(value).replace(/[^0-9]/g, ""));

export function ShopCatalogue({ products }: { products: Product[] }) {
  const { category, setCategory } = useShop();
  const [filters, setFilters] = useState<Filters>(empty);
  const [draft, setDraft] = useState<Filters>(empty);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(24);
  const selected = { ...filters, category };

  const availableCategories = useMemo(() => {
    const found = new Map<string, string>();
    products.forEach((product) => product.categories?.forEach((item) => found.set(item.slug, item.name)));
    products.forEach((product) => { if (product.category !== "all" && !found.has(product.category)) found.set(product.category, product.category); });
    return [...found].sort(([a], [b]) => categories.findIndex((item) => item.id === a) - categories.findIndex((item) => item.id === b));
  }, [products]);
  const materials = useMemo(() => [...new Set(products.flatMap(materialOptions))].filter(Boolean).sort((a, b) => a.localeCompare(b, "fa")), [products]);
  const priceCeiling = useMemo(() => Math.max(0, ...products.map((product) => product.price)), [products]);

  const filtered = useMemo(() => {
    const terms = normalize(query).split(" ").filter(Boolean);
    const minimum = selected.min ? parsePrice(selected.min) : 0;
    const maximum = selected.max ? parsePrice(selected.max) : Infinity;
    const result = products.filter((product) => {
      if (selected.category !== "all" && product.category !== selected.category && !product.categories?.some((item) => item.slug === selected.category)) return false;
      if (product.price < minimum || product.price > maximum) return false;
      if (selected.stock && product.isInStock === false) return false;
      if (selected.sale && !product.onSale) return false;
      if (selected.materials.length && !materialOptions(product).some((item) => selected.materials.includes(item))) return false;
      const haystack = normalize([product.name, product.english, product.sku, product.category, ...(product.categories?.map((item) => item.name) ?? []), ...materialOptions(product)].filter(Boolean).join(" "));
      return terms.every((term) => haystack.includes(term));
    });
    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "popular") result.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0) || (b.averageRating ?? 0) - (a.averageRating ?? 0));
    return result;
  }, [products, query, sort, selected.category, selected.min, selected.max, selected.stock, selected.sale, selected.materials]);

  const activeCount = Number(category !== "all") + filters.materials.length + Number(Boolean(filters.min)) + Number(Boolean(filters.max)) + Number(filters.stock) + Number(filters.sale);
  function update(patch: Partial<Filters>) { setFilters((current) => ({ ...current, ...patch })); setVisible(24); }
  function reset() { setFilters(empty); setCategory("all"); setDraft(empty); setQuery(""); setVisible(24); }
  function openFilters() { setDraft({ ...filters, category }); setOpen(true); }
  function apply() { setFilters({ ...draft, category: "all" }); setCategory(draft.category); setVisible(24); setOpen(false); }
  useEffect(() => { if (!open) return; const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [open]);

  function controls(value: Filters, change: (patch: Partial<Filters>) => void) {
    return <div className="space-y-8 text-right" dir="rtl">
      <fieldset><legend className="mb-4 text-sm font-semibold text-[#332a2c]">دسته‌بندی</legend><div className="space-y-1"><button type="button" onClick={() => change({ category: "all" })} className={`flex w-full justify-between rounded-xl px-3 py-2.5 text-sm ${value.category === "all" ? "bg-[#f7e8ed] text-[#813e59]" : "text-[#75666a] hover:bg-[#faf5f6]"}`}><span>همه محصولات</span><span>{format(products.length)}</span></button>{availableCategories.map(([slug, name]) => <button key={slug} type="button" onClick={() => change({ category: slug })} className={`flex w-full justify-between rounded-xl px-3 py-2.5 text-sm ${value.category === slug ? "bg-[#f7e8ed] text-[#813e59]" : "text-[#75666a] hover:bg-[#faf5f6]"}`}><span>{name}</span><span>{format(products.filter((product) => product.category === slug || product.categories?.some((item) => item.slug === slug)).length)}</span></button>)}</div></fieldset>
      <fieldset className="border-t border-[#eee3e5] pt-6"><legend className="pt-6 text-sm font-semibold text-[#332a2c]">بازه قیمت <span className="font-normal text-[#a08e92]">(تومان)</span></legend><div className="mt-4 flex gap-2"><input aria-label="حداقل قیمت" inputMode="numeric" type="text" value={value.min} onChange={(event) => change({ min: event.target.value })} placeholder="از ۰" className="w-1/2 rounded-xl border border-[#e9dedf] px-3 py-3 text-sm outline-none focus:border-[#ae7585]"/><input aria-label="حداکثر قیمت" inputMode="numeric" type="text" value={value.max} onChange={(event) => change({ max: event.target.value })} placeholder={`تا ${format(priceCeiling)}`} className="w-1/2 rounded-xl border border-[#e9dedf] px-3 py-3 text-sm outline-none focus:border-[#ae7585]"/></div></fieldset>
      {materials.length > 0 && <fieldset className="border-t border-[#eee3e5] pt-6"><legend className="pt-6 text-sm font-semibold text-[#332a2c]">جنس</legend><div className="mt-4 max-h-48 space-y-3 overflow-y-auto">{materials.map((material) => <label key={material} className="flex cursor-pointer items-center gap-3 text-sm text-[#68595e]"><input type="checkbox" checked={value.materials.includes(material)} onChange={() => change({ materials: value.materials.includes(material) ? value.materials.filter((item) => item !== material) : [...value.materials, material] })} className="accent-[#a45e77]"/>{material}</label>)}</div></fieldset>}
      <fieldset className="space-y-4 border-t border-[#eee3e5] pt-6"><legend className="pt-6 text-sm font-semibold text-[#332a2c]">ویژگی‌ها</legend><label className="flex cursor-pointer items-center gap-3 text-sm text-[#68595e]"><input type="checkbox" checked={value.stock} onChange={(event) => change({ stock: event.target.checked })} className="accent-[#a45e77]"/>فقط کالاهای موجود</label><label className="flex cursor-pointer items-center gap-3 text-sm text-[#68595e]"><input type="checkbox" checked={value.sale} onChange={(event) => change({ sale: event.target.checked })} className="accent-[#a45e77]"/>فقط تخفیف‌دارها</label></fieldset>
    </div>;
  }

  return <section dir="rtl" className="min-w-0 w-full py-10 lg:py-16">
    <div className="mb-9 border-b border-[#eee2e4] pb-8"><p className="mb-3 text-xs tracking-[0.3em] text-[#ae7c8d]">WINGS COLLECTION</p><h1 className="text-3xl font-medium text-[#30272a] sm:text-4xl">فروشگاه وینگز</h1><p className="mt-3 text-sm leading-7 text-[#8b777d]">قطعه‌ای برای هر سلیقه و هر لحظه؛ مجموعه را جستجو و انتخاب کنید.</p></div>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative min-w-0 flex-1"><label htmlFor="shop-search" className="sr-only">جستجو در محصولات</label><div className="flex h-13 items-center gap-3 rounded-2xl border border-[#e7dadd] bg-white px-4 focus-within:border-[#ad7688]"><svg aria-hidden="true" className="size-5 text-[#a77a89]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><input id="shop-search" type="search" autoComplete="off" value={query} onChange={(event) => { setQuery(event.target.value); setVisible(24); }} placeholder="نام محصول، جنس یا کد کالا..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#aa999e]"/>{query && <button type="button" aria-label="پاک کردن جستجو" onClick={() => setQuery("")} className="text-[#8f727a]">×</button>}</div>{query.trim() && filtered.length > 0 && <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-[#e7dadd] bg-white p-2 shadow-xl"><p className="px-3 py-2 text-xs text-[#9a7d85]">محصولات پیشنهادی</p>{filtered.slice(0, 4).map((product) => <a key={product.id} href={`/shop/${product.slug}`} className="block truncate rounded-xl px-3 py-2 text-sm hover:bg-[#fbf3f5]">{product.name}</a>)}</div>}</div>
      <div className="flex gap-2"><button type="button" onClick={openFilters} className="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl border border-[#dfcdd2] bg-[#fff8fa] px-5 text-sm text-[#7e4c5f] lg:hidden">فیلترها {activeCount > 0 && <span className="rounded-full bg-[#a45e77] px-2 text-xs text-white">{format(activeCount)}</span>}</button><label htmlFor="shop-sort" className="sr-only">مرتب‌سازی</label><select id="shop-sort" value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="h-13 flex-1 rounded-xl border border-[#e7dadd] bg-white px-4 text-sm outline-none focus:border-[#ad7688] sm:min-w-44"><option value="newest">جدیدترین</option><option value="popular">محبوب‌ترین</option><option value="low">ارزان‌ترین</option><option value="high">گران‌ترین</option></select></div>
    </div>
    <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#8c777e]"><span aria-live="polite">{format(filtered.length)} محصول از {format(products.length)} محصول</span>{(activeCount > 0 || query) && <button type="button" onClick={reset} className="rounded-full border border-[#e6d2d8] px-3 py-1.5 text-[#8c5267] hover:bg-[#fff3f6]">پاک کردن همه فیلترها ×</button>}</div>
    <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[260px_minmax(0,1fr)]"><aside className="hidden self-start rounded-3xl border border-[#eee3e5] bg-white p-5 lg:block"><div className="mb-6 flex items-center justify-between"><h2 className="text-lg font-medium">فیلتر محصولات</h2>{activeCount > 0 && <button type="button" onClick={reset} className="text-xs text-[#9e5e76]">پاک کردن</button>}</div>{controls(selected, (patch) => { if (patch.category !== undefined) { setCategory(patch.category); setVisible(24); } else update(patch); })}</aside><div className="min-w-0">{filtered.length ? <><div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-7 lg:grid-cols-3 xl:grid-cols-4">{filtered.slice(0, visible).map((product) => <ProductCard key={product.id} product={product} mobileHorizontal sizes="(max-width: 639px) 40vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"/>)}</div>{visible < filtered.length && <div className="mt-12 text-center"><p className="mb-4 text-xs text-[#927d83]">نمایش {format(Math.min(visible, filtered.length))} از {format(filtered.length)} محصول</p><button type="button" onClick={() => setVisible((count) => count + 24)} className="rounded-full border border-[#b98092] px-8 py-3 text-sm text-[#7e4c5f] hover:bg-[#fbeef2]">نمایش محصولات بیشتر</button></div>}</> : <div className="rounded-3xl border border-[#eee3e5] bg-[#fffafb] px-5 py-20 text-center"><h2 className="text-xl text-[#342b2e]">محصولی پیدا نشد</h2><p className="mt-3 text-sm text-[#8f7c81]">جستجو یا فیلترها را تغییر دهید.</p><button type="button" onClick={reset} className="mt-6 rounded-full bg-[#382930] px-6 py-3 text-sm text-white">نمایش همه محصولات</button></div>}</div></div>
    {open && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="بستن فیلترها" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/50"/><div role="dialog" aria-modal="true" aria-label="فیلتر محصولات" className="absolute inset-y-0 right-0 flex w-[min(90vw,390px)] flex-col bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-[#eee3e5] p-5"><h2 className="text-lg font-medium">فیلتر محصولات</h2><button type="button" onClick={() => setOpen(false)} aria-label="بستن" className="p-2 text-xl">×</button></div><div className="min-h-0 flex-1 overflow-y-auto p-5">{controls(draft, (patch) => setDraft((current) => ({ ...current, ...patch })))}</div><div className="flex gap-2 border-t border-[#eee3e5] bg-white p-4"><button type="button" onClick={() => setDraft(empty)} className="rounded-xl border border-[#e4d6da] px-4 py-3 text-sm">پاک کردن</button><button type="button" onClick={apply} className="flex-1 rounded-xl bg-[#392a30] px-4 py-3 text-sm text-white">اعمال فیلترها</button></div></div></div>}
  </section>;
}
