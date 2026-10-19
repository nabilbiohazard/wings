import { Sparkles } from "lucide-react";

export function CommerceHero({ checkout = false }: { checkout?: boolean }) {
  return (
    <section className="commerce-hero">
      <div className="commerce-hero-copy">
        <p className="commerce-eyebrow" lang="en" dir="ltr">
          WINGS · {checkout ? "A LITTLE JOY, ON ITS WAY" : "YOUR LITTLE WORLD"}
        </p>
        <h1>
          {checkout ? "ثبت سفارش" : "حساب کاربری من"}
          <span className="commerce-hero-flower" aria-hidden="true">
            ✳
          </span>
        </h1>
        <p>
          {checkout
            ? "چند قدم کوچک تا رسیدن انتخاب‌های دوست‌داشتنی‌ات."
            : "جایی برای انتخاب‌های تو، داستان‌های تازه و تکه‌های کوچک شادی."}
        </p>
        <div className="commerce-hero-caption">
          <Sparkles size={14} aria-hidden="true" />
          <span>
            {checkout
              ? "با دقت انتخاب کردی؛ با عشق آماده‌اش می‌کنیم."
              : "خوش آمدی به گوشهٔ کوچک خودت در وینگز."}
          </span>
        </div>
      </div>
      <div className="commerce-hero-art" aria-hidden="true">
        <span className="commerce-orbit" />
        <span className="commerce-orbit commerce-orbit-inner" />
        <svg viewBox="0 0 160 160" fill="none">
          <path
            d="M80 89C38 103 14 66 31 39C46 17 72 40 80 70C88 40 114 17 129 39C146 66 122 103 80 89Z"
            fill="currentColor"
            fillOpacity=".13"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M80 87C61 82 39 108 55 125C66 138 78 112 80 99C82 112 94 138 105 125C121 108 99 82 80 87Z"
            fill="currentColor"
            fillOpacity=".08"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M80 101V67M80 70L71 59M80 70L89 59"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <span className="commerce-art-star">✦</span>
        <span className="commerce-art-word" lang="en">
          a little more sparkle.
        </span>
      </div>
    </section>
  );
}
