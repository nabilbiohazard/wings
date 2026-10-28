"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpLeft, Check, LoaderCircle, Mail, Send } from "lucide-react";
import styles from "./contact.module.css";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setError("");
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true)
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "پیام ارسال نشد. دوباره تلاش کن یا مستقیم به ما ایمیل بزن.",
        );
      setStatus("sent");
      form.reset();
    } catch (reason) {
      setStatus("idle");
      setError(
        reason instanceof Error
          ? reason.message
          : "ارسال پیام انجام نشد؛ دوباره تلاش کن.",
      );
    }
  }
  return (
    <div id="contact-form" className={styles.formCard} dir="rtl">
      <div className={styles.formTop}>
        <p lang="en" dir="ltr">
          A NOTE TO WINGS
        </p>
        <span>
          <Mail size={19} strokeWidth={1.2} />
        </span>
      </div>
      {status === "sent" ? (
        <div className={styles.success} role="status">
          <span>
            <Check size={31} strokeWidth={1.3} />
          </span>
          <p className={styles.eyebrow} lang="en" dir="ltr">
            THANK YOU FOR YOUR NOTE
          </p>
          <h2>پیامت به دست ما رسید.</h2>
          <p>
            ممنون که برایمان نوشتی. از راه ارتباطی که وارد کردی پاسخ می‌دهیم.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setError("");
            }}
          >
            نوشتن پیام دیگر <ArrowUpLeft size={16} />
          </button>
        </div>
      ) : (
        <>
          <h2>از کجا شروع کنیم؟</h2>
          <p className={styles.formDescription}>
            چند خط از تو، شروع یک گفت‌وگوی خوب.
            <br />
            فیلدهای ستاره‌دار را پر کن و برایمان بنویس.
          </p>
          <form
            onSubmit={handleSubmit}
            className={styles.form}
            aria-busy={status === "sending"}
          >
            <fieldset
              disabled={status === "sending"}
              className={styles.formFields}
            >
              <legend className="sr-only">اطلاعات تماس و متن پیام</legend>
              <div className={styles.fieldGrid}>
                <label htmlFor="contact-name">
                  نام و نام خانوادگی <span>*</span>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="دوست داریم با نامت صدایت کنیم"
                  />
                </label>
                <label htmlFor="contact-phone">
                  شماره تماس <span>*</span>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    minLength={7}
                    maxLength={25}
                    pattern="[+0-9۰-۹٠-٩\s\(\)\-]{7,25}"
                    dir="ltr"
                    placeholder="09..."
                  />
                </label>
                <label htmlFor="contact-email">
                  ایمیل <small>(اختیاری)</small>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={150}
                    dir="ltr"
                    placeholder="name@example.com"
                  />
                </label>
                <label htmlFor="contact-subject">
                  موضوع گفت‌وگو <small>(اختیاری)</small>
                  <select id="contact-subject" name="subject" defaultValue="">
                    <option value="">دربارهٔ چه چیزی صحبت کنیم؟</option>
                    <option>راهنمایی برای انتخاب محصول</option>
                    <option>پیگیری سفارش</option>
                    <option>طراحی و چارم‌های دلخواه</option>
                    <option>همکاری و پیشنهاد</option>
                    <option>موضوع دیگر</option>
                  </select>
                </label>
              </div>
              <label htmlFor="contact-message" className={styles.messageLabel}>
                پیام تو <span>*</span>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={5}
                  placeholder="هر جزئیاتی که کمک می‌کند بهتر راهنمایی‌ات کنیم…"
                />
              </label>
              <p className={styles.messageHint}>
                بین ۱۰ تا ۳۰۰۰ نویسه؛ با خیال راحت برایمان بنویس.
              </p>
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="contact-website">وب‌سایت</label>
                <input
                  id="contact-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
            </fieldset>
            {error && (
              <p role="alert" className={styles.formError}>
                {error} <a href="mailto:hello@wingsgallery.ir">ارسال ایمیل</a>
              </p>
            )}
            <div className={styles.formBottom}>
              <p>
                پاسخ را از راه ارتباطی
                <br />
                واردشده در فرم دریافت می‌کنی.
              </p>
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "در حال ارسال…" : "ارسال پیام"}
                <span>
                  {status === "sending" ? (
                    <LoaderCircle size={17} className={styles.spinner} />
                  ) : (
                    <Send size={17} strokeWidth={1.4} />
                  )}
                </span>
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
