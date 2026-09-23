

"use client";
 
import { useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CharmPalette } from "./CharmPalette";
import { Chain, VIEWBOX_HEIGHT, VIEWBOX_WIDTH, type PlacedCharm } from "./Chain";
import type { CharmData } from "./Charm";
import { getClosestPointOnPath } from "@/lib/snapToPath";
 
// Swap these for your real charm catalogue / images
const CHARMS: CharmData[] = [
  { id: "heart", name: "Heart", image: "/charms/heart.png", price: 12 },
  { id: "star", name: "Star", image: "/charms/star.png", price: 10 },
  { id: "moon", name: "Moon", image: "/charms/moon.png", price: 14 },
  { id: "flower", name: "Flower", image: "/charms/flower.png", price: 11 },
  { id: "shell", name: "Shell", image: "/charms/shell.png", price: 9 },
  { id: "clover", name: "Clover", image: "/images/charms/clover.png", price: 13 },
  { id: "butterfly", name: "Butterfly", image: "/charms/butterfly.png", price: 15 },
  { id: "letter-a", name: "Letter A", image: "/charms/letter-a.png", price: 8 },
];
 
export function CharmBuilder() {
  const [placedCharms, setPlacedCharms] = useState<PlacedCharm[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
 
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );
 
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const data = active.data.current as
      | { type: "palette"; charm: CharmData }
      | { type: "placed"; instanceId: string; charm: CharmData }
      | undefined;
 
    if (!data || !over || over.id !== "chain-drop-zone") return;
 
    const container = document.getElementById("chain-container");
    const path = pathRef.current;
    if (!container || !path) return;
 
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.rect.current.translated ?? active.rect.current.initial;
    if (!activeRect) return;
 
    // Center of the dragged charm, relative to the chain container
    const centerX = activeRect.left + activeRect.width / 2 - containerRect.left;
    const centerY = activeRect.top + activeRect.height / 2 - containerRect.top;
 
    // Convert to the SVG's viewBox coordinate space
    const svgX = (centerX / containerRect.width) * VIEWBOX_WIDTH;
    const svgY = (centerY / containerRect.height) * VIEWBOX_HEIGHT;
 
    const snapped = getClosestPointOnPath(path, { x: svgX, y: svgY });
 
    if (data.type === "palette") {
      const newCharm: PlacedCharm = {
        instanceId: `${data.charm.id}-${Date.now()}`,
        charm: data.charm,
        t: snapped.t,
      };
      setPlacedCharms((prev) => [...prev, newCharm]);
    } else {
      setPlacedCharms((prev) =>
        prev.map((pc) => (pc.instanceId === data.instanceId ? { ...pc, t: snapped.t } : pc))
      );
    }
  }
 
  function handleRemove(instanceId: string) {
    setPlacedCharms((prev) => prev.filter((pc) => pc.instanceId !== instanceId));
  }
 
  function handleReset() {
    setPlacedCharms([]);
  }
 
  const total = placedCharms.reduce((sum, pc) => sum + pc.charm.price, 0);
 
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-800">Build Your Charm Bracelet</h1>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            Reset
          </button>
        </div>
 
        {/* Image (chain) on the left, charms on the right — stacks on mobile */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[3fr_2fr]">
          <div className="flex items-center justify-center rounded-2xl bg-neutral-50 p-8">
            <Chain placedCharms={placedCharms} onRemove={handleRemove} pathRef={pathRef} />
          </div>
 
          <div>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500">
              Drag a charm onto the chain
            </h2>
            <CharmPalette charms={CHARMS} />
          </div>
        </div>
 
        <div className="mt-6 flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
          <span className="text-sm text-neutral-600">
            {placedCharms.length} charm{placedCharms.length !== 1 ? "s" : ""} selected
          </span>
          <span className="text-lg font-semibold text-neutral-800">${total.toFixed(2)}</span>
        </div>
      </div>
    </DndContext>
  );
}
 
