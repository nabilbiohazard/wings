"use client";

import { useEffect, useState } from "react";
import { commerce } from "@/lib/commerce-client";
import { money, cartPayload } from "@/lib/commerce-types";
import type { Variation, VariationAttribute } from "@/lib/commerce-types";
import type { Product } from "@/lib/types";
import { useShop } from "@/components/shop-provider";
import { useCommerce } from "./provider";
import type { SavedDesign } from "@/lib/saved-designs";
import type { CartItem } from "@/lib/commerce-types";

export function ProductPurchase({
  product,
  design,
  onAdded,
  stickyOnMobile = false,
}: {
  product: Pick<
    Product,
    | "id"
    | "name"
    | "image"
    | "price"
    | "hasOptions"
    | "isInStock"
    | "isPurchasable"
  >;
  design?: SavedDesign;
  onAdded?: () => void;
  stickyOnMobile?: boolean;
}) {
  const { addItem, loading } = useCommerce();
  const { openPanel } = useShop();
  const [variations, setVariations] = useState<Variation[]>([]);
  const [attributeOptions, setAttributeOptions] = useState<
    VariationAttribute[]
  >([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [fetching, setFetching] = useState(product.hasOptions || false);
  const [adding, setAdding] = useState(false);
  useEffect(() => {
    if (!product.hasOptions) return;
    const controller = new AbortController();
    commerce<{ variations: Variation[]; attributes: VariationAttribute[] }>(
      `products/${product.id}/variations`,
    )
      .then((result) => {
        if (!controller.signal.aborted) {
          setVariations(result.variations);
          setAttributeOptions(result.attributes);
        }
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setFetching(false);
      });
    return () => controller.abort();
  }, [product.id, product.hasOptions]);
  const allSelected =
    attributeOptions.length > 0 &&
    attributeOptions.every((attribute) => Boolean(selected[attribute.key]));
  const variation = allSelected
    ? variations.find((item) =>
        attributeOptions.every(
          (attribute) =>
            !item.attributes[attribute.key] ||
            item.attributes[attribute.key] === selected[attribute.key],
        ),
      )
    : undefined;
  const available =
    product.isInStock !== false &&
    product.isPurchasable !== false &&
    (!product.hasOptions || (variation?.in_stock && variation.purchasable));
  return (
    <div className="space-y-4">
      {product.hasOptions && fetching && (
        <p role="status" className="text-sm">
          در حال دریافت مدل‌ها…
        </p>
      )}
      {product.hasOptions &&
        attributeOptions.map((attribute) => (
          <label key={attribute.key} className="commerce-label">
            {attribute.name}
            <select
              className="commerce-input"
              value={selected[attribute.key] || ""}
              onChange={(event) =>
                setSelected((current) => ({
                  ...current,
                  [attribute.key]: event.target.value,
                }))
              }
            >
              <option value="">انتخاب {attribute.name}</option>
              {attribute.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      {variation && (
        <p className="text-sm">
          {money(variation.price, variation.currency)}
          {!variation.in_stock && " · ناموجود"}
        </p>
      )}
      {product.hasOptions && allSelected && !variation && (
        <p className="text-sm text-[#9b5870]">این ترکیب مشخصات موجود نیست.</p>
      )}
      <label className="commerce-label">
        تعداد
        <input
          className="commerce-input max-w-28"
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(event) =>
            setQuantity(
              Math.max(1, Math.min(99, Number(event.target.value) || 1)),
            )
          }
        />
      </label>
      <div className={stickyOnMobile ? "design-purchase-bar" : undefined}>
      {stickyOnMobile && (
        <p className="mb-2 text-xs text-[#e4d9df] md:hidden">
          {design?.charms.length
            ? `${design.charms.length.toLocaleString("fa-IR")} چارم در طرح تو`
            : product.name}
        </p>
      )}
      <button
        type="button"
        className="commerce-button w-full"
        disabled={loading || fetching || adding || !available}
        onClick={async () => {
          if (!available) return;
          const price = variation
            ? Number(variation.price) / (variation.currency === "IRR" ? 10 : 1)
            : product.price;
          const item: CartItem = {
            id: product.id,
            variation_id: variation?.id,
            quantity,
            name: product.name,
            image: product.image,
            price,
            attributes: variation ? selected : undefined,
            variation_label: variation
              ? attributeOptions
                  .map(
                    (attribute) =>
                      `${attribute.name}: ${attribute.options.find((option) => option.value === selected[attribute.key])?.label || selected[attribute.key]}`,
                  )
                  .join(" · ")
              : undefined,
          };
          if (design) {
            setAdding(true);
            setError("");
            try {
              const snapshot = structuredClone({
                ...design,
                version: 1 as const,
              });
              const prepared = await commerce<{ item: CartItem }>(
                "designs/prepare",
                cartPayload({ ...item, design: snapshot }),
              );
              addItem(prepared.item);
            } catch (reason) {
              const failure = reason as Error & { status?: number };
              if (![404, 502, 503].includes(failure.status || 0)) {
                setError(failure.message);
                return;
              }
              // Keep the reversible cart draft when the bridge is unavailable. Checkout still validates on WooCommerce.
              const snapshot = structuredClone({
                ...design,
                version: 1 as const,
              });
              addItem({
                ...item,
                design: snapshot,
                design_pending: true,
                price:
                  item.price +
                  snapshot.charms.reduce(
                    (sum, charm) => sum + (charm.charm.price ?? 0),
                    0,
                  ),
              });
            } finally {
              setAdding(false);
            }
          } else addItem(item);
          onAdded?.();
          openPanel("cart");
        }}
      >
        {adding
          ? "در حال بررسی طرح…"
          : loading
            ? "در حال آماده‌سازی…"
            : product.isInStock === false
              ? "در حال حاضر ناموجود"
              : stickyOnMobile
                ? "افزودن به سبد خرید"
                : design
                ? "افزودن طرح به سبد خرید"
                : "افزودن به سبد خرید"}
      </button>
      {error && (
        <p role="alert" className="commerce-error">
          {error}
        </p>
      )}
      </div>
    </div>
  );
}
