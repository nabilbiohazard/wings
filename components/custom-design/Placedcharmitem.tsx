

"use client";
 
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { Move, X } from "lucide-react";
import type { CharmData } from "./Charm";

// The attachment ring sits at a different point inside each transparent image.
const ATTACHMENT_POINTS: Record<string, { x: number; y: number }> = {
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
  /** CSS left/top position, e.g. "42.3%" */
  x: string;
  y: string;
  rotation: number;
  onRemove: (instanceId: string) => void;
  onMove: (instanceId: string) => void;
}
 
export function PlacedCharmItem({ instanceId, charm, x, y, rotation, onRemove, onMove }: PlacedCharmItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `placed-${instanceId}`,
    data: { type: "placed" as const, instanceId, charm },
  });
 
  const attachment = ATTACHMENT_POINTS[charm.id] ?? { x: 50, y: 30 };
  const style: React.CSSProperties = {
    left: x,
    top: y,
    transform: `translate3d(calc(-${attachment.x}% + ${transform?.x ?? 0}px), calc(-${attachment.y}% + ${transform?.y ?? 0}px), 0) rotate(${rotation}deg)`,
    transformOrigin: `${attachment.x}% ${attachment.y}%`,
    zIndex: isDragging ? 60 : 10,
  };
 
  return (
    <div ref={setNodeRef} style={style} onClick={(event) => event.stopPropagation()} className="absolute group touch-none">
      <div
        {...listeners}
        {...attributes}
        className={`relative h-28 w-28 cursor-grab active:cursor-grabbing sm:h-40 sm:w-40 lg:h-60 lg:w-55 ${
          isDragging ? "opacity-70" : ""
        }`}
      >
        <Image src={charm.image} alt={charm.name} fill unoptimized className="object-contain" sizes="(max-width: 639px) 112px, (max-width: 1023px) 160px, 220px" />
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onMove(instanceId);
        }}
        style={{
          left: `calc(${attachment.x}% - 24px)`,
          top: `calc(${attachment.y}% - 16px)`,
          transform: "translate(-50%, -50%)",
        }}
        className="absolute flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100"
        aria-label={`جابه‌جایی ${charm.name}`}
      >
        <Move size={15} />
      </button>
 
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onRemove(instanceId);
        }}
        style={{
          left: `calc(${attachment.x}% + 24px)`,
          top: `calc(${attachment.y}% - 16px)`,
          transform: "translate(-50%, -50%)",
        }}
        className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-sm md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100"
        aria-label={`Remove ${charm.name}`}
      >
        <X size={15} />
      </button>
    </div>
  );
}
 
