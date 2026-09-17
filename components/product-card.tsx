"use client";
import Image from "next/image";
import { type Product, persianNumber } from "@/lib/products";
import { Icon } from "./icon";
import { useShop } from "./shop-provider";
export function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite, viewProduct } = useShop();
  const saved = favorites.includes(product.id);
  return <article className="product-card group">
    <div className="product-visual">
      <button className="product-image-button" onClick={() => viewProduct(product)} aria-label={`مشاهده ${product.name}`}><Image src={product.image} alt={product.name} fill sizes="(max-width: 600px) 50vw, (max-width: 1000px) 45vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /><span className="quick-view">نگاهی نزدیک‌تر<Icon name="plus" size={16} /></span></button>
      {product.label && <span className="product-label">{product.label}</span>}
      <button className={`favorite-button ${saved ? "is-saved" : ""}`} aria-pressed={saved} aria-label={`${saved ? "حذف از" : "افزودن به"} علاقه‌مندی‌ها: ${product.name}`} onClick={() => toggleFavorite(product.id)}><Icon name="heart" size={19} /></button>
    </div>
    <div className="product-info"><button onClick={() => viewProduct(product)}><h3>{product.name}</h3></button><span className="product-price">{persianNumber(product.price)} <small>تومان</small></span><p lang="en" dir="ltr">{product.english}</p></div>
  </article>;
}
