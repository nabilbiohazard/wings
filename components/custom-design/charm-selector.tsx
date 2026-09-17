"use client";

import Image from "next/image";
import { Icon } from "../icon";
import type { BaseOption } from "./base-selector";
import type { ProductType } from "./product-type-selector";

export type CharmOption = {
  id: string;
  title: string;
  englishTitle: string;
  price: number;
  image: string;
  compatibleWith: ProductType[];
};

type CharmSelectorProps = {
  productType: ProductType;
  selectedBase: BaseOption | null;
  value: string[];
  onChange: (ids: string[]) => void;
};

export const charms: CharmOption[] = [
  {
    id: "heart",
    title: "قلب",
    englishTitle: "HEART",
    price: 290000,
    image: "/images/charm-heart.jpg",
    compatibleWith: ["necklace", "bracelet", "earring"],
  },
  {
    id: "star",
    title: "ستاره",
    englishTitle: "STAR",
    price: 320000,
    image: "/images/charm-star.jpg",
    compatibleWith: ["necklace", "bracelet", "earring"],
  },
  {
    id: "moon",
    title: "ماه",
    englishTitle: "MOON",
    price: 350000,
    image: "/images/charm-moon.jpg",
    compatibleWith: ["necklace", "bracelet", "earring"],
  },
  {
    id: "butterfly",
    title: "پروانه",
    englishTitle: "BUTTERFLY",
    price: 390000,
    image: "/images/charm-butterfly.jpg",
    compatibleWith: ["necklace", "bracelet"],
  },
  {
    id: "letter",
    title: "حرف",
    englishTitle: "LETTER",
    price: 420000,
    image: "/images/charm-letter.jpg",
    compatibleWith: ["necklace", "bracelet"],
  },
  {
    id: "pearl",
    title: "مروارید",
    englishTitle: "PEARL",
    price: 450000,
    image: "/images/charm-pearl.jpg",
    compatibleWith: ["necklace", "bracelet", "earring"],
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export function CharmSelector({
  productType,
  selectedBase,
  value,
  onChange,
}: CharmSelectorProps) {
  const availableCharms = charms.filter((charm) =>
    charm.compatibleWith.includes(productType),
  );

  const selectedCharms = availableCharms.filter((charm) =>
    value.includes(charm.id),
  );

  const charmsPrice = selectedCharms.reduce(
    (total, charm) => total + charm.price,
    0,
  );

  const totalPrice = (selectedBase?.price ?? 0) + charmsPrice;

  function toggleCharm(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((charmId) => charmId !== id));
      return;
    }

    onChange([...value, id]);
  }

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center" dir="rtl">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-sm font-medium text-pink-500">
            ۳
          </div>

          <p className="mt-5 text-xs tracking-[5px] text-black/35">
            ADD YOUR CHARMS
          </p>

          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
            حالا داستانت رو کامل کن
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-black/55">
            چارم‌هایی که دوست داری انتخاب کن. می‌تونی چند مدل رو با هم ترکیب
            کنی و هر زمان خواستی انتخابت رو تغییر بدی.
          </p>
        </div>

        {!selectedBase ? (
          <div
            className="mx-auto mt-12 max-w-2xl rounded-[28px] border border-dashed border-black/15 bg-[#faf9f7] px-6 py-12 text-center"
            dir="rtl"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/[0.05]">
              <Icon name="sparkle" size={20} />
            </div>

            <h3 className="mt-5 text-lg font-medium">
              اول پایه اکسسوری رو انتخاب کن
            </h3>

            <p className="mt-2 text-sm leading-7 text-black/45">
              بعد از انتخاب پایه، چارم‌های مناسب برای طراحی تو اینجا فعال
              می‌شن.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-16 lg:grid-cols-6">
              {availableCharms.map((charm) => {
                const isSelected = value.includes(charm.id);

                return (
                  <button
                    key={charm.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleCharm(charm.id)}
                    className={`group overflow-hidden rounded-[28px] border text-right transition-all duration-300 ${
                      isSelected
                        ? "border-black bg-black text-white shadow-xl shadow-black/10"
                        : "border-black/10 bg-white hover:-translate-y-1 hover:border-black/25 hover:shadow-lg hover:shadow-black/5"
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f7f4f0]">
                      <Image
                        src={charm.image}
                        alt={charm.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <span
                        className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-white/70 bg-white/75 text-black"
                        }`}
                      >
                        <Icon
                          name={isSelected ? "check" : "plus"}
                          size={14}
                        />
                      </span>
                    </div>

                    <div className="p-4 sm:p-5" dir="rtl">
                      <p
                        className={`text-[9px] tracking-[3px] ${
                          isSelected ? "text-white/40" : "text-black/35"
                        }`}
                      >
                        {charm.englishTitle}
                      </p>

                      <h3 className="mt-2 text-base font-medium sm:text-lg">
                        {charm.title}
                      </h3>

                      <p
                        className={`mt-3 text-xs ${
                          isSelected ? "text-white/60" : "text-black/50"
                        }`}
                      >
                        {formatPrice(charm.price)} تومان
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              className="mx-auto mt-10 max-w-3xl rounded-[30px] border border-black/10 bg-[#faf9f7] p-5 sm:p-7"
              dir="rtl"
            >
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-xs text-black/40">چارم‌های انتخاب‌شده</p>

                  <p className="mt-2 text-lg font-medium">
                    {value.length === 0
                      ? "هنوز چارمی انتخاب نکردی"
                      : `${new Intl.NumberFormat("fa-IR").format(
                          value.length,
                        )} چارم`}
                  </p>
                </div>

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                  <Icon name="sparkle" size={18} />
                </span>
              </div>

              {selectedCharms.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedCharms.map((charm) => (
                    <button
                      key={charm.id}
                      type="button"
                      onClick={() => toggleCharm(charm.id)}
                      className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs transition-colors hover:border-black"
                    >
                      {charm.title}
                      <Icon name="close" size={12} />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-7 space-y-4 border-t border-black/10 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/45">پایه</span>

                  <span>{formatPrice(selectedBase.price)} تومان</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/45">چارم‌ها</span>

                  <span>{formatPrice(charmsPrice)} تومان</span>
                </div>

                <div className="flex items-end justify-between border-t border-black/10 pt-5">
                  <div>
                    <p className="text-xs text-black/40">قیمت فعلی طراحی</p>
                    <p className="mt-1 text-xs text-black/35">
                      قبل از هزینه ارسال
                    </p>
                  </div>

                  <p className="text-xl font-semibold sm:text-2xl">
                    {formatPrice(totalPrice)}
                    <span className="mr-2 text-xs font-normal text-black/45">
                      تومان
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}