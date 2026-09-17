import Image from "next/image";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

export function FeaturedPost() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* IMAGE */}

            <div className="relative aspect-[4/3] overflow-hidden rounded-[40px]">
              <Image
                src="/images/blog-featured.jpg"

                alt="مقاله ویژه وینگز"

                fill

                sizes="
                  (max-width:900px) 100vw,
                  50vw
                "

                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* CONTENT */}

            <div className="text-right">
              <p className="text-xs tracking-[5px] text-black/40">FEATURED STORY</p>

              <h2 className="mt-6 font-serif text-4xl leading-relaxed sm:text-5xl">
                چطور یک
                <br />
                <span className="text-pink-400 italic">اکسسوری</span>
                مناسب انتخاب کنیم؟
              </h2>

              <p className="mt-6 text-sm leading-9 text-black/60">
                انتخاب یک اکسسوری فقط درباره ظاهر نیست؛ درباره احساسی است که همراه خودت می‌کنی. در
                این راهنما یاد می‌گیری چطور قطعه‌ای را انتخاب کنی که بیشتر شبیه تو باشد.
              </p>

              <a
                href="#"

                className="mt-8 inline-flex items-center gap-3 text-sm transition hover:opacity-60"
              >
                مطالعه مقاله
                <Icon
                  name="arrow"

                  size={18}
                />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
