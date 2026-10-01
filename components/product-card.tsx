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
    (attribute) => attribute.name === "جنس",
  )?.options[0];

  return (
    <article
      dir="rtl"
      className="group flex h-full w-full flex-col rounded-[22px] border border-pink-200/70 bg-white p-2 transition-colors duration-300 hover:border-pink-400 focus-within:border-pink-400"
    >
      <div className="relative isolate aspect-[4/5] overflow-hidden rounded-2xl bg-[#f4f1ed]">
        <Link
          href={href}
          aria-label={`مشاهده ${product.name}`}
          className="relative block h-full w-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-black"
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes={sizes}
              className={`object-cover transition-[transform,opacity] duration-700 motion-reduce:transition-none group-hover:scale-105 ${secondImage ? "group-hover:opacity-0" : ""}`}
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
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none"
            />
          )}
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={saved}
          aria-label={`${saved ? "حذف از" : "افزودن به"} علاقه‌مندی‌ها: ${product.name}`}
          className={`absolute top-2 left-2 flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${saved ? "border-[#e8c4ce] bg-[#f8e4e9] text-[#a33c58]" : "border-white/70 bg-white/90 text-[#3d302b] hover:bg-[#f8e4e9]"}`}
        >
          <Icon
            name="heart"
            size={17}
            className={saved ? "fill-current" : ""}
          />
        </button>
        {(!inStock || hasDiscount) && (
          <span
            className={`pointer-events-none absolute right-2 bottom-2 rounded-lg px-2.5 py-1.5 text-[10px] font-medium ${!inStock ? "bg-white/95 text-black/60" : "bg-pink-300 text-pink-950"}`}
          >
            {!inStock ? "ناموجود" : `${persianNumber(discount)}٪ تخفیف`}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <p className="mb-2 truncate text-[10px] text-black/50">
          {material || "وینگز گالری"}
        </p>
        <Link
          href={href}
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <h3
            className="line-clamp-2 min-h-12 text-sm leading-6 font-medium text-[#211b18] transition-colors hover:text-[#97566a]"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>
        <div className="mt-4 flex min-h-12 flex-wrap items-end justify-between gap-x-2 gap-y-1">
          <div>
            {hasDiscount && (
              <del className="mb-1 block text-[11px] text-black/40">
                <span className="sr-only">قیمت قبلی: </span>
                {persianNumber(regularPrice)}
                <span className="sr-only"> تومان</span>
              </del>
            )}
            <p className="text-[15px] font-medium tabular-nums text-[#211b18]">
              {persianNumber(hasDiscount ? salePrice : product.price)}{" "}
              <span className="text-[10px] font-normal text-black/50">
                تومان
              </span>
            </p>
          </div>
          {Boolean(product.averageRating && product.averageRating > 0) && (
            <span
              className="text-[10px] text-black/50"
              aria-label={`امتیاز ${persianNumber(product.averageRating!)} از ۵`}
            >
              <span aria-hidden="true" className="ml-1 text-[#b68a49]">
                ★
              </span>
              {persianNumber(product.averageRating!)}
            </span>
          )}
        </div>
        <Link
          href={href}
          aria-label={`مشاهده ${product.name}`}
          className="mt-4 flex min-h-10 items-center justify-between gap-2 rounded-xl bg-pink-100 px-3 py-2.5 text-[11px] text-pink-950 transition-colors hover:bg-pink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
        >
          {product.hasOptions ? "انتخاب مدل" : "مشاهده محصول"}
          <Icon name="arrow" size={15} />
        </Link>
      </div>
    </article>
  );
}
