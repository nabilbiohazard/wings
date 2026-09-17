"use client";
import { categories, products } from "@/lib/products";
import { ProductCard } from "./product-card";
import { Icon } from "./icon";
import { Reveal } from "./reveal";
import { useShop } from "./shop-provider";
export function NewArrivals() {
  const { category, setCategory } = useShop();
  const filtered = products.filter(product => category === "all" || product.category === category);
  return <section id="new-arrivals" className="new-arrivals section-container" aria-labelledby="arrivals-heading"><Reveal>
    <div className="section-heading"><div><p className="eyebrow">تازه‌ها، برای حال‌وهوای تازه</p><h2 id="arrivals-heading">تازه به جمع ما رسیدند<span className="heading-star">✧</span></h2></div><button className="text-link" onClick={() => setCategory("all")}>دیدن همه محصولات<Icon name="arrow" size={17} /></button></div>
    <div className="category-filters" aria-label="فیلتر محصولات">{[{ id: "all" as const, name: "همه" }, ...categories].map(item => <button key={item.id} onClick={() => setCategory(item.id)} className={category === item.id ? "selected" : ""} aria-pressed={category === item.id}>{item.name}</button>)}</div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-6" aria-live="polite">{filtered.map(product => <ProductCard key={product.id} product={product} />)}</div>
    <div className="arrivals-caption"><span /><p>هر تکه، شروع یک داستان تازه</p><span /></div>
  </Reveal></section>;
}
