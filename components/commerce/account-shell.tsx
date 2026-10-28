"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HeaderBackdrop } from "@/components/header-backdrop";
import { useCommerce } from "./provider";
import { useShop } from "../shop-provider";
import { LoginForm } from "./login-form";
import { ArrowUpLeft, ChevronLeft, Flower2, Gem, Heart, LayoutDashboard, LogOut, MapPin, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import styles from "./account.module.css";

const links = [
  {href:"/account",label:"داشبورد و سفارش‌ها",icon:LayoutDashboard},
  {href:"/account/addresses",label:"آدرس‌های من",icon:MapPin},
  {href:"/account/profile",label:"اطلاعات حساب",icon:UserRound},
];

export function AccountShell({children}: {children:React.ReactNode}) {
  const {customer,loading,error,logout}=useCommerce();
  const {openPanel}=useShop();
  const pathname=usePathname();
  const [failure,setFailure]=useState("");
  const [loggingOut,setLoggingOut]=useState(false);
  const current = pathname === "/account/profile" ? "اطلاعات حساب" : pathname === "/account/addresses" ? "آدرس‌های من" : pathname.startsWith("/account/orders/") ? "جزئیات سفارش" : "داشبورد من";
  return <main className={styles.page} dir="rtl"><HeaderBackdrop /><div className={`site-container ${styles.container}`}>
    <nav className={styles.breadcrumb} aria-label="مسیر صفحه"><Link href="/">خانه</Link><span>/</span><span aria-current="page">{customer ? current : "حساب کاربری"}</span></nav>
    {error && <p className="commerce-error mt-5" role="alert">{error}</p>}
    {loading ? <div className={styles.loading} role="status"><Gem size={30} strokeWidth={1} /><p>در حال دریافت حساب…</p></div> : !customer ? <section className={styles.loginLayout} aria-label="ورود به دنیای شخصی وینگز"><div className={styles.loginStory}><p className={styles.eyebrow} lang="en" dir="ltr">YOUR LITTLE WINGS WORLD</p><h1>یک گوشهٔ کوچک،<br /><span>فقط برای خودت.</span></h1><p>سفارش‌هایت، انتخاب‌های دوست‌داشتنی و طرح‌هایی که خودت ساخته‌ای؛ همه کنار هم در دنیای شخصی تو.</p><div className={styles.loginImage}><Image src="/images/contact-hero.jpg" alt="هدیهٔ وینگز با گل‌ها و یادداشت شخصی" fill preload sizes="(max-width:767px) 100vw, 50vw" className="object-cover" /><span lang="en">A little more you.</span></div></div><div className={styles.loginCard}><div className={styles.loginMark}><Flower2 size={35} strokeWidth={1} /><span lang="en">WELCOME TO WINGS</span></div><LoginForm /><p className={styles.loginNote}><ShieldCheck size={15} /> ورود با کد یک‌بارمصرف، بدون نیاز به رمز عبور</p><Link href="/shop" className={styles.loginBack}>فعلاً انتخاب‌های وینگز را ببین <ArrowUpLeft size={15} /></Link></div></section> : <>
      <header className={styles.welcome}><div><p className={styles.eyebrow} lang="en" dir="ltr">YOUR PERSONAL WINGS SPACE</p><h1>{pathname === "/account" ? <>{customer.first_name ? `${customer.first_name} جان،` : "همراه وینگز،"} <span>خوش آمدی.</span></> : current}</h1><p>اینجا، داستان انتخاب‌های تو ادامه دارد.</p></div><div className={styles.welcomeArt} aria-hidden="true"><Flower2 size={41} strokeWidth={.8} /><span lang="en">A little space,<br /><em>all yours.</em></span></div></header>
      <div className={styles.layout}><aside className={styles.sidebar}><div className={styles.identity}><span className={styles.avatar} aria-hidden="true">{customer.first_name?.[0] || <UserRound size={25} strokeWidth={1.2} />}</span><div><strong>{[customer.first_name,customer.last_name].filter(Boolean).join(" ") || "همراه وینگز"}</strong><span dir="ltr">{customer.phone}</span><small><ShieldCheck size={11} /> شماره تأیید شده</small></div></div><nav className={styles.navigation} aria-label="حساب کاربری">{links.map(item=><Link key={item.href} href={item.href} aria-current={pathname===item.href || (item.href==="/account" && pathname.startsWith("/account/orders/")) ? "page" : undefined}><item.icon size={17} strokeWidth={1.4} /><span>{item.label}</span><ChevronLeft size={13} /></Link>)}<button type="button" onClick={()=>openPanel("wishlist")}><Heart size={17} strokeWidth={1.4} /><span>علاقه‌مندی‌ها و طرح‌ها</span><ChevronLeft size={13} /></button></nav><div className={styles.sidebarNote}><Sparkles size={20} strokeWidth={1.2} /><p>انتخاب بعدی،<br />با امضای خودت.</p><Link href="/custom-design">خودت بساز <ArrowUpLeft size={15} /></Link></div><button type="button" className={styles.logout} disabled={loggingOut} onClick={async()=>{setFailure("");setLoggingOut(true);try{await logout();}catch(reason){setFailure(reason instanceof Error ? reason.message : "خروج انجام نشد؛ دوباره تلاش کن.");}finally{setLoggingOut(false);}}}><LogOut size={16} strokeWidth={1.4} />{loggingOut ? "در حال خروج…" : "خروج از حساب"}</button>{failure && <p className="commerce-error mt-3" role="alert">{failure}</p>}</aside><div className={styles.content}>{children}</div></div>
    </>}
  </div></main>;
}
