"use client";

import { useDroppable } from "@dnd-kit/core";
import type { RefObject } from "react";
import { PlacedCharmItem } from "./Placedcharmitem";
import type { CharmData } from "./Charm";

export interface PlacedCharm {
  instanceId: string;
  charm: CharmData;
  /** Position along the chain path, from 0 (start) to 1 (end) */
  t: number;
}

/**
 * The path the chain follows, in a 600x600 (square) viewBox — a perfect circle.
 * Swap this for the outline of your real bracelet/necklace artwork —
 * it just needs to be a single <path> that traces where charms can sit.
 */
const CX = 300;
const CY = 300;
const RADIUS = 260;

export const CHAIN_PATH_D = `M ${CX} ${CY - RADIUS} A ${RADIUS} ${RADIUS} 0 1 1 ${
  CX - 0.01
} ${CY - RADIUS} Z`;

export const VIEWBOX_WIDTH = 600;
export const VIEWBOX_HEIGHT = 600;

interface ChainProps {
  placedCharms: PlacedCharm[];
  onRemove: (instanceId: string) => void;
  pathRef: RefObject<SVGPathElement | null>;
}

export function Chain({ placedCharms, onRemove, pathRef }: ChainProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "chain-drop-zone" });

  return (
    <div
      ref={setNodeRef}
      id="chain-container"
      className={`relative mx-auto aspect-square w-full max-w-md rounded-2xl border-2 border-dashed transition-colors ${
        isOver ? "border-amber-400 bg-amber-50/40" : "border-transparent"
      }`}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="h-full w-full"
      >
        <path
          ref={pathRef}
          d={CHAIN_PATH_D}
          fill="none"
          stroke="#c9a24b"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </svg>

      {placedCharms.map((pc) => {
        const point = getPercentPositionFromT(pathRef, pc.t);
        if (!point) return null;
        return (
          <PlacedCharmItem
            key={pc.instanceId}
            instanceId={pc.instanceId}
            charm={pc.charm}
            x={point.xPercent}
            y={point.yPercent}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
}

function getPercentPositionFromT(
  pathRef: RefObject<SVGPathElement | null>,
  t: number,
): { xPercent: string; yPercent: string } | null {
  const path = pathRef.current;
  if (!path) return null;

  const length = path.getTotalLength();
  const pt = path.getPointAtLength(t * length);

  return {
    xPercent: `${(pt.x / VIEWBOX_WIDTH) * 100}%`,
    yPercent: `${(pt.y / VIEWBOX_HEIGHT) * 100}%`,
  };
}
