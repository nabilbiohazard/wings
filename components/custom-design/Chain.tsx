"use client";

import { useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import { useState, type RefObject } from "react";
import { PlacedCharmItem } from "./Placedcharmitem";
import type { CharmData } from "./Charm";
import type { DesignProduct } from "@/lib/design-products";

export interface PlacedCharm {
  instanceId: string;
  charm: CharmData;
  x: number;
  y: number;
  rotation: number;
}

// Follow the main cord in the bracelet artwork, in a 600x600 viewBox.
export const CHAIN_CENTER_X = 289;
export const CHAIN_CENTER_Y = 305;
const RADIUS_X = 227;
const RADIUS_Y = 211;

// Editable blocked arc, in degrees clockwise from the top:
// 0 = top, 90 = right, 180 = bottom, 270 = left.
// Example: block from 330 degrees (upper left) to 30 (upper right).
export const BLOCKED_ARC_START_DEG = 310;
export const BLOCKED_ARC_END_DEG = 50;

export function isNecklace(product: DesignProduct): boolean {
  return /گردنبند|necklace/i.test(`${product.name} ${product.category} ${product.slug}`);
}

// Two separate branches, traced in the same square as the product image.
// Do not join across the pendant: that would allow charms to float in the gap.
export const NECKLACE_PATH_D =
  "M 103 0 C 100 155 133 294 224 386 M 496 0 C 499 155 466 294 376 386";

export function isCharmPositionBlocked(x: number, y: number, product?: DesignProduct): boolean {
  if (product && isNecklace(product)) return false;
  const normalize = (angle: number) => ((angle % 360) + 360) % 360;
  const angle = normalize(
    (Math.atan2((x - CHAIN_CENTER_X) / RADIUS_X, -(y - CHAIN_CENTER_Y) / RADIUS_Y) * 180) / Math.PI,
  );
  const start = normalize(BLOCKED_ARC_START_DEG);
  const end = normalize(BLOCKED_ARC_END_DEG);
  // Equal endpoints disable the blocked arc.
  if (start === end) return false;
  return start < end
    ? angle >= start && angle <= end
    : angle >= start || angle <= end;
}

export const CHAIN_PATH_D = `M ${CHAIN_CENTER_X} ${CHAIN_CENTER_Y - RADIUS_Y} A ${RADIUS_X} ${RADIUS_Y} 0 1 1 ${
  CHAIN_CENTER_X - 0.01
} ${CHAIN_CENTER_Y - RADIUS_Y} Z`;

export function getCharmRotation(x: number, y: number, product?: DesignProduct): number {
  if (product && isNecklace(product)) {
    // Find the parameter on the monotonic cubic branch from its height.
    // Its outward normal points left/down on the left and right/down on the right.
    let low = 0;
    let high = 1;
    for (let step = 0; step < 30; step += 1) {
      const t = (low + high) / 2;
      const height = 3 * (1 - t) ** 2 * t * 155 +
        3 * (1 - t) * t ** 2 * 294 + t ** 3 * 386;
      if (height < y) low = t;
      else high = t;
    }
    const t = (low + high) / 2;
    const dx = 3 * (1 - t) ** 2 * -3 +
      6 * (1 - t) * t * 33 + 3 * t ** 2 * (x < 300 ? 91 : 90);
    const dy = 3 * (1 - t) ** 2 * 155 +
      6 * (1 - t) * t * 139 + 3 * t ** 2 * 92;
    const outwardX = x < 300 ? -dy : dy;
    return Math.atan2(dx, outwardX) * 180 / Math.PI - 90;
  }
  const outwardAngle = Math.atan2(
    (y - CHAIN_CENTER_Y) / (RADIUS_Y * RADIUS_Y),
    (x - CHAIN_CENTER_X) / (RADIUS_X * RADIUS_X),
  );
  return (outwardAngle * 180) / Math.PI - 90;
}

export const VIEWBOX_WIDTH = 600;
export const VIEWBOX_HEIGHT = 600;

interface ChainProps {
  product: DesignProduct;
  placedCharms: PlacedCharm[];
  onRemove: (instanceId: string) => void;
  onMove: (instanceId: string) => void;
  onCancelPlacement: () => void;
  onCanvasTap: (clientX: number, clientY: number) => void;
  placementHint?: string;
  pathRef: RefObject<SVGPathElement | null>;
}

export function Chain({ product, placedCharms, onRemove, onMove, onCancelPlacement, onCanvasTap, placementHint, pathRef }: ChainProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "chain-drop-zone" });
  const [selectedCharmId, setSelectedCharmId] = useState<string | null>(null);

  return (
    <div
      ref={setNodeRef}
      id="chain-container"
      onClickCapture={(event) => {
        if (!placementHint || (event.target as HTMLElement).closest("[data-charm-actions]")) return;
        if (window.matchMedia("(max-width: 1023px)").matches &&
          (event.target as HTMLElement).closest("[data-placed-charm]")) return;
        event.stopPropagation();
        setSelectedCharmId(null);
        onCanvasTap(event.clientX, event.clientY);
      }}
      onClick={(event) => {
        setSelectedCharmId(null);
        onCanvasTap(event.clientX, event.clientY);
      }}
      className={`relative mx-auto aspect-square w-full max-w-md touch-manipulation rounded-2xl bg-white transition-shadow ${
        isOver || placementHint ? "ring-2 ring-inset ring-[#dbc48f]" : ""
      }`}
    >
      {placementHint && (
        <div className="pointer-events-none absolute inset-x-2 top-2 z-20 rounded-xl bg-white/90 px-3 py-2 text-center text-xs font-medium text-amber-900 shadow-sm backdrop-blur-sm md:hidden">
          {placementHint}
        </div>
      )}
      {product.image ? <Image
        key={product.id}
        src={product.image}
        alt={product.name}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 448px"
        className="pointer-events-none select-none object-contain"
        draggable={false}
      /> : <div className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-[#806d75]">تصویر این محصول هنوز ثبت نشده است.</div>}
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={isNecklace(product) ? NECKLACE_PATH_D : CHAIN_PATH_D}
          fill="none"
          stroke="none"
        />
      </svg>

      {placedCharms.map((pc) => {
        return (
          <PlacedCharmItem
            key={pc.instanceId}
            instanceId={pc.instanceId}
            charm={pc.charm}
            x={`${(pc.x / VIEWBOX_WIDTH) * 100}%`}
            y={`${(pc.y / VIEWBOX_HEIGHT) * 100}%`}
            rotation={pc.rotation}
            selected={selectedCharmId === pc.instanceId}
            onSelect={(instanceId) => {
              setSelectedCharmId(instanceId);
              onCancelPlacement();
            }}
            onRemove={onRemove}
            onMove={onMove}
          />
        );
      })}
    </div>
  );
}
