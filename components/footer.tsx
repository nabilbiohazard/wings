import { Wordmark } from "./wordmark";
import { Icon } from "./icon";

const shopLinks = [
  { label: "فروشگاه", href: "#new-arrivals" },
  { label: "کالکشن‌ها", href: "#collections" },
  { label: "خودت بساز", href: "#build-your-own" },
];

const companyLinks = [
  { label: "درباره وینگز", href: "#our-story" },
  { label: "مجله وینگز", href: "/blog" },
  { label: "تماس با ما", href: "/contact" },
];

export function Footer() {
  return (
    <footer
      id="contact"
      className="w-full border-t border-black/10 bg-[#ebe2d9]"
    >
      {/* MAIN FOOTER */}
      <div className="mx-auto w-full max-w-[1600px] px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
          {/* BRAND */}
          <div className="lg:col-span-5">
            <Wordmark />

            <p className="mt-6 max-w-sm text-sm leading-8 text-black/50">
              تکه‌های کوچک، حس‌های بزرگ.
              <br />
              جزئیاتی برای کامل‌تر کردن استایل تو.
            </p>

            <a
              href="#collections"
              lang="en"
              dir="ltr"
              className="
                mt-10 inline-block
                font-serif text-3xl leading-[1.15]
                tracking-[-0.02em]
                text-black
                transition-opacity duration-300
                hover:opacity-50
                sm:text-4xl
              "
            >
              Spread a little
              <br />

              <em className="font-serif text-pink-400">
                more sparkle ♡
              </em>
            </a>
          </div>

          {/* SHOP LINKS */}
          <div className="lg:col-span-2">
            <p className="mb-5 text-[11px] tracking-[3px] text-black/35">
              SHOP
            </p>

            <nav className="flex flex-col items-start gap-4">
              {shopLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="
                    text-sm text-black/65
                    transition-all duration-300
                    hover:translate-x-[-3px]
                    hover:text-black
                  "
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* COMPANY LINKS */}
          <div className="lg:col-span-2">
            <p className="mb-5 text-[11px] tracking-[3px] text-black/35">
              WINGS
            </p>

            <nav className="flex flex-col items-start gap-4">
              {companyLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="
                    text-sm text-black/65
                    transition-all duration-300
                    hover:translate-x-[-3px]
                    hover:text-black
                  "
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* CONTACT */}
          <div className="lg:col-span-3">
            <p className="mb-5 text-[11px] tracking-[3px] text-black/35">
              CONTACT
            </p>

            <p className="text-sm leading-7 text-black/50">
              خوشحال می‌شویم از تو بشنویم.
            </p>

            <a
              href="mailto:hello@wingsgallery.ir"
              dir="ltr"
              className="
                group mt-5
                inline-flex items-center gap-3
                text-sm text-black
                transition-opacity duration-300
                hover:opacity-60
              "
            >
              hello@wingsgallery.ir

              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                <Icon
                  name="arrow"
                  size={16}
                />
              </span>
            </a>

            <div className="mt-8 h-px w-full bg-black/10" />

            <p className="mt-6 max-w-[260px] text-xs leading-6 text-black/40">
              برای سوالات، همکاری یا پیگیری سفارش از طریق صفحه تماس با ما
              پیام بفرست.
            </p>
          </div>
        </div>
      </div>

      {/* LARGE BRAND LINE */}
      <div className="overflow-hidden border-t border-black/[0.07]">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
          <div
            lang="en"
            dir="ltr"
            className="
              select-none py-7
              text-center font-serif
              text-[12vw] leading-none
              tracking-[-0.06em]
              text-black/[0.035]
              sm:text-[10vw]
              lg:text-[150px]
            "
          >
            WINGS GALLERY
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-black/[0.07]">
        <div
          className="
            mx-auto flex w-full max-w-[1600px]
            flex-col gap-5
            px-5 py-6
            text-xs text-black/40
            sm:px-8
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <p>
            © ۱۴۰۵ وینگز گالری. با عشق، برای تو.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#"
              className="transition-colors duration-300 hover:text-black"
            >
              حریم خصوصی
            </a>

            <a
              href="#"
              className="transition-colors duration-300 hover:text-black"
            >
              قوانین و مقررات
            </a>

            <a
              href="#"
              className="transition-colors duration-300 hover:text-black"
            >
              شرایط ارسال
            </a>
          </div>

          <a
            href="#"
            className="
              group inline-flex items-center gap-2
              text-black/60
              transition-colors duration-300
              hover:text-black
            "
          >
            بازگشت به بالا

            <span className="transition-transform duration-300 group-hover:-translate-y-1">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}