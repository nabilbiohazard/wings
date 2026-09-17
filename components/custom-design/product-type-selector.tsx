"use client";

import Image from "next/image";
import { Icon } from "../icon";

export type ProductType = "necklace" | "bracelet" | "earring";

type ProductTypeSelectorProps = {
  value: ProductType;
  onChange: (value: ProductType) => void;
};

const productTypes: {
  id: ProductType;
  title: string;
  englishTitle: string;
  description: string;
  image: string;
}[] = [
  {
    id: "necklace",
    title: "گردنبند",
    englishTitle: "NECKLACE",
    description: "زنجیر مورد علاقه‌ات را انتخاب کن و با چارم‌های خودت کاملش کن.",
    image: "/images/custom-necklace.jpg",
  },
  {
    id: "bracelet",
    title: "دستبند",
    englishTitle: "BRACELET",
    description: "یک دستبند شخصی بساز و داستانت را با جزئیات کوچک تعریف کن.",
    image: "/images/custom-bracelet.jpg",
  },
  {
    id: "earring",
    title: "گوشواره",
    englishTitle: "EARRING",
    description: "ترکیبی متفاوت بساز که دقیقاً با استایل تو هماهنگ باشد.",
    image: "/images/custom-earring.jpg",
  },
];

export function ProductTypeSelector({
  value,
  onChange,
}: ProductTypeSelectorProps) {
  return (
    <div className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center" dir="rtl">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-sm font-medium text-pink-500">
            ۱
          </div>

          <p className="mt-5 text-xs tracking-[5px] text-black/35">
            CHOOSE YOUR PIECE
          </p>

          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
            دوست داری چی بسازی؟
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-black/55">
            اول نوع اکسسوری رو انتخاب کن. در مرحله بعد مدل پایه و جزئیاتش رو
            مشخص می‌کنیم.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-16">
          {productTypes.map((item) => {
            const isSelected = value === item.id;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange(item.id)}
                className={`group relative overflow-hidden rounded-[32px] border text-right transition-all duration-500 ${
                  isSelected
                    ? "border-black bg-black shadow-xl shadow-black/10"
                    : "border-black/10 bg-[#faf9f7] hover:-translate-y-1 hover:border-black/25 hover:shadow-xl hover:shadow-black/5"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                  <div
                    className={`absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                      isSelected
                        ? "border-white bg-white text-black"
                        : "border-white/40 bg-black/10 text-white"
                    }`}
                  >
                    {isSelected ? (
                      <Icon name="check" size={17} />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </div>
                </div>

                <div
                  className={`p-6 sm:p-7 ${
                    isSelected ? "text-white" : "text-black"
                  }`}
                  dir="rtl"
                >
                  <p
                    className={`text-[10px] tracking-[4px] ${
                      isSelected ? "text-white/45" : "text-black/35"
                    }`}
                  >
                    {item.englishTitle}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-medium">{item.title}</h3>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isSelected
                          ? "bg-white text-black"
                          : "bg-black/[0.05] text-black group-hover:bg-black group-hover:text-white"
                      }`}
                    >
                      <Icon name="arrow" size={15} />
                    </span>
                  </div>

                  <p
                    className={`mt-4 text-sm leading-7 ${
                      isSelected ? "text-white/60" : "text-black/50"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="mt-8 flex items-center justify-center gap-2 text-sm text-black/45"
          dir="rtl"
        >
          <Icon name="check" size={15} />
          انتخاب فعلی:
          <span className="font-medium text-black">
            {productTypes.find((item) => item.id === value)?.title}
          </span>
        </div>
      </div>
    </div>
  );
}