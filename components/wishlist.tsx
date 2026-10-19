"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, Trash2, ArrowLeft, Pencil } from "lucide-react";
import type { Product } from "@/lib/types";
import type { SavedDesign } from "@/lib/saved-designs";
import { persianNumber } from "@/lib/products";
import { SavedDesignPreview } from "./custom-design/SavedDesignPreview";
import styles from "./wishlist.module.css";
import { ProductPurchase } from "./commerce/product-purchase";
import { isCustomizable } from "@/lib/design-products";

export function Wishlist({
  products,
  favorites,
  designs,
  loading,
  failed,
  error,
  onRemoveProduct,
  onRemoveDesign,
  onClose,
}: {
  products: Product[];
  favorites: number[];
  designs: SavedDesign[];
  loading: boolean;
  failed: boolean;
  error: string;
  onRemoveProduct: (id: number) => void;
  onRemoveDesign: (id: string) => void;
  onClose: () => void;
}) {
  const selected = products.filter((product) => favorites.includes(product.id));
  const count = favorites.length + designs.length;
  return (
    <div className={styles.wishlist} dir="rtl">
      <div className={styles.intro}>
        <span className={styles.introIcon}>
          <Heart size={24} strokeWidth={1.5} />
        </span>
        <div>
          <p>انتخاب‌هایی که به دلت نشسته‌اند</p>
          <h3>
            گوشه‌ای برای سلیقهٔ تو<span>.</span>
          </h3>
        </div>
        <span className={styles.count}>{persianNumber(count)} انتخاب</span>
      </div>
      {error && (
        <p role="alert" className={styles.feedback}>
          {error}
        </p>
      )}
      {designs.length > 0 && (
        <section aria-labelledby="wishlist-designs-title">
          <div className={styles.sectionHeading}>
            <h4 id="wishlist-designs-title">
              <Sparkles size={17} /> طرح‌های شخصی تو
            </h4>
            <span>{persianNumber(designs.length)} طرح</span>
          </div>
          <div className={styles.grid}>
            {designs.map((design) => {
              const href = `/custom-design?product=${design.product.id}&design=${encodeURIComponent(design.id)}`;
              const complete = design.charms.every(
                (item) => item.charm.price !== undefined,
              );
              const price =
                design.product.price +
                (complete
                  ? design.charms.reduce(
                      (sum, item) => sum + (item.charm.price ?? 0),
                      0,
                    )
                  : 0);
              return (
                <article key={design.id} className={styles.card}>
                  <div className={styles.preview}>
                    <Link
                      href={href}
                      onClick={onClose}
                      aria-label={`مشاهدهٔ طرح ${design.product.name}`}
                      className={styles.designPreview}
                    >
                      <SavedDesignPreview design={design} />
                    </Link>
                    <span className={styles.badge}>
                      <Sparkles size={12} /> ساختهٔ تو
                    </span>
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => onRemoveDesign(design.id)}
                      aria-label={`حذف طرح ${design.product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className={styles.details}>
                    <p className={styles.meta}>
                      {persianNumber(design.charms.length)} چارم · یک ترکیب شخصی
                    </p>
                    <h5>
                      <Link href={href} onClick={onClose}>
                        {design.product.name}
                      </Link>
                    </h5>
                    <div className={styles.price}>
                      <span>{complete ? "برآورد قیمت طرح" : "قیمت محصول پایه"}</span>
                      <strong>
                        {persianNumber(price)} <small>تومان</small>
                      </strong>
                    </div>
                    <Link
                      href={href}
                      onClick={onClose}
                      className={styles.action}
                    >
                      <span>
                        <Pencil size={14} /> باز کردن و ویرایش
                      </span>
                      <ArrowLeft size={16} />
                    </Link>
                    {isCustomizable(design.product) && (
                      <div className="mt-3">
                        <ProductPurchase
                          product={design.product}
                          design={design}
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
      {favorites.length > 0 && (
        <section aria-labelledby="wishlist-products-title">
          <div className={styles.sectionHeading}>
            <h4 id="wishlist-products-title">
              <Heart size={17} /> محصولات مورد علاقه
            </h4>
            <span>{persianNumber(favorites.length)} محصول</span>
          </div>
          {loading && (
            <p className={styles.feedback} role="status">
              در حال دریافت انتخاب‌های تو…
            </p>
          )}
          {failed && (
            <p className={styles.feedback} role="alert">
              دریافت محصولات انجام نشد؛ کمی بعد دوباره تلاش کن.
            </p>
          )}
          <div className={styles.grid}>
            {selected.map((product) => (
              <article key={product.id} className={styles.card}>
                <div className={styles.preview}>
                  <Link
                    href={`/shop/${product.slug}`}
                    onClick={onClose}
                    className={styles.productPreview}
                    aria-label={`مشاهده ${product.name}`}
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        sizes="(max-width: 599px) 72px, 100px"
                        className="object-contain"
                      />
                    ) : (
                      <Sparkles size={40} />
                    )}
                  </Link>
                  <span className={styles.badge}>وینگز گالری</span>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => onRemoveProduct(product.id)}
                    aria-label={`حذف ${product.name} از علاقه‌مندی‌ها`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className={styles.details}>
                  <p className={styles.meta}>
                    {product.categories?.[0]?.name ??
                      "انتخابی برای لحظه‌های تو"}
                  </p>
                  <h5>
                    <Link href={`/shop/${product.slug}`} onClick={onClose}>
                      {product.name}
                    </Link>
                  </h5>
                  <div className={styles.price}>
                    <span>
                      {product.isInStock === false ? "ناموجود" : "قیمت محصول"}
                    </span>
                    <strong>
                      {persianNumber(product.price)} <small>تومان</small>
                    </strong>
                  </div>
                  <Link
                    href={`/shop/${product.slug}`}
                    onClick={onClose}
                    className={styles.action}
                  >
                    <span>مشاهدهٔ محصول</span>
                    <ArrowLeft size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {!loading && !failed && selected.length < favorites.length && (
            <p className={styles.feedback}>
              بعضی از محصولات ذخیره‌شده دیگر در فروشگاه در دسترس نیستند.
            </p>
          )}
        </section>
      )}
      {count === 0 && (
        <div className={styles.empty}>
          <Heart size={46} strokeWidth={1} />
          <h4>جای انتخاب‌های تو خالی است</h4>
          <p>
            قلب کنار محصولات را لمس کن یا طرح شخصی‌ات را ذخیره کن تا اینجا
            پیدایش کنی.
          </p>
          <Link href="/shop" onClick={onClose} className={styles.action}>
            کشف محصولات <ArrowLeft size={16} />
          </Link>
        </div>
      )}
      {count > 0 && (
        <div className={styles.footer}>
          <p>برای انتخاب بعدی‌ات، هنوز داستان‌های زیادی داریم.</p>
          <Link href="/shop" onClick={onClose}>
            ادامهٔ گشت‌وگذار <ArrowLeft size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}
