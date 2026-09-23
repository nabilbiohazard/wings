"use client";

import Image from "next/image";
import { Icon } from "../icon";
import type { ProductType } from "./product-type-selector";

export type BaseOption = {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  price: number;
  image: string;
};

type BaseSelectorProps = {
  productType: ProductType;
  value: BaseOption | null;
  onChange: (base: BaseOption) => void;
};

const baseOptions: Record<ProductType, BaseOption[]> = {
  necklace: [
    {
      id: "necklace-delicate",
      title: "زنجیر ظریف",
      englishTitle: "DELICATE CHAIN",
      description: "مینیمال و ظریف، مناسب ترکیب با یک یا چند چارم کوچک.",
      price: 890000,
      image: "/images/hero.png",
    },
    {
      id: "necklace-classic",
      title: "زنجیر کلاسیک",
      englishTitle: "CLASSIC CHAIN",
      description: "انتخابی همه‌کاره برای استفاده روزمره و ترکیب چند چارم.",
      price: 1190000,
      image: "/images/hero.png",
    },
    {
      id: "necklace-bold",
      title: "زنجیر لینک",
      englishTitle: "LINK CHAIN",
      description: "فرم برجسته‌تر برای استایل‌های جسورانه و متفاوت.",
      price: 1490000,
      image: "/images/hero.png",
    },
  ],
  bracelet: [
    {
      id: "bracelet-delicate",
      title: "دستبند ظریف",
      englishTitle: "DELICATE BRACELET",
      description: "پایه‌ای سبک و مینیمال برای چارم‌های ظریف.",
      price: 690000,
      image: "/images/hero.png",
    },
    {
      id: "bracelet-classic",
      title: "دستبند کلاسیک",
      englishTitle: "CLASSIC BRACELET",
      description: "مناسب ترکیب چند چارم و استفاده روزمره.",
      price: 790000,
      image: "/images/hero.png",
    },
    {
      id: "bracelet-link",
      title: "دستبند لینک",
      englishTitle: "LINK BRACELET",
      description: "ظاهر مدرن‌تر با حلقه‌های درشت‌تر و استایل خاص.",
      price: 990000,
      image: "/images/hero.png",
    },
  ],
  earring: [
    {
      id: "earring-stud",
      title: "پایه میخی",
      englishTitle: "STUD BASE",
      description: "ساده، سبک و مناسب طراحی‌های مینیمال.",
      price: 690000,
      image: "/images/hero.png",
    },
    {
      id: "earring-hoop-small",
      title: "حلقه‌ای ظریف",
      englishTitle: "SMALL HOOP",
      description: "حلقه کوچک برای اضافه کردن یک چارم ظریف.",
      price: 790000,
      image: "/images/hero.png",
    },
    {
      id: "earring-hoop-medium",
      title: "حلقه‌ای کلاسیک",
      englishTitle: "CLASSIC HOOP",
      description: "اندازه متعادل برای ساخت ترکیب‌های متفاوت‌تر.",
      price: 890000,
      image: "/images/hero.png",
    },
  ],
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export function BaseSelector({
  productType,
  value,
  onChange,
}: BaseSelectorProps) {
  const options = baseOptions[productType];

  return (
    <section className="bg-[#faf8f5] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center" dir="rtl">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
            ۲
          </div>

          <p className="mt-5 text-xs tracking-[5px] text-black/35">
            CHOOSE YOUR BASE
          </p>

          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
            پایه مورد علاقه‌ات رو انتخاب کن
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-black/55">
            پایه اصلی طراحی رو انتخاب کن. بعد از این مرحله می‌تونی چارم‌ها و
            جزئیات دلخواهت رو بهش اضافه کنی.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-16">
          {options.map((item) => {
            const isSelected = value?.id === item.id;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange(item)}
                className={`group overflow-hidden rounded-[32px] border bg-white text-right transition-all duration-500 ${
                  isSelected
                    ? "border-black shadow-xl shadow-black/10"
                    : "border-black/10 hover:-translate-y-1 hover:border-black/25 hover:shadow-xl hover:shadow-black/5"
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-[#f3f0ec]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute left-5 top-5">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-white/60 bg-white/70 text-black"
                      }`}
                    >
                      {isSelected ? (
                        <Icon name="check" size={17} />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7" dir="rtl">
                  <p className="text-[10px] tracking-[4px] text-black/35">
                    {item.englishTitle}
                  </p>

                  <div className="mt-3 flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-2xl font-medium">{item.title}</h3>

                      <p className="mt-3 text-sm leading-7 text-black/50">
                        {item.description}
                      </p>
                    </div>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${
                        isSelected
                          ? "bg-black text-white"
                          : "bg-black/[0.05] group-hover:bg-black group-hover:text-white"
                      }`}
                    >
                      <Icon name="check" size={15} />
                    </span>
                  </div>

                  <div className="mt-6 border-t border-black/10 pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-black/40">قیمت پایه</span>

                      <span className="text-base font-medium">
                        {formatPrice(item.price)}
                        <span className="mr-1 text-xs font-normal text-black/45">
                          تومان
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {value && (
          <div
            className="mx-auto mt-8 flex max-w-xl items-center justify-between rounded-2xl border border-black/10 bg-white px-5 py-4"
            dir="rtl"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                <Icon name="check" size={14} />
              </span>

              <div>
                <p className="text-xs text-black/40">پایه انتخاب‌شده</p>
                <p className="mt-1 text-sm font-medium">{value.title}</p>
              </div>
            </div>

            <p className="text-sm font-medium">
              {formatPrice(value.price)} تومان
            </p>
          </div>
        )}
      </div>
    </section>
  );
}