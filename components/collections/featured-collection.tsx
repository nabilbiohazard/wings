import Link from "next/link";
import Image from "next/image";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

export function FeaturedCollection() {
  return (
    <section className="w-full bg-[#faf8f5] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto site-container  ">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* IMAGE */}

            <div className="relative aspect-[4/5] overflow-hidden rounded-[40px]">
              <Image
                src="/images/hero.png"

                alt="Signature collection"

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
              <p className="text-xs tracking-[5px] text-black/40">SIGNATURE COLLECTION</p>

              <h2 className="mt-6 font-serif text-4xl leading-relaxed sm:text-5xl lg:text-6xl">
                The Little
                <br />
                <span className="text-pink-400 italic">Joys</span>
              </h2>

              <p className="mt-6 text-sm leading-9 text-black/60">
                کالکشنی از قطعات ظریف و خاص که برای لحظه‌های کوچک اما به‌یادماندنی طراحی شده‌اند.
                <br />
                هر قطعه، داستانی دارد که با تو کامل می‌شود.
              </p>

              <div className="mt-8 flex justify-end">
                <Link
                  href="/shop"

                  className="group flex items-center gap-4 rounded-full bg-black px-8 py-4 text-sm text-white transition-all duration-300 hover:bg-pink-400 hover:text-black"
                >
                  مشاهده محصولات
                  <Icon
                    name="arrow"

                    size={17}

                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
