"use client";

import { Reveal } from "../reveal";
import { Icon } from "../icon";

export function BlogNewsletter() {
  return (
    <section className="w-full bg-[#faf8f5] py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
        <Reveal>
          <div className="rounded-[40px] bg-black px-6 py-12 text-center text-white sm:px-12 lg:px-20">
            <p className="text-xs tracking-[6px] text-white/50">WINGS LETTER</p>

            <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
              داستان‌های تازه
              <br />
              <span className="text-pink-300 italic">وینگز</span>
              را دریافت کن.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/70">
              از کالکشن‌های جدید، ایده‌های استایل و داستان‌های پشت هر طراحی باخبر شو.
            </p>

            <form className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"

                placeholder="ایمیل شما"

                className="h-14 flex-1 rounded-full border border-white/20 bg-white/10 px-6 text-right text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50"
              />

              <button
                type="submit"

                className="flex h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-sm text-black transition-all duration-300 hover:bg-pink-300"
              >
                عضویت
                <Icon
                  name="arrow"

                  size={16}
                />
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
