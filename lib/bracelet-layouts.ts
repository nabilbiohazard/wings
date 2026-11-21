// Coordinates traced from BC-2, adjusted to the 990px crop at (130, 130).
// Eleven alternating main links; leave clearance on both sides of the clasp.
export const BC2_SLOTS = [
  { x: 456, y: 149 },
  { x: 522, y: 236 }, { x: 537, y: 334 },
  { x: 483, y: 435 }, { x: 392, y: 513 },
  { x: 283, y: 522 }, { x: 188, y: 495 },
  { x: 110, y: 410 }, { x: 72, y: 308 },
  { x: 80, y: 198 }, { x: 126, y: 110 },

] as const;

export function isBC2(product: { name: string; slug?: string }) {
  return /\bbc[\s_-]*2\b/i.test(`${product.name} ${product.slug ?? ""}`);
}

export function nearestBC2Slot(position: { x: number; y: number }) {
  return BC2_SLOTS.reduce((best, slot) =>
    Math.hypot(slot.x - position.x, slot.y - position.y) <
    Math.hypot(best.x - position.x, best.y - position.y) ? slot : best,
  );
}
