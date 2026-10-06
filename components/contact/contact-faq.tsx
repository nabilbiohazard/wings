const questions = [
  {
    question: "برای پیگیری سفارش چه اطلاعاتی بفرستم؟",
    answer:
      "شماره سفارش و شماره تماسی را که هنگام ثبت سفارش وارد کرده‌ای در پیام بنویس تا بتوانیم سفارشت را دقیق‌تر بررسی کنیم.",
  },
  {
    question: "برای انتخاب محصول از کجا شروع کنم؟",
    answer:
      "کالکشن‌ها را ببین یا در فروشگاه با جستجو و فیلترها، قطعه‌ای متناسب با سلیقه‌ات پیدا کن.",
  },
  {
    question: "می‌توانم دستبندم را خودم طراحی کنم؟",
    answer:
      "بله. در بخش «خودت بساز» می‌توانی چارم‌ها را انتخاب کنی و روی دستبند دلخواهت بچینی.",
  },
  {
    question: "برای همکاری یا پیشنهاد چطور پیام بدهم؟",
    answer:
      "از فرم همین صفحه یا ایمیل hello@wingsgallery.ir برایمان بنویس و موضوع پیام را مشخص کن.",
  },
] as const;

export function ContactFaq() {
  return (
    <section
      id="contact-faq"
      className="contact-faq"
      aria-labelledby="faq-title"
    >
      <div className="site-container contact-container contact-faq-grid" dir="rtl">
        <div>
          <p className="contact-eyebrow">پیش از ارسال پیام</p>
          <h2
            id="faq-title"
            className="mt-5 max-w-md text-3xl leading-[1.45] font-medium sm:text-4xl"
          >
            شاید پاسخ همین‌جا باشد.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-8 contact-muted">
            اگر جواب را پیدا نکردی، فرم بالا برای توست؛ هر چیزی که ذهنت را درگیر
            کرده برایمان بنویس.
          </p>
          <a href="#contact-form" className="contact-faq-link">
            نوشتن پیام <span aria-hidden="true">↖</span>
          </a>
        </div>
        <div className="border-t border-[#cdbebb]">
          {questions.map((item, index) => (
            <details key={item.question} className="contact-question group">
              <summary className="contact-summary">
                <span className="pt-1 text-[11px] text-[#ae8b92]" dir="ltr">
                  0{index + 1}
                </span>
                <span className="flex-1 text-sm leading-7 font-medium text-[#3c3032] sm:text-base">
                  {item.question}
                </span>
                <span aria-hidden="true" className="contact-toggle">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="pr-8 pb-7 text-sm leading-8 contact-muted sm:pr-12">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
