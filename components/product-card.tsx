"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { persianNumber } from "@/lib/products";
import { Icon } from "./icon";
import { useShop } from "./shop-provider";

type ProductCardProps = {
  product: Product;
  sizes?: string;
};

const previewColors = [
  "bg-pink-100 text-pink-400",
  "bg-[#f6e9ef] text-[#ca94ae]",
  "bg-[#eee8f4] text-[#b29ac8]",
  "bg-[#fce8e1] text-[#d5a391]",
];

function ImagePlaceholder({ index = 0 }: { index?: number }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-5 ${previewColors[index % previewColors.length]}`}
    >
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full border border-current/20"
        aria-hidden="true"
      >
        <Icon name="sparkle" size={38} />
      </div>
      <span className="text-[10px] text-[#835567]">تصویر به‌زودی</span>
    </div>
  );
}

export function ProductPreviewCard({
  name,
  index,
}: {
  name: string;
  index: number;
}) {
  return (
    <article
      dir="rtl"
      aria-label={`${name}، کارت نمونه`}
      className="flex h-full flex-col rounded-[22px] border border-pink-200/70 bg-white p-2"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        <ImagePlaceholder index={index} />
        <span className="absolute top-3 right-3 rounded-full bg-white/80 px-3 py-1.5 text-[10px] text-pink-800">
          پیش‌نمایش
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-3 text-xs text-[#835567]"
        >
          {persianNumber(index + 1).padStart(2, "۰")} / ۰۷
        </span>
      </div>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <p className="mb-2 text-[10px] text-pink-700/70">وینگز گالری</p>
        <h3 className="min-h-12 text-sm leading-6 font-medium text-[#211b18]">
          {name}
        </h3>
        <div className="mt-4 flex min-h-12 items-end">
          <p className="text-sm text-[#835567]">به‌زودی</p>
        </div>
        <p className="mt-4 flex min-h-10 items-center justify-between gap-2 rounded-xl bg-pink-50 px-3 py-2.5 text-[11px] text-pink-800">
          یک انتخاب تازه در راه است <Icon name="sparkle" size={15} />
        </p>
      </div>
    </article>
  );
}

export function ProductCard({
  product,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: ProductCardProps) {
  const { favorites, toggleFavorite } = useShop();
  const saved = favorites.includes(product.id);
  const href = `/shop/${product.slug}`;
  const secondImage = product.images?.[1];
  const regularPrice = product.regularPrice ?? product.price;
  const salePrice = product.salePrice ?? product.price;
  const hasDiscount =
    Boolean(product.onSale) && regularPrice > salePrice && salePrice >= 0;
  const discount = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;
  const inStock = product.isInStock !== false;
  const material = product.attributes?.find(
    (attribute) => /جنس|material/i.test(attribute.name),
  )?.options[0];
  const category = product.categories?.[0]?.name;
  const rating = product.averageRating ?? 0;

  return (
    <article
      dir="rtl"
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] border border-[#ede3e2] bg-white p-1.5 shadow-[0_8px_28px_rgba(74,43,52,0.035)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#d8bac3] hover:shadow-[0_20px_48px_rgba(74,43,52,0.11)] focus-within:border-[#b4778c] motion-reduce:transform-none"
    >
      <div className="relative isolate aspect-[4/5] overflow-hidden rounded-[19px] bg-[#f7f1ef]">
        <Link
          href={href}
          aria-label={`مشاهده ${product.name}`}
          className="relative block h-full w-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#9b5870]"
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes={sizes}
              className={`object-cover transition-[transform,opacity] duration-700 motion-reduce:transition-none group-hover:scale-[1.04] ${secondImage ? "group-hover:opacity-0" : ""}`}
            />
          ) : (
            <ImagePlaceholder />
          )}
          {secondImage && (
            <Image
              src={secondImage}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-[transform,opacity] duration-700 group-hover:scale-[1.04] group-hover:opacity-100 motion-reduce:transition-none"
            />
          )}
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {(!inStock || hasDiscount) && (
          <span
            className={`pointer-events-none absolute top-2.5 right-2.5 rounded-full px-3 py-1.5 text-[10px] font-semibold shadow-sm sm:text-[11px] ${!inStock ? "bg-white/95 text-[#74686b]" : "bg-[#8f425f] text-white"}`}
          >
            {!inStock ? "ناموجود" : `${persianNumber(discount)}٪ تخفیف`}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={saved}
          aria-label={`${saved ? "حذف از" : "افزودن به"} علاقه‌مندی‌ها: ${product.name}`}
          className={`absolute top-2.5 left-2.5 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-[background-color,color,transform] hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b5870] sm:h-10 sm:w-10 ${saved ? "border-[#e6bbc9] bg-[#fbe8ed] text-[#9b3f61]" : "border-white/80 bg-white/90 text-[#47363c] hover:bg-[#fbe8ed] hover:text-[#9b3f61]"}`}
        >
          <Icon
            name="heart"
            size={17}
            className={saved ? "fill-current" : ""}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5 sm:px-3.5">
        <div className="mb-2 flex min-w-0 items-center justify-between gap-2 text-[10px] text-[#9b7883] sm:text-[11px]">
          <span className="truncate">{category || "وینگز گالری"}</span>
          {rating > 0 && (
            <span className="shrink-0 text-[#9d7041]" aria-label={`امتیاز ${persianNumber(rating)} از ۵`}>
              <span aria-hidden="true">★</span> {persianNumber(rating)}
            </span>
          )}
        </div>
        <Link
          href={href}
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b5870]"
        >
          <h3
            className="line-clamp-2 min-h-12 text-[13px] leading-6 font-medium text-[#30262a] transition-colors hover:text-[#9b5870] sm:text-sm"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 min-h-4 truncate text-[10px] text-[#ad9ca0] sm:text-[11px]">
          {material || "انتخابی برای لحظه‌های تو"}
        </p>
        <div className="mt-auto flex min-h-20 flex-col justify-end border-t border-[#f1e8e8] pt-3">
          {hasDiscount && (
            <del className="mb-0.5 block text-[11px] text-[#aa9b9e]">
              <span className="sr-only">قیمت قبلی: </span>
              {persianNumber(regularPrice)}
              <span className="sr-only"> تومان</span>
            </del>
          )}
          <p className="text-[15px] font-semibold tabular-nums text-[#35262c] sm:text-base">
            {persianNumber(hasDiscount ? salePrice : product.price)}{" "}
            <span className="text-[10px] font-normal text-[#95858a] sm:text-[11px]">
              تومان
            </span>
          </p>
        </div>
        <Link
          href={href}
          aria-label={`مشاهده ${product.name}`}
          className="mt-2 flex min-h-10 items-center justify-between gap-1 rounded-xl bg-[#f8eef1] px-3 py-2.5 text-[11px] font-medium text-[#79465a] transition-[background-color,color] hover:bg-[#8f425f] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b5870] sm:px-4 sm:text-xs"
        >
          <span className="truncate">{product.hasOptions ? "انتخاب مدل" : "مشاهده محصول"}</span>
          <Icon name="arrow" size={15} />
        </Link>
      </div>
    </article>
  );
}
