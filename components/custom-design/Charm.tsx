

"use client";
 
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
 
export interface CharmData {
  id: string;
  name: string;
  image: string;
  price: number;
}
 
/** A charm sitting in the right-hand palette, ready to be dragged onto the chain. */
export function PaletteCharm({ charm }: { charm: CharmData }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${charm.id}`,
    data: { type: "palette" as const, charm },
  });
 
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;
 
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`touch-none flex flex-col items-center gap-1 rounded-xl border border-neutral-200 bg-white p-3 cursor-grab active:cursor-grabbing shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="relative h-14 w-14">
        <Image src={charm.image} alt={charm.name} fill className="object-contain" sizes="56px" />
      </div>
      <span className="text-xs font-medium text-neutral-700 text-center">{charm.name}</span>
      <span className="text-xs text-neutral-400">${charm.price.toFixed(2)}</span>
    </div>
  );
}
 
