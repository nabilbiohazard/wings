export type Customer = {
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
};
export type Address = {
  id: string;
  label: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address_1: string;
  address_2: string;
  postcode: string;
};
export type CartItem = {
  id: number;
  variation_id?: number;
  quantity: number;
  name: string;
  image: string;
  price: number;
  variation_label?: string;
  attributes?: Record<string, string>;
  design?: DesignSnapshot;
  design_pending?: boolean;
};
export type Order = {
  id: number;
  number: string;
  status: string;
  status_label: string;
  created: string;
  currency: string;
  total: string;
  subtotal: string;
  discount: string;
  shipping_total: string;
  tax: string;
  payment_title: string;
  customer_note: string;
  shipping: Omit<Address, "id" | "label">;
  items: {
    id: number;
    product_id: number;
    variation_id: number;
    name: string;
    quantity: number;
    total: string;
    image: string;
    attributes: string[];
    design?: DesignSnapshot | null;
    design_component?: string;
  }[];
  notes: { id: number; note: string; created: string }[];
  can_cancel: boolean;
};
export type Quote = {
  id: string;
  currency: string;
  subtotal: string;
  discount: string;
  shipping_total: string;
  tax: string;
  total: string;
  shipping: {
    package: number;
    name: string;
    rates: { id: string; label: string; cost: string }[];
    selected: string;
  }[];
  items: { name: string; quantity: number; total: string }[];
};
export type CheckoutInput = {
  items: ReturnType<typeof cartPayload>[];
  address_id: string;
  coupon: string;
  shipping_methods: string[];
  note: string;
};
export type Variation = {
  id: number;
  label: string;
  price: string;
  currency: string;
  in_stock: boolean;
  purchasable: boolean;
  attributes: Record<string, string>;
};
export type VariationAttribute = {
  key: string;
  name: string;
  options: { value: string; label: string }[];
};

export function digits(value: string) {
  return value
    .replace(/[۰-۹]/g, (char) => String(char.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (char) => String(char.charCodeAt(0) - 1632));
}

export function normalizePhone(value: string) {
  const phone = digits(value)
    .replace(/[\s()-]/g, "")
    .replace(/^(?:\+98|0098|98)(?=9)/, "0");
  return /^09\d{9}$/.test(phone) ? phone : null;
}

export function cartKey(
  item: Pick<CartItem, "id" | "variation_id" | "attributes" | "design">,
) {
  return `${item.id}:${item.variation_id || 0}:${JSON.stringify(Object.entries(item.attributes || {}).sort(([a], [b]) => a.localeCompare(b)))}:${item.design ? JSON.stringify([item.design.product.image, item.design.charms.map((item) => [item.charm.id, item.x, item.y, item.rotation])]) : ""}`;
}

export function validDesign(value: unknown): value is DesignSnapshot {
  const design = value as DesignSnapshot;
  return Boolean(
    design &&
    design.version === 1 &&
    design.product &&
    Number.isSafeInteger(design.product.id) &&
    typeof design.product.image === "string" &&
    Array.isArray(design.charms) &&
    design.charms.length > 0 &&
    design.charms.length <= 30 &&
    design.charms.every(
      (item) =>
        item &&
        typeof item.instanceId === "string" &&
        item.instanceId.length <= 80 &&
        item.charm &&
        typeof item.charm.id === "string" &&
        /^[a-z0-9-]{1,60}$/.test(item.charm.id) &&
        typeof item.charm.image === "string" &&
        Number.isFinite(item.x) &&
        item.x >= 0 &&
        item.x <= 600 &&
        Number.isFinite(item.y) &&
        item.y >= 0 &&
        item.y <= 600 &&
        Number.isFinite(item.rotation) &&
        Math.abs(item.rotation) <= 3600,
    ) &&
    new Set(design.charms.map((item) => item.instanceId)).size ===
      design.charms.length,
  );
}

export function cartPayload(item: CartItem) {
  return {
    id: item.id,
    variation_id: item.variation_id,
    quantity: item.quantity,
    attributes: item.attributes,
    design: item.design
      ? {
          version: 1,
          product: {
            id: item.design.product.id,
            image: item.design.product.image,
          },
          charms: item.design.charms.map(
            ({ instanceId, charm, x, y, rotation }) => ({
              instanceId,
              charm: { id: charm.id, image: charm.image },
              x,
              y,
              rotation,
            }),
          ),
        }
      : undefined,
  };
}

export function validCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result = new Map<string, CartItem>();
  for (const item of value.slice(0, 50)) {
    if (
      !item ||
      !Number.isSafeInteger(item.id) ||
      item.id < 1 ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99 ||
      (item.variation_id !== undefined &&
        (!Number.isSafeInteger(item.variation_id) || item.variation_id < 0)) ||
      typeof item.name !== "string" ||
      typeof item.image !== "string" ||
      typeof item.price !== "number" ||
      !Number.isFinite(item.price) ||
      item.price < 0
    )
      continue;
    const clean: CartItem = {
      id: item.id,
      quantity: item.quantity,
      name: item.name.slice(0, 300),
      image: item.image,
      price: item.price,
      variation_id: item.variation_id || undefined,
      variation_label:
        typeof item.variation_label === "string"
          ? item.variation_label.slice(0, 300)
          : undefined,
    };
    if (item.design !== undefined) {
      if (!validDesign(item.design) || item.design.product.id !== item.id)
        continue;
      clean.design = structuredClone(item.design);
      clean.design_pending = item.design_pending === true;
    }
    if (
      item.attributes &&
      typeof item.attributes === "object" &&
      !Array.isArray(item.attributes)
    ) {
      const entries = Object.entries(item.attributes);
      if (
        entries.length > 10 ||
        entries.some(
          ([key, value]) =>
            !key.startsWith("attribute_") ||
            key.length > 150 ||
            typeof value !== "string" ||
            value.length > 150,
        )
      )
        continue;
      clean.attributes = Object.fromEntries(entries) as Record<string, string>;
    }
    result.set(cartKey(clean), clean);
  }
  return [...result.values()];
}

// WooCommerce decimal amounts are in the store's configured currency, not Store API minor units.
export function money(value: string | number, currency = "IRR") {
  const amount = Number(value);
  const converted = currency === "IRR" ? amount / 10 : amount;
  const unit = ["IRR", "IRT", "TOMAN"].includes(currency) ? "تومان" : currency;
  return `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(converted)} ${unit}`;
}
import type { SavedDesign } from "./saved-designs";
export type DesignSnapshot = SavedDesign & { version: 1 };
