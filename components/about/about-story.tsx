import Image from "next/image";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

export function AboutStory() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* IMAGE */}

            <div className="relative aspect-[4/5] overflow-hidden rounded-[40px]">
              <Image
                src="/images/hero.png"

                alt="داستان وینگز گالری"

                fill

                sizes="
                  (max-width:900px) 100vw,
                  50vw
                "

                className="object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* IMAGE LABEL */}

              <div className="absolute bottom-6 left-6 rounded-full bg-white/90 px-5 py-3 text-xs tracking-[3px] text-black backdrop-blur">
                EST. 2026
              </div>
            </div>

            {/* CONTENT */}

            <div className="text-right">
              <Icon
                name="sparkle"

                size={30}

                className="text-pink-400"
              />

              <p className="mt-6 text-xs tracking-[5px] text-black/40">OUR STORY</p>

              <h2 className="mt-5 font-serif text-4xl leading-relaxed sm:text-5xl">
                داستانی که از
                <br />
                <span className="text-pink-400 italic">جزئیات کوچک</span>
                شروع شد.
              </h2>

              <p className="mt-8 text-sm leading-9 text-black/70">
                وینگز با یک باور ساده ساخته شد؛ اینکه زیبایی همیشه در چیزهای بزرگ نیست. گاهی یک چارم
                کوچک، یک رنگ خاص یا یک هدیه ساده می‌تواند یک احساس بزرگ بسازد.
              </p>

              <p className="mt-5 text-sm leading-9 text-black/70">
                ما اکسسوری‌هایی طراحی می‌کنیم که فقط برای پوشیدن نیستند؛ بلکه بخشی از لحظه‌ها،
                خاطرات و داستان شخصی تو می‌شوند.
              </p>

              <div className="mt-10 flex items-center justify-end gap-4">
                <span className="h-px w-16 bg-black/20" />

                <span className="font-serif text-xl text-black/50 italic">With love, Wings ♡</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
