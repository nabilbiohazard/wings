"use client";

import { Icon } from "../icon";
import type { BaseOption } from "./base-selector";
import { charms } from "./charm-selector";
import type { ProductType } from "./product-type-selector";

type DesignSummaryProps = {
  productType: ProductType;
  selectedBase: BaseOption | null;
  selectedCharms: string[];
  onAddToCart: () => void;
};

const productLabels: Record<ProductType, string> = {
  necklace: "گردنبند",
  bracelet: "دستبند",
  earring: "گوشواره",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export function DesignSummary({
  productType,
  selectedBase,
  selectedCharms,
  onAddToCart,
}: DesignSummaryProps) {
  const selectedCharmItems = charms.filter((charm) =>
    selectedCharms.includes(charm.id),
  );

  const charmsPrice = selectedCharmItems.reduce(
    (total, charm) => total + charm.price,
    0,
  );

  const totalPrice = (selectedBase?.price ?? 0) + charmsPrice;

  return (
    <section className="bg-black py-16 text-white sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <div className="text-right" dir="rtl">
            <div className="flex justify-end">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-medium text-black">
                ۵
              </span>
            </div>

            <p className="mt-5 text-xs tracking-[5px] text-white/35">
              YOUR DESIGN
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              طراحی تو
              <br />
              آماده‌ست
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-8 text-white/55">
              انتخاب‌هات رو یک بار دیگه بررسی کن. قیمت نهایی بر اساس پایه و
              چارم‌هایی که انتخاب کردی محاسبه شده.
            </p>

            <div className="mt-8 flex flex-wrap justify-end gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs text-white/60">
                {productLabels[productType]}
              </span>

              {selectedBase && (
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs text-white/60">
                  {selectedBase.title}
                </span>
              )}

              <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs text-white/60">
                {new Intl.NumberFormat("fa-IR").format(selectedCharms.length)}{" "}
                چارم
              </span>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.06]"
            dir="rtl"
          >
            <div className="border-b border-white/10 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-white/35">خلاصه سفارش</p>
                  <h3 className="mt-2 text-2xl font-medium">
                    Wings Custom Design
                  </h3>
                </div>

                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                  <Icon name="sparkle" size={19} />
                </span>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/45">نوع محصول</span>
                <span className="text-sm font-medium">
                  {productLabels[productType]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/45">پایه انتخاب‌شده</span>
                <span className="text-sm font-medium">
                  {selectedBase?.title ?? "انتخاب نشده"}
                </span>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/45">چارم‌ها</span>

                  <span className="text-xs text-white/35">
                    {new Intl.NumberFormat("fa-IR").format(
                      selectedCharmItems.length,
                    )}{" "}
                    انتخاب
                  </span>
                </div>

                {selectedCharmItems.length === 0 ? (
                  <p className="mt-4 text-sm text-white/30">
                    چارمی انتخاب نشده
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {selectedCharmItems.map((charm) => (
                      <div
                        key={charm.id}
                        className="flex items-center justify-between rounded-2xl bg-white/[0.05] px-4 py-3"
                      >
                        <span className="text-sm">{charm.title}</span>

                        <span className="text-xs text-white/45">
                          {formatPrice(charm.price)} تومان
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/45">قیمت پایه</span>

                  <span>
                    {selectedBase
                      ? `${formatPrice(selectedBase.price)} تومان`
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/45">قیمت چارم‌ها</span>

                  <span>{formatPrice(charmsPrice)} تومان</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="text-xs text-white/35">قیمت نهایی</p>
                    <p className="mt-1 text-xs text-white/25">
                      هزینه ارسال جداگانه محاسبه می‌شود
                    </p>
                  </div>

                  <p className="text-2xl font-semibold sm:text-3xl">
                    {formatPrice(totalPrice)}
                    <span className="mr-2 text-xs font-normal text-white/40">
                      تومان
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={!selectedBase}
                onClick={onAddToCart}
                className="group mt-2 flex w-full items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition-all duration-300 hover:bg-pink-300 disabled:cursor-not-allowed disabled:opacity-30"
              >
                افزودن طراحی به سبد خرید

                <Icon
                  name="bag"
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </button>

              {!selectedBase && (
                <p className="text-center text-xs text-white/30">
                  برای ادامه ابتدا یک پایه انتخاب کن.
                </p>
              )}

              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-white/30">
                <Icon name="check" size={13} />
                قبل از پرداخت امکان بررسی سفارش وجود دارد
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}