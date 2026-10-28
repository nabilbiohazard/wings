"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeftRight,
  ArrowUpLeft,
  Check,
  Gem,
  Heart,
  MousePointer2,
  Plus,
  RotateCcw,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";
import { Chain } from "./Chain";
import { CharmPalette } from "./CharmPalette";
import { ProductPicker } from "./ProductPicker";
import { ProductPurchase } from "../commerce/product-purchase";
import { designRules } from "@/lib/design-rules";
import { persianNumber } from "@/lib/products";
import type { StudioWizardProps } from "./StudioWizard";
import styles from "./builder-studio.module.css";

export function StudioDesktop(props: StudioWizardProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const workspace = useRef<HTMLDivElement>(null);
  const { product, placed, total, priced } = props;
  const rule = product ? designRules(product) : null;
  const canSave = Boolean(product && placed.length && !props.saved);
  const snapshot = product
    ? { id: "current", product, charms: placed, savedAt: "" }
    : null;
  function openCollection() {
    if (!product) setPickerOpen(true);
    else
      workspace.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return (
    <div className={styles.studio} dir="rtl" data-desktop-studio>
      <div className="site-container">
        <header className={styles.heading}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span />
              WINGS — PERSONAL ATELIER
            </p>
            <h1>
              شبیه هیچ‌کس،
              <br />
              <span>شبیه خودت.</span>
              <Sparkles aria-hidden="true" strokeWidth={1} />
            </h1>
            <p className={styles.intro}>
              از یک زنجیر ساده تا تکه‌ای از دنیای تو.
              <br />
              چارم‌ها را کنار هم بچین؛ چیزی بساز که فقط مال توست.
            </p>
          </div>
          <div className={styles.heroNote}>
            <span className={styles.atelierStamp} aria-hidden="true">
              <Gem strokeWidth={1} />
              <span>MADE BY YOU</span>
            </span>
            <p>تو طراح این داستانی.</p>
            <span>انتخاب کن. ترکیب کن. امضای خودت را بساز.</span>
          </div>
        </header>
        <nav className={styles.journey} aria-label="راهنمای طراحی">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className={product ? styles.journeyDone : ""}
          >
            <span className={styles.stepNumber}>
              {product ? <Check size={18} /> : "۰۱"}
            </span>
            <span>
              <strong>محصولت را انتخاب کن</strong>
              <small>شروع یک داستان تازه</small>
            </span>
            <ArrowUpLeft size={18} />
          </button>
          <button
            type="button"
            onClick={openCollection}
            className={placed.length ? styles.journeyDone : ""}
          >
            <span className={styles.stepNumber}>
              {placed.length ? <Check size={18} /> : "۰۲"}
            </span>
            <span>
              <strong>حال‌وهوایش را بساز</strong>
              <small>هر چارم، یک تکه از تو</small>
            </span>
            <ArrowUpLeft size={18} />
          </button>
          <button
            type="button"
            onClick={props.onSave}
            disabled={!canSave}
            className={props.saved ? styles.journeyDone : ""}
          >
            <span className={styles.stepNumber}>
              {props.saved ? <Check size={18} /> : "۰۳"}
            </span>
            <span>
              <strong>امضایت را ذخیره کن</strong>
              <small>برای خودت یا یک آدم خاص</small>
            </span>
            <ArrowUpLeft size={18} />
          </button>
        </nav>
        {props.requestedUnavailable && !product && (
          <p role="status" className={styles.unavailableProduct}>
            این محصول دیگر موجود نیست؛ محصول دیگری برای طراحی انتخاب کن.
          </p>
        )}
        <div className={styles.workbench}>
          <div className={styles.workbenchHeading}>
            <div>
              <span className={styles.workbenchMark}>
                <Sparkles size={19} strokeWidth={1.4} />
              </span>
              <div>
                <h2>استودیوی کوچک تو</h2>
                <p>اینجا سلیقه‌ات شکل می‌گیرد.</p>
              </div>
            </div>
            <span className={styles.sessionBadge}>
              <span />
              {product ? "در حال طراحی" : "آمادهٔ اولین انتخاب"}
            </span>
          </div>
          <div className={styles.workspace} ref={workspace}>
            <section className={styles.canvasSection} aria-label="میز طراحی">
              <div className={styles.canvasToolbar}>
                <div className={styles.productIdentity}>
                  <span className={styles.productThumbnail}>
                    {product?.image ? (
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-contain"
                      />
                    ) : (
                      <Gem size={23} strokeWidth={1.2} />
                    )}
                  </span>
                  <div className={styles.productInfo}>
                    <span className={styles.productEyebrow}>
                      {rule?.label ?? "میز طراحی تو"}
                    </span>
                    <strong title={product?.name}>
                      {product?.name ?? "محصولت را انتخاب کن"}
                    </strong>
                    <span className={styles.productMeta}>
                      {product
                        ? `${persianNumber(product.price)} تومان · ${placed.length.toLocaleString("fa-IR")} چارم`
                        : "قدم اول؛ انتخاب محصول"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.changeProductButton}
                    onClick={() => setPickerOpen(true)}
                    aria-label={product ? "تغییر محصول" : "انتخاب محصول"}
                  >
                    <ArrowLeftRight size={16} />
                    <span>{product ? "تغییر محصول" : "انتخاب محصول"}</span>
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
                      onClick={props.onUndo}
                      disabled={!props.canUndo}
                      aria-label="بازگردانی آخرین تغییر"
                    >
                      <Undo2 size={18} />
                    </button>
                    <span className={styles.toolDivider} />
                    <button
                      type="button"
                      onClick={props.onReset}
                      disabled={!placed.length}
                      aria-label="شروع دوباره"
                    >
                      <RotateCcw size={17} />
                    </button>
                  </div>
                  <div className={styles.designActions}>
                    <button
                      type="button"
                      className={`${styles.toolbarSaveButton} ${props.saved ? styles.toolbarSaved : ""}`}
                      onClick={props.onSave}
                      disabled={!canSave}
                      aria-label="ذخیرهٔ طرح در علاقه‌مندی‌ها"
                    >
                      {props.saved ? <Check size={17} /> : <Heart size={17} />}
                      <span>{props.saved ? "ذخیره شد" : "ذخیرهٔ طرح من"}</span>
                    </button>
                    {props.saved && (
                      <button
                        type="button"
                        className={styles.toolbarNewButton}
                        onClick={() => {
                          props.onNew();
                          setPickerOpen(true);
                        }}
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
                  {product ? (
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
                  ) : (
                    <div className={styles.emptyCanvas}>
                      <div className={styles.inspirationImage}>
                        <Image
                          src="/images/bracelet.png"
                          alt="ایده‌ای برای دستبند شخصی"
                          fill
                          sizes="260px"
                          className="object-cover"
                        />
                        <span>
                          <Sparkles size={14} /> از اینجا الهام بگیر
                        </span>
                      </div>
                      <h2>هر ترکیب، یک دنیای تازه</h2>
                      <p>
                        اول محصولت را انتخاب کن؛ بعد با چارم‌ها به آن حال‌وهوای
                        خودت را بده.
                      </p>
                      <button type="button" onClick={() => setPickerOpen(true)}>
                        شروع طراحی من <ArrowUpLeft size={18} />
                      </button>
                      <span className={styles.emptyCanvasHint}>
                        انتخاب محصول ← افزودن چارم ← تنظیم جای چارم‌ها
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.canvasStatus}>
                <MousePointer2 size={16} />
                <p role="status" aria-live="polite">
                  {props.hint ||
                    props.message ||
                    (rule?.single
                      ? "یک چارم انتخاب کن؛ انتخاب بعدی جایگزین قبلی می‌شود."
                      : product
                        ? "چارم را انتخاب کن یا روی محصول بکش."
                        : "برای شروع، یک محصول انتخاب کن.")}
                </p>
                {props.hint ? (
                  <button type="button" onClick={props.onCancel}>
                    لغو انتخاب
                  </button>
                ) : props.canUndo ? (
                  <button type="button" onClick={props.onUndo}>
                    بازگردانی
                  </button>
                ) : null}
              </div>
            </section>
            <aside className={styles.paletteSection} aria-label="انتخاب چارم">
              <CharmPalette
                charms={props.charms}
                counts={props.counts}
                loading={props.loading}
                error={props.error}
                selectedCharmId={props.selectedCharmId}
                singleCharm={rule?.single}
                onSelect={(charm) =>
                  product ? props.onSelect(charm) : setPickerOpen(true)
                }
                onAdd={(charm) =>
                  product ? props.onAdd(charm) : setPickerOpen(true)
                }
              />
            </aside>
          </div>
        </div>
        <section className={styles.summary} aria-label="چارم‌های انتخاب‌شده">
          <div className={styles.designReceipt}>
            <div>
              <span className={styles.receiptIcon}>
                <Gem size={23} strokeWidth={1.3} />
              </span>
              <div>
                <small>YOUR PERSONAL EDITION</small>
                <h2>جزئیات یک طرح منحصر‌به‌تو</h2>
              </div>
            </div>
            <div className={styles.receiptStats}>
              <span>
                <small>چارم‌های تو</small>
                <strong>
                  {placed.length.toLocaleString("fa-IR")} <small>انتخاب</small>
                </strong>
              </span>
              <span>
                <small>قیمت محصول پایه</small>
                <strong>
                  {product ? persianNumber(product.price) : "—"}{" "}
                  <small>{product ? "تومان" : ""}</small>
                </strong>
              </span>
            </div>
          </div>
          {product && snapshot && placed.length > 0 && (
            <div
              className={`${styles.purchasePanel} mb-6 rounded-2xl border border-[#e7dadd] bg-[#fffafb] p-4`}
            >
              <h2 className="mb-4">همین طرح را سفارش بده</h2>
              <ProductPurchase
                key={product.id}
                product={product}
                design={snapshot}
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
            {priced && <span>{persianNumber(total)} تومان</span>}
          </div>
          {placed.length ? (
            <ul className={styles.selectedList}>
              {placed.map((item, index) => (
                <li key={item.instanceId}>
                  <button
                    type="button"
                    onClick={() => props.onMove(item.instanceId)}
                    aria-label={`جابه‌جایی ${item.charm.name}`}
                  >
                    <span>{(index + 1).toLocaleString("fa-IR")}</span>
                    {item.charm.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => props.onRemove(item.instanceId)}
                    aria-label={`حذف ${item.charm.name}`}
                  >
                    <X size={15} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptySummary}>
              {product
                ? "هنوز چارمی اضافه نکرده‌ای؛ اولین انتخاب را شروع کن."
                : "بعد از انتخاب محصول، چارم‌های طرح تو اینجا نمایش داده می‌شوند."}
            </p>
          )}
        </section>
      </div>
      {pickerOpen && (
        <ProductPicker
          products={props.products}
          selectedId={product?.id}
          hasDesign={placed.length > 0}
          failed={props.catalogueFailed}
          onSelect={(next) => {
            props.onProduct(next);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
