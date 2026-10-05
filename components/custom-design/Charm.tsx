

"use client";
 
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
 
export interface CharmData {
  id: string;
  name: string;
  image: string;
  price?: number;
  category?: string;
  keywords?: string[];
}
 
/** A charm sitting in the right-hand palette, ready to be dragged onto the chain. */
export function PaletteCharm({
  charm,
  selected,
  onSelect,
}: {
  charm: CharmData;
  selected: boolean;
  onSelect: (charm: CharmData) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${charm.id}`,
    data: { type: "palette" as const, charm },
  });
 
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col items-center gap-1 rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
        selected ? "border-amber-500 ring-2 ring-amber-200" : "border-neutral-200"
      } ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        {...listeners}
        {...attributes}
        className="flex w-full touch-none cursor-grab flex-col items-center gap-1 active:cursor-grabbing"
      >
        <div className="relative h-14 w-14">
          <Image src={charm.image} alt={charm.name} fill unoptimized className="object-contain" sizes="56px" />
        </div>
        <span className="text-center text-xs font-medium text-neutral-700">{charm.name}</span>
      </div>
      {charm.price !== undefined && (
        <span className="text-xs text-neutral-400">${charm.price.toFixed(2)}</span>
      )}
      <button
        type="button"
        onClick={() => onSelect(charm)}
        aria-pressed={selected}
        className={`mt-auto w-full rounded-lg px-2 py-1.5 text-xs font-medium transition ${
          selected ? "bg-amber-100 text-amber-900" : "bg-neutral-100 text-neutral-700 hover:bg-amber-100"
        }`}
      >
        {selected ? "انتخاب شد" : "انتخاب"}
      </button>
    </div>
  );
}
 
