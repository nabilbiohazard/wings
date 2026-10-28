import { ArrowUpLeft, Plus } from "lucide-react";
import styles from "./contact.module.css";

const questions = [
  {
    question: "برای پیگیری سفارش چه اطلاعاتی بفرستم؟",
    answer:
      "شمارهٔ سفارش و شمارهٔ تماسی را که هنگام ثبت سفارش وارد کرده‌ای در پیام بنویس تا بتوانیم سفارشت را دقیق‌تر بررسی کنیم. سفارش‌هایت در حساب کاربری هم در دسترس‌اند.",
  },
  {
    question: "برای انتخاب محصول از کجا شروع کنم؟",
    answer:
      "کالکشن‌ها را ببین یا در فروشگاه با جست‌وجو و فیلترها، قطعه‌ای متناسب با سلیقه‌ات پیدا کن. اگر بین چند انتخاب مرددی، نام محصول‌ها را در فرم برایمان بنویس.",
  },
  {
    question: "می‌توانم زیورآلاتم را خودم طراحی کنم؟",
    answer:
      "بله. در بخش «خودت بساز» می‌توانی یک محصول انتخاب کنی و با چارم‌های دلخواهت طرح شخصی خودت را بسازی.",
  },
  {
    question: "برای همکاری یا پیشنهاد چطور پیام بدهم؟",
    answer:
      "در فرم همین صفحه، موضوع «همکاری و پیشنهاد» را انتخاب کن و ایده‌ات را بنویس. می‌توانی به hello@wingsgallery.ir هم ایمیل بزنی.",
  },
];
export function ContactFaq() {
  return (
    <section
      id="contact-faq"
      className={styles.faq}
      aria-labelledby="faq-title"
    >
      <div className={`site-container ${styles.faqInner}`}>
        <div className={styles.faqIntro}>
          <p className={styles.eyebrow} lang="en" dir="ltr">
            A FEW LITTLE ANSWERS
          </p>
          <h2 id="faq-title">
            شاید جواب،
            <br />
            <span>همین نزدیکی‌ست.</span>
          </h2>
          <p>
            پیش از نوشتن، نگاهی به این سؤال‌ها بینداز. اگر پاسخ تو اینجا نبود،
            خوشحال می‌شویم از خودت بشنویم.
          </p>
          <a href="#contact-form">
            هنوز سؤال دارم <ArrowUpLeft size={17} />
          </a>
        </div>
        <div className={styles.questions}>
          {questions.map((item, index) => (
            <details key={item.question} className={styles.question}>
              <summary>
                <span className={styles.questionNumber} lang="en">
                  0{index + 1}
                </span>
                <span>{item.question}</span>
                <Plus size={18} strokeWidth={1.3} />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
