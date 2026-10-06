import { HeaderBackdrop } from "@/components/header-backdrop";
import Image from "next/image";
import Link from "next/link";

const values = [
  {
    number: "01",
    symbol: "✦",
    title: "زیبایی در جزئیات",
    description:
      "به همان انتخاب‌های کوچکی توجه می‌کنیم که یک روز معمولی را به خاطره تبدیل می‌کنند.",
    caption: "THE LITTLE THINGS",
  },
  {
    number: "02",
    symbol: "♡",
    title: "انتخابی شبیه تو",
    description:
      "سلیقه و داستان هر آدم متفاوت است؛ هر قطعه می‌تواند معنای خودش را برای تو داشته باشد.",
    caption: "PERSONAL BY NATURE",
  },
  {
    number: "03",
    symbol: "✳",
    title: "لذت هدیه دادن",
    description:
      "گاهی یک نشانه کوچک، بهترین راه برای گفتن حرفی بزرگ و به‌یادماندنی است.",
    caption: "A LITTLE LOVE",
  },
] as const;

const designSteps = [
  { number: "۰۱", title: "انتخاب کن", detail: "چارم‌هایی شبیه حال‌وهوای تو" },
  { number: "۰۲", title: "کنار هم بچین", detail: "ترکیبی با معنای شخصی" },
  { number: "۰۳", title: "داستانت را بساز", detail: "دستبندی که شبیه خودت است" },
] as const;

function ArrowIcon({
  className = "",
  direction = "left",
}: {
  className?: string;
  direction?: "left" | "diagonal";
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {direction === "diagonal" ? (
        <path d="M7 17 17 7M7 7h10v10" />
      ) : (
        <path d="M19 12H5m6-6-6 6 6 6" />
      )}
    </svg>
  );
}

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      dir="ltr"
      className={`flex items-center gap-3 text-[10px] font-medium tracking-[0.2em] sm:text-[11px] ${
        light ? "text-[#efd0da]" : "text-[#936577]"
      }`}
    >
      <span className="h-px w-7 shrink-0 bg-current opacity-60" />
      {children}
    </p>
  );
}

const container =
  "mx-auto w-full site-container   ";

const buttonFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#936577]";

export default function AboutPage() {
  return (
    <main
      dir="rtl"
      className="overflow-hidden bg-[#faf7f2] text-[#38292e]"
    >
      {/* فضای پشت هدر */}
      <HeaderBackdrop />

      {/* معرفی */}
      <section
        aria-labelledby="about-title"
        className="relative isolate"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 -z-10 h-[500px] w-[500px] max-w-full rounded-full bg-[#eddde1]/45 blur-3xl"
        />

        <div className={container}>
          <div className="flex items-center justify-between gap-4 border-b border-[#38292e]/10 py-5">
            <nav aria-label="مسیر صفحه" className="text-xs text-[#78656d]">
              <ol className="flex items-center gap-3">
                <li>
                  <Link
                    href="/"
                    className={`rounded-sm transition-colors hover:text-[#936577] ${buttonFocus}`}
                  >
                    خانه
                  </Link>
                </li>

                <li aria-hidden="true" className="text-[#bba6ae]">
                  /
                </li>

                <li aria-current="page" className="text-[#38292e]">
                  درباره وینگز
                </li>
              </ol>
            </nav>

            <span
              dir="ltr"
              className="hidden text-[10px] tracking-[0.18em] text-[#936577] sm:block"
            >
              THE WORLD OF WINGS
            </span>
          </div>

          <div className="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-20">
            <div className="max-w-xl">
              <Eyebrow>ABOUT WINGS / OUR STORY</Eyebrow>

              <h1
                id="about-title"
                className="mt-7 text-[clamp(2.5rem,4.6vw,4.6rem)] font-medium leading-[1.4]"
              >
                جزئیات کوچک،
                <br />
                <span className="text-[#a16c80]">داستان‌های</span>
                <br />
                بزرگ.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-8 text-[#78656d] sm:text-base sm:leading-9">
                وینگز از یک باور ساده شکل گرفت: یک اکسسوری می‌تواند
                نشانه‌ای از یک حس، یک خاطره یا بخشی از خود تو باشد.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#our-story"
                  className={`group inline-flex min-h-12 items-center gap-6 rounded-full bg-[#38292e] px-6 py-3 text-sm text-[#fff8f3] transition-colors hover:bg-[#936577] ${buttonFocus}`}
                >
                  داستان وینگز
                  <ArrowIcon className="shrink-0 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" />
                </a>

                <Link
                  href="/collections"
                  className={`inline-flex min-h-12 items-center gap-3 rounded-full px-3 py-3 text-sm text-[#785362] transition-colors hover:text-[#38292e] ${buttonFocus}`}
                >
                  کشف کالکشن‌ها
                  <ArrowIcon direction="diagonal" />
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4 border-t border-[#38292e]/10 pt-6 sm:mt-12">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#c6a5b1] text-xl text-[#936577]"
                >
                  ✦
                </span>

                <div>
                  <p className="text-xs font-medium">
                    تکه‌های کوچک، حس‌های بزرگ
                  </p>
                  <p className="mt-1 text-xs text-[#78656d]">
                    برای انتخاب‌هایی که معنایی برای تو دارند.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative pb-6 pl-4 sm:pb-8 sm:pl-8">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 top-8 rounded-t-[160px] rounded-b-lg border border-[#cbb0ba] sm:rounded-t-[220px]"
              />

              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[160px] rounded-b-lg bg-[#e8d7cc] sm:rounded-t-[220px]">
                <Image
                  src="/images/hero.png"
                  alt="زیورآلات رنگی وینگز در استایل روزمره"
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover object-center"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#30252a]/65 via-transparent to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                  <p className="text-sm leading-7 text-white">
                    یک قطعه کوچک،
                    <br />
                    بخشی از داستان تو.
                  </p>

                  <span
                    aria-hidden="true"
                    className="text-4xl text-[#f1cedb]"
                  >
                    ✦
                  </span>
                </div>
              </div>

              <div
                dir="ltr"
                className="absolute bottom-0 right-4 rounded-full border border-[#dcc9c9] bg-[#faf7f2] px-5 py-3 text-[9px] tracking-[0.16em] text-[#785362] sm:right-8"
              >
                LITTLE PIECES, BIG STORIES
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* جمله برند */}
      <section
        aria-label="نگاه وینگز"
        className="border-y border-[#38292e]/10 bg-[#eee3dd]"
      >
        <div
          className={`${container} flex flex-col items-center justify-between gap-5 py-7 text-center md:flex-row`}
        >
          <span
            dir="ltr"
            className="text-[10px] tracking-[0.2em] text-[#785362]"
          >
            MADE WITH FEELING
          </span>

          <p className="flex items-center gap-4 text-sm text-[#624c56]">
            <span aria-hidden="true" className="text-[#a16c80]">
              ✦
            </span>
            برای لحظه‌هایی که می‌خواهی به یاد بمانند
            <span aria-hidden="true" className="text-[#a16c80]">
              ✦
            </span>
          </p>

          <span
            dir="ltr"
            className="text-[10px] tracking-[0.2em] text-[#785362]"
          >
            WINGS GALLERY
          </span>
        </div>
      </section>

      {/* داستان برند */}
      <section
        id="our-story"
        aria-labelledby="story-title"
        className={`${container} scroll-mt-28 py-16 sm:py-24 lg:py-28`}
      >
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="relative aspect-[5/6] overflow-hidden rounded-sm bg-[#e7d5c7]">
                <Image
                  src="/images/about-hero.png"
                  alt="گردنبند، دستبند و گوشواره‌های ظریف وینگز"
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="relative -mt-16 mr-auto w-[88%] rounded-sm border border-[#e7d7d6] bg-[#faf7f2] p-6 sm:-mt-20 sm:p-8">
                <span
                  aria-hidden="true"
                  className="font-serif text-4xl leading-none text-[#bd8c9d]"
                >
                  “
                </span>

                <p className="mt-2 text-lg font-medium leading-8 sm:text-xl">
                  زیبایی، از جایی شروع می‌شود که چیزی برای تو معنا
                  پیدا می‌کند.
                </p>

                <p
                  dir="ltr"
                  className="mt-4 text-[9px] tracking-[0.2em] text-[#936577]"
                >
                  THE WINGS PHILOSOPHY
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 max-w-xl lg:order-2">
            <Eyebrow>01 / THE IDEA</Eyebrow>

            <h2
              id="story-title"
              className="mt-6 text-3xl font-medium leading-[1.5] sm:text-4xl lg:text-5xl"
            >
              زیبایی، وقتی
              <br />
              <span className="text-[#a16c80]">معنای شخصی</span>
              <br />
              پیدا می‌کند.
            </h2>

            <div className="mt-7 space-y-5 text-sm leading-9 text-[#78656d] sm:text-base">
              <p>
                گاهی یک چارم کوچک، یک رنگ آشنا یا هدیه‌ای ساده
                می‌تواند یادآور آدمی عزیز و لحظه‌ای خاص باشد.
                وینگز برای همین پیوند میان زیبایی و احساس شکل گرفت.
              </p>

              <p>
                ما دوست داریم انتخاب هر قطعه برای تو لذت‌بخش باشد؛
                چیزی که با سلیقه‌ات جور دربیاید و هر بار دیدنش،
                لبخندی به همراه داشته باشد.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-12 bg-[#c6a5b1]" />
              <span
                dir="ltr"
                className="font-serif text-2xl italic text-[#936577]"
              >
                With love, Wings ♡
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ارزش‌ها */}
      <section
        aria-labelledby="values-title"
        className="bg-[#38292e] py-16 text-[#fff8f3] sm:py-24"
      >
        <div className={container}>
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <Eyebrow light>02 / WHAT MATTERS</Eyebrow>

              <h2
                id="values-title"
                className="mt-6 text-3xl font-medium leading-relaxed sm:text-4xl"
              >
                چیزهایی که به آن‌ها
                <br className="sm:hidden" /> باور داریم
                <span className="text-[#d5a1b4]">.</span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-8 text-[#dfcbd2]">
              از اولین نگاه تا لحظه‌ای که یک قطعه را به بخشی از
              استایلت تبدیل می‌کنی.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14 lg:gap-6">
            {values.map((value) => (
              <article
                key={value.number}
                className="group flex flex-col rounded-2xl border border-white/15 bg-white/[0.04] p-6 transition-colors duration-300 hover:bg-white/[0.08] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="flex size-14 items-center justify-center rounded-full border border-[#d5a1b4]/35 text-3xl text-[#e5b7c7]"
                  >
                    {value.symbol}
                  </span>

                  <span
                    dir="ltr"
                    className="font-serif text-3xl text-[#d5a1b4]/60"
                  >
                    {value.number}
                  </span>
                </div>

                <h3 className="mt-10 text-xl font-medium">
                  {value.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-8 text-[#dfcbd2]">
                  {value.description}
                </p>

                <p
                  dir="ltr"
                  className="mt-8 border-t border-white/15 pt-5 text-[9px] tracking-[0.18em] text-[#d5a1b4]"
                >
                  {value.caption}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* طراحی شخصی */}
      <section
        aria-labelledby="personal-title"
        className={`${container} py-16 sm:py-24 lg:py-28`}
      >
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-xl">
            <Eyebrow>03 / YOUR STORY, YOUR DESIGN</Eyebrow>

            <h2
              id="personal-title"
              className="mt-6 text-3xl font-medium leading-[1.5] sm:text-4xl lg:text-5xl"
            >
              بعضی داستان‌ها را
              <br />
              <span className="text-[#a16c80]">خودت می‌سازی.</span>
            </h2>

            <p className="mt-6 text-sm leading-9 text-[#78656d] sm:text-base">
              چارم‌ها را انتخاب کن، کنار هم بچین و دستبندی بساز که
              هر جزئش برای تو معنایی دارد.
            </p>

            <ol className="mt-8">
              {designSteps.map((step) => (
                <li
                  key={step.number}
                  className="flex items-center gap-4 border-b border-[#38292e]/10 py-4 first:border-t"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#efe1e5] text-xs text-[#936577]">
                    {step.number}
                  </span>

                  <div>
                    <h3 className="text-sm font-medium">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-[#78656d]">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/custom-design"
              className={`group mt-8 inline-flex min-h-12 items-center gap-6 rounded-full bg-[#38292e] px-6 py-3 text-sm text-[#fff8f3] transition-colors hover:bg-[#936577] ${buttonFocus}`}
            >
              طراحی دستبند من
              <ArrowIcon className="transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" />
            </Link>
          </div>

          <div className="relative pb-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-lg bg-[#ead3bf]">
              <Image
                src="/images/custom-hero.png"
                alt="چارم‌ها و دستبند برای ساخت طرح شخصی"
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="absolute inset-x-5 bottom-0 flex items-center justify-between gap-4 rounded-xl border border-[#e6d8d8] bg-[#fffaf6] px-5 py-5 shadow-[0_12px_30px_rgba(56,41,46,0.06)] sm:inset-x-8 sm:px-6">
              <div>
                <p className="text-sm font-medium">
                  طراحی تو، امضای تو
                </p>

                <p
                  dir="ltr"
                  className="mt-2 text-[9px] tracking-[0.16em] text-[#936577]"
                >
                  ONE BRACELET. YOUR STORY.
                </p>
              </div>

              <span
                aria-hidden="true"
                className="text-3xl text-[#a16c80]"
              >
                ♡
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* دعوت پایانی */}
      <section
        aria-labelledby="next-story-title"
        className="px-5 pb-12 sm:px-8 sm:pb-16"
      >
        <div className="relative isolate mx-auto site-content overflow-hidden rounded-2xl bg-[#38292e] px-6 py-16 text-center text-white sm:px-12 sm:py-24">
          <Image
            src="/images/hero-butterfly.png"
            alt=""
            fill
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[#302029]/80"
          />

          <div className="mx-auto max-w-2xl">
            <span
              aria-hidden="true"
              className="inline-flex size-14 items-center justify-center rounded-full border border-[#f1cedb]/40 text-2xl text-[#f1cedb]"
            >
              ✦
            </span>

            <p
              dir="ltr"
              className="mt-6 text-[10px] tracking-[0.22em] text-[#f1cedb]"
            >
              THE NEXT CHAPTER
            </p>

            <h2
              id="next-story-title"
              className="mt-5 text-3xl font-medium leading-[1.5] sm:text-4xl lg:text-5xl"
            >
              داستان بعدی،
              <br />
              با انتخاب تو شروع می‌شود.
            </h2>

            <p className="mx-auto mt-5 max-w-md text-sm leading-8 text-[#eddee4]">
              قطعه‌ای پیدا کن که شبیه حال‌وهوای توست؛ برای خودت یا
              کسی که دوستش داری.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex min-h-12 items-center gap-6 rounded-full bg-[#fff8f3] px-7 py-3 text-sm font-medium text-[#38292e] transition-colors hover:bg-[#f1cedb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                دیدن محصولات
                <ArrowIcon className="transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/40 px-6 py-3 text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                گفت‌وگو با وینگز
                <ArrowIcon direction="diagonal" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
