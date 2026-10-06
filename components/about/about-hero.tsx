import Image from "next/image";
import { Reveal } from "../reveal";

export function AboutHero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden text-white">
      {/* IMAGE */}

      <Image
        src="/images/about-hero.png"
        alt="About Wings"
        fill
        priority
        loading="eager"
        sizes="100vw"
        className="object-cover"
      />
      {/* OVERLAY */}

      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-black/70" />

      {/* CONTENT */}

      <div className="relative z-10 mx-auto w-full site-container  ">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs tracking-[6px] text-white/70">WINGS GALLERY</p>

            <h1 className="mt-8 font-serif text-5xl leading-tight sm:text-6xl lg:text-8xl">
              Little pieces.
              <br />
              <span className="text-pink-300 italic">Big stories.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-sm leading-9 text-white/80 sm:text-base">
              وینگز از یک ایده ساده شروع شد؛ ساختن اکسسوری‌هایی که فقط زیبا نیستند، بلکه بخشی از
              خاطرات و داستان‌های شخصی تو می‌شوند.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <span className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm backdrop-blur-md">
                Our Story
              </span>

              <span className="rounded-full bg-white px-7 py-3 text-sm text-black">2026</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* BOTTOM LABEL */}

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] tracking-[5px] text-white/50">
        THE STORY BEHIND WINGS
      </div>
    </section>
  );
}
