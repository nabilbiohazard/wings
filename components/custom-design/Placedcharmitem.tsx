"use client";

import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { Move, X } from "lucide-react";
import type { CSSProperties } from "react";
import type { CharmData } from "./Charm";
import styles from "./builder-studio.module.css";

export const ATTACHMENT_POINTS: Record<string, { x: number; y: number }> = {
  clover: { x: 57, y: 30 },
  "pink-dress": { x: 51, y: 32 },
  cocktail: { x: 47, y: 33 },
  "ice-cream": { x: 50, y: 33 },
  travel: { x: 51, y: 30 },
  tennis: { x: 51, y: 23 },
  chocolate: { x: 43, y: 41 },
  "gold-dress": { x: 51, y: 32 },
  shrimp: { x: 49, y: 29 },
  fashion: { x: 52, y: 30 },
};

interface PlacedCharmItemProps {
  instanceId: string;
  charm: CharmData;
  x: string;
  y: string;
  rotation: number;
  onRemove: (instanceId: string) => void;
  onMove: (instanceId: string) => void;
}

export function PlacedCharmItem({
  instanceId,
  charm,
  x,
  y,
  rotation,
  onRemove,
  onMove,
}: PlacedCharmItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `placed-${instanceId}`,
      data: { type: "placed" as const, instanceId, charm },
    });

  const attachment = ATTACHMENT_POINTS[charm.id] ?? { x: 50, y: 30 };

  const style: CSSProperties = {
    left: x,
    top: y,
    transform: `translate3d(
      calc(-${attachment.x}% + ${transform?.x ?? 0}px),
      calc(-${attachment.y}% + ${transform?.y ?? 0}px),
      0
    ) rotate(${rotation}deg)`,
    transformOrigin: `${attachment.x}% ${attachment.y}%`,
    zIndex: isDragging ? 60 : 10,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.placedCharm} ${
        isDragging ? styles.placedCharmDragging : ""
      }`}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className={styles.placedDragHandle}
        aria-label={`کشیدن و جابه‌جایی ${charm.name}`}
        onClick={(event) => { event.stopPropagation(); onMove(instanceId); }}
      >
        <Image
          src={charm.image}
          alt={charm.name}
          fill
          unoptimized
          draggable={false}
          sizes="(max-width: 1023px) 160px, 220px"
          className="pointer-events-none select-none object-contain"
        />
      </button>

      <div
        className={styles.placedActions}
        data-charm-actions
        style={{
          left: `${attachment.x}%`,
          top: `${attachment.y}%`,
          transform: `translate(-50%, -100%) rotate(${-rotation}deg)`,
        }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMove(instanceId);
          }}
          aria-label={`انتخاب و جابه‌جایی ${charm.name}`}
        >
          <Move size={15} />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(instanceId);
          }}
          aria-label={`حذف ${charm.name}`}
          className={styles.removePlacedButton}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
