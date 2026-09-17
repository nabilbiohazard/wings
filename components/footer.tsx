import { Wordmark } from "./wordmark";
import { Icon } from "./icon";

export function Footer() {
  return (
    <footer id="contact" className="w-full border-t border-black/10 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-8">
        <div className="grid grid-cols-1 gap-10 text-right lg:grid-cols-3 lg:items-start">
          <div>
            <Wordmark />

            <p className="mt-5 text-sm text-black/60">تکه‌های کوچک، حس‌های بزرگ.</p>
          </div>

          <div className="flex flex-col gap-3 text-right">
            <span className="text-sm text-black/60">خوشحال می‌شویم از تو بشنویم</span>

            <a
              href="mailto:hello@wingsgallery.ir"
              dir="ltr"
              className="flex items-center justify-end gap-3 text-sm transition hover:opacity-60"
            >
              hello@wingsgallery.ir
              <Icon name="arrow" size={17} />
            </a>
          </div>

          <a
            href="#collections"
            lang="en"
            dir="ltr"
            className="text-right text-3xl leading-tight transition hover:opacity-60"
          >
            Spread a little
            <br />
            <em>more sparkle ♡</em>
          </a>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-black/10 pt-6 text-right text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© ۱۴۰۵ وینگز گالری. با عشق، برای تو.</span>

          <span>نسخه نمایشی فروشگاه · محصولات و قیمت‌ها نمونه هستند</span>

          <a href="#" className="transition hover:text-black">
            بازگشت به بالا ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
