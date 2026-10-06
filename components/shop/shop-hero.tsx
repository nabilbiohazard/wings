import Image from "next/image";
import { Reveal } from "../reveal";

export function ShopHero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden text-white">
      <Image
        src="/images/shop-hero.png"
        alt="Wings collection"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] site-container items-center justify-center  ">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-6 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
              Find your
              <br />
              <span className="text-pink-300 italic">little joy</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-9 text-white/80">
              قطعه‌ای کوچک برای لحظه‌هایی که فقط متعلق به تو هستند.
              <br />
              اکسسوری‌هایی برای ساختن داستان شخصی تو.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <span className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm backdrop-blur-md">
                New Collection
              </span>

              <span className="rounded-full bg-white px-6 py-3 text-sm text-black">2026</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
