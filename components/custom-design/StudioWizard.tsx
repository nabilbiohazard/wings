"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import Image from "next/image";
import { StudioDesktop } from "./StudioDesktop";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Gem,
  Heart,
  Pencil,
  Plus,
  RotateCcw,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";
import { StudioProducts } from "./StudioProducts";
import { CharmPalette } from "./CharmPalette";
import { Chain, type PlacedCharm } from "./Chain";
import { SavedDesignPreview } from "./SavedDesignPreview";
import { ProductPurchase } from "../commerce/product-purchase";
import type { DesignProduct } from "@/lib/design-products";
import type { CharmData } from "./Charm";
import { designRules } from "@/lib/design-rules";
import { persianNumber } from "@/lib/products";
import styles from "./studio-wizard.module.css";

export type StudioStep = 1 | 2 | 3;
export type StudioWizardProps = {
  step: StudioStep;
  onStep: (step: StudioStep) => void;
  products: DesignProduct[];
  product: DesignProduct | null;
  onProduct: (product: DesignProduct) => void;
  catalogueFailed: boolean;
  requestedUnavailable: boolean;
  charms: CharmData[];
  placed: PlacedCharm[];
  counts: Record<string, number>;
  loading: boolean;
  error: string;
  selectedCharmId?: string;
  onSelect: (charm: CharmData) => void;
  onAdd: (charm: CharmData) => void;
  onRemove: (id: string) => void;
  onMove: (id: string) => void;
  onTap: (x: number, y: number) => void;
  onCancel: () => void;
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
  onSave: () => void;
  saved: boolean;
  onNew: () => void;
  pathRef: RefObject<SVGPathElement | null>;
  message: string;
  hint?: string;
  total: number;
  priced: boolean;
};

const titles = [
  "اول، محصولت را انتخاب کن.",
  "حالا به آن شخصیت بده.",
  "این هم امضای شخصی تو.",
];
const descriptions = [
  "یک شروع ساده برای چیزی که فقط شبیه توست.",
  "چارم‌ها را انتخاب کن و ترکیب دلخواهت را بساز.",
  "طرح نهایی و جزئیات قیمت را ببین؛ آمادهٔ همراه‌شدن با توست.",
];

const desktopQuery = "(min-width: 1024px)";
function subscribeDesktop(listener: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
function readDesktop() {
  return window.matchMedia(desktopQuery).matches;
}
function readServerDesktop() {
  return false;
}

export function StudioResponsive(props: StudioWizardProps) {
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    readDesktop,
    readServerDesktop,
  );
  return desktop ? <StudioDesktop {...props} /> : <StudioWizard {...props} />;
}

export function StudioWizard(props: StudioWizardProps) {
  const { step, onStep, product, placed, total, priced } = props;
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [step]);
  const ready =
    step === 1
      ? Boolean(product)
      : Boolean(product && placed.length && priced && !props.loading);
  const estimate = product ? product.price + total : null;
  const snapshot = product
    ? { id: "current", product, charms: placed, savedAt: "" }
    : null;
  const rule = product ? designRules(product) : null;
  return (
    <section
      className={styles.wizard}
      dir="rtl"
      aria-label="استودیوی طراحی وینگز"
      data-step={step}
    >
      <div className={styles.top}>
        <div className={styles.brand}>
          <Sparkles size={17} />
          <span>WINGS PERSONAL ATELIER</span>
          <span className={styles.stepLabel}>
            مرحله {step.toLocaleString("fa-IR")} از ۳
          </span>
        </div>
        <nav className={styles.steps} aria-label="مراحل طراحی">
          {["انتخاب محصول", "انتخاب چارم", "طرح نهایی"].map((label, index) => (
            <button
              type="button"
              key={label}
              aria-current={step === index + 1 ? "step" : undefined}
              disabled={index + 1 > step}
              onClick={() => onStep((index + 1) as StudioStep)}
            >
              <span>
                {index + 1 < step ? (
                  <Check size={15} />
                ) : (
                  (index + 1).toLocaleString("fa-IR")
                )}
              </span>
              <strong>{label}</strong>
            </button>
          ))}
        </nav>
        <div className={styles.titleRow}>
          <div>
            <h1 ref={titleRef} tabIndex={-1}>
              {titles[step - 1]}
            </h1>
            <p>{descriptions[step - 1]}</p>
          </div>
          <Gem className={styles.titleGem} size={36} strokeWidth={1} />
        </div>
      </div>

      <div className={styles.stage} key={step}>
        {step === 1 && (
          <>
            <p className={styles.notice} role="status">
              {props.requestedUnavailable
                ? "محصول قبلی موجود نیست؛ محصول دیگری انتخاب کن."
                : placed.length > 0
                  ? "با تغییر محصول، چیدمان چارم‌ها از نو شروع می‌شود."
                  : "انتخابت را انجام بده و «مرحله بعد» را بزن."}
            </p>
            <StudioProducts
              products={props.products}
              selected={product}
              failed={props.catalogueFailed}
              onSelect={props.onProduct}
            />
          </>
        )}
        {step === 2 && product && (
          <div className={styles.editor}>
            <section className={styles.canvasPanel} aria-label="میز طراحی">
              <div className={styles.canvasTools}>
                <div>
                  <strong>{product.name}</strong>
                  <small>{rule?.label}</small>
                </div>
                <div className={styles.tools}>
                  <button
                    type="button"
                    onClick={props.onUndo}
                    disabled={!props.canUndo}
                    aria-label="بازگردانی آخرین تغییر"
                  >
                    <Undo2 size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={props.onReset}
                    disabled={!placed.length}
                    aria-label="پاک کردن چارم‌ها"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onStep(1)}
                    className={styles.changeProduct}
                  >
                    تغییر محصول
                  </button>
                </div>
              </div>
              <div className={styles.canvas}>
                <div className={styles.chain}>
                  <Chain
                    product={product}
                    placedCharms={placed}
                    onRemove={props.onRemove}
                    onMove={props.onMove}
                    onCancelPlacement={props.onCancel}
                    onCanvasTap={props.onTap}
                    placementHint={props.hint}
                    pathRef={props.pathRef}
                  />
                </div>
              </div>
              <span className="sr-only" role="status" aria-live="polite">
                {props.hint}
              </span>
            </section>
            <aside className={styles.collection} aria-label="انتخاب چارم">
              <CharmPalette
                mobileFilters
                charms={props.charms}
                counts={props.counts}
                loading={props.loading}
                error={props.error}
                selectedCharmId={props.selectedCharmId}
                singleCharm={rule?.single}
                onSelect={props.onSelect}
                onAdd={props.onAdd}
              />
            </aside>
          </div>
        )}
        {step === 3 && product && snapshot && (
          <div className={styles.review}>
            <div className={styles.finished}>
              <div className={styles.previewHeading}>
                <span className={styles.edition}>THE PERSONAL EDITION</span>
                <span className={styles.previewBadge}>
                  <Check size={12} /> طرح نهایی تو
                </span>
              </div>
              <div
                className={styles.finishedArt}
                role="img"
                aria-label={`طرح نهایی ${product.name} با ${placed.length.toLocaleString("fa-IR")} چارم`}
              >
                <SavedDesignPreview design={snapshot} large />
              </div>
              <div className={styles.previewCaption}>
                <span className={styles.signature}>
                  <Sparkles size={14} /> ساختهٔ سلیقهٔ تو
                </span>
                <button type="button" onClick={() => onStep(2)}>
                  <Pencil size={13} /> ویرایش طرح
                </button>
              </div>
            </div>
            <div className={styles.receipt}>
              <span className={styles.receiptLabel}>
                <span /> از انتخاب تو، به امضای تو
              </span>
              <h2>{product.name}</h2>
              <p className={styles.reviewSubtitle}>
                ترکیبی که خودت انتخاب کردی؛ با تمام جزئیاتش.
              </p>
              <div className={styles.designFacts}>
                <span>
                  <Gem size={14} />
                  {rule?.label}
                </span>
                <span>
                  <Sparkles size={14} />
                  {placed.length.toLocaleString("fa-IR")} چارم انتخابی
                </span>
              </div>
              <div className={styles.charmSelectionHeading}>
                <h3>جزئیات کوچک، داستان تو</h3>
                <span>{placed.length.toLocaleString("fa-IR")} چارم</span>
              </div>
              <ul className={styles.charmCards} aria-label="چارم‌های طرح نهایی">
                {placed.map((item, index) => (
                  <li key={item.instanceId}>
                    <div className={styles.charmThumbnail}>
                      <Image
                        src={item.charm.image}
                        alt=""
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div className={styles.charmDetails}>
                      <small>
                        انتخاب {(index + 1).toLocaleString("fa-IR")}
                      </small>
                      <strong>{item.charm.name}</strong>
                    </div>
                    <button
                      type="button"
                      aria-label={`حذف ${item.charm.name}`}
                      onClick={() => {
                        props.onRemove(item.instanceId);
                        onStep(2);
                      }}
                    >
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
              <dl>
                <div>
                  <dt>محصول پایه</dt>
                  <dd>{persianNumber(product.price)} تومان</dd>
                </div>
                <div>
                  <dt>مجموع چارم‌ها</dt>
                  <dd>
                    {priced
                      ? `${persianNumber(total)} تومان`
                      : "در حال دریافت قیمت…"}
                  </dd>
                </div>
                <div className={styles.receiptTotal}>
                  <dt>
                    مجموع طرح <small>برای هر عدد</small>
                  </dt>
                  <dd>
                    {priced ? (
                      <>
                        {persianNumber(product.price + total)}{" "}
                        <small>تومان</small>
                      </>
                    ) : (
                      "قیمت در دست بررسی"
                    )}
                  </dd>
                </div>
              </dl>
              <p className={styles.priceNote}>
                هزینهٔ ارسال و تخفیف در تسویه‌حساب محاسبه می‌شود.
                {product.hasOptions
                  ? " قیمت نهایی با انتخاب مدل مشخص می‌شود."
                  : ""}
              </p>
              <div className={styles.reviewActions}>
                <button
                  type="button"
                  onClick={props.onSave}
                  disabled={props.saved}
                >
                  {props.saved ? <Check size={16} /> : <Heart size={16} />}
                  {props.saved ? "طرح ذخیره شده" : "ذخیرهٔ طرح من"}
                </button>
                <button type="button" onClick={() => onStep(2)}>
                  <Pencil size={15} /> ویرایش چیدمان
                </button>
                <button type="button" onClick={props.onNew}>
                  <Plus size={15} /> طرح جدید
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.dock}>
        <div className={styles.price}>
          <small>
            {step === 1 ? "قیمت محصول انتخابی" : "برآورد قیمت هر طرح"}
          </small>
          <strong>
            {estimate === null
              ? "—"
              : step > 1 && placed.length && !priced
                ? "در حال دریافت قیمت…"
                : persianNumber(step === 1 ? product!.price : estimate)}
            <span>
              {estimate !== null && !(step > 1 && placed.length && !priced)
                ? "تومان"
                : ""}
            </span>
          </strong>
          <small>
            {step === 2
              ? `${placed.length.toLocaleString("fa-IR")} چارم انتخاب شده`
              : (product?.name ?? "محصولی انتخاب نشده")}
          </small>
        </div>
        <div className={styles.dockActions}>
          {step > 1 && (
            <button
              type="button"
              className={styles.back}
              onClick={() => onStep((step - 1) as StudioStep)}
              aria-label="مرحله قبل"
            >
              <ArrowRight size={18} />
              <span>قبلی</span>
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              className={styles.next}
              disabled={!ready}
              onClick={() => onStep((step + 1) as StudioStep)}
            >
              {step === 1 ? "مرحله بعد" : "دیدن طرح نهایی"}
              <ArrowLeft size={19} />
            </button>
          ) : (
            product &&
            snapshot && (
              <div className={styles.checkout}>
                {ready ? (
                  <ProductPurchase product={product} design={snapshot} />
                ) : (
                  <p role="status">
                    {props.error || "در حال دریافت قیمت چارم‌ها…"}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
