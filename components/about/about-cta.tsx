import Link from "next/link";
import Image from "next/image";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

export function AboutCTA() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden text-white">
      <Image
        src="/images/about-hero.png"

        alt="کالکشن وینگز"

        fill

        sizes="100vw"

        className="object-cover"
      />

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto site-container  text-center ">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs tracking-[6px] text-white/60">YOUR STORY</p>

            <h2 className="mt-8 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
              داستان بعدی
              <br />
              <span className="text-pink-300 italic">با تو شروع می‌شود.</span>
            </h2>

            <p className="mx-auto mt-8 max-w-xl text-sm leading-9 text-white/80">
              یک انتخاب کوچک، یک حس تازه، یک تکه از داستان شخصی تو. کالکشن وینگز را کشف کن و چیزی را
              پیدا کن که شبیه خودت باشد.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/shop"

                className="flex items-center gap-4 rounded-full bg-white px-9 py-4 text-sm text-black transition-all duration-300 hover:bg-pink-300"
              >
                مشاهده کالکشن
                <Icon
                  name="arrow"

                  size={18}
                />
              </Link>

              <Link
                href="/custom-design"

                className="rounded-full border border-white/40 px-9 py-4 text-sm transition-all duration-300 hover:bg-white hover:text-black"
              >
                خودت بساز
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
