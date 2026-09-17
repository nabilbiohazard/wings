import Image from "next/image";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

export function CollectionsCTA() {
  return (
    <section className="relative min-h-[65vh] overflow-hidden text-white">
      <Image
        src="/images/collections-cta.jpg"

        alt="Create your collection"

        fill

        sizes="100vw"

        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex min-h-[65vh] items-center justify-center px-5 text-center sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs tracking-[6px] text-white/60">CREATE YOUR STORY</p>

            <h2 className="mt-7 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
              کالکشن
              <br />
              <span className="text-pink-300 italic">مخصوص خودت</span>
              را بساز
            </h2>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-9 text-white/80">
              از انتخاب رنگ‌ها و جزئیات کوچک، یک قطعه بساز که فقط متعلق به تو باشد.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/custom-design"

                className="group flex items-center gap-4 rounded-full bg-white px-9 py-4 text-sm text-black transition-all duration-300 hover:bg-pink-300"
              >
                خودت بساز
                <Icon
                  name="arrow"

                  size={17}

                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
              </a>

              <a
                href="/shop"

                className="rounded-full border border-white/40 px-9 py-4 text-sm transition-all duration-300 hover:bg-white hover:text-black"
              >
                مشاهده محصولات
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
