"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { categories, products, persianNumber, type Category, type Product } from "@/lib/products";
import { Icon } from "./icon";

type Panel = "search" | "wishlist" | "cart" | "account" | "product" | null;
type CartLine = { id: string; quantity: number };
type ShopContextValue = {
  category: Category; setCategory: (category: Category) => void;
  favorites: string[]; toggleFavorite: (id: string) => void;
  cart: CartLine[]; openPanel: (panel: Panel) => void; viewProduct: (product: Product) => void;
};
const ShopContext = createContext<ShopContextValue | null>(null);
export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside ShopProvider");
  return value;
}
function MiniProduct({ product, children: actions }: { product: Product; children?: React.ReactNode }) {
  const { viewProduct } = useShop();
  return <div className="mini-product"><button onClick={() => viewProduct(product)} aria-label={`مشاهده ${product.name}`}><Image src={product.image} alt={product.name} width={86} height={86} /></button><div><button onClick={() => viewProduct(product)} className="mini-product-name">{product.name}</button><p>{persianNumber(product.price)} تومان</p>{actions}</div></div>;
}
export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [category, setCategory] = useState<Category>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [panel, setPanel] = useState<Panel>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleFavorite = (id: string) => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const viewProduct = (product: Product) => { setSelected(product); setPanel("product"); };
  const changeQuantity = (id: string, amount: number) => setCart(current => current.map(line => line.id === id ? { ...line, quantity: line.quantity + amount } : line).filter(line => line.quantity > 0));
  const addToCart = (id: string) => {
    setCart(current => current.some(line => line.id === id) ? current.map(line => line.id === id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { id, quantity: 1 }]);
    setPanel("cart");
  };
  useEffect(() => {
    const dialog = dialogRef.current;
    if (panel && dialog && !dialog.open) dialog.showModal();
    if (!panel && dialog?.open) dialog.close();
    if (!panel) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [panel]);
  const normalize = (text: string) => text.toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/\u200c/g, " ").trim();
  const searchResults = products.filter(product => normalize(`${product.name} ${product.english} ${categories.find(item => item.id === product.category)?.name}`).includes(normalize(query)));
  const titles: Record<Exclude<Panel, null>, string> = { search: "دنبال کدام تکه شادی می‌گردی؟", wishlist: "دوست‌داشتنی‌های تو", cart: "سبد کوچک شادی تو", account: "به دنیای وینگز خوش آمدی", product: selected?.name ?? "جزئیات محصول" };
  return <ShopContext.Provider value={{ category, setCategory, favorites, toggleFavorite, cart, openPanel: setPanel, viewProduct }}>
    {children}
    <dialog ref={dialogRef} className={`shop-dialog ${panel === "product" ? "product-dialog" : ""}`} aria-labelledby="dialog-title" onCancel={() => setPanel(null)} onClose={() => setPanel(null)} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setPanel(null); } }}>
      <div className="dialog-header"><h2 id="dialog-title">{panel ? titles[panel] : "وینگز گالری"}</h2><button onClick={() => setPanel(null)} className="icon-button" aria-label="بستن پنجره"><Icon name="close" /></button></div>
      {panel === "search" && <><label htmlFor="product-search" className="sr-only">جستجوی محصولات</label><div className="search-input"><Icon name="search" /><input id="product-search" type="search" placeholder="گردنبند، پروانه، گیلاس…" value={query} onChange={event => setQuery(event.target.value)} /></div><p className="dialog-subtitle">{query ? `${persianNumber(searchResults.length)} محصول پیدا شد` : "شاید این‌ها همان چیزی باشند که دنبالش هستی"}</p><div aria-live="polite">{searchResults.length ? searchResults.map(product => <MiniProduct key={product.id} product={product} />) : <div className="empty-state"><Icon name="search" size={36} /><p>چیزی با این نام پیدا نکردیم.</p><button className="text-link" onClick={() => setQuery("")}>دیدن همه محصولات<Icon name="arrow" size={16} /></button></div>}</div></>}
      {panel === "wishlist" && (favorites.length ? products.filter(product => favorites.includes(product.id)).map(product => <MiniProduct key={product.id} product={product}><button className="small-text-button" onClick={() => toggleFavorite(product.id)}>حذف از علاقه‌مندی‌ها</button></MiniProduct>) : <div className="empty-state"><Icon name="heart" size={42} /><h3>جای دوست‌داشتنی‌هایت اینجاست</h3><p>قلب کنار هر محصول را لمس کن تا اینجا پیدایش کنی.</p><button className="button-primary" onClick={() => setPanel(null)}>ادامه گشت‌وگذار<Icon name="arrow" size={17} /></button></div>)}
      {panel === "cart" && (cart.length ? <><div aria-live="polite">{cart.map(line => { const product = products.find(item => item.id === line.id)!; return <MiniProduct key={line.id} product={product}><div className="quantity-control"><button aria-label={`افزایش تعداد ${product.name}`} onClick={() => changeQuantity(line.id, 1)}><Icon name="plus" size={14} /></button><span>{persianNumber(line.quantity)}</span><button aria-label={`کاهش تعداد ${product.name}`} onClick={() => changeQuantity(line.id, -1)}><Icon name="minus" size={14} /></button></div></MiniProduct>; })}</div><div className="cart-total"><span>جمع سبد خرید</span><strong>{persianNumber(cart.reduce((sum, line) => sum + products.find(product => product.id === line.id)!.price * line.quantity, 0))} تومان</strong></div><p className="demo-notice">این سبد خرید نمایشی است. ثبت سفارش و پرداخت هنوز فعال نیست و انتخاب‌ها تا زمانی که صفحه باز است نگهداری می‌شوند.</p><button className="button-primary w-full" onClick={() => setPanel(null)}>ادامه خرید<Icon name="arrow" size={17} /></button></> : <div className="empty-state"><Icon name="bag" size={42} /><h3>هنوز چیزی به سبدت اضافه نکردی</h3><p>یک تکه کوچک شادی منتظر توست.</p><button className="button-primary" onClick={() => { setPanel(null); document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" }); }}>کشف تازه‌رسیده‌ها<Icon name="arrow" size={17} /></button></div>)}
      {panel === "account" && <div className="empty-state"><Icon name="user" size={42} /><h3>جایی برای داستان تو</h3><p>ورود و پیگیری سفارش‌ها با راه‌اندازی فروشگاه فعال می‌شود. فعلاً می‌توانی محصولات را ببینی و لیست دوست‌داشتنی‌هایت را بسازی.</p><button className="button-primary" onClick={() => setPanel("wishlist")}>دیدن علاقه‌مندی‌ها<Icon name="heart" size={17} /></button></div>}
      {panel === "product" && selected && <div className="product-detail"><Image src={selected.image} alt={selected.name} width={500} height={500} sizes="(max-width: 700px) 85vw, 350px" /><div><p className="eyebrow">یک تکه شادی از وینگز</p><p className="detail-english" lang="en" dir="ltr">{selected.english}</p><p className="detail-description">{selected.description}</p><p className="detail-price">{persianNumber(selected.price)} <small>تومان</small></p><button className="button-primary w-full" onClick={() => addToCart(selected.id)}>افزودن به سبد خرید<Icon name="bag" size={18} /></button><button className="detail-favorite text-link" aria-pressed={favorites.includes(selected.id)} onClick={() => toggleFavorite(selected.id)}><Icon name={favorites.includes(selected.id) ? "check" : "heart"} size={18} />{favorites.includes(selected.id) ? "در لیست دوست‌داشتنی‌ها" : "افزودن به دوست‌داشتنی‌ها"}</button><p className="detail-demo">محصول و مشخصات نمونه برای نمایش طراحی فروشگاه</p></div></div>}
    </dialog>
  </ShopContext.Provider>;
}
