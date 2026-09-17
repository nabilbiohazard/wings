"use client";
import { useState } from "react";
import { Icon } from "./icon";
import { useShop } from "./shop-provider";
const links = [{ name: "خانه", href: "#" }, { name: "فروشگاه", href: "#new-arrivals" }, { name: "خودت بساز", href: "#build-your-own" }, { name: "کالکشن‌ها", href: "#collections" }, { name: "درباره ما", href: "#our-story" }, { name: "مجله وینگز", href: "#journal" }, { name: "تماس با ما", href: "#contact" }];
export function Wordmark() {
  return <a href="#" className="wordmark" aria-label="وینگز گالری، خانه" dir="ltr"><span>WINGS</span><small>GALLERY</small></a>;
}
export function Header() {
  const [menu, setMenu] = useState(false);
  const { openPanel, favorites, cart } = useShop();
  return <>
    <div className="promo-bar"><span className="promo-side">کمی درخشش، برای هر روز تو</span><span className="flex items-center justify-center gap-3"><Icon name="sparkle" size={12} />ارسال رایگان برای سفارش‌های بالای ۱٬۰۰۰٬۰۰۰ تومان<Icon name="sparkle" size={12} /></span><span className="promo-side" dir="ltr">A little joy, every day</span></div>
    <header className="site-header"><div className="header-inner" dir="rtl">
      <Wordmark />
      <nav className="desktop-nav" aria-label="منوی اصلی" dir="rtl">{links.map((link, i) => <a key={link.name} className={i === 0 ? "active" : ""} href={link.href}>{link.name}</a>)}</nav>
      <div className="header-actions" dir="ltr">
        <button className="icon-button mobile-menu-toggle" aria-label={menu ? "بستن منو" : "باز کردن منو"} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}><Icon name={menu ? "close" : "menu"} /></button>
        <button className="icon-button" aria-label="جستجو" onClick={() => openPanel("search")}><Icon name="search" /></button>
        <button className="icon-button" aria-label={`علاقه‌مندی‌ها، ${favorites.length} محصول`} onClick={() => openPanel("wishlist")}><Icon name="heart" />{favorites.length > 0 && <span className="count">{favorites.length.toLocaleString("fa-IR")}</span>}</button>
        <button className="icon-button account-button" aria-label="حساب کاربری" onClick={() => openPanel("account")}><Icon name="user" /></button>
        <button className="icon-button" aria-label="سبد خرید" onClick={() => openPanel("cart")}><Icon name="bag" /><span className="count">{cart.reduce((sum, line) => sum + line.quantity, 0).toLocaleString("fa-IR")}</span></button>
      </div>
    </div>
    {menu && <nav id="mobile-nav" className="mobile-nav" aria-label="منوی موبایل">{links.map(link => <a key={link.name} href={link.href} onClick={() => setMenu(false)}>{link.name}<Icon name="arrow" size={17} /></a>)}</nav>}
    </header>
  </>;
}
