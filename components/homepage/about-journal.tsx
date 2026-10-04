import Link from "next/link";
import { Icon } from "../icon";
import { HoverVideoSection } from "./hover-video-section";

export function AboutJournal() {
  return (
    <section
      id="about-and-journal"
      dir="rtl"
      aria-label="درباره ما و مجله وینگر"
      className="grid w-full grid-cols-1 md:grid-cols-2"
    >
      <HoverVideoSection
        as="article"
        src="/videos/about_us.mp4"
        aria-labelledby="about-preview-heading"
        className="group relative isolate flex min-h-[480px] flex-col justify-between overflow-hidden bg-[#623c50] px-6 py-9 text-white grayscale transition-[filter] duration-500 hover:grayscale-0 focus-within:grayscale-0 motion-reduce:transition-none sm:px-10 sm:py-12 lg:min-h-[620px] lg:px-16 lg:py-14 xl:px-20"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#24151f]/60" />

        <div className="relative flex items-center justify-between gap-4">
          <p
            lang="en"
            dir="ltr"
            className="text-[10px] tracking-[4px] text-white/85"
          >
            THE STORY OF WINGS
          </p>
          <Icon name="sparkle" size={24} className="text-pink-200" />
        </div>

        <div className="relative mt-24 max-w-lg">
          <p className="mb-4 text-xs text-pink-200">
            پشت هر جزئیات، یک قصه است
          </p>
          <h2
            id="about-preview-heading"
            className="text-4xl leading-normal font-medium sm:text-5xl lg:text-6xl"
          >
            درباره ما
          </h2>
          <p className="mt-5 max-w-md text-sm leading-8 text-white/85 sm:text-base sm:leading-9">
            ما به شادیِ چیزهای کوچک باور داریم؛ به رنگی که حال تو را خوب می‌کند
            و چارمی که گوشه‌ای از داستان تو را همراهت نگه می‌دارد.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex min-h-12 items-center gap-6 rounded-full bg-pink-200 py-2 pr-6 pl-2 text-sm font-medium text-[#35232c] transition-colors hover:bg-pink-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-200"
          >
            قصه وینگز را بخوان
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60">
              <Icon name="arrow" size={17} />
            </span>
          </Link>
        </div>
      </HoverVideoSection>

      <HoverVideoSection
        as="article"
        src="/videos/magazine.mp4"
        aria-labelledby="journal-preview-heading"
        className="group relative isolate flex min-h-[480px] flex-col justify-between overflow-hidden bg-[#542f3d] px-6 py-9 text-white grayscale transition-[filter] duration-500 hover:grayscale-0 focus-within:grayscale-0 motion-reduce:transition-none sm:px-10 sm:py-12 lg:min-h-[620px] lg:px-16 lg:py-14 xl:px-20"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#24151f]/60" />

        <div className="relative flex items-center justify-between gap-4">
          <p lang="en" dir="ltr" className="text-[10px] tracking-[4px]">
            THE WINGS JOURNAL
          </p>
          <span
            aria-hidden="true"
            className="font-['Cormorant_Garamond'] text-3xl italic"
          >
            Journal
          </span>
        </div>

        <div className="relative mt-24 max-w-lg">
          <p className="mb-4 text-xs text-pink-200">
            کمی بخوان، کلی الهام بگیر
          </p>
          <h2
            id="journal-preview-heading"
            className="text-4xl leading-normal font-medium sm:text-5xl lg:text-6xl"
          >
            مجله وینگر
          </h2>
          <p className="mt-5 max-w-md text-sm leading-8 text-white/85 sm:text-base sm:leading-9">
            از کنار هم گذاشتن چارم‌ها تا پیدا کردن هدیه‌ای به‌یادماندنی؛ ایده‌ها
            و قصه‌هایی برای اینکه استایلت، بیشتر شبیه خودت باشد.
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex min-h-12 items-center gap-6 rounded-full bg-pink-200 py-2 pr-6 pl-2 text-sm font-medium text-[#35232c] transition-colors hover:bg-pink-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-200"
          >
            ورق زدن مجله
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60">
              <Icon name="arrow" size={17} />
            </span>
          </Link>
        </div>
      </HoverVideoSection>
    </section>
  );
}
