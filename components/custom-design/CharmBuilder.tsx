

"use client";
 
import { useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CharmPalette } from "./CharmPalette";
import { Chain, VIEWBOX_HEIGHT, VIEWBOX_WIDTH, getCharmRotation, type PlacedCharm } from "./Chain";
import type { CharmData } from "./Charm";
import { getClosestPointOnPath } from "@/lib/snapToPath";
 
// Product prices can be added when the catalogue pricing is available.
const CHARMS: CharmData[] = [
  { id: "clover", name: "Clover", image: "/images/charms/clover.png", price: 13, category: "دریایی", keywords: ["خرچنگ", "crab"] },
  ...[
    { photo: 1, id: "pink-dress", name: "Pink Dress", category: "مد و زیبایی", keywords: ["لباس", "پیراهن", "صورتی"] },
    { photo: 2, id: "cocktail", name: "Cocktail", category: "خوراکی‌ها", keywords: ["نوشیدنی", "لیوان"] },
    { photo: 3, id: "ice-cream", name: "Ice Cream", category: "خوراکی‌ها", keywords: ["بستنی"] },
    { photo: 5, id: "travel", name: "Travel", category: "سفر و سرگرمی", keywords: ["سفر", "هواپیما", "پاسپورت"] },
    { photo: 6, id: "tennis", name: "Tennis Racket", category: "سفر و سرگرمی", keywords: ["تنیس", "راکت", "ورزش"] },
    { photo: 7, id: "chocolate", name: "Chocolate", category: "خوراکی‌ها", keywords: ["شکلات"] },
    { photo: 8, id: "gold-dress", name: "Gold Dress", category: "مد و زیبایی", keywords: ["لباس", "پیراهن", "طلایی"] },
    { photo: 9, id: "shrimp", name: "Shrimp", category: "دریایی", keywords: ["میگو"] },
    { photo: 10, id: "fashion", name: "Fashion", category: "مد و زیبایی", keywords: ["آرایش", "رژلب", "کیف"] },
  ].map(({ photo, ...charm }) => ({
    ...charm,
    image: `/images/charms/photo_${photo}_2026-10-01_15-40-19.jpg - Edited.png`,
  })),
];
 
export function CharmBuilder() {
  const [placedCharms, setPlacedCharms] = useState<PlacedCharm[]>([]);
  const [selection, setSelection] = useState<
    | { type: "add"; charm: CharmData }
    | { type: "move"; instanceId: string }
    | null
  >(null);
  const pathRef = useRef<SVGPathElement>(null);
  const lastDragEnd = useRef(0);
  const nextInstanceId = useRef(0);
 
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );
 
  function placeAtPoint(
    clientX: number,
    clientY: number,
    action: { type: "add"; charm: CharmData } | { type: "move"; instanceId: string },
  ) {
    const container = document.getElementById("chain-container");
    const path = pathRef.current;
    if (!container || !path) return false;

    const rect = container.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      return false;
    }

    const snapped = getClosestPointOnPath(path, {
      x: ((clientX - rect.left) / rect.width) * VIEWBOX_WIDTH,
      y: ((clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT,
    });
    const position = {
      x: snapped.x,
      y: snapped.y,
      rotation: getCharmRotation(snapped.x, snapped.y),
    };

    if (action.type === "add") {
      nextInstanceId.current += 1;
      const newCharm: PlacedCharm = {
        instanceId: `${action.charm.id}-${nextInstanceId.current}`,
        charm: action.charm,
        ...position,
      };
      setPlacedCharms((prev) => [...prev, newCharm]);
    } else {
      setPlacedCharms((prev) =>
        prev.map((pc) => pc.instanceId === action.instanceId ? { ...pc, ...position } : pc),
      );
    }
    return true;
  }

  function handleDragEnd(event: DragEndEvent) {
    lastDragEnd.current = Date.now();
    const { active } = event;
    const data = active.data.current as
      | { type: "palette"; charm: CharmData }
      | { type: "placed"; instanceId: string; charm: CharmData }
      | undefined;
 
    if (!data) return;
 
    const activator = event.activatorEvent;
    let dropX: number;
    let dropY: number;
    if (activator instanceof MouseEvent || activator instanceof PointerEvent) {
      dropX = activator.clientX + event.delta.x;
      dropY = activator.clientY + event.delta.y;
    } else if (activator instanceof TouchEvent) {
      const touch = activator.changedTouches[0];
      if (!touch) return;
      dropX = touch.clientX + event.delta.x;
      dropY = touch.clientY + event.delta.y;
    } else {
      const activeRect = active.rect.current.translated ?? active.rect.current.initial;
      if (!activeRect) return;
      dropX = activeRect.left + activeRect.width / 2;
      dropY = activeRect.top + activeRect.height / 2;
    }

    if (data.type === "palette") {
      placeAtPoint(dropX, dropY, { type: "add", charm: data.charm });
    } else {
      placeAtPoint(dropX, dropY, { type: "move", instanceId: data.instanceId });
    }
  }

  function handleSelectCharm(charm: CharmData) {
    const alreadySelected = selection?.type === "add" && selection.charm.id === charm.id;
    setSelection(alreadySelected ? null : { type: "add", charm });
    if (!alreadySelected && window.matchMedia("(max-width: 767px)").matches) {
      document.getElementById("chain-container")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleCanvasTap(clientX: number, clientY: number) {
    if (!selection || Date.now() - lastDragEnd.current < 300) return;
    if (placeAtPoint(clientX, clientY, selection)) setSelection(null);
  }
 
  function handleRemove(instanceId: string) {
    setPlacedCharms((prev) => prev.filter((pc) => pc.instanceId !== instanceId));
    setSelection((current) => current?.type === "move" && current.instanceId === instanceId ? null : current);
  }
 
  function handleReset() {
    setPlacedCharms([]);
    setSelection(null);
  }
 
  const hasCompletePricing = placedCharms.every((pc) => pc.charm.price !== undefined);
  const total = placedCharms.reduce((sum, pc) => sum + (pc.charm.price ?? 0), 0);
 
  return (
    <DndContext
      id="custom-design-dnd"
      sensors={sensors}
      collisionDetection={(args) =>
        args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args)
      }
      onDragEnd={handleDragEnd}
    >
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-800">دستبندت را بساز</h1>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            پاک کردن
          </button>
        </div>
 
        {/* Image (chain) on the left, charms on the right — stacks on mobile */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[3fr_2fr]">
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-neutral-50 p-2 sm:p-5 md:p-8">
            <Chain
              placedCharms={placedCharms}
              onRemove={handleRemove}
              onMove={(instanceId) => setSelection({ type: "move", instanceId })}
              onCanvasTap={handleCanvasTap}
              placementHint={selection?.type === "add"
                ? `برای افزودن ${selection.charm.name} روی دستبند بزنید`
                : selection?.type === "move"
                  ? "جای جدید چارم را روی دستبند لمس کنید"
                  : undefined}
              pathRef={pathRef}
            />
            {selection && (
              <button
                type="button"
                onClick={() => setSelection(null)}
                className="rounded-full px-4 py-2 text-sm text-neutral-600 underline-offset-4 hover:underline md:hidden"
              >
                لغو انتخاب
              </button>
            )}
          </div>
 
          <div>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500">
              چارم دلخواهت را انتخاب کن
            </h2>
            <p className="mb-4 text-sm text-neutral-500 md:hidden">
              چارم را انتخاب کن، سپس روی جای دلخواه دستبند بزن. برای جابه‌جایی از دکمهٔ کنار چارم استفاده کن.
            </p>
            <CharmPalette charms={CHARMS} selectedCharmId={selection?.type === "add" ? selection.charm.id : undefined} onSelect={handleSelectCharm} />
          </div>
        </div>
 
        <div className="mt-6 flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
          <span className="text-sm text-neutral-600">
            {placedCharms.length} چارم روی دستبند
          </span>
          {hasCompletePricing && (
            <span className="text-lg font-semibold text-neutral-800">${total.toFixed(2)}</span>
          )}
        </div>
      </div>
    </DndContext>
  );
}
 
