import Link from "next/link";
import { Wordmark } from "./wordmark";

const shopLinks = [
  { label: "فروشگاه", href: "/#new-arrivals" },
  { label: "کالکشن‌ها", href: "/#collections" },
  { label: "خودت بساز", href: "/#build-your-own" },
];

const companyLinks = [
  { label: "درباره وینگز", href: "/#our-story" },
  { label: "مجله وینگز", href: "/blog" },
  { label: "تماس با ما", href: "/contact" },
];

const legalLinks = [
  { label: "حریم خصوصی", href: "/privacy" },
  { label: "قوانین و مقررات", href: "/terms" },
  { label: "شرایط ارسال", href: "/shipping" },
];

const focusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#92576b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#ebe2d9]";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 shrink-0 ${className}`}
    >
      <path
        d="M19 12H5m0 0 6 6m-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BraceletIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      className="h-10 w-10"
    >
      <path
        d="M34.5 13.5a15 15 0 1 0 4 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="m35 5 1.8 5.2L42 12l-5.2 1.8L35 19l-1.8-5.2L28 12l5.2-1.8L35 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 33s-6-3.8-6-7.5a3.2 3.2 0 0 1 6-1.5 3.2 3.2 0 0 1 6 1.5c0 3.7-6 7.5-6 7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 33v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      dir="rtl"
      className="w-full border-t border-[#443039]/10 bg-[#ebe2d9] text-[#443039]"
    >
      <div className="mx-auto site-container   ">
        {/* BUILD YOUR OWN */}
        <div className="border-b border-[#443039]/15 py-8 sm:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="flex items-start gap-4 sm:items-center sm:gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#92576b]/20 bg-[#f7f0eb] text-[#92576b] sm:h-[72px] sm:w-[72px]">
                <BraceletIcon />
              </span>

              <div>
                <p className="mb-2 text-xs font-medium text-[#805b68]">
                  یک انتخاب شخصی‌تر
                </p>

                <h2 className="text-xl font-semibold leading-relaxed tracking-tight sm:text-2xl">
                  دستبندی که داستان تو را می‌گوید.
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-7 text-[#69585e]">
                  چارم‌های دلخواهت را کنار هم بچین و ترکیب خودت را بساز.
                </p>
              </div>
            </div>

            <Link
              href="/#build-your-own"
              className={`group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-6 rounded-full bg-[#443039] px-7 py-3 text-sm font-medium text-[#fffaf7] transition-colors hover:bg-[#654451] md:w-auto ${focusClasses}`}
            >
              خودت بساز
              <ArrowIcon className="transition-transform motion-safe:group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 py-10 sm:gap-x-10 sm:py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* BRAND */}
          <div className="col-span-2 lg:col-span-4 lg:pe-10">
            <div className="flex justify-start">
              <Wordmark />
            </div>

            <p className="mt-5 max-w-sm text-sm leading-8 text-[#69585e]">
              تکه‌های کوچک، حس‌های بزرگ.
              <br />
              جزئیاتی برای کامل‌تر کردن استایل تو.
            </p>

            <p
              lang="en"
              dir="ltr"
              className="mt-6 w-fit font-serif text-2xl italic tracking-tight text-[#92576b] sm:text-3xl"
            >
              A little more sparkle.
            </p>
          </div>

          {/* SHOP */}
          <div className="lg:col-span-2">
            <h3 className="mb-3 text-sm font-semibold">کشف وینگز</h3>

            <nav aria-label="لینک‌های فروشگاه">
              <ul className="flex flex-col">
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`group inline-flex min-h-11 items-center gap-2 rounded-sm py-2 text-sm text-[#69585e] transition-colors hover:text-[#92576b] ${focusClasses}`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 rounded-full bg-[#92576b] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* COMPANY */}
          <div className="lg:col-span-2">
            <h3 className="mb-3 text-sm font-semibold">درباره ما</h3>

            <nav aria-label="لینک‌های آشنایی با وینگز">
              <ul className="flex flex-col">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`group inline-flex min-h-11 items-center gap-2 rounded-sm py-2 text-sm text-[#69585e] transition-colors hover:text-[#92576b] ${focusClasses}`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 rounded-full bg-[#92576b] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* CONTACT */}
          <div className="col-span-2 rounded-2xl border border-[#443039]/10 bg-[#f7f0eb]/70 p-5 sm:p-6 lg:col-span-4">
            <h3 className="text-sm font-semibold">در ارتباط باشیم</h3>

            <p className="mt-3 text-sm leading-7 text-[#69585e]">
              برای انتخاب، همکاری یا پیگیری سفارش، خوشحال می‌شویم از تو بشنویم.
            </p>

            <Link
              href="/contact"
              className={`group mt-5 flex min-h-12 items-center justify-between gap-4 rounded-xl border border-[#443039]/20 px-4 py-3 text-sm font-medium transition-colors hover:border-[#92576b]/50 hover:bg-[#ebe2d9]/60 hover:text-[#92576b] ${focusClasses}`}
            >
              تماس و پیگیری سفارش
              <ArrowIcon className="transition-transform motion-safe:group-hover:-translate-x-1" />
            </Link>

            <a
              href="mailto:hello@wingsgallery.ir"
              dir="ltr"
              className={`mt-3 inline-flex min-h-11 max-w-full items-center rounded-sm py-2 text-sm text-[#69585e] underline decoration-[#69585e]/30 underline-offset-4 transition-colors hover:text-[#92576b] ${focusClasses}`}
            >
              <span className="break-all">hello@wingsgallery.ir</span>
            </a>
          </div>
        </div>

        {/* BRAND SIGNATURE */}
        <div
          aria-hidden="true"
          lang="en"
          dir="ltr"
          className="pointer-events-none select-none overflow-hidden pb-5 pt-2 text-center font-serif text-[clamp(2.25rem,9.5vw,8rem)] leading-none tracking-[-0.055em] text-[#443039]/10 sm:pb-8"
        >
          WINGS GALLERY
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center gap-3 border-t border-[#443039]/15 py-5 text-xs text-[#69585e] lg:flex-row lg:justify-between lg:gap-6">
          <p className="text-center leading-6 lg:text-start">
            © ۱۴۰۵ وینگز گالری. با عشق، برای تو.
          </p>

          <nav aria-label="اطلاعات حقوقی و ارسال">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`inline-flex min-h-11 items-center rounded-sm py-2 transition-colors hover:text-[#92576b] ${focusClasses}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="#"
            className={`group inline-flex min-h-11 shrink-0 items-center gap-3 rounded-sm py-2 font-medium transition-colors hover:text-[#92576b] ${focusClasses}`}
          >
            بازگشت به بالا
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#443039]/20 transition-colors group-hover:border-[#92576b]/50">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 transition-transform motion-safe:group-hover:-translate-y-0.5"
              >
                <path
                  d="M12 19V5m0 0-6 6m6-6 6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
