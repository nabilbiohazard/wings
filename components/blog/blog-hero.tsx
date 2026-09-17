import Image from "next/image";
import { Reveal } from "../reveal";

export function BlogHero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden text-white">
      <Image
        src="/images/blog-hero.png"

        alt="Wings Journal"

        fill

        priority

        sizes="100vw"

        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-[1600px] items-center justify-center px-5 text-center sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs tracking-[6px] text-white/60">WINGS JOURNAL</p>

            <h1 className="mt-8 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
              Stories,
              <br />
              <span className="text-pink-300 italic">inspirations</span>
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-sm leading-9 text-white/80">
              داستان‌هایی درباره سبک، انتخاب‌های شخصی و زیبایی در جزئیات کوچک.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
