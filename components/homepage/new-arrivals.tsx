"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Mousewheel, Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./new-arrivals.module.css";

import { persianNumber } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ProductCard, ProductPreviewCard } from "../product-card";
import { Icon } from "../icon";
import { Reveal } from "../reveal";
import { useShop } from "../shop-provider";

const filters = [
  { id: "all", name: "همه", matches: [] },
  {
    id: "necklace",
    name: "گردنبند",
    matches: ["necklace", "necklaces", "گردنبند"],
  },
  {
    id: "bracelet",
    name: "دستبند",
    matches: ["bracelet", "bracelets", "دستبند"],
  },
  {
    id: "charms",
    name: "انگشتر و چارم",
    matches: [
      "charms",
      "charm",
      "rings",
      "ring",
      "چارم",
      "چارم‌ها",
      "انگشتر",
      "انگشتر و چارم",
    ],
  },
] as const;

// Layout previews fill empty slots until the catalog has seven real products.
// They have no prices, product links, or shopping actions.
const previewNames = {
  all: [
    "گردنبند پروانه",
    "دستبند مروارید",
    "چارم قلب",
    "انگشتر شکوفه",
    "گردنبند ماه",
    "دستبند زنجیری",
    "چارم ستاره",
  ],
  necklace: [
    "گردنبند پروانه",
    "گردنبند ماه",
    "گردنبند قلب",
    "گردنبند مروارید",
    "گردنبند گل",
    "گردنبند ستاره",
    "گردنبند زنجیری",
  ],
  bracelet: [
    "دستبند مروارید",
    "دستبند قلب",
    "دستبند زنجیری",
    "دستبند گل",
    "دستبند ستاره",
    "دستبند پروانه",
    "دستبند رنگی",
  ],
  charms: [
    "چارم قلب",
    "انگشتر شکوفه",
    "چارم ستاره",
    "چارم پروانه",
    "انگشتر ماه",
    "چارم گیلاس",
    "چارم گل",
  ],
};

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function normalizeCategory(value: string) {
  try {
    value = decodeURIComponent(value);
  } catch {
    // Preserve catalog slugs containing literal percent signs.
  }
  return value
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\s\u200c_-]+/g, "")
    .trim();
}

function matchesCategory(product: Product, filter: (typeof filters)[number]) {
  if (filter.id === "all") return true;
  const names = [
    product.category,
    ...(product.categories ?? []).flatMap(({ slug, name }) => [slug, name]),
  ].map(normalizeCategory);
  return filter.matches.some((name) => names.includes(normalizeCategory(name)));
}

export function NewArrivals() {
  const { category, setCategory, products, productsLoading, productsError } =
    useShop();
  const slider = useRef<SwiperInstance | null>(null);
  // Keep SSR and the first hydration render identical before reading slider edges.
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot,
  );
  const [edges, setEdges] = useState({ beginning: true, end: true });
  const activeFilter =
    filters.find((filter) => filter.id === category) ?? filters[0];
  const selectedProducts = products
    .filter((product) => matchesCategory(product, activeFilter))
    .slice(0, 7);
  const previews = previewNames[activeFilter.id].slice(selectedProducts.length);

  function updateNavigation(instance: SwiperInstance) {
    setEdges({
      beginning: instance.isBeginning,
      end: instance.isEnd || instance.isLocked,
    });
  }

  return (
    <section
      id="new-arrivals"
      dir="rtl"
      className={`${styles.section} w-full scroll-mt-28 py-16 sm:py-20 lg:py-24`}
      aria-labelledby="arrivals-heading"
    >
      <div className={`mx-auto w-full site-container ${styles.container}`}>
        <Reveal>
          <div className={`${styles.controls} ${styles.editHeading}`}>
            <div className={styles.editCopy}>
              <p
                className={styles.eyebrow}
                lang="en"
                dir="ltr"
              >
                THE WINGS EDIT
              </p>
              <h2
                id="arrivals-heading"
                className={styles.title}
              >
                انتخاب‌های <span>این روزها</span>
              </h2>
              <p className={styles.description}>
                جزئیاتی تازه، برای حال‌وهوای هر روزت.
              </p>
            </div>
            <div className={styles.editArtwork}>
              <span className={styles.editionLabel} lang="en" dir="ltr">CURATED BY WINGS</span>
              <span className={`font-serif ${styles.editWord}`} aria-hidden="true" dir="ltr">Edit</span>
            <Link
              href="/shop"
              className={styles.shopLink}
            >
              همه محصولات <Icon name="arrow" size={17} />
            </Link>
            </div>
          </div>

          <div className={`${styles.controls} ${styles.toolbar}`}>
            <div
              className={styles.filters}
              role="group"
              aria-label="دسته‌بندی محصولات"
            >
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setCategory(filter.id)}
                  aria-pressed={activeFilter.id === filter.id}
                  aria-controls="arrivals-products"
                  className={styles.filter}
                >
                  {filter.name}
                </button>
              ))}
            </div>
            <div className="flex w-full items-center justify-between gap-5 sm:w-auto">
              <p className={styles.resultCount} role="status">
                {productsLoading
                  ? "در حال دریافت محصولات…"
                  : previews.length
                    ? "۷ کارت · همراه با پیش‌نمایش"
                    : `${persianNumber(selectedProducts.length)} انتخاب برای تو`}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="محصولات قبلی"
                  aria-controls="arrivals-products"
                  disabled={!hydrated || productsLoading || edges.beginning}
                  onClick={() => slider.current?.slidePrev()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-white text-pink-900 transition-colors hover:bg-pink-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-white"
                >
                  <Icon name="arrow" size={17} className="rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="محصولات بعدی"
                  aria-controls="arrivals-products"
                  disabled={!hydrated || productsLoading || edges.end}
                  onClick={() => slider.current?.slideNext()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-pink-100 text-pink-900 transition-colors hover:bg-pink-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-pink-100"
                >
                  <Icon name="arrow" size={17} />
                </button>
              </div>
            </div>
          </div>

          <div id="arrivals-products" aria-busy={productsLoading}>
            {productsError && (
              <p
                role="status"
                className="mb-5 text-sm leading-7 text-[#e8b9c7]"
              >
                دریافت محصولات ممکن نشد؛ فعلاً کارت‌های پیش‌نمایش را می‌بینی.
              </p>
            )}
            {productsLoading ? (
              <div
                className="grid auto-cols-[78%] grid-flow-col gap-4 overflow-hidden sm:auto-cols-[36%] lg:auto-cols-[28%] xl:auto-cols-[23%] 2xl:auto-cols-[19%]"
                aria-hidden="true"
              >
                {Array.from({ length: 7 }, (_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-pink-200/60 bg-white p-2 motion-safe:animate-pulse"
                  >
                    <div className="aspect-[4/5] rounded-xl bg-pink-100" />
                    <div className="m-3 h-3 w-2/3 rounded bg-black/5" />
                    <div className="m-3 h-4 w-1/2 rounded bg-black/5" />
                  </div>
                ))}
              </div>
            ) : (
              <Swiper
                key={activeFilter.id}
                dir="rtl"
                modules={[A11y, Keyboard, Mousewheel, Pagination]}
                mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
                pagination={{ clickable: true, bulletElement: "button" }}
                grabCursor
                keyboard={{ enabled: true, onlyInViewport: true }}
                a11y={{
                  prevSlideMessage: "محصول قبلی",
                  nextSlideMessage: "محصول بعدی",
                  slideLabelMessage: "کارت {{index}} از {{slidesLength}}",
                  paginationBulletMessage: "رفتن به بخش {{index}} محصولات",
                }}
                spaceBetween={14}
                slidesPerView={1.25}
                watchOverflow
                onSwiper={(instance) => {
                  slider.current = instance;
                  updateNavigation(instance);
                }}
                onSlideChange={updateNavigation}
                onResize={updateNavigation}
                onLock={updateNavigation}
                onUnlock={updateNavigation}
                breakpoints={{
                  480: { slidesPerView: 2.2 },
                  640: { slidesPerView: 2.65, spaceBetween: 16 },
                  1024: { slidesPerView: 3.4, spaceBetween: 20 },
                  1280: { slidesPerView: 4.25 },
                  1536: { slidesPerView: 5.25 },
                }}
                className={`${styles.carousel} !pt-2 !pb-2`}
              >
                {selectedProducts.map((product) => (
                  <SwiperSlide key={product.id} className="!h-auto">
                    <ProductCard
                      theme="plum"
                      product={product}
                      sizes="(min-width: 1536px) 330px, (min-width: 1280px) 24vw, (min-width: 1024px) 30vw, (min-width: 640px) 38vw, (min-width: 480px) 45vw, 80vw"
                    />
                  </SwiperSlide>
                ))}
                {previews.map((name, index) => (
                  <SwiperSlide
                    key={`preview-${activeFilter.id}-${index}`}
                    className="!h-auto"
                  >
                    <ProductPreviewCard
                      theme="plum"
                      name={name}
                      index={selectedProducts.length + index}
                    />
                  </SwiperSlide>
                ))}
                <SwiperSlide className="!h-auto">
                  <Link
                    href="/shop"
                    className={`group ${styles.moreCard}`}
                  >
                    <span className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#f2c4d7] text-[#38212e] transition-transform group-hover:-translate-x-2 motion-reduce:transform-none">
                      <Icon name="arrow" size={30} />
                    </span>
                    <span className="text-2xl font-medium">
                      هنوز ادامه داره…
                    </span>
                    <span className="mt-4 text-sm leading-7 text-[#d7bdc9]">
                      انتخاب بعدی‌ات شاید همین‌جا باشد.
                    </span>
                    <span className="mt-8 rounded-full bg-pink-950 px-6 py-3 text-sm text-white">
                      مشاهده همه محصولات
                    </span>
                  </Link>
                </SwiperSlide>
              </Swiper>
            )}
          </div>
          <Link
            href="/shop"
            className="mt-7 flex items-center justify-center gap-3 py-3 text-sm sm:hidden"
          >
            دیدن همه محصولات <Icon name="arrow" size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
