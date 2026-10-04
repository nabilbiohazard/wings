const questions = [
  { question: "برای پیگیری سفارش چه اطلاعاتی بفرستم؟", answer: "شماره سفارش و شماره تماسی را که هنگام ثبت سفارش وارد کرده‌ای در پیام بنویس تا بتوانیم سفارشت را دقیق‌تر بررسی کنیم." },
  { question: "برای انتخاب محصول از کجا شروع کنم؟", answer: "کالکشن‌ها را ببین یا در فروشگاه با جستجو و فیلترها، قطعه‌ای متناسب با سلیقه‌ات پیدا کن." },
  { question: "می‌توانم دستبندم را خودم طراحی کنم؟", answer: "بله. در بخش «خودت بساز» می‌توانی چارم‌ها را انتخاب کنی و روی دستبند دلخواهت بچینی." },
  { question: "برای همکاری یا پیشنهاد چطور پیام بدهم؟", answer: "از فرم همین صفحه یا ایمیل hello@wingsgallery.ir برایمان بنویس و موضوع پیام را مشخص کن." },
] as const;

export function ContactFaq() {
  return (
    <section id="contact-faq" className="border-y border-[#dfd2cf] bg-[#eee6e1] px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[minmax(280px,0.65fr)_minmax(0,1fr)] lg:gap-20" dir="rtl">
        <div>
          <p className="flex items-center gap-3 text-[11px] tracking-[0.16em] text-[#a56f7b]"><span className="h-px w-8 bg-[#bf929b]" aria-hidden="true" />چند پرسش رایج <span dir="ltr">/ ۰۲</span></p>
          <h2 id="faq-title" className="mt-5 max-w-md text-3xl leading-[1.45] font-medium tracking-[-0.035em] sm:text-4xl">شاید جواب سوالت همین‌جا باشد.</h2>
          <p className="mt-5 max-w-sm text-sm leading-8 text-[#817471]">اگر جواب را پیدا نکردی، فرم بالا برای توست؛ هر چیزی که ذهنت را درگیر کرده برایمان بنویس.</p>
          <a href="#contact-form" className="mt-7 inline-flex items-center gap-3 border-b border-[#a77283] pb-2 text-sm font-medium text-[#88576a] transition-colors hover:text-[#4f303c]">نوشتن پیام <span aria-hidden="true">↖</span></a>
        </div>
        <div className="border-t border-[#cdbebb]">
          {questions.map((item, index) => (
            <details key={item.question} className="group border-b border-[#cdbebb]">
              <summary className="flex cursor-pointer list-none items-start gap-4 py-5 marker:hidden sm:gap-6 sm:py-6">
                <span className="pt-1 text-[11px] text-[#ae8b92]" dir="ltr">0{index + 1}</span>
                <span className="flex-1 text-sm leading-7 font-medium text-[#3c3032] sm:text-base">{item.question}</span>
                <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#bda8a9] text-lg text-[#8d6671] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pr-8 pb-7 text-sm leading-8 text-[#817471] sm:pr-12">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
