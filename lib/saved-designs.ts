import { useSyncExternalStore } from "react";
import type { DesignProduct } from "./design-products";
import type { PlacedCharm } from "@/components/custom-design/Chain";

export type SavedDesign = { id: string; product: DesignProduct; charms: PlacedCharm[]; savedAt: string };
const key = "wings.saved-designs.v1";
const eventName = "wings:saved-designs";
const empty: SavedDesign[] = [];
let cachedRaw: string | null | undefined;
let cached: SavedDesign[] = empty;

function snapshot(): SavedDesign[] {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(key);
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    const data: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(data) ? data.filter((item): item is SavedDesign => Boolean(
      item && typeof item.id === "string" && typeof item.savedAt === "string" &&
      item.product && Number.isFinite(item.product.id) && Number.isFinite(item.product.price) && typeof item.product.slug === "string" && typeof item.product.name === "string" && typeof item.product.image === "string" &&
      Array.isArray(item.charms) && item.charms.every((charm: PlacedCharm) =>
        charm && typeof charm.instanceId === "string" && Number.isFinite(charm.x) && Number.isFinite(charm.y) && Number.isFinite(charm.rotation) &&
        charm.charm && typeof charm.charm.id === "string" && typeof charm.charm.name === "string" && typeof charm.charm.image === "string"),
    )) : empty;
  } catch { cached = empty; }
  return cached;
}

function subscribe(listener: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === key || event.key === null) listener(); };
  window.addEventListener(eventName, listener);
  window.addEventListener("storage", storage);
  return () => { window.removeEventListener(eventName, listener); window.removeEventListener("storage", storage); };
}

export function useSavedDesigns() { return useSyncExternalStore(subscribe, snapshot, () => empty); }

export function designSignature(productId: number, charms: PlacedCharm[]) {
  return JSON.stringify([productId, charms.map((item) => [item.charm.id, item.x, item.y, item.rotation])]);
}

export function saveDesign(product: DesignProduct, charms: PlacedCharm[]) {
  const designs = snapshot();
  const signature = designSignature(product.id, charms);
  const existing = designs.find((item) => designSignature(item.product.id, item.charms) === signature);
  if (existing) return true;
  try {
    const design: SavedDesign = { id: crypto.randomUUID(), product, charms, savedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify([design, ...designs]));
    window.dispatchEvent(new Event(eventName));
    return true;
  } catch { return false; }
}

export function removeSavedDesign(id: string) {
  try {
    localStorage.setItem(key, JSON.stringify(snapshot().filter((item) => item.id !== id)));
    window.dispatchEvent(new Event(eventName));
    return true;
  } catch { return false; }
}
