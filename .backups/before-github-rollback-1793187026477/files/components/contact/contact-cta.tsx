import Link from "next/link";
import Image from "next/image";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

export function ContactCTA() {
  return (
    <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden text-white">
      <Image
        src="/images/hero.png"

        alt="وینگز گالری"

        fill

        sizes="100vw"

        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="text-xs tracking-[6px] text-white/60">YOUR LITTLE JOY</p>

          <h2 className="mt-8 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
            هر داستانی
            <br />
            <span className="text-pink-300 italic">با یک انتخاب کوچک</span>
            <br />
            شروع می‌شود.
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-9 text-white/80">
            چیزی را انتخاب کن که شبیه توست؛ یک رنگ، یک حس، یک خاطره.
            <br />
            وینگز آماده ساختن داستان بعدی توست.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"

              className="group flex items-center gap-4 rounded-full bg-white px-9 py-4 text-sm text-black transition-all duration-300 hover:bg-pink-300"
            >
              مشاهده محصولات
              <Icon
                name="arrow"

                size={18}

                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>

            <Link
              href="/custom-design"

              className="rounded-full border border-white/40 px-9 py-4 text-sm transition-all duration-300 hover:bg-white hover:text-black"
            >
              خودت بساز
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
