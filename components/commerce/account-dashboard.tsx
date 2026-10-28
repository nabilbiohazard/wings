"use client";

import Link from "next/link";
import { ArrowUpLeft, Heart, MapPin, Sparkles, UserRound } from "lucide-react";
import { OrderList } from "./orders";
import { useSavedDesigns } from "@/lib/saved-designs";
import { useShop } from "../shop-provider";
import { SavedDesignPreview } from "../custom-design/SavedDesignPreview";
import styles from "./account.module.css";

export function AccountDashboard() {
  const designs=useSavedDesigns();
  const {openPanel}=useShop();
  return <>
    <OrderList overview />
    <div className={styles.shortcuts}><Link href="/account/addresses"><span><MapPin size={21} strokeWidth={1.3} /></span><div><h2>آدرس‌های من</h2><p>مقصد بعدیِ انتخاب‌های تو</p></div><ArrowUpLeft size={18} /></Link><Link href="/account/profile"><span><UserRound size={21} strokeWidth={1.3} /></span><div><h2>اطلاعات حساب</h2><p>جزئیاتی برای آشنایی بیشتر</p></div><ArrowUpLeft size={18} /></Link></div>
    <section className={styles.designs} aria-labelledby="saved-designs-title"><div className={styles.panelHeading}><div><p className={styles.eyebrow} lang="en" dir="ltr">CREATED BY YOU</p><h2 id="saved-designs-title">طرح‌هایی با امضای تو</h2></div>{designs.length > 0 && <button type="button" onClick={()=>openPanel("wishlist")}>همهٔ طرح‌ها <ArrowUpLeft size={16} /></button>}</div>{designs.length ? <div className={styles.designGrid}>{designs.slice(0,2).map(design=><Link key={design.id} href={`/custom-design?product=${design.product.id}&design=${encodeURIComponent(design.id)}`}><div className={styles.designPreview}><SavedDesignPreview design={design} /></div><div><h3>{design.product.name}</h3><p>{design.charms.length.toLocaleString("fa-IR")} چارم انتخابی</p><span>ادامهٔ طراحی <ArrowUpLeft size={15} /></span></div></Link>)}</div> : <div className={styles.designEmpty}><span><Heart size={27} strokeWidth={1.2} /></span><div><h3>اولین داستانت را بساز.</h3><p>با چارم‌های محبوبت یک طرح بساز و برای روزهای بعد ذخیره‌اش کن.</p></div><Link href="/custom-design">شروع طراحی <ArrowUpLeft size={16} /></Link></div>}</section>
    <div className={styles.helpNote}><Sparkles size={17} strokeWidth={1.2} /><p>برای پیگیری سفارش یا انتخاب یک قطعه، کنارت هستیم.</p><Link href="/contact">گفت‌وگو با وینگز <ArrowUpLeft size={15} /></Link></div>
  </>;
}
