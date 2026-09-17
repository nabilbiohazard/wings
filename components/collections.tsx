"use client";
import Image from "next/image";
import { categories } from "@/lib/products";
import { Icon } from "./icon";
import { Reveal } from "./reveal";
import { useShop } from "./shop-provider";
export function CategoryCard({ category }: { category: typeof categories[number] }) {
  const { setCategory } = useShop();
  return <a href="#new-arrivals" onClick={() => setCategory(category.id)} className="category-card group">
    <Image src={category.image} alt={category.name} fill sizes="(max-width: 600px) 50vw, 25vw" className="category-image transition-transform duration-700 group-hover:scale-105" />
    <div className="category-copy"><span lang="en" className="category-english">{category.english}</span><h3>{category.name}</h3><p>{category.tagline}</p><span className="circle-arrow"><Icon name="arrow" size={16} /></span></div>
  </a>;
}
export function Collections() {
  return <section id="collections" className="collections section-container" aria-labelledby="collections-heading"><div className="collection-heading"><h2 id="collections-heading">دنیای کوچکِ دوست‌داشتنی‌ها</h2><span lang="en" dir="ltr">FIND YOUR LITTLE JOY</span></div><Reveal className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">{categories.map(category => <CategoryCard key={category.id} category={category} />)}</Reveal></section>;
}
