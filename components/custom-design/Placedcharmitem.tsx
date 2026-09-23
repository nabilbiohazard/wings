

"use client";
 
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { X } from "lucide-react";
import type { CharmData } from "./Charm";
 
interface PlacedCharmItemProps {
  instanceId: string;
  charm: CharmData;
  /** CSS left/top position, e.g. "42.3%" */
  x: string;
  y: string;
  onRemove: (instanceId: string) => void;
}
 
export function PlacedCharmItem({ instanceId, charm, x, y, onRemove }: PlacedCharmItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `placed-${instanceId}`,
    data: { type: "placed" as const, instanceId, charm },
  });
 
  const style: React.CSSProperties = {
    left: x,
    top: y,
    transform: transform
      ? `translate3d(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px), 0)`
      : "translate3d(-50%, -50%, 0)",
    zIndex: isDragging ? 60 : 10,
  };
 
  return (
    <div ref={setNodeRef} style={style} className="absolute group touch-none">
      <div
        {...listeners}
        {...attributes}
        className={`relative h-30 w-30 cursor-grab active:cursor-grabbing rounded-full shadow-md ring-1 ring-black/5 transition-transform ${
          isDragging ? "opacity-70 scale-110" : ""
        }`}
      >
        <Image src={charm.image} alt={charm.name} fill className="object-contain p-1" sizes="40px" />
      </div>
 
      <button
        type="button"
        onClick={() => onRemove(instanceId)}
        className="absolute -top-1.5 -right-1.5 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex"
        aria-label={`Remove ${charm.name}`}
      >
        <X size={10} />
      </button>
    </div>
  );
}
 
