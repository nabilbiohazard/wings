import { BC2_SLOTS, isBC2 } from "./bracelet-layouts";

export type CharmSlot = { x: number; y: number; rotation?: number };
export type CharmLayout = {
  version: 1;
  image: string;
  maxCharms: number;
  slots: CharmSlot[];
};

export function parseCharmLayout(raw: unknown): CharmLayout | undefined {
  if (!raw || typeof raw !== "object") return;
  const layout = raw as CharmLayout;
  if (
    layout.version !== 1 ||
    !Array.isArray(layout.slots) ||
    layout.slots.length < 1 ||
    layout.slots.length > 30 ||
    !Number.isInteger(layout.maxCharms) ||
    layout.maxCharms < 1 ||
    layout.maxCharms > layout.slots.length ||
    typeof layout.image !== "string" ||
    !/^https?:\/\//.test(layout.image)
  )
    return;
  const keys = new Set<string>();
  for (const slot of layout.slots) {
    if (
      !slot ||
      !Number.isFinite(slot.x) ||
      !Number.isFinite(slot.y) ||
      slot.x < 0 ||
      slot.x > 600 ||
      slot.y < 0 ||
      slot.y > 600 ||
      (slot.rotation !== undefined &&
        (!Number.isFinite(slot.rotation) || Math.abs(slot.rotation) > 360))
    )
      return;
    const key = `${slot.x},${slot.y}`;
    if (keys.has(key)) return;
    keys.add(key);
  }
  return layout;
}

export function placementSlots(product: {
  name: string;
  slug?: string;
  charmLayout?: CharmLayout;
}): readonly CharmSlot[] | undefined {
  return product.charmLayout?.slots ?? (isBC2(product) ? BC2_SLOTS : undefined);
}

export function nearestSlot(
  slots: readonly CharmSlot[],
  point: { x: number; y: number },
) {
  return slots.reduce((best, slot) =>
    Math.hypot(slot.x - point.x, slot.y - point.y) <
    Math.hypot(best.x - point.x, best.y - point.y)
      ? slot
      : best,
  );
}
