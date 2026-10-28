"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSavedDesigns, removeSavedDesign } from "@/lib/saved-designs";
import { Wishlist } from "./wishlist";
import { categories, persianNumber } from "@/lib/products";
import type { Category, Product } from "@/lib/types";
import { Icon } from "./icon";
import { useCommerce } from "./commerce/provider";
import { LoginForm } from "./commerce/login-form";
import { CartView } from "./commerce/cart-view";
import { ProductPurchase } from "./commerce/product-purchase";
import type { CartItem } from "@/lib/commerce-types";

type Panel = "search" | "wishlist" | "cart" | "account" | "product" | null;

type CartLine = CartItem;

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
          className="object-contain object-center"
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
  const router = useRouter();
  const savedDesigns = useSavedDesigns();
  const [savedDesignError, setSavedDesignError] = useState("");
  const [category, setCategory] = useState<Category>("all");

  const [favorites, setFavorites] = useState<number[]>([]);

  const { cart } = useCommerce();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  const [panel, setPanel] = useState<Panel>(null);

  const [selected, setSelected] = useState<Product | null>(null);

  const [query, setQuery] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved: unknown = JSON.parse(localStorage.getItem("wings-favorites-v1") || "[]");
        if (Array.isArray(saved)) setFavorites(saved.filter((id): id is number => Number.isSafeInteger(id) && id > 0));
      } catch { /* Favorites remain usable without browser storage. */ }
    });
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try { localStorage.setItem("wings-favorites-v1", JSON.stringify(next)); } catch { /* In-memory favorites remain usable. */ }
      return next;
    });
  };

  const viewProduct = (product: Product) => {
    setSelected(product);

    setPanel("product");
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

    openPanel: (next) => {
      if (next === "cart" || next === "wishlist") {
        setPanel(null);
        router.push(next === "cart" ? "/cart" : "/wishlist");
      } else setPanel(next);
    },

    viewProduct,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}

      <dialog
        ref={dialogRef}
        className={`fixed inset-0 m-auto w-[90%] max-h-[90dvh] overflow-y-auto rounded-3xl bg-white p-4 sm:p-6 text-black shadow-2xl backdrop:bg-black/40 ${
          panel === "wishlist"
            ? "max-w-[640px]"
            : panel === "product"
              ? "max-w-4xl"
              : "max-w-xl"
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

        {panel === "wishlist" && (
          <Wishlist
            products={products}
            favorites={favorites}
            designs={savedDesigns}
            loading={productsLoading}
            failed={productsError}
            error={savedDesignError}
            onRemoveProduct={toggleFavorite}
            onRemoveDesign={(id) => {
              setSavedDesignError(
                removeSavedDesign(id)
                  ? ""
                  : "حذف طرح انجام نشد؛ دوباره تلاش کن.",
              );
            }}
            onClose={() => setPanel(null)}
          />
        )}

        {panel === "cart" && <CartView onClose={() => setPanel(null)} />}

        {panel === "account" && <LoginForm onSuccess={() => setPanel(null)} />}

        {panel === "product" && selected && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-contain object-center"
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

              <div className="mt-6">
                <ProductPurchase key={selected.id} product={selected} />
              </div>

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
