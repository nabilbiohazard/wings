"use client";

import Image from "next/image";
import { Icon } from "../icon";
import { Reveal } from "../reveal";
import { useShop } from "../shop-provider";

const collectionCards = [
  {
    id: "charms",
    number: "01",
    name: "انگشتر و چارم",
    english: "RINGS & CHARMS",
    tagline: "جزئیاتی کوچک با حضوری فراموش‌نشدنی",
    image: "/images/collection-rings.png",
  },
  {
    id: "necklace",
    number: "02",
    name: "گردنبند",
    english: "NECKLACES",
    tagline: "داستانی که همیشه نزدیک قلب تو می‌ماند",
    image: "/images/collection-necklaces.png",
  },
  {
    id: "bracelet",
    number: "03",
    name: "دستبند",
    english: "BRACELETS",
    tagline: "تکه‌های شادی برای همراهی هر روز تو",
    image: "/images/collection-bracelets.png",
  },
] as const;

type CollectionCardProps = {
  card: (typeof collectionCards)[number];
};

function CollectionCard({ card }: CollectionCardProps) {
  const { setCategory } = useShop();

  return (
    <a
      href="#new-arrivals"
      onClick={() => setCategory(card.id)}
      className="group relative isolate min-h-[430px] overflow-hidden rounded-[32px] bg-[#211914] sm:min-h-[500px]"
    >
      <Image
        src={card.image}
        alt={card.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition duration-1000 ease-out group-hover:scale-[1.06] group-hover:brightness-110"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/5 to-black/15" />
      <div className="absolute inset-0 opacity-0 ring-1 ring-inset ring-white/40 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-white sm:p-6">
        <span className="rounded-full border border-white/25 bg-black/10 px-3 py-1.5 text-[10px] tracking-[3px] backdrop-blur-md">
          {card.number}
        </span>
        <span className="text-[9px] tracking-[2.5px] text-white/75">
          {card.english}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
        <div className="flex items-end justify-between gap-5 rounded-[24px] border border-white/15 bg-black/20 p-5 backdrop-blur-md transition-colors duration-500 group-hover:bg-black/35">
          <div className="text-right" dir="rtl">
            <h3 className="text-2xl font-medium sm:text-[28px]">{card.name}</h3>
            <p className="mt-2 max-w-[220px] text-xs leading-6 text-white/70">
              {card.tagline}
            </p>
          </div>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:-rotate-45 group-hover:bg-pink-300">
            <Icon name="arrow" size={16} />
          </span>
        </div>
      </div>
    </a>
  );
}

function CustomDesignCard() {
  return (
    <a
      href="/custom-design"
      className="group relative isolate flex min-h-[430px] flex-col overflow-hidden rounded-[32px] bg-[#171310] p-6 text-white sm:min-h-[500px] sm:p-7"
    >
      <div className="absolute -top-16 -right-20 h-72 w-72 rounded-full bg-pink-300/25 blur-[70px] transition-transform duration-1000 group-hover:scale-125" />
      <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#8a5b3f]/30 blur-[80px]" />
      <div className="absolute inset-4 rounded-[25px] border border-white/10" />

      <div className="relative flex items-center justify-between">
        <span className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] tracking-[3px] text-white/70">
          04
        </span>
        <span className="text-[9px] tracking-[2.5px] text-pink-200/70">
          YOUR STORY
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/10 sm:h-44 sm:w-44">
          <div className="absolute inset-4 animate-[spin_12s_linear_infinite] rounded-full border border-dashed border-pink-300/35" />
          <span className="text-5xl text-pink-300 transition-transform duration-700 group-hover:rotate-45 group-hover:scale-110">
            ✦
          </span>
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-5" dir="rtl">
        <div className="text-right">
          <p className="text-[10px] tracking-[2px] text-pink-200/60">
            مخصوص خود تو
          </p>
          <h3 className="mt-2 text-2xl font-medium sm:text-[28px]">
            خودت بساز
          </h3>
          <p className="mt-2 text-xs leading-6 text-white/55">
            چارم‌ها را انتخاب کن و قصه‌ات را بساز
          </p>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-300 text-black transition-transform duration-500 group-hover:-rotate-45 group-hover:scale-105">
          <Icon name="arrow" size={16} />
        </span>
      </div>
    </a>
  );
}

export function Collections() {
  return (
    <section
      id="collections"
      className="w-full bg-[#f7f4f0] py-20 sm:py-24 lg:py-32"
      aria-labelledby="collections-heading"
    >
      <div className="mx-auto w-full site-container  ">
        <div className="mb-12 text-center sm:mb-16 lg:mb-20" dir="rtl">
          <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-2 shadow-[0_8px_30px_rgba(34,25,20,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
            <span className="text-[10px] tracking-[0.18em] text-black/45">
              مجموعه‌های وینگز
            </span>
            <span className="text-[9px] tracking-[2px] text-black/25" dir="ltr">
              01 — 04
            </span>
          </div>

          <h2
            id="collections-heading"
            className="mx-auto mt-6 max-w-4xl text-4xl leading-[1.4] font-medium tracking-[-0.035em] text-[#1d1815] sm:mt-8 sm:text-5xl lg:text-6xl"
          >
            زیبایی، در انتخاب‌های کوچک توست
            <span className="mr-2 text-pink-400">.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-black/50 sm:text-[15px]">
            از بین کالکشن‌های وینگز، آن تکه‌ای را انتخاب کن که حال‌وهوای تو را
            کامل می‌کند.
          </p>

          <div
            className="mx-auto mt-7 flex max-w-52 items-center gap-4 sm:mt-9"
            aria-hidden="true"
          >
            <span className="h-px flex-1 bg-black/10" />
            <span className="text-sm text-pink-400">✦</span>
            <span className="h-px flex-1 bg-black/10" />
          </div>
        </div>

        <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {collectionCards.map((card) => (
            <CollectionCard key={card.id} card={card} />
          ))}
          <CustomDesignCard />
        </Reveal>
      </div>
    </section>
  );
}
