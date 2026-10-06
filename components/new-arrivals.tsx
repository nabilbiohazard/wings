"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { categories, products } from "@/lib/products";

import { ProductCard } from "./product-card";
import { Icon } from "./icon";
import { Reveal } from "./reveal";
import { useShop } from "./shop-provider";

const filters = [
  {
    id: "all" as const,
    name: "همه",
  },
  ...categories,
];

export function NewArrivals() {
  const { category, setCategory } = useShop();

  const prevRef = useRef<HTMLButtonElement>(null);

  const nextRef = useRef<HTMLButtonElement>(null);

  const filteredProducts = products.filter(
    (product) => category === "all" || product.category === category,
  );

  return (
    <section
      id="new-arrivals"
      className="w-full py-16 sm:py-20 lg:py-24"
      aria-labelledby="arrivals-heading"
    >
      <div className="mx-auto w-full site-container ">
        <Reveal>
          <div className="mb-10 flex flex-col gap-6 text-right lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm tracking-wide text-black/60">
                تازه‌ها، برای حال‌وهوای تازه
              </p>

              <h2 id="arrivals-heading" className="text-4xl font-medium lg:text-5xl">
                تازه به جمع ما رسیدند
                <span className="mr-2 text-pink-400">✧</span>
              </h2>
            </div>

            <button
              onClick={() => setCategory("all")}
              className="flex items-center justify-end gap-3 text-sm transition hover:opacity-60"
            >
              دیدن همه محصولات
              <Icon name="arrow" size={17} />
            </button>
          </div>

          <div className="mb-12 flex flex-wrap justify-end gap-3" aria-label="فیلتر محصولات">
            {filters.map((item) => (
              <button
                key={item.id}
                onClick={() => setCategory(item.id)}
                aria-pressed={category === item.id}
                className={`rounded-full px-5 py-2 text-sm transition-all duration-300 ${
                  category === item.id
                    ? "bg-black text-white"
                    : "bg-black/5 text-black hover:bg-black hover:text-white"
                } `}
              >
                {item.name}
              </button>
            ))}
          </div>

          <Swiper
            key={category}

            modules={[Autoplay, Navigation, Pagination]}

            spaceBetween={24}

            slidesPerView={1.15}

            loop={filteredProducts.length > 4}

            speed={1000}

            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}

            pagination={{
              clickable: true,
            }}

            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}

            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean" && swiper.params.navigation) {
                swiper.params.navigation.prevEl = prevRef.current;

                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}

            breakpoints={{
              640: {
                slidesPerView: 2.2,
              },

              1024: {
                slidesPerView: 3.2,
              },

              1280: {
                slidesPerView: 4,
              },
            }}

            className="!overflow-visible !pb-14"
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto">
                <div className="h-full">
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-5 flex items-center justify-between gap-6">
            <div className="flex gap-3">
              <button
                ref={prevRef}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 transition hover:bg-black hover:text-white"
              >
                <Icon name="arrow" size={16} />
              </button>

              <button
                ref={nextRef}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 transition hover:bg-black hover:text-white"
              >
                <Icon name="arrow" size={16} className="rotate-180" />
              </button>
            </div>

            <div className="flex flex-1 items-center gap-5 text-sm text-black/50">
              <span className="h-px flex-1 bg-black/10" />
              هر تکه، شروع یک داستان تازه
              <span className="h-px flex-1 bg-black/10" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
