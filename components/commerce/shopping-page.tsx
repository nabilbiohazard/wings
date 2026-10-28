"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpLeft, Flower2, Heart, ShoppingBag } from "lucide-react";
import { HeaderBackdrop } from "../header-backdrop";
import { Wishlist } from "../wishlist";
import { useShop } from "../shop-provider";
import { removeSavedDesign, useSavedDesigns } from "@/lib/saved-designs";
import { CartView } from "./cart-view";
import styles from "./shopping-page.module.css";

export function ShoppingPage({ kind }: { kind: "cart" | "wishlist" }) {
  const { products, favorites, toggleFavorite, productsLoading, productsError, openPanel } = useShop();
  const designs = useSavedDesigns();
  const [error, setError] = useState("");
  const isCart = kind === "cart";
  const title = isCart ? "سبد کوچک شادی تو" : "دوست‌داشتنی‌های تو";
  return <main className={styles.page} dir="rtl" data-shopping-kind={kind}>
    <HeaderBackdrop />
    <div className={`site-container ${styles.container}`}>
      <nav className={styles.breadcrumb} aria-label="مسیر صفحه"><Link href="/">خانه</Link><span>/</span><span aria-current="page">{isCart ? "سبد خرید" : "علاقه‌مندی‌ها"}</span></nav>
      <header className={styles.hero}><div><p lang="en" dir="ltr">{isCart ? "YOUR LITTLE BAG OF JOY" : "THE THINGS YOU LOVE"}</p><h1>{title}<span>.</span></h1><p>{isCart ? "انتخاب‌های قشنگت اینجاست؛ چند قدم تا رسیدن یک بسته شادی." : "محصولات محبوب و طرح‌های شخصی‌ات، کنار هم در گوشه‌ای برای خودت."}</p></div><div className={styles.signature} aria-hidden="true"><Flower2 size={42} strokeWidth={.8} /><span lang="en" dir="ltr">A little more<br /><em>{isCart ? "joy." : "love."}</em></span></div></header>
      <nav className={styles.tabs} aria-label="انتخاب‌های من"><Link href="/wishlist" aria-current={!isCart ? "page" : undefined}><Heart size={17} /> علاقه‌مندی‌ها</Link><Link href="/cart" aria-current={isCart ? "page" : undefined}><ShoppingBag size={17} /> سبد خرید</Link><Link href="/shop">ادامه گشت‌وگذار <ArrowUpLeft size={16} /></Link></nav>
      <div className={styles.layout}>
        <section className={styles.panel} aria-label={title}>{isCart ? <CartView onClose={() => openPanel(null)} standalone /> : <Wishlist products={products} favorites={favorites} designs={designs} loading={productsLoading} failed={productsError} error={error} onRemoveProduct={toggleFavorite} onRemoveDesign={id => setError(removeSavedDesign(id) ? "" : "حذف طرح انجام نشد؛ دوباره تلاش کن.")} onClose={() => openPanel(null)} />}</section>
        <aside className={styles.aside}><span className={styles.icon}>{isCart ? <ShoppingBag size={26} strokeWidth={1} /> : <Heart size={26} strokeWidth={1} />}</span><p lang="en" dir="ltr">Small details.<br /><em>Big feelings.</em></p><h2>{isCart ? "با دقت انتخاب کردی." : "سلیقه تو، امضای تو."}</h2><p>{isCart ? "مبلغ نهایی و هزینه ارسال در مرحله ثبت سفارش محاسبه می‌شود. پیش از ثبت، تعداد و جزئیات انتخاب‌هایت را بررسی کن." : "با لمس قلب محصولات، آن‌ها را اینجا نگه دار. طرح‌هایی که در طراح وینگز ذخیره می‌کنی هم همین‌جا منتظرت هستند."}</p><Link href={isCart ? "/wishlist" : "/custom-design"}>{isCart ? "دیدن علاقه‌مندی‌ها" : "ساختن طرح شخصی"}<ArrowUpLeft size={16} /></Link>{!isCart && <small>انتخاب‌ها روی همین مرورگر نگهداری می‌شوند.</small>}</aside>
      </div>
    </div>
  </main>;
}
