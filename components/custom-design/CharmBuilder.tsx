"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  Plus,
  RotateCcw,
  Undo2,
  X,
  SlidersHorizontal,
  ShoppingBag,
  ArrowLeftRight,
  Heart,
  Check,
} from "lucide-react";
import { CharmPalette } from "./CharmPalette";
import {
  Chain,
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  getCharmRotation,
  isCharmPositionBlocked,
  type PlacedCharm,
} from "./Chain";
import type { CharmData } from "./Charm";
import { ProductPicker } from "./ProductPicker";
import { SavedDesignConfirmation } from "./SavedDesignConfirmation";
import { customizationHref, type DesignProduct } from "@/lib/design-products";
import { persianNumber } from "@/lib/products";
import { getClosestPointOnPath } from "@/lib/snapToPath";
import {
  useSavedDesigns,
  saveDesign,
  designSignature,
} from "@/lib/saved-designs";
import { useShop } from "../shop-provider";
import styles from "./builder-studio.module.css";
import { ProductPurchase } from "../commerce/product-purchase";

type Selection =
  { type: "add"; charm: CharmData } | { type: "move"; instanceId: string };

type DragData =
  | { type: "palette"; charm: CharmData }
  | { type: "placed"; instanceId: string; charm: CharmData };

type Position = { x: number; y: number };

// Catalogue items wait for a hold so the list can scroll. On the bracelet,
// touch-action is disabled and a short movement should start repositioning.
class StudioTouchSensor extends TouchSensor {
  constructor(props: ConstructorParameters<typeof TouchSensor>[0]) {
    super({
      ...props,
      options: {
        ...props.options,
        activationConstraint:
          props.activeNode.data.current?.type === "placed"
            ? { distance: 4 }
            : props.options.activationConstraint,
      },
    });
  }
}

export function CharmBuilder({
  products,
  initialProduct,
  initialCharms = [],
  catalogueFailed = false,
  requestedUnavailable = false,
}: {
  products: DesignProduct[];
  initialProduct: DesignProduct | null;
  initialCharms?: PlacedCharm[];
  catalogueFailed?: boolean;
  requestedUnavailable?: boolean;
}) {
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [paletteCharms, setPaletteCharms] = useState<CharmData[]>([]);
  const [charmsLoading, setCharmsLoading] = useState(true);
  const [charmsError, setCharmsError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/woo/charms", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.charms))
          throw new Error(data.message || "?????? ???????? ??????? ????? ???.");
        return data.charms as CharmData[];
      })
      .then((charms) => {
        if (!controller.signal.aborted) setPaletteCharms(charms);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setCharmsError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCharmsLoading(false);
      });
    return () => controller.abort();
  }, []);
  const charmPrices = Object.fromEntries(
    paletteCharms.map((charm) => [charm.id, charm.price]),
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saveConfirmationOpen, setSaveConfirmationOpen] = useState(false);
  const [placedCharms, setPlacedCharms] =
    useState<PlacedCharm[]>(initialCharms);
  const savedDesigns = useSavedDesigns();
  const { openPanel } = useShop();
  const designSaved = Boolean(
    selectedProduct &&
    savedDesigns.some(
      (design) =>
        designSignature(design.product.id, design.charms) ===
        designSignature(selectedProduct.id, placedCharms),
    ),
  );
  const [selection, setSelection] = useState<Selection | null>(null);
  const [draggedCharm, setDraggedCharm] = useState<CharmData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [canUndo, setCanUndo] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [viewportTop, setViewportTop] = useState(0);

  const pathRef = useRef<SVGPathElement>(null);
  const placedRef = useRef<PlacedCharm[]>(initialCharms);
  const history = useRef<PlacedCharm[][]>([]);
  const lastDragEnd = useRef(0);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const dragActive = useRef(false);
  const dragPointer = useRef<Position | null>(null);
  const dragGrabOffset = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    function trackMouse(event: MouseEvent) {
      if (dragActive.current) {
        dragPointer.current = { x: event.clientX, y: event.clientY };
      }
    }
    function trackTouch(event: TouchEvent) {
      const touch = event.changedTouches[0];
      if (dragActive.current && touch) {
        dragPointer.current = { x: touch.clientX, y: touch.clientY };
      }
    }
    document.addEventListener("mousemove", trackMouse, true);
    document.addEventListener("mouseup", trackMouse, true);
    document.addEventListener("touchmove", trackTouch, true);
    document.addEventListener("touchend", trackTouch, true);
    return () => {
      document.removeEventListener("mousemove", trackMouse, true);
      document.removeEventListener("mouseup", trackMouse, true);
      document.removeEventListener("touchmove", trackTouch, true);
      document.removeEventListener("touchend", trackTouch, true);
    };
  }, []);

  // Mouse and touch sensors are separate so mobile scrolling remains usable.
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(StudioTouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      keyboardCodes: {
        start: ["Space"],
        cancel: ["Escape"],
        end: ["Space", "Enter", "Tab"],
      },
    }),
  );

  function commit(next: PlacedCharm[]) {
    history.current.push(placedRef.current);
    // Keep a bounded history.
    if (history.current.length > 50) history.current.shift();

    placedRef.current = next;
    setPlacedCharms(next);
    setCanUndo(true);
  }

  function undo() {
    const previous = history.current.pop();
    if (!previous) return;

    placedRef.current = previous;
    setPlacedCharms(previous);
    setSelection(null);
    setCanUndo(history.current.length > 0);
    setMessage("آخرین تغییر بازگردانده شد.");
  }

  function closeSheet() {
    setSheetOpen(false);
    requestAnimationFrame(() => openButtonRef.current?.focus());
  }

  useEffect(() => {
    if (!sheetOpen) return;

    const media = window.matchMedia("(max-width: 1023px)");
    const previousOverflow = document.body.style.overflow;

    if (media.matches) document.body.style.overflow = "hidden";

    function updateViewport() {
      setViewportHeight(window.visualViewport?.height ?? window.innerHeight);
      setViewportTop(window.visualViewport?.offsetTop ?? 0);
    }

    function onBreakpointChange() {
      if (!media.matches) setSheetOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSheetOpen(false);
        openButtonRef.current?.focus();
      }
      if (event.key === "Tab" && media.matches) {
        const buttons = workspaceRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input, select, a[href], [tabindex="0"]',
        );
        const focusable = Array.from(buttons ?? []).filter(
          (element) => element.getClientRects().length > 0,
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        const active = document.activeElement;
        if (
          !workspaceRef.current?.contains(active) ||
          (event.shiftKey ? active === first : active === last)
        ) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    }

    updateViewport();
    closeButtonRef.current?.focus({ preventScroll: true });

    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    window.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onBreakpointChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onBreakpointChange);
    };
  }, [sheetOpen]);

  function applyPosition(position: Position, action: Selection) {
    if (!selectedProduct) return false;
    if (isCharmPositionBlocked(position.x, position.y, selectedProduct)) {
      setMessage("این قسمت برای اتصال چارم مجاز نیست؛ جای دیگری انتخاب کن.");
      return false;
    }

    const nextPosition = {
      x: position.x,
      y: position.y,
      rotation: getCharmRotation(position.x, position.y, selectedProduct),
    };

    if (action.type === "add") {
      commit([
        ...placedRef.current,
        {
          instanceId: `${action.charm.id}-${crypto.randomUUID()}`,
          charm: action.charm,
          ...nextPosition,
        },
      ]);
      setMessage(`${action.charm.name} اضافه شد.`);
    } else {
      const current = placedRef.current.find(
        (item) => item.instanceId === action.instanceId,
      );
      if (!current) return false;

      commit(
        placedRef.current.map((item) =>
          item.instanceId === action.instanceId
            ? { ...item, ...nextPosition }
            : item,
        ),
      );
      setMessage("جای چارم تغییر کرد.");
    }

    return true;
  }

  function placeAtPoint(clientX: number, clientY: number, action: Selection) {
    const container = document.getElementById("chain-container");
    const path = pathRef.current;
    if (!container || !path) return false;

    const rect = container.getBoundingClientRect();
    if (
      rect.width === 0 ||
      rect.height === 0 ||
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return false;
    }

    const matrix = path.getScreenCTM();
    if (!matrix) return false;
    const localPoint = new DOMPoint(clientX, clientY).matrixTransform(
      matrix.inverse(),
    );
    return applyPosition(getClosestPointOnPath(path, localPoint), action);
  }

  function addAutomatically(charm: CharmData) {
    if (Date.now() - lastDragEnd.current < 350) return;
    if (!selectedProduct) {
      setPickerOpen(true);
      return;
    }

    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    if (!Number.isFinite(length) || length <= 0) return;
    const minimumDistance = 55;
    let best: Position | null = null;
    let bestScore = -Infinity;
    for (let index = 0; index < 240; index += 1) {
      const point = path.getPointAtLength((index / 240) * length);
      if (isCharmPositionBlocked(point.x, point.y, selectedProduct)) continue;
      const distance = placedRef.current.length
        ? Math.min(
            ...placedRef.current.map((item) =>
              Math.hypot(item.x - point.x, item.y - point.y),
            ),
          )
        : Infinity;
      if (distance < minimumDistance) continue;
      const score = placedRef.current.length ? distance : point.y;
      if (score > bestScore) {
        bestScore = score;
        best = { x: point.x, y: point.y };
      }
    }

    if (!best) {
      setMessage(
        "فضای خالی کافی پیدا نشد؛ چارم را بکش یا جای چارم‌های قبلی را تنظیم کن.",
      );
      return;
    }

    if (applyPosition(best, { type: "add", charm })) {
      setSelection(null);
    }
  }

  function selectCharm(charm: CharmData) {
    if (Date.now() - lastDragEnd.current < 350) return;
    if (!selectedProduct) {
      setPickerOpen(true);
      return;
    }
    setSelection((current) =>
      current?.type === "add" && current.charm.id === charm.id
        ? null
        : { type: "add", charm },
    );
    setMessage("محل دلخواه را روی محصول لمس کن.");
  }

  function selectMove(instanceId: string) {
    if (Date.now() - lastDragEnd.current < 350) return;
    setSelection({ type: "move", instanceId });
    setMessage("برای جابه‌جایی، محل جدید را روی محصول لمس کن.");
  }

  function removeCharm(instanceId: string) {
    if (!placedRef.current.some((item) => item.instanceId === instanceId))
      return;
    commit(placedRef.current.filter((item) => item.instanceId !== instanceId));

    setSelection((current) =>
      current?.type === "move" && current.instanceId === instanceId
        ? null
        : current,
    );
    setMessage("چارم حذف شد.");
  }

  function reset() {
    if (placedRef.current.length) commit([]);
    setSelection(null);
    setMessage("میز طراحی خالی شد؛ می‌توانی با بازگردانی برگردی.");
  }

  function handleCanvasTap(clientX: number, clientY: number) {
    if (!selection || Date.now() - lastDragEnd.current < 350) return;
    if (placeAtPoint(clientX, clientY, selection)) setSelection(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    dragActive.current = false;
    setDraggedCharm(null);
    lastDragEnd.current = Date.now();

    const data = event.active.data.current as DragData | undefined;
    if (!data) return;

    const action: Selection =
      data.type === "palette"
        ? { type: "add", charm: data.charm }
        : { type: "move", instanceId: data.instanceId };

    // Use viewport coordinates from the release event. Drag deltas can include
    // scroll compensation and no longer match the finger's position.
    if (dragPointer.current) {
      const { x, y } = dragPointer.current;
      dragPointer.current = null;
      if (
        placeAtPoint(
          x + dragGrabOffset.current.x,
          y + dragGrabOffset.current.y,
          action,
        )
      )
        setSelection(null);
      return;
    }

    // For an existing charm, preserve the grabbed offset and move
    // its attachment point by the drag delta.
    if (data.type === "placed") {
      const item = placedRef.current.find(
        (entry) => entry.instanceId === data.instanceId,
      );
      const container = document.getElementById("chain-container");
      if (!item || !container) return;

      const rect = container.getBoundingClientRect();
      const x = rect.left + (item.x / VIEWBOX_WIDTH) * rect.width;
      const y = rect.top + (item.y / VIEWBOX_HEIGHT) * rect.height;

      if (placeAtPoint(x + event.delta.x, y + event.delta.y, action)) {
        setSelection(null);
      }
      return;
    }

    const activator = event.activatorEvent;
    let dropX: number;
    let dropY: number;

    if (activator instanceof MouseEvent || activator instanceof PointerEvent) {
      dropX = activator.clientX + event.delta.x;
      dropY = activator.clientY + event.delta.y;
    } else if (
      typeof TouchEvent !== "undefined" &&
      activator instanceof TouchEvent
    ) {
      const touch = activator.changedTouches[0];
      if (!touch) return;

      dropX = touch.clientX + event.delta.x;
      dropY = touch.clientY + event.delta.y;
    } else {
      const rect =
        event.active.rect.current.translated ??
        event.active.rect.current.initial;
      if (!rect) return;

      dropX = rect.left + rect.width / 2;
      dropY = rect.top + rect.height / 2;
    }

    if (placeAtPoint(dropX, dropY, action)) setSelection(null);
  }

  const counts = placedCharms.reduce<Record<string, number>>((result, item) => {
    result[item.charm.id] = (result[item.charm.id] ?? 0) + 1;
    return result;
  }, {});

  const hasCompletePricing =
    placedCharms.length > 0 &&
    placedCharms.every((item) => charmPrices[item.charm.id] != null);

  const total = placedCharms.reduce(
    (sum, item) => sum + (charmPrices[item.charm.id] ?? 0),
    0,
  );

  const hint =
    selection?.type === "add"
      ? `محل اتصال ${selection.charm.name} را لمس کن`
      : selection?.type === "move"
        ? "محل جدید چارم را روی محصول لمس کن"
        : undefined;

  const viewportStyle = {
    "--studio-top": `${viewportTop}px`,
    "--studio-height":
      viewportHeight !== null ? `${viewportHeight}px` : "100dvh",
  } as CSSProperties;

  function openProductPicker() {
    setSheetOpen(false);
    setPickerOpen(true);
  }

  function chooseProduct(product: DesignProduct) {
    if (selectedProduct?.id !== product.id) {
      setSelectedProduct(product);
      setPlacedCharms([]);
      placedRef.current = [];
      history.current = [];
      setCanUndo(false);
      setSelection(null);
      setDraggedCharm(null);
      setMessage(`${product.name} آمادهٔ طراحی است.`);
      window.history.replaceState(null, "", customizationHref(product.id));
    }
    setPickerOpen(false);
  }

  function saveCurrentDesign() {
    if (!selectedProduct || !placedCharms.length) return;
    if (saveDesign(selectedProduct, placedCharms)) {
      setMessage("طرح تو در علاقه‌مندی‌ها ذخیره شد.");
      setSaveConfirmationOpen(true);
    } else {
      setMessage(
        "ذخیرهٔ طرح انجام نشد؛ فضای ذخیره‌سازی مرورگر را بررسی کن و دوباره تلاش کن.",
      );
    }
  }

  function startNewDesign() {
    setSheetOpen(false);
    setSelectedProduct(null);
    setPlacedCharms([]);
    placedRef.current = [];
    history.current = [];
    setCanUndo(false);
    setSelection(null);
    setMessage("طرح قبلی در علاقه‌مندی‌هاست؛ محصول بعدی را انتخاب کن.");
    window.history.replaceState(null, "", "/custom-design");
    setPickerOpen(true);
  }

  return (
    <DndContext
      id="custom-design-dnd"
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "برای انتخاب چارم Enter را بزن. برای کشیدن با صفحه‌کلید Space را بزن، با کلیدهای جهت حرکت کن و با Enter رها کن. Escape حرکت را لغو می‌کند.",
        },
      }}
      sensors={sensors}
      collisionDetection={(args) =>
        args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args)
      }
      onDragStart={({ active, activatorEvent }) => {
        dragActive.current = true;
        dragPointer.current = null;
        dragGrabOffset.current = { x: 0, y: 0 };
        const data = active.data.current as DragData | undefined;
        if (data?.type === "placed") {
          const item = placedRef.current.find(
            (entry) => entry.instanceId === data.instanceId,
          );
          const matrix = pathRef.current?.getScreenCTM();
          const pointer =
            activatorEvent instanceof MouseEvent
              ? { x: activatorEvent.clientX, y: activatorEvent.clientY }
              : typeof TouchEvent !== "undefined" &&
                  activatorEvent instanceof TouchEvent &&
                  activatorEvent.changedTouches[0]
                ? {
                    x: activatorEvent.changedTouches[0].clientX,
                    y: activatorEvent.changedTouches[0].clientY,
                  }
                : null;
          if (item && matrix && pointer) {
            const anchor = new DOMPoint(item.x, item.y).matrixTransform(matrix);
            dragGrabOffset.current = {
              x: anchor.x - pointer.x,
              y: anchor.y - pointer.y,
            };
          }
        }
        setDraggedCharm(data?.type === "palette" ? data.charm : null);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        dragActive.current = false;
        dragPointer.current = null;
        setDraggedCharm(null);
        lastDragEnd.current = Date.now();
      }}
    >
      <div
        dir="rtl"
        className={`${styles.studio} ${sheetOpen ? styles.studioSheetOpen : ""}`}
      >
        <div className="site-container">
          <header className={styles.heading}>
            <p className={styles.eyebrow}>WINGS DESIGN STUDIO</p>
            <h1>
              انتخاب تو، <span>داستان تو.</span>
            </h1>
            <p className={styles.intro}>
              یک محصول انتخاب کن، چارم‌های دلخواهت را روی آن بچین و طرح خودت را
              بساز.
            </p>
          </header>
          {requestedUnavailable && !selectedProduct && (
            <p role="status" className={styles.unavailableProduct}>
              این محصول دیگر موجود نیست؛ محصول دیگری برای طراحی انتخاب کن.
            </p>
          )}

          <div
            ref={workspaceRef}
            role={sheetOpen ? "dialog" : undefined}
            aria-modal={sheetOpen ? true : undefined}
            aria-label={sheetOpen ? "انتخاب چارم و طراحی دستبند" : undefined}
            className={`${styles.workspace} ${
              sheetOpen ? styles.workspaceOpen : ""
            }`}
            style={viewportStyle}
          >
            <section className={styles.canvasSection} aria-label="میز طراحی">
              <div className={styles.canvasToolbar}>
                <div className={styles.productIdentity}>
                  <div className={styles.productInfo}>
                    <span className={styles.productEyebrow}>میز طراحی تو</span>
                    <strong title={selectedProduct?.name}>
                      {selectedProduct?.name ?? "محصولت را انتخاب کن"}
                    </strong>
                    <span className={styles.productMeta}>
                      {selectedProduct
                        ? `${persianNumber(selectedProduct.price)} تومان · ${placedCharms.length.toLocaleString("fa-IR")} چارم`
                        : "قدم اول؛ انتخاب محصول"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.changeProductButton}
                    onClick={openProductPicker}
                    aria-label={
                      selectedProduct ? "تغییر محصول" : "انتخاب محصول"
                    }
                    title={selectedProduct ? "تغییر محصول" : "انتخاب محصول"}
                  >
                    <ArrowLeftRight size={16} />
                    <span>
                      {selectedProduct ? "تغییر محصول" : "انتخاب محصول"}
                    </span>
                  </button>
                </div>
                <div className={styles.toolbarButtons}>
                  <div
                    className={styles.editTools}
                    role="group"
                    aria-label="ابزارهای ویرایش طرح"
                  >
                    <button
                      type="button"
                      onClick={undo}
                      disabled={!canUndo}
                      aria-label="بازگردانی آخرین تغییر"
                      title="بازگردانی آخرین تغییر"
                    >
                      <Undo2 size={18} />
                    </button>
                    <span className={styles.toolDivider} aria-hidden="true" />
                    <button
                      type="button"
                      onClick={reset}
                      disabled={!placedCharms.length && !selection}
                      aria-label="شروع دوباره"
                      title="شروع دوباره"
                    >
                      <RotateCcw size={17} />
                    </button>
                  </div>
                  <div className={styles.designActions}>
                    <button
                      type="button"
                      onClick={saveCurrentDesign}
                      disabled={
                        !selectedProduct || !placedCharms.length || designSaved
                      }
                      className={`${styles.toolbarSaveButton} ${designSaved ? styles.toolbarSaved : ""}`}
                      aria-label={
                        designSaved
                          ? "طرح در علاقه‌مندی‌ها ذخیره شده"
                          : "ذخیرهٔ طرح در علاقه‌مندی‌ها"
                      }
                      title={
                        designSaved
                          ? "طرح ذخیره شده"
                          : "ذخیرهٔ طرح در علاقه‌مندی‌ها"
                      }
                    >
                      {designSaved ? <Check size={17} /> : <Heart size={17} />}
                      <span>
                        {designSaved ? "ذخیره شد" : "افزودن به علاقه‌مندی‌ها"}
                      </span>
                    </button>
                    {designSaved && (
                      <button
                        type="button"
                        onClick={startNewDesign}
                        className={styles.toolbarNewButton}
                      >
                        <Plus size={16} />
                        <span>طراحی محصول جدید</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.canvasArea}>
                <div className={styles.chainFrame}>
                  {selectedProduct ? (
                    <Chain
                      product={selectedProduct}
                      placedCharms={placedCharms}
                      onRemove={removeCharm}
                      onMove={selectMove}
                      onCancelPlacement={() => setSelection(null)}
                      onCanvasTap={handleCanvasTap}
                      placementHint={hint}
                      pathRef={pathRef}
                    />
                  ) : (
                    <div className={styles.emptyCanvas}>
                      <span className={styles.emptyCanvasIcon}>
                        <ShoppingBag size={42} strokeWidth={1.25} />
                      </span>
                      <h2>جای انتخاب تو خالی است</h2>
                      <p>
                        اول محصولت را انتخاب کن؛ بعد با چارم‌ها به آن حال‌وهوای
                        خودت را بده.
                      </p>
                      <button type="button" onClick={openProductPicker}>
                        <Plus size={18} /> انتخاب محصول
                      </button>
                      <span className={styles.emptyCanvasHint}>
                        انتخاب محصول ← افزودن چارم ← تنظیم جای چارم‌ها
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.canvasStatus}>
                <p role="status" aria-live="polite">
                  {hint ||
                    message ||
                    (selectedProduct
                      ? "چارم را انتخاب کن یا روی محصول بکش."
                      : "برای شروع، یک محصول انتخاب کن.")}
                </p>
                {selection ? (
                  <button type="button" onClick={() => setSelection(null)}>
                    لغو انتخاب
                  </button>
                ) : canUndo ? (
                  <button type="button" onClick={undo}>
                    بازگردانی
                  </button>
                ) : null}
              </div>
            </section>

            <aside
              id="mobile-charm-panel"
              className={styles.paletteSection}
              aria-label="انتخاب چارم"
            >
              <div className={styles.sheetHeader}>
                <span className={styles.sheetHandle} aria-hidden="true" />
                <div>
                  <strong>چارم بعدی‌ات را انتخاب کن</strong>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeSheet}
                    aria-label="بستن پنل انتخاب چارم"
                  >
                    <X size={21} />
                  </button>
                </div>
              </div>

              <CharmPalette
                charms={paletteCharms}
                loading={charmsLoading}
                error={charmsError}
                counts={counts}
                selectedCharmId={
                  selection?.type === "add" ? selection.charm.id : undefined
                }
                onSelect={selectCharm}
                onAdd={addAutomatically}
              />

              <div className={styles.sheetFooter}>
                <button type="button" onClick={closeSheet}>
                  <SlidersHorizontal size={17} />
                  تنظیم جای چارم‌ها
                </button>
                <span>
                  {placedCharms.length.toLocaleString("fa-IR")} چارم اضافه شده
                </span>
              </div>
            </aside>
          </div>

          <section className={styles.summary} aria-label="چارم‌های انتخاب‌شده">
            {selectedProduct && placedCharms.length > 0 && (
              <div className="mb-6 rounded-2xl border border-[#e7dadd] bg-[#fffafb] p-4">
                <h2 className="mb-4">همین طرح را سفارش بده</h2>
                <ProductPurchase
                  key={selectedProduct.id}
                  product={selectedProduct}
                  design={{
                    id: "current",
                    product: selectedProduct,
                    charms: placedCharms,
                    savedAt: "",
                  }}
                  onAdded={() => setSheetOpen(false)}
                />
              </div>
            )}
            <div className={styles.saveDesignBar}>
              <div>
                <h2>طرح تو، برای روزهای بعد</h2>
                <p>
                  محصول و جای همهٔ چارم‌ها در علاقه‌مندی‌های همین مرورگر ذخیره
                  می‌شود.
                </p>
              </div>
            </div>
            <div className={styles.summaryHeading}>
              <div>
                <h2>ترکیب شخصی تو</h2>
                <p>برای تغییر جای هر چارم، نام آن را انتخاب کن.</p>
              </div>
              {hasCompletePricing && <span>{persianNumber(total)} تومان</span>}
            </div>

            {placedCharms.length ? (
              <ul className={styles.selectedList}>
                {placedCharms.map((item, index) => (
                  <li key={item.instanceId}>
                    <button
                      type="button"
                      onClick={() => selectMove(item.instanceId)}
                      aria-label={`جابه‌جایی ${item.charm.name}`}
                    >
                      <span>{(index + 1).toLocaleString("fa-IR")}</span>
                      {item.charm.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCharm(item.instanceId)}
                      aria-label={`حذف ${item.charm.name}`}
                    >
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptySummary}>
                {selectedProduct
                  ? "هنوز چارمی اضافه نکرده‌ای؛ اولین انتخاب را شروع کن."
                  : "بعد از انتخاب محصول، چارم‌های طرح تو اینجا نمایش داده می‌شوند."}
              </p>
            )}

            {!hasCompletePricing && placedCharms.length > 0 && (
              <p className={styles.pricingNote}>
                قیمت همهٔ چارم‌ها هنوز ثبت نشده است.
              </p>
            )}
          </section>

          <div className={styles.mobileBar}>
            <div>
              <strong>طراحی خودت</strong>
              <span>
                {placedCharms.length.toLocaleString("fa-IR")} چارم انتخاب شده
              </span>
            </div>
            <button
              ref={openButtonRef}
              type="button"
              onClick={() =>
                selectedProduct ? setSheetOpen(true) : openProductPicker()
              }
              aria-expanded={sheetOpen}
              aria-controls="mobile-charm-panel"
            >
              <Plus size={19} />
              {selectedProduct ? "انتخاب چارم" : "انتخاب محصول"}
            </button>
          </div>
        </div>
      </div>

      {pickerOpen && (
        <ProductPicker
          products={products}
          selectedId={selectedProduct?.id}
          hasDesign={placedCharms.length > 0}
          failed={catalogueFailed}
          onSelect={chooseProduct}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {saveConfirmationOpen && (
        <SavedDesignConfirmation
          onClose={() => setSaveConfirmationOpen(false)}
          onViewWishlist={() => {
            setSaveConfirmationOpen(false);
            setSheetOpen(false);
            openPanel("wishlist");
          }}
        />
      )}

      {typeof document !== "undefined" &&
        createPortal(
          <DragOverlay dropAnimation={null} zIndex={10000}>
            {draggedCharm ? (
              <div className={styles.dragPreview} aria-hidden="true">
                <Image
                  src={draggedCharm.image}
                  alt=""
                  fill
                  unoptimized
                  sizes="88px"
                  className="object-contain"
                />
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
}
