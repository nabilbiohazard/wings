import Image from "next/image";
import { Icon } from "./icon";
import { Reveal } from "./reveal";

export function EditorialSection() {
  return (
    <section
      id="our-story"
      className="w-full py-16 sm:py-20 lg:py-24"
      aria-labelledby="story-heading"
    >
      <div className="mx-auto w-full max-w-[1600px] px-8">
        <Reveal>
          <div className="relative min-h-[650px] overflow-hidden rounded-[40px]">
            <Image
              src="/images/hero.png"
              alt="لحظه‌ای آرام با اکسسوری‌های ظریف و رنگی"
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* IMAGE OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/40 to-black/10" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* TEXT */}

            <div className="relative z-10 flex h-full min-h-[650px] items-center justify-start px-8 sm:px-12 lg:px-20">
              <div className="max-w-xl text-right text-white">
                <Icon name="sparkle" size={30} className="text-pink-200" />

                <p className="mt-6 text-sm tracking-wide text-white/70">به قشنگیِ خودت</p>

                <h2
                  id="story-heading"
                  className="mt-5 text-4xl leading-relaxed font-medium sm:text-5xl lg:text-6xl"
                >
                  شادی، در همین
                  <br />
                  <span className="text-pink-200">چیزهای کوچک است.</span>
                </h2>

                <p className="mt-7 text-sm leading-9 text-white/85 sm:text-base">
                  ما به جادوی جزئیات کوچک باور داریم. به یک چارم که خاطره‌ای را زنده می‌کند، یک رنگ
                  که لبخند می‌آورد و هدیه‌ای که می‌گوید «به یادت هستم».
                </p>

                <p className="mt-4 text-sm leading-9 text-white/80">
                  وینگز برای همین لحظه‌هاست؛ برای اینکه هر روز، کمی بیشتر شبیه خودت بدرخشی.
                </p>

                <a
                  href="#journal"
                  className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/40 px-7 py-3 text-sm backdrop-blur-sm transition hover:bg-white hover:text-black"
                >
                  از دنیای وینگز بیشتر بخوان
                  <Icon name="arrow" size={18} />
                </a>

                <span lang="en" className="mt-8 block text-lg text-white/60 italic">
                  With love, Wings ♡
                </span>
              </div>
            </div>

            {/* IMAGE LABEL */}

            <span
              lang="en"
              className="absolute bottom-8 left-8 z-10 text-4xl leading-tight text-white drop-shadow-lg sm:text-5xl"
            >
              Everyday
              <br />
              <em>happiness.</em>
              <small className="mt-3 block text-xs tracking-[3px] text-white/70">
                GOOD JEWELRY. GOOD MOOD.
              </small>
            </span>
          </div>
        </Reveal>

        {/* JOURNAL */}

        <div
          id="journal"
          className="mt-16 grid grid-cols-1 gap-8 rounded-[32px] bg-black/[0.03] p-8 text-right sm:p-10 lg:grid-cols-3 lg:items-center"
        >
          <div>
            <p className="text-sm text-black/60">یادداشتی از مجله وینگز</p>

            <h3 className="mt-3 text-2xl font-medium">چطور یک اکسسوری، داستان تو می‌شود؟</h3>
          </div>

          <p className="text-sm leading-9 text-black/70">
            از رنگی که دوست داری شروع کن. یک چارم برای یک خاطره، یک قلب برای یک نفر و یک پروانه برای
            شروعی تازه. کنار هم بگذارشان؛ قشنگ‌ترین ترکیب، همان است که شبیه توست.
          </p>

          <a
            href="#collections"
            className="flex items-center justify-end gap-3 text-sm transition hover:opacity-60"
          >
            داستانت را بساز
            <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
