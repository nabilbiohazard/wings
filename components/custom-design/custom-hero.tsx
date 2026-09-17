import Image from "next/image";
import Link from "next/link";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

export function CustomHero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-[#f6f0eb]">
      <Image
        src="/images/custom-hero.png"
        alt="Create your own jewelry"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-[1600px] items-center justify-center px-5 pt-28 sm:px-8 lg:pt-32">
        <Reveal className="w-full">
          <div
            className="mx-auto max-w-3xl text-center text-white"
            dir="rtl"
          >
            <p className="text-xs tracking-[5px] text-white/60">
              CREATE YOUR OWN
            </p>

            <h1 className="mt-6 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
              چیزی بساز
              <br />
              که فقط
              <span className="mx-3 italic text-pink-300">مال تو</span>
              باشد
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-9 text-white/80 sm:text-base">
              از انتخاب پایه شروع کن، چارم‌های مورد علاقه‌ات را اضافه کن و یک
              اکسسوری بساز که داستان خودت را تعریف کند.
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a
                href="#builder"
                className="group flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-all duration-300 hover:bg-pink-300"
              >
                شروع طراحی
                <Icon
                  name="arrow"
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
              </a>

              <Link
                href="/collections"
                className="flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-8 py-4 text-sm text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black"
              >
                دیدن کالکشن‌ها
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs text-white/70">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                انتخاب پایه
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                انتخاب چارم
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                پیش‌نمایش زنده
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}