import Image from "next/image";
import { Reveal } from "../reveal";

export function CollectionsHero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden text-white">
      <Image
        src="/images/collections-hero.png"

        alt="Wings collections"

        fill

        priority

        sizes="100vw"

        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex min-h-[92vh] items-center justify-center px-5 text-center sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs tracking-[6px] text-white/60">WINGS COLLECTIONS</p>

            <h1 className="mt-8 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
              Discover
              <br />
              <span className="text-pink-300 italic">your story</span>
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-sm leading-9 text-white/80">
              مجموعه‌ای از اکسسوری‌های خاص برای لحظه‌هایی که فقط متعلق به تو هستند.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
