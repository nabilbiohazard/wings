import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactFaq } from "@/components/contact/contact-faq";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f8f5f1] text-[#32262a]">
      <div aria-hidden="true" className="h-[140px] bg-[#171315]" />

      <section className="mx-auto max-w-[1440px] px-5 pt-14 pb-16 sm:px-8 sm:pt-20 lg:pt-24 lg:pb-24" aria-labelledby="contact-title">
        <div className="grid gap-7 border-b border-[#d9ccc8] pb-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end lg:gap-14 lg:pb-14" dir="rtl">
          <div>
            <p className="flex items-center gap-3 text-[11px] tracking-[0.16em] text-[#a56f7b]"><span className="h-px w-8 bg-[#bf929b]" aria-hidden="true" />راه ارتباطی وینگز <span dir="ltr">/ ۰۱</span></p>
            <h1 id="contact-title" className="mt-5 max-w-4xl text-[clamp(2.65rem,6vw,5.5rem)] leading-[1.3] font-medium tracking-[-0.055em]">
              بیا با هم <span className="text-[#a96d80]">حرف بزنیم.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-[#796d6b] sm:text-base sm:leading-9">سوالی درباره یک قطعه داری؟ برای سفارشت کمکی می‌خواهی؟ یا فقط دوست داری ایده‌ای را با ما در میان بگذاری؟ اینجا جای گفت‌وگوست.</p>
          </div>
          <p className="hidden border-r border-[#cdb7b9] pr-5 font-['Cormorant_Garamond'] text-4xl leading-none italic text-[#ae7d89] lg:block" dir="ltr">A little note<br />goes a long way.</p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] lg:gap-10 xl:gap-14" dir="rtl">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>

      <ContactFaq />

      <div className="border-t border-[#d9ccc8] px-5 py-8 sm:px-8" aria-hidden="true">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 text-[10px] tracking-[0.2em] text-[#a88b91]" dir="ltr"><span>WINGS GALLERY</span><span>MADE OF LITTLE MOMENTS ✦</span></div>
      </div>
    </main>
  );
}
