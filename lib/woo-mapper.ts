import type { Product } from "./types";

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function toToman(
  value?: string | number | null,
  currency = "IRR"
): number {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return 0;
  }

  const price = Number(value);

  if (!Number.isFinite(price)) {
    return 0;
  }

  // وردپرس فعلی شما IRR است.
  if (currency === "IRR") {
    return Math.round(price / 10);
  }

  return Math.round(price);
}

type WooPrice = string | number | null;

interface WooProduct {
  id: string | number;
  type?: string;
  name?: string;
  slug?: string;
  sku?: string;
  images?: { src?: string | null }[];
  categories?: { id: string | number; name?: string; slug?: string }[];
  prices?: { price?: WooPrice; regular_price?: WooPrice; sale_price?: WooPrice; currency_code?: string };
  price?: WooPrice;
  regular_price?: WooPrice;
  sale_price?: WooPrice;
  is_in_stock?: boolean;
  stock_status?: string;
  is_purchasable?: boolean;
  purchasable?: boolean;
  on_sale?: boolean;
  short_description?: string;
  description?: string;
  stock_availability?: { class?: string };
  low_stock_remaining?: number | null;
  average_rating?: string | number;
  review_count?: string | number;
  has_options?: boolean;
  attributes?: { name?: string; terms?: { name: string }[]; options?: string[] }[];
}

export function mapWooProduct(product: WooProduct): Product {
  const images: string[] =
    product.images
      ?.map((image) => image?.src)
      .filter((src): src is string => typeof src === "string" && src.length > 0) ?? [];

  /*
   * Store API:
   * product.prices.price
   *
   * wc/v3:
   * product.price
   */
  const priceSource =
    product.prices?.price ??
    product.price ??
    0;

  const regularPriceSource =
    product.prices?.regular_price ??
    product.regular_price ??
    priceSource;

  const salePriceSource =
    product.prices?.sale_price ??
    product.sale_price ??
    priceSource;

  const currency =
    product.prices?.currency_code ??
    "IRR";

  /*
   * Store API:
   * is_in_stock
   *
   * wc/v3:
   * stock_status
   */
  const isInStock =
    typeof product.is_in_stock === "boolean"
      ? product.is_in_stock
      : product.stock_status
        ? product.stock_status === "instock"
        : true;

  const isPurchasable =
    typeof product.is_purchasable === "boolean"
      ? product.is_purchasable
      : typeof product.purchasable === "boolean"
        ? product.purchasable
        : true;

  return {
    id: Number(product.id),
    type: product.type,

    name: product.name ?? "",

    slug: safeDecode(product.slug ?? ""),

    sku: product.sku ?? "",

    category:
      product.categories?.[0]?.slug ??
      "all",

    categories:
      product.categories?.map((category) => ({
        id: Number(category.id),
        name: category.name ?? "",
        slug: category.slug ?? "",
      })) ?? [],

    price: toToman(
      priceSource,
      currency
    ),

    regularPrice: toToman(
      regularPriceSource,
      currency
    ),

    salePrice: toToman(
      salePriceSource,
      currency
    ),

    onSale:
      product.on_sale ?? false,

    image:
      images[0] ??
      "/images/product-placeholder.jpg",

    images,

    shortDescription:
      product.short_description ?? "",

    description:
      product.description ?? "",

    isInStock,

    isPurchasable,

    stockStatus:
      product.stock_status ??
      product.stock_availability?.class ??
      "",

    lowStockRemaining:
      product.low_stock_remaining ?? null,

    averageRating: Number(
      product.average_rating ?? 0
    ),

    reviewCount: Number(
      product.review_count ?? 0
    ),

    hasOptions:
      product.has_options ??
      product.type === "variable",

    attributes:
      product.attributes?.map(
        (attribute) => ({
          name: attribute.name ?? "",

          options:
            attribute.terms?.map(
              (term) => term.name
            ) ??
            attribute.options ??
            [],
        })
      ) ?? [],
  };
}
