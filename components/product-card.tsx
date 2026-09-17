"use client";

import Image from "next/image";
import { type Product, persianNumber } from "@/lib/products";
import { Icon } from "./icon";
import { useShop } from "./shop-provider";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { favorites, toggleFavorite, viewProduct } = useShop();

  const saved = favorites.includes(product.id);

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-black/[0.03]">
        <button
          onClick={() => viewProduct(product)}
          aria-label={`مشاهده ${product.name}`}
          className="relative block h-full w-full overflow-hidden"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="
              (max-width:600px) 50vw,
              (max-width:1000px) 45vw,
              25vw
            "
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <span className="absolute bottom-5 left-1/2 flex -translate-x-1/2 translate-y-4 items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-xs text-black opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            نگاهی نزدیک‌تر
            <Icon name="plus" size={16} />
          </span>
        </button>

        {product.label && (
          <span className="absolute top-4 left-4 rounded-full bg-white px-4 py-1.5 text-xs text-black">
            {product.label}
          </span>
        )}

        <button
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={saved}
          aria-label={`${saved ? "حذف از" : "افزودن به"} علاقه‌مندی‌ها: ${product.name}`}
          className={`absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${
            saved ? "bg-black text-white" : "bg-white/90 text-black hover:bg-black hover:text-white"
          } `}
        >
          <Icon name="heart" size={19} />
        </button>
      </div>

      <div className="mt-5 text-right">
        <button onClick={() => viewProduct(product)} className="block text-right">
          <h3 className="text-base font-medium transition hover:opacity-60">{product.name}</h3>
        </button>

        <span className="mt-2 block text-sm text-black/80">
          {persianNumber(product.price)}

          <small className="mr-1 text-xs text-black/50">تومان</small>
        </span>

        <p lang="en" dir="ltr" className="mt-2 text-xs tracking-wide text-black/50">
          {product.english}
        </p>
      </div>
    </article>
  );
}
