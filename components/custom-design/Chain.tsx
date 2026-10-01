"use client";

import { useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import type { RefObject } from "react";
import { PlacedCharmItem } from "./Placedcharmitem";
import type { CharmData } from "./Charm";

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

export const CHAIN_PATH_D = `M ${CHAIN_CENTER_X} ${CHAIN_CENTER_Y - RADIUS_Y} A ${RADIUS_X} ${RADIUS_Y} 0 1 1 ${
  CHAIN_CENTER_X - 0.01
} ${CHAIN_CENTER_Y - RADIUS_Y} Z`;

export function getCharmRotation(x: number, y: number): number {
  const outwardAngle = Math.atan2(
    (y - CHAIN_CENTER_Y) / (RADIUS_Y * RADIUS_Y),
    (x - CHAIN_CENTER_X) / (RADIUS_X * RADIUS_X),
  );
  return (outwardAngle * 180) / Math.PI - 90;
}

export const VIEWBOX_WIDTH = 600;
export const VIEWBOX_HEIGHT = 600;

interface ChainProps {
  placedCharms: PlacedCharm[];
  onRemove: (instanceId: string) => void;
  onMove: (instanceId: string) => void;
  onCanvasTap: (clientX: number, clientY: number) => void;
  placementHint?: string;
  pathRef: RefObject<SVGPathElement | null>;
}

export function Chain({ placedCharms, onRemove, onMove, onCanvasTap, placementHint, pathRef }: ChainProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "chain-drop-zone" });

  return (
    <div
      ref={setNodeRef}
      id="chain-container"
      onClick={(event) => onCanvasTap(event.clientX, event.clientY)}
      className={`relative mx-auto aspect-square w-full max-w-md touch-manipulation rounded-2xl border-2 border-dashed transition-colors ${
        isOver || placementHint ? "border-amber-400 bg-amber-50/40" : "border-transparent"
      }`}
    >
      {placementHint && (
        <div className="pointer-events-none absolute inset-x-2 top-2 z-20 rounded-xl bg-white/90 px-3 py-2 text-center text-xs font-medium text-amber-900 shadow-sm backdrop-blur-sm md:hidden">
          {placementHint}
        </div>
      )}
      <Image
        src="/images/bracelet/photo_4_2026-10-01_15-40-19.jpg - Edited.png"
        alt="Blue cord bracelet with gold clasps"
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 448px"
        className="pointer-events-none select-none object-contain"
        draggable={false}
      />
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={CHAIN_PATH_D}
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
            onRemove={onRemove}
            onMove={onMove}
          />
        );
      })}
    </div>
  );
}
