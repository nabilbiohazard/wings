"use client";

import Image from "next/image";
import { Icon } from "../icon";
import type { BaseOption } from "./base-selector";
import type { ProductType } from "./product-type-selector";

type LivePreviewProps = {
  productType: ProductType;
  selectedBase: BaseOption | null;
  selectedCharms: string[];
};

const productLabels: Record<ProductType, string> = {
  necklace: "گردنبند",
  bracelet: "دستبند",
  earring: "گوشواره",
};

const previewBases: Record<string, string> = {
  "necklace-delicate": "/images/preview/base-necklace-delicate.png",
  "necklace-classic": "/images/preview/base-necklace-classic.png",
  "necklace-bold": "/images/preview/base-necklace-bold.png",
  "bracelet-delicate": "/images/preview/base-bracelet-delicate.png",
  "bracelet-classic": "/images/preview/base-bracelet-classic.png",
  "bracelet-link": "/images/preview/base-bracelet-link.png",
  "earring-stud": "/images/preview/base-earring-stud.png",
  "earring-hoop-small": "/images/preview/base-earring-small.png",
  "earring-hoop-medium": "/images/preview/base-earring-medium.png",
};

const charmImages: Record<string, string> = {
  heart: "/images/preview/charm-heart.png",
  star: "/images/preview/charm-star.png",
  moon: "/images/preview/charm-moon.png",
  butterfly: "/images/preview/charm-butterfly.png",
  letter: "/images/preview/charm-letter.png",
  pearl: "/images/preview/charm-pearl.png",
};

type Position = {
  left: string;
  top: string;
  rotate?: number;
};

const charmPositions: Record<ProductType, Position[]> = {
  necklace: [
    { left: "47%", top: "59%" },
    { left: "39%", top: "57%", rotate: -8 },
    { left: "55%", top: "57%", rotate: 8 },
    { left: "32%", top: "53%", rotate: -12 },
    { left: "62%", top: "53%", rotate: 12 },
    { left: "47%", top: "68%" },
  ],
  bracelet: [
    { left: "47%", top: "46%" },
    { left: "38%", top: "48%", rotate: -10 },
    { left: "56%", top: "48%", rotate: 10 },
    { left: "29%", top: "52%", rotate: -14 },
    { left: "65%", top: "52%", rotate: 14 },
    { left: "47%", top: "59%" },
  ],
  earring: [
    { left: "36%", top: "57%", rotate: -5 },
    { left: "58%", top: "57%", rotate: 5 },
    { left: "36%", top: "67%" },
    { left: "58%", top: "67%" },
    { left: "47%", top: "72%" },
    { left: "47%", top: "80%" },
  ],
};

export function LivePreview({
  productType,
  selectedBase,
  selectedCharms,
}: LivePreviewProps) {
  const baseImage = selectedBase
    ? previewBases[selectedBase.id]
    : undefined;

  return (
    <section className="bg-[#f5f0eb] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div className="text-right" dir="rtl">
            <div className="flex justify-end">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
                ۴
              </span>
            </div>

            <p className="mt-5 text-xs tracking-[5px] text-black/35">
              LIVE PREVIEW
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              طراحی تو،
              <br />
              جلوی چشم خودت
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-8 text-black/55">
              هر تغییری که در پایه یا چارم‌ها ایجاد کنی، اینجا به‌صورت زنده
              نمایش داده می‌شه تا قبل از ثبت سفارش ترکیب نهایی رو ببینی.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/70 px-5 py-4">
                <span className="font-medium">
                  {productLabels[productType]}
                </span>
                <span className="text-xs text-black/40">نوع محصول</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/70 px-5 py-4">
                <span className="font-medium">
                  {selectedBase?.title ?? "انتخاب نشده"}
                </span>
                <span className="text-xs text-black/40">پایه</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/70 px-5 py-4">
                <span className="font-medium">
                  {new Intl.NumberFormat("fa-IR").format(
                    selectedCharms.length,
                  )}
                </span>
                <span className="text-xs text-black/40">تعداد چارم</span>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-black/35">
              پیش‌نمایش برای شبیه‌سازی طراحی است و ممکن است اندازه واقعی قطعات
              کمی متفاوت باشد.
            </p>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-[780px] overflow-hidden rounded-[44px] border border-black/[0.06] bg-[#eee7df] shadow-2xl shadow-black/[0.06]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.95),_rgba(239,231,223,0.8)_60%,_rgba(225,214,202,0.9))]" />

              <div className="absolute left-6 top-6 z-30 rounded-full border border-white/50 bg-white/60 px-4 py-2 text-[10px] tracking-[3px] text-black/45 backdrop-blur-xl">
                WINGS DESIGN STUDIO
              </div>

              {!selectedBase || !baseImage ? (
                <div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center"
                  dir="rtl"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg shadow-black/5">
                    <Icon name="sparkle" size={24} />
                  </span>

                  <h3 className="mt-6 text-xl font-medium">
                    طراحی از اینجا شروع می‌شه
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-7 text-black/45">
                    یک پایه انتخاب کن تا پیش‌نمایش اکسسوری اینجا نمایش داده بشه.
                  </p>
                </div>
              ) : (
                <>
                  <div className="absolute inset-[8%] z-10">
                    <Image
                      src={baseImage}
                      alt={selectedBase.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-contain"
                    />
                  </div>

                  <div className="absolute inset-0 z-20">
                    {selectedCharms.map((charmId, index) => {
                      const image = charmImages[charmId];
                      const positions = charmPositions[productType];
                      const position = positions[index % positions.length];

                      if (!image) return null;

                      return (
                        <div
                          key={charmId}
                          className="absolute h-[11%] w-[11%] -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                          style={{
                            left: position.left,
                            top: position.top,
                            transform: `translate(-50%, -50%) rotate(${
                              position.rotate ?? 0
                            }deg)`,
                          }}
                        >
                          <Image
                            src={image}
                            alt=""
                            fill
                            sizes="100px"
                            className="object-contain drop-shadow-lg"
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="absolute bottom-6 left-6 right-6 z-30 flex items-center justify-between rounded-[22px] border border-white/50 bg-white/60 px-5 py-4 backdrop-blur-xl">
                <div>
                  <p className="text-[9px] tracking-[3px] text-black/35">
                    YOUR DESIGN
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedBase?.title ?? "Wings Custom"}
                  </p>
                </div>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                  <Icon name="sparkle" size={15} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}