"use client";

import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/types";

import { persianNumber } from "@/lib/products";

import { Icon } from "./icon";

import { useShop } from "./shop-provider";

type ProductCardProps = {
  product: Product;
};

function stripHtml(html?: string) {
  if (!html) {
    return "";
  }

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function ProductCard({
  product,
}: ProductCardProps) {
  const {
    favorites,
    toggleFavorite,
  } = useShop();

  const saved =
    favorites.includes(product.id);

  const productHref =
    `/shop/${product.slug}`;

  const secondImage =
    product.images?.length > 1
      ? product.images[1]
      : null;

  const category =
    product.categories?.[0]?.name;

  const description =
    stripHtml(product.shortDescription);

  const material =
    product.attributes
      ?.find(
        (attribute) =>
          attribute.name === "جنس"
      )
      ?.options?.[0];

  const weight =
    product.attributes
      ?.find(
        (attribute) =>
          attribute.name === "وزن"
      )
      ?.options?.[0];

  const hasDiscount =
    Boolean(product.onSale) &&
    Boolean(product.regularPrice) &&
    Boolean(product.salePrice) &&
    Number(product.regularPrice) >
      Number(product.salePrice);

  const discountPercent =
    hasDiscount
      ? Math.round(
          ((Number(
            product.regularPrice
          ) -
            Number(
              product.salePrice
            )) /
            Number(
              product.regularPrice
            )) *
            100
        )
      : 0;

  /*
   * undefined را ناموجود حساب نمی‌کنیم.
   */
  const inStock =
    product.isInStock !== false;

  return (
    <article
      className="
        group
        relative
        w-full
      "
    >
      {/* =========================
          IMAGE
      ========================= */}

      <div
        className="
          relative
          aspect-[4/5]
          overflow-hidden
          rounded-[30px]
          bg-[#f7f7f7]
        "
      >
        <Link
          href={productHref}
          aria-label={`مشاهده ${product.name}`}
          className="relative block h-full w-full"
        >
          {/* MAIN IMAGE */}

          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="
              (max-width:600px) 50vw,
              (max-width:1000px) 45vw,
              25vw
            "
            className={`
              object-cover
              transition-all
              duration-700
              ease-out

              ${
                secondImage
                  ? `
                    scale-100
                    opacity-100
                    group-hover:scale-[1.03]
                    group-hover:opacity-0
                  `
                  : `
                    group-hover:scale-[1.05]
                  `
              }
            `}
          />

          {/* SECOND IMAGE */}

          {secondImage && (
            <Image
              src={secondImage}
              alt={`${product.name} - تصویر دوم`}
              fill
              sizes="
                (max-width:600px) 50vw,
                (max-width:1000px) 45vw,
                25vw
              "
              className="
                scale-[1.05]
                object-cover
                opacity-0
                transition-all
                duration-700
                ease-out

                group-hover:scale-100
                group-hover:opacity-100
              "
            />
          )}

          {/* GRADIENT */}

          <div
            className="
              absolute inset-x-0 bottom-0
              h-[35%]
              bg-gradient-to-t
              from-black/35
              via-black/5
              to-transparent

              opacity-0
              transition-opacity
              duration-500

              group-hover:opacity-100
            "
          />

          {/* PRODUCT CTA */}

          <div
            className="
              absolute
              bottom-5
              left-5 right-5

              flex
              translate-y-5
              items-center
              justify-between

              rounded-full
              bg-white/95
              px-5 py-3.5

              text-xs
              text-black

              opacity-0

              shadow-[0_12px_35px_rgba(0,0,0,0.12)]
              backdrop-blur-xl

              transition-all
              duration-400

              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <span>
              مشاهده محصول
            </span>

            <span
              className="
                flex h-7 w-7
                items-center justify-center
                rounded-full
                bg-black
                text-white
              "
            >
              ←
            </span>
          </div>
        </Link>

        {/* =========================
            BADGES
        ========================= */}

        <div
          className="
            pointer-events-none
            absolute
            left-4 top-4
            z-20

            flex
            flex-col
            items-start
            gap-2
          "
        >
          {hasDiscount && (
            <span
              className="
                rounded-full
                bg-black
                px-3 py-1.5

                text-[10px]
                font-medium
                text-white
              "
            >
              ٪
              {persianNumber(
                discountPercent
              )}
              {" "}
              تخفیف
            </span>
          )}

          {!inStock && (
            <span
              className="
                rounded-full
                bg-white/95
                px-3 py-1.5

                text-[10px]
                text-black/60

                shadow-sm
                backdrop-blur
              "
            >
              ناموجود
            </span>
          )}
        </div>

        {/* =========================
            FAVORITE
        ========================= */}

        <button
          type="button"
          onClick={() =>
            toggleFavorite(product.id)
          }
          aria-pressed={saved}
          aria-label={`${
            saved
              ? "حذف از"
              : "افزودن به"
          } علاقه‌مندی‌ها: ${product.name}`}
          className={`
            absolute
            right-4 top-4
            z-30

            flex h-10 w-10
            items-center justify-center

            rounded-full
            border

            shadow-sm
            backdrop-blur-xl

            transition-all
            duration-300

            ${
              saved
                ? `
                  border-black
                  bg-black
                  text-white
                `
                : `
                  border-white/50
                  bg-white/90
                  text-black

                  hover:scale-105
                  hover:bg-black
                  hover:text-white
                `
            }
          `}
        >
          <Icon
            name="heart"
            size={18}
          />
        </button>
      </div>

      {/* =========================
          PRODUCT CONTENT
      ========================= */}

      <div className="px-1 pt-5 text-right">
        {/* META */}

        <div className="flex min-h-5 items-center justify-between gap-4">
          <span
            className="
              text-[10px]
              tracking-[1px]
              text-black/35
            "
          >
            {category || "WINGS GALLERY"}
          </span>

          <div
            className="
              flex items-center
              gap-2
              text-[10px]
            "
          >
            <span
              className="
                flex items-center
                gap-1.5
                text-black/45
              "
            >
              <span
                className={`
                  h-1.5 w-1.5
                  rounded-full

                  ${
                    inStock
                      ? "bg-emerald-500"
                      : "bg-black/20"
                  }
                `}
              />

              {inStock
                ? "موجود"
                : "ناموجود"}
            </span>
          </div>
        </div>

        {/* TITLE */}

        <Link
          href={productHref}
          className="block"
        >
          <h3
            className="
              mt-3
              text-[17px]
              font-medium
              leading-8
              text-black

              transition-opacity
              duration-300

              hover:opacity-55
            "
          >
            {product.name}
          </h3>
        </Link>

        {/* ATTRIBUTES */}

        {(material || weight) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {material && (
              <span
                className="
                  rounded-full
                  bg-black/[0.045]
                  px-3 py-1.5

                  text-[10px]
                  text-black/55
                "
              >
                {material}
              </span>
            )}

            {weight && (
              <span
                className="
                  rounded-full
                  bg-black/[0.045]
                  px-3 py-1.5

                  text-[10px]
                  text-black/55
                "
              >
                {weight}
              </span>
            )}
          </div>
        )}

        {/* DESCRIPTION */}

        {description && (
          <p
            className="
              mt-3
              line-clamp-2
              text-xs
              leading-6
              text-black/45
            "
          >
            {description}
          </p>
        )}

        {/* PRICE */}

        <div
          className="
            mt-4
            flex
            min-h-8
            items-center
            justify-between
            gap-3
          "
        >
          {hasDiscount ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span
                className="
                  text-[17px]
                  font-semibold
                  tracking-tight
                  text-black
                "
              >
                {persianNumber(
                  product.salePrice!
                )}

                <small
                  className="
                    mr-1
                    text-[10px]
                    font-normal
                    text-black/40
                  "
                >
                  تومان
                </small>
              </span>

              <span
                className="
                  text-[11px]
                  text-black/30
                  line-through
                "
              >
                {persianNumber(
                  product.regularPrice!
                )}
              </span>
            </div>
          ) : (
            <span
              className="
                text-[17px]
                font-semibold
                tracking-tight
                text-black
              "
            >
              {persianNumber(
                product.price
              )}

              <small
                className="
                  mr-1
                  text-[10px]
                  font-normal
                  text-black/40
                "
              >
                تومان
              </small>
            </span>
          )}

          {/* RATING */}

          {Boolean(
            product.averageRating &&
              product.averageRating > 0
          ) && (
            <span
              dir="ltr"
              className="
                flex items-center
                gap-1
                text-[10px]
                text-black/40
              "
            >
              <span className="text-black">
                ★
              </span>

              {product.averageRating?.toFixed(
                1
              )}
            </span>
          )}
        </div>

        {/* BOTTOM ACCENT */}

        <div
          className="
            mt-5
            h-px
            w-full

            origin-right
            scale-x-0

            bg-black/15

            transition-transform
            duration-500

            group-hover:scale-x-100
          "
        />
      </div>
    </article>
  );
}