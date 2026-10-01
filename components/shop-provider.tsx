"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { categories, persianNumber } from "@/lib/products";
import type { Category, Product } from "@/lib/types";
import { Icon } from "./icon";

type Panel = "search" | "wishlist" | "cart" | "account" | "product" | null;

type CartLine = {
  id: number;
  quantity: number;
};

type ShopContextValue = {
  category: Category;
  setCategory: (category: Category) => void;

  favorites: number[];
  toggleFavorite: (id: number) => void;

  cart: CartLine[];

  products: Product[];
  productsLoading: boolean;
  productsError: boolean;

  openPanel: (panel: Panel) => void;

  viewProduct: (product: Product) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }

  return context;
}

function MiniProduct({
  product,
  children,
}: {
  product: Product;
  children?: React.ReactNode;
}) {
  const { viewProduct } = useShop();

  return (
    <div className="flex items-center gap-4 border-b border-black/10 py-4">
      <button
        onClick={() => viewProduct(product)}
        aria-label={`مشاهده ${product.name}`}
        className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-xl"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="86px"
          className="object-cover"
        />
      </button>

      <div className="flex flex-1 flex-col gap-2 text-right">
        <button
          onClick={() => viewProduct(product)}
          className="text-right text-sm font-medium transition hover:opacity-60"
        >
          {product.name}
        </button>

        <p className="text-sm text-black/60">
          {persianNumber(product.price)} تومان
        </p>

        {children}
      </div>
    </div>
  );
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [category, setCategory] = useState<Category>("all");

  const [favorites, setFavorites] = useState<number[]>([]);

  const [cart, setCart] = useState<CartLine[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  const [panel, setPanel] = useState<Panel>(null);

  const [selected, setSelected] = useState<Product | null>(null);

  const [query, setQuery] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const viewProduct = (product: Product) => {
    setSelected(product);

    setPanel("product");
  };

  const changeQuantity = (id: number, amount: number) => {
    setCart((current) =>
      current
        .map((line) =>
          line.id === id
            ? {
                ...line,
                quantity: line.quantity + amount,
              }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const addToCart = (id: number) => {
    setCart((current) => {
      const exists = current.some((line) => line.id === id);

      if (exists) {
        return current.map((line) =>
          line.id === id
            ? {
                ...line,
                quantity: line.quantity + 1,
              }
            : line,
        );
      }

      return [
        ...current,
        {
          id,
          quantity: 1,
        },
      ];
    });

    setPanel("cart");
  };

  useEffect(() => {
    fetch("/api/woo/products")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load products");
        return response.json();
      })
      .then((data) => {
        if (data.success === false || !Array.isArray(data.products)) {
          throw new Error("Invalid product response");
        }
        setProducts(data.products);
      })
      .catch(() => {
        setProducts([]);
        setProductsError(true);
      })
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (panel && dialog && !dialog.open) {
      dialog.showModal();
    }

    if (!panel && dialog?.open) {
      dialog.close();
    }

    const previousOverflow = document.body.style.overflow;

    if (panel) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [panel]);

  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ي/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/\u200c/g, " ")
      .trim();
  };

  const searchResults = products.filter((product) => {
    const categoryName = categories.find(
      (item) => item.id === product.category,
    )?.name;

    const searchable = `${product.name}
        ${product.english}
        ${categoryName}`;

    return normalize(searchable).includes(normalize(query));
  });

  const titles: Record<Exclude<Panel, null>, string> = {
    search: "دنبال کدام تکه شادی می‌گردی؟",

    wishlist: "دوست‌داشتنی‌های تو",

    cart: "سبد کوچک شادی تو",

    account: "به دنیای وینگز خوش آمدی",

    product: selected?.name ?? "جزئیات محصول",
  };

  const contextValue: ShopContextValue = {
    category,

    setCategory,

    favorites,

    toggleFavorite,

    cart,

    products,
    productsLoading,
    productsError,

    openPanel: setPanel,

    viewProduct,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}

      <dialog
        ref={dialogRef}
        className={`fixed inset-0 m-auto w-[90%] max-w-xl rounded-3xl bg-white p-6 text-black shadow-2xl backdrop:bg-black/40 ${
          panel === "product" ? "max-w-4xl" : ""
        } `}
        aria-labelledby="dialog-title"
        onCancel={() => setPanel(null)}
        onClose={() => setPanel(null)}
      >
        <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-5">
          <h2 id="dialog-title" className="text-lg font-medium">
            {panel ? titles[panel] : "وینگز گالری"}
          </h2>

          <button
            onClick={() => setPanel(null)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
            aria-label="بستن پنجره"
          >
            <Icon name="close" />
          </button>
        </div>

        {panel === "search" && (
          <div>
            <label htmlFor="product-search" className="sr-only">
              جستجوی محصولات
            </label>

            <div className="flex items-center gap-3 border-b border-black/20 pb-3">
              <Icon name="search" size={20} />

              <input
                id="product-search"
                type="search"
                placeholder="گردنبند، پروانه، گیلاس…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="flex-1 bg-transparent text-right outline-none"
              />
            </div>

            <p className="my-5 text-sm text-black/50">
              {query
                ? `${persianNumber(searchResults.length)} محصول پیدا شد`
                : "شاید این‌ها همان چیزی باشند که دنبالش هستی"}
            </p>

            <div aria-live="polite">
              {searchResults.length ? (
                searchResults.map((product) => (
                  <MiniProduct key={product.id} product={product} />
                ))
              ) : (
                <div className="flex flex-col items-center gap-5 py-12 text-center">
                  <Icon name="search" size={36} />

                  <p>چیزی با این نام پیدا نکردیم.</p>

                  <button
                    className="flex items-center gap-2 text-sm transition hover:opacity-60"
                    onClick={() => setQuery("")}
                  >
                    دیدن همه محصولات
                    <Icon name="arrow" size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {panel === "wishlist" &&
          (favorites.length ? (
            <div>
              {products
                .filter((product) => favorites.includes(product.id))
                .map((product) => (
                  <MiniProduct key={product.id} product={product}>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="mt-2 text-xs text-black/60 transition hover:text-black"
                    >
                      حذف از علاقه‌مندی‌ها
                    </button>
                  </MiniProduct>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 py-12 text-center">
              <Icon name="heart" size={42} />

              <h3 className="text-lg font-medium">
                جای دوست‌داشتنی‌هایت اینجاست
              </h3>

              <p className="text-sm text-black/60">
                قلب کنار هر محصول را لمس کن تا اینجا پیدایش کنی.
              </p>

              <button
                className="rounded-full bg-black px-7 py-3 text-sm text-white"
                onClick={() => setPanel(null)}
              >
                ادامه گشت‌وگذار
                <Icon name="arrow" size={17} />
              </button>
            </div>
          ))}

        {panel === "cart" &&
          (cart.length ? (
            <div>
              {cart.map((line) => {
                const product = products.find((item) => item.id === line.id)!;

                return (
                  <MiniProduct key={line.id} product={product}>
                    <div className="mt-3 flex items-center gap-4">
                      <button
                        onClick={() => changeQuantity(line.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border"
                      >
                        <Icon name="plus" size={14} />
                      </button>

                      <span>{persianNumber(line.quantity)}</span>

                      <button
                        onClick={() => changeQuantity(line.id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border"
                      >
                        <Icon name="minus" size={14} />
                      </button>
                    </div>
                  </MiniProduct>
                );
              })}

              <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5">
                <span>جمع سبد خرید</span>

                <strong>
                  {persianNumber(
                    cart.reduce((sum, line) => {
                      const product = products.find(
                        (item) => item.id === line.id,
                      );

                      return sum + (product?.price ?? 0) * line.quantity;
                    }, 0),
                  )}{" "}
                  تومان
                </strong>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 py-12 text-center">
              <Icon name="bag" size={42} />

              <h3>هنوز چیزی به سبدت اضافه نکردی</h3>

              <button
                className="rounded-full bg-black px-7 py-3 text-white"
                onClick={() => {
                  setPanel(null);

                  document.getElementById("new-arrivals")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                کشف تازه‌رسیده‌ها
              </button>
            </div>
          ))}

        {panel === "account" && (
          <div className="flex flex-col items-center gap-5 py-12 text-center">
            <Icon name="user" size={42} />

            <h3 className="text-lg font-medium">جایی برای داستان تو</h3>

            <p className="text-sm leading-7 text-black/60">
              ورود و پیگیری سفارش‌ها با راه‌اندازی فروشگاه فعال می‌شود.
            </p>

            <button
              onClick={() => setPanel("wishlist")}
              className="rounded-full bg-black px-7 py-3 text-white"
            >
              دیدن علاقه‌مندی‌ها
            </button>
          </div>
        )}

        {panel === "product" && selected && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-right">
              <p className="text-sm text-black/50">یک تکه شادی از وینگز</p>

              <p lang="en" dir="ltr" className="mt-3 text-sm text-black/50">
                {selected.english}
              </p>

              <p className="mt-5 leading-8">{selected.description}</p>

              <p className="mt-5 text-xl font-medium">
                {persianNumber(selected.price)} <small>تومان</small>
              </p>

              <button
                onClick={() => addToCart(selected.id)}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-black py-4 text-white"
              >
                افزودن به سبد خرید
                <Icon name="bag" size={18} />
              </button>

              <button
                onClick={() => toggleFavorite(selected.id)}
                className="mt-4 flex w-full items-center justify-center gap-3 py-3"
              >
                <Icon
                  name={favorites.includes(selected.id) ? "check" : "heart"}
                  size={18}
                />

                {favorites.includes(selected.id)
                  ? "در لیست دوست‌داشتنی‌ها"
                  : "افزودن به دوست‌داشتنی‌ها"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ShopContext.Provider>
  );
}
