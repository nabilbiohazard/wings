"use client";

import { HeaderBackdrop } from "@/components/header-backdrop";

import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/components/shop-provider";

const collections = [
  {
    id: "necklace",
    number: "01",
    english: "NECKLACES",
    name: "گردنبندها",
    description: "جزئیاتی که همیشه نزدیک قلبت می‌مانند.",
    image: "/images/collection-necklaces.png",
    className: "sm:col-span-6 lg:col-span-7",
  },
  {
    id: "bracelet",
    number: "02",
    english: "BRACELETS",
    name: "دستبندها",
    description: "همراهی کوچک برای روزهای پر از خاطره.",
    image: "/images/collection-bracelets.png",
    className: "sm:col-span-6 lg:col-span-5",
  },
  {
    id: "charms",
    number: "03",
    english: "CHARMS",
    name: "چارم‌ها",
    description: "هر کدام یک نشانه از داستان تو.",
    image: "/images/charms.png",
    className: "sm:col-span-6 lg:col-span-5",
  },
  {
    id: "earrings",
    number: "04",
    english: "EARRINGS",
    name: "گوشواره‌ها",
    description: "درخشش ظریف، درست به اندازه خودت.",
    image: "/images/earrings.png",
    className: "sm:col-span-6 lg:col-span-7",
  },
] as const;

export default function CollectionsPage() {
  const { setCategory } = useShop();

  return (
    <main className="overflow-hidden bg-[#faf7f4] text-[#30252a]">
      <HeaderBackdrop />
      <section
        id="explore-collections"
        className="mx-auto site-container  py-20  sm:py-28 lg:py-36"
        aria-labelledby="explore-title"
      >
        <div
          className="mb-11 flex flex-col items-start justify-between gap-8 border-b border-[#e3d5d0] pb-9 sm:mb-14 lg:flex-row lg:items-end"
          dir="rtl"
        >
          <div className="max-w-2xl">
            <p
              className="text-[11px] tracking-[0.24em] text-[#a36a7d]"
              dir="ltr"
            >
              CURATED FOR YOUR STORY · 01 / 04
            </p>
            <h2
              id="explore-title"
              className="mt-5 text-4xl font-medium tracking-[-0.035em] sm:text-5xl lg:text-6xl"
            >
              دنیای وینگز را کشف کن<span className="text-[#bd8396]">.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-8 text-[#817078]">
            از یک گردنبند ظریف تا چارمی که معنای خودش را دارد؛ اینجا انتخاب‌ها
            به سلیقه تو شکل می‌گیرند.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-5 lg:gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href="/shop"
              onClick={() => setCategory(collection.id)}
              className={`group relative isolate min-h-[450px] overflow-hidden rounded-[28px] bg-[#e9ddd7] sm:min-h-[520px] lg:min-h-[580px] ${collection.className}`}
              aria-label={`مشاهده ${collection.name} در فروشگاه`}
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.045] motion-reduce:transform-none"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#24191b]/85 via-[#24191b]/12 to-[#24191b]/20" />
              <div
                className="absolute inset-x-0 top-0 flex items-center justify-between p-6 text-white sm:p-8"
                dir="ltr"
              >
                <span className="rounded-full border border-white/45 bg-black/10 px-3 py-1.5 text-xs backdrop-blur-sm">
                  {collection.number}
                </span>
                <span className="text-[10px] tracking-[0.25em] text-white/85">
                  {collection.english}
                </span>
              </div>
              <div
                className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-8"
                dir="rtl"
              >
                <div>
                  <h3 className="text-3xl font-medium sm:text-4xl">
                    {collection.name}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-white/80 sm:text-sm">
                    {collection.description}
                  </p>
                </div>
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/15 text-lg backdrop-blur-sm transition-[background-color,transform] group-hover:-translate-x-1 group-hover:bg-white group-hover:text-[#4c3039] motion-reduce:transform-none"
                  aria-hidden="true"
                >
                  ←
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section
        className="bg-[#efe4df] px-5 py-20 sm:px-8 sm:py-28"
        aria-labelledby="signature-title"
      >
        <div className="mx-auto grid site-content items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#ead2be] lg:aspect-[4/5]">
            <Image
              src="/images/custom-hero.png"
              alt="زیورآلات و چارم‌های دست‌چین برای ساخت طرح دلخواه"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span
              className="absolute bottom-5 left-5 rounded-full border border-white/50 bg-white/80 px-4 py-2 text-[10px] tracking-[0.18em] text-[#604653] backdrop-blur-sm"
              dir="ltr"
            >
              MADE PERSONAL
            </span>
          </div>
          <div dir="rtl" className="max-w-xl lg:pr-4">
            <p
              className="text-[11px] tracking-[0.25em] text-[#9b6676]"
              dir="ltr"
            >
              A LITTLE PIECE OF YOU
            </p>
            <h2
              id="signature-title"
              className="mt-6 text-4xl leading-[1.45] font-medium tracking-[-0.035em] sm:text-5xl"
            >
              وقتی انتخاب،{" "}
              <span className="text-[#a6667c]">کاملاً مال توست</span>
            </h2>
            <p className="mt-6 text-sm leading-9 text-[#75636a] sm:text-base">
              گاهی زیباترین قطعه همان است که خودت می‌سازی. چارم‌ها را کنار هم
              بگذار و دستبندی بساز که داستانش فقط برای تو باشد.
            </p>
            <Link
              href="/custom-design"
              className="mt-9 inline-flex min-h-12 items-center gap-6 rounded-full bg-[#49313b] px-7 py-3 text-sm text-white transition-colors hover:bg-[#965f75] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#49313b]"
            >
              دستبند خودت را بساز <span aria-hidden="true">←</span>
            </Link>
          </div>
        </div>
      </section>
      <section
        className="px-5 py-20 text-center sm:px-8 sm:py-28"
        aria-labelledby="all-products-title"
      >
        <div className="mx-auto max-w-2xl" dir="rtl">
          <p className="text-[11px] tracking-[0.24em] text-[#a36a7d]" dir="ltr">
            THE COMPLETE EDIT
          </p>
          <h2
            id="all-products-title"
            className="mt-5 text-4xl font-medium sm:text-5xl"
          >
            هنوز دنبال قطعه خودت می‌گردی؟
          </h2>
          <p className="mt-5 text-sm leading-8 text-[#817078]">
            تمام انتخاب‌های وینگز را یک‌جا ببین و آن چیزی را پیدا کن که با تو
            جور است.
          </p>
          <Link
            href="/shop"
            onClick={() => setCategory("all")}
            className="mt-8 inline-flex min-h-12 items-center gap-5 rounded-full border border-[#9b6879] px-7 py-3 text-sm text-[#7b4d5d] transition-colors hover:bg-[#9b6879] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b6879]"
          >
            مشاهده همه محصولات <span aria-hidden="true">←</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
