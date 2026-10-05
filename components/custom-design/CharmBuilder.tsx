

"use client";
 
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CharmPalette } from "./CharmPalette";
import { Chain, VIEWBOX_HEIGHT, VIEWBOX_WIDTH, getCharmRotation, isCharmPositionBlocked, type PlacedCharm } from "./Chain";
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
  const [draggedCharm, setDraggedCharm] = useState<CharmData | null>(null);
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
    if (isCharmPositionBlocked(snapped.x, snapped.y)) return false;
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
    setDraggedCharm(null);
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
        args.pointerCoordinates
          ? pointerWithin(args)
          : rectIntersection(args)
      }
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => {
        const data = active.data.current;
        setDraggedCharm(data?.type === "palette" ? data.charm : null);
      }}
      onDragCancel={() => {
        setDraggedCharm(null);
        lastDragEnd.current = Date.now();
      }}
    >
      <div
        dir="rtl"
        className="min-h-screen bg-[#f8f5f0] text-[#38292e]"
      >
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
          {/* عنوان استودیو */}
          <header className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p
                dir="ltr"
                className="flex items-center gap-3 text-[10px] font-medium tracking-[0.22em] text-[#95677b]"
              >
                <span className="h-px w-8 bg-current" />
                WINGS DESIGN STUDIO
              </p>

              <h1 className="mt-4 text-3xl font-medium leading-relaxed sm:text-4xl">
                دستبندی با
                <span className="text-[#a16c80]"> امضای خودت.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-8 text-[#796770]">
                چارم‌های دلخواهت را انتخاب کن و کنار هم بچین؛
                هر قطعه، بخشی از داستان تو.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-full border border-[#e1d3d8] bg-white/70 px-4 py-3">
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full bg-[#f0e1e7] text-[#95677b]"
              >
                ✦
              </span>

              <span className="text-xs text-[#796770]">
                انتخاب کن، بچین، شخصی‌اش کن
              </span>
            </div>
          </header>

          {/* محیط طراحی */}
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] lg:gap-6">
            {/* بوم دستبند */}
            <section
              aria-labelledby="builder-canvas-title"
              className="min-w-0 overflow-hidden rounded-[24px] border border-[#e4d9d7] bg-[#fffdf9] shadow-[0_12px_40px_rgba(56,41,46,0.04)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#eee5e1] px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f1e7e3] text-lg text-[#95677b]"
                  >
                    ♡
                  </span>

                  <div>
                    <h2
                      id="builder-canvas-title"
                      className="text-sm font-semibold"
                    >
                      میز طراحی تو
                    </h2>
                    <p className="mt-1 text-[11px] text-[#796770]">
                      پیش‌نمایش چیدمان دستبند
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={placedCharms.length === 0 && !selection}
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-[#e0cdd4] px-3 py-2 text-xs text-[#87586c] transition-colors hover:bg-[#f4e8ed] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#95677b] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 10a9 9 0 1 1 2.6 8.4" />
                    <path d="M3 4v6h6" />
                  </svg>
                  شروع دوباره
                </button>
              </div>

              {/* پس‌زمینه بوم */}
              <div className="relative isolate overflow-hidden bg-[#f6f0e9] px-2 py-8 sm:px-5 sm:py-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(#c7b5ac_1px,transparent_1px)] [background-size:22px_22px]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[75%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fffdf9] blur-3xl"
                />

                <div className="mb-5 flex justify-center">
                  <span
                    dir="ltr"
                    className="rounded-full border border-[#d7c8be] bg-[#fffdf9]/90 px-4 py-2 text-[9px] tracking-[0.2em] text-[#917b72]"
                  >
                    YOUR LITTLE MASTERPIECE
                  </span>
                </div>

                <div className="mx-auto w-full max-w-[760px]">
                  <Chain
                    placedCharms={placedCharms}
                    onRemove={handleRemove}
                    onMove={(instanceId) =>
                      setSelection({ type: "move", instanceId })
                    }
                    onCanvasTap={handleCanvasTap}
                    placementHint={
                      selection?.type === "add"
                        ? `برای افزودن ${selection.charm.name} روی دستبند بزنید`
                        : selection?.type === "move"
                          ? "جای جدید چارم را روی دستبند لمس کنید"
                          : undefined
                    }
                    pathRef={pathRef}
                  />
                </div>

                <p className="mt-5 text-center text-xs leading-6 text-[#88766d]">
                  {placedCharms.length === 0
                    ? "اولین چارم را انتخاب کن؛ داستان از همین‌جا شروع می‌شود."
                    : "می‌توانی جای چارم‌ها را تغییر بدهی و ترکیب تازه‌ای بسازی."}
                </p>
              </div>

              {/* وضعیت انتخاب */}
              <div
                role="status"
                aria-live="polite"
                className={`flex min-h-[84px] items-center justify-between gap-3 border-t px-5 py-4 sm:px-7 ${
                  selection
                    ? "border-[#e3c7d2] bg-[#f5e7ed]"
                    : "border-[#eee5e1] bg-[#fffdf9]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm ${
                      selection
                        ? "bg-[#95677b] text-white"
                        : "bg-[#f1e7e3] text-[#95677b]"
                    }`}
                  >
                    {selection ? "↙" : "✦"}
                  </span>

                  <div>
                    <p className="text-xs font-medium sm:text-sm">
                      {selection?.type === "add"
                        ? `${selection.charm.name} انتخاب شده`
                        : selection?.type === "move"
                          ? "یک جای تازه انتخاب کن"
                          : "آماده طراحی هستی؟"}
                    </p>

                    <p className="mt-1 text-[11px] leading-6 text-[#796770]">
                      {selection
                        ? "روی محل دلخواه دستبند بزن."
                        : "چارم را انتخاب کن یا روی دستبند بکش."}
                    </p>
                  </div>
                </div>

                {selection && (
                  <button
                    type="button"
                    onClick={() => setSelection(null)}
                    className="min-h-10 shrink-0 rounded-full border border-[#cfa8b8] px-4 py-2 text-xs text-[#87586c] transition-colors hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#95677b]"
                  >
                    لغو انتخاب
                  </button>
                )}
              </div>
            </section>

            {/* پنل چارم‌ها */}
            <aside
              aria-labelledby="charm-palette-title"
              className="min-w-0 overflow-hidden rounded-[24px] border border-[#e4d9d7] bg-white shadow-[0_12px_40px_rgba(56,41,46,0.04)]"
            >
              <div className="bg-[#38292e] px-5 py-6 text-[#fff8f3] sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <p
                    dir="ltr"
                    className="text-[9px] tracking-[0.2em] text-[#dfb2c3]"
                  >
                    THE CHARM COLLECTION
                  </p>

                  <span aria-hidden="true" className="text-[#dfb2c3]">
                    ✳
                  </span>
                </div>

                <h2
                  id="charm-palette-title"
                  className="mt-4 text-xl font-medium"
                >
                  جزئیات را تو انتخاب کن
                </h2>

                <p className="mt-2 text-xs leading-7 text-[#e0cdd5]">
                  از بین چارم‌ها، آن‌هایی را پیدا کن که شبیه تو هستند.
                </p>
              </div>

              <div className="p-4 sm:p-5">
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#eadde2] bg-[#faf5f7] p-3">
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#cba8b7] text-xs text-[#95677b]"
                  >
                    i
                  </span>

                  <p className="text-[11px] leading-6 text-[#796770]">
                    برای افزودن، چارم را انتخاب کن و روی دستبند بزن.
                    برای جابه‌جایی، از دکمه کنار چارم یا کشیدن آن
                    استفاده کن.
                  </p>
                </div>

                <CharmPalette
                  charms={CHARMS}
                  selectedCharmId={
                    selection?.type === "add"
                      ? selection.charm.id
                      : undefined
                  }
                  onSelect={handleSelectCharm}
                />
              </div>
            </aside>
          </div>

          {/* خلاصه طرح */}
          <section
            aria-labelledby="design-summary-title"
            className="mt-6 overflow-hidden rounded-[24px] border border-[#e4d9d7] bg-[#fffdf9]"
          >
            <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#efe0e6] text-2xl text-[#95677b]"
                >
                  ✦
                </span>

                <div>
                  <h2
                    id="design-summary-title"
                    className="text-base font-medium"
                  >
                    ترکیب مخصوص تو
                  </h2>

                  <p className="mt-1 text-xs leading-6 text-[#796770]">
                    {placedCharms.length > 0
                      ? `${placedCharms.length.toLocaleString("fa-IR")} چارم در طرح فعلی`
                      : "هنوز چارمی به دستبند اضافه نکرده‌ای."}
                  </p>
                </div>
              </div>

              {placedCharms.length > 0 && (
                <div className="rounded-xl border border-[#e4d9d7] bg-[#f8f3ee] px-5 py-3 sm:text-left">
                  <p className="text-[10px] text-[#796770]">
                    {hasCompletePricing
                      ? "مجموع قیمت چارم‌ها"
                      : "وضعیت قیمت‌گذاری"}
                  </p>

                  {hasCompletePricing ? (
                    <p
                      dir="ltr"
                      className="mt-1 text-xl font-semibold text-[#87586c]"
                    >
                      ${total.toFixed(2)}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs leading-6 text-[#87586c]">
                      قیمت همه چارم‌ها هنوز ثبت نشده است.
                    </p>
                  )}
                </div>
              )}
            </div>

            {placedCharms.length > 0 && (
              <div className="border-t border-[#eee5e1] px-5 py-5 sm:px-7">
                <ul className="flex flex-wrap gap-2">
                  {placedCharms.map((placedCharm, index) => (
                    <li
                      key={placedCharm.instanceId}
                      className="flex items-center gap-3 rounded-full border border-[#e1cfd7] bg-[#f9f0f4] py-1.5 pr-2 pl-1.5"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-[#95677b]">
                        {(index + 1).toLocaleString("fa-IR")}
                      </span>

                      <span className="text-xs text-[#68515b]">
                        {placedCharm.charm.name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(placedCharm.instanceId)
                        }
                        aria-label={`حذف ${placedCharm.charm.name} شماره ${index + 1}`}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full text-lg text-[#95677b] transition-colors hover:bg-[#ecd5df] hover:text-[#38292e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#95677b]"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* راهنمای کوتاه */}
          <div className="mt-8 grid gap-5 px-1 sm:grid-cols-3 sm:gap-8">
            {[
              {
                number: "۰۱",
                title: "چارم‌ها را کشف کن",
                description: "از رنگ‌ها و نشانه‌های موردعلاقه‌ات شروع کن.",
              },
              {
                number: "۰۲",
                title: "ترکیبت را بچین",
                description: "هر چارم را در جای دلخواه دستبند قرار بده.",
              },
              {
                number: "۰۳",
                title: "به سلیقه خودت تغییر بده",
                description: "جابه‌جا کن، حذف کن و ترکیب تازه‌ای بساز.",
              },
            ].map((step) => (
              <div key={step.number} className="flex items-start gap-3">
                <span className="pt-0.5 text-xs text-[#a16c80]">
                  {step.number}
                </span>

                <div>
                  <h3 className="text-xs font-medium">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[11px] leading-6 text-[#796770]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {draggedCharm && createPortal(
        <DragOverlay dropAnimation={null} zIndex={1000}>
          <div className="pointer-events-none flex h-full w-full items-center justify-center rounded-xl border border-amber-200 bg-white/90 shadow-xl" aria-hidden="true">
            <div className="relative h-14 w-14">
              <Image src={draggedCharm.image} alt="" fill unoptimized className="object-contain" sizes="56px" />
            </div>
          </div>
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );

}
 
