"use client";

import { useEffect, useRef, useState } from "react";
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
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  getCharmRotation,
  isCharmPositionBlocked,
  type PlacedCharm,
} from "./Chain";
import type { CharmData } from "./Charm";
import {
  StudioResponsive as StudioWizard,
  type StudioStep,
} from "./StudioWizard";
import { SavedDesignConfirmation } from "./SavedDesignConfirmation";
import { customizationHref, type DesignProduct } from "@/lib/design-products";
import { getClosestPointOnPath } from "@/lib/snapToPath";
import {
  useSavedDesigns,
  saveDesign,
  designSignature,
} from "@/lib/saved-designs";
import { useShop } from "../shop-provider";
import styles from "./builder-studio.module.css";
import { designRules } from "@/lib/design-rules";

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
  const startingCharms =
    initialProduct && designRules(initialProduct).single
      ? initialCharms
          .slice(0, 1)
          .map((item) => ({ ...item, ...designRules(initialProduct).anchor }))
      : initialCharms;
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
          throw new Error(data.message || "دریافت چارم‌های فروشگاه انجام نشد.");
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
  const [step, setStep] = useState<StudioStep>(initialCharms.length ? 3 : 1);
  const [saveConfirmationOpen, setSaveConfirmationOpen] = useState(false);
  const [placedCharms, setPlacedCharms] =
    useState<PlacedCharm[]>(startingCharms);
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
  const [message, setMessage] = useState("");
  const [canUndo, setCanUndo] = useState(false);

  const pathRef = useRef<SVGPathElement>(null);
  const placedRef = useRef<PlacedCharm[]>(startingCharms);
  const history = useRef<PlacedCharm[][]>([]);
  const lastDragEnd = useRef(0);
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

  function applyPosition(position: Position, action: Selection) {
    if (!selectedProduct) return false;
    const rules = designRules(selectedProduct);
    if (rules.single) {
      if (action.type === "move") {
        setMessage("این مدل یک جای اتصال ثابت در پایین محصول دارد.");
        return true;
      }
      commit([
        {
          instanceId: `${action.charm.id}-${crypto.randomUUID()}`,
          charm: action.charm,
          ...rules.anchor,
        },
      ]);
      setMessage(`${action.charm.name} در جایگاه تک‌چارم قرار گرفت.`);
      return true;
    }
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
      setStep(1);
      return;
    }

    if (designRules(selectedProduct).single) {
      applyPosition(designRules(selectedProduct).anchor, {
        type: "add",
        charm,
      });
      setSelection(null);
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
      setStep(1);
      return;
    }
    if (designRules(selectedProduct).single) {
      addAutomatically(charm);
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
    if (selectedProduct && designRules(selectedProduct).single) {
      setMessage(
        "جای اتصال این مدل ثابت است؛ برای تعویض، چارم دیگری انتخاب کن.",
      );
      return;
    }
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
    setSelectedProduct(null);
    setPlacedCharms([]);
    placedRef.current = [];
    history.current = [];
    setCanUndo(false);
    setSelection(null);
    setMessage("محصول بعدی را برای یک طرح تازه انتخاب کن.");
    window.history.replaceState(null, "", "/custom-design");
    setStep(1);
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
      <StudioWizard
        step={step}
        onStep={setStep}
        products={products}
        product={selectedProduct}
        onProduct={chooseProduct}
        catalogueFailed={catalogueFailed}
        requestedUnavailable={requestedUnavailable}
        charms={paletteCharms}
        placed={placedCharms}
        counts={counts}
        loading={charmsLoading}
        error={charmsError}
        selectedCharmId={
          selection?.type === "add" ? selection.charm.id : undefined
        }
        onSelect={selectCharm}
        onAdd={addAutomatically}
        onRemove={removeCharm}
        onMove={selectMove}
        onTap={handleCanvasTap}
        onCancel={() => setSelection(null)}
        onUndo={undo}
        onReset={reset}
        canUndo={canUndo}
        onSave={saveCurrentDesign}
        saved={designSaved}
        onNew={startNewDesign}
        pathRef={pathRef}
        message={message}
        hint={hint}
        total={total}
        priced={hasCompletePricing}
      />

      {saveConfirmationOpen && (
        <SavedDesignConfirmation
          onClose={() => setSaveConfirmationOpen(false)}
          onViewWishlist={() => {
            setSaveConfirmationOpen(false);
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
