import Image from "next/image";
import { Reveal } from "../reveal";

export function ContactHero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden text-white">
      <Image
        src="/images/contact-hero.jpg"

        alt="ارتباط با وینگز"

        fill

        priority

        sizes="100vw"

        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="text-xs tracking-[6px] text-white/60">CONTACT WINGS</p>

          <h1 className="mt-8 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
            Let's
            <span className="text-pink-300 italic">talk.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-9 text-white/80">
            ما اینجاییم تا سوال‌ها، پیشنهادها و داستان‌های تو را بشنویم.
            <br />
            هر پیام، شروع یک ارتباط تازه است.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
