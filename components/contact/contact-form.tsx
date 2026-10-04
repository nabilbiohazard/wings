"use client";

import { useState, type FormEvent } from "react";

const fieldClass = "w-full border-0 border-b border-[#d9cbc7] bg-transparent px-0 py-3 text-sm text-[#382c30] outline-none transition-colors placeholder:text-[#b6a8a6] focus:border-[#9e6577]";

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

      if (!response.ok) throw new Error("Message delivery failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("idle");
      setError("پیام ارسال نشد. دوباره تلاش کن یا مستقیم به ما ایمیل بزن.");
    }
  }

  return (
    <div id="contact-form" className="relative overflow-hidden rounded-[4px] border border-[#e6dad4] bg-[#fffdfa] px-6 py-8 shadow-[0_22px_70px_rgba(62,35,43,0.04)] sm:px-10 sm:py-10 xl:px-12 xl:py-12" dir="rtl">
      <span aria-hidden="true" className="absolute top-0 right-0 h-1 w-28 bg-[#bd8797]" />
      <div className="flex items-center justify-between gap-5 border-b border-[#e8deda] pb-6">
        <p className="text-[10px] tracking-[0.22em] text-[#a66e7c]" dir="ltr">A NOTE TO WINGS</p>
        <span className="text-[11px] text-[#b1979c]">۰۱ / ۰۲</span>
      </div>
      <h2 className="mt-8 text-2xl leading-[1.45] font-medium tracking-[-0.025em] sm:text-3xl">پیامت را برایمان بنویس.</h2>
      <p className="mt-3 max-w-md text-sm leading-8 text-[#857673]">فرم را پر کن و هر جزئیاتی که کمک می‌کند بهتر راهنمایی‌ات کنیم برایمان بنویس.</p>

      {status === "sent" ? (
        <div role="status" className="mt-10 min-h-96 border-t border-[#e8deda] pt-14 text-center">
          <span aria-hidden="true" className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#caa9b1] text-2xl text-[#9e6577]">✦</span>
          <h3 className="mt-7 text-2xl font-medium">پیامت به دست ما رسید.</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-8 text-[#857673]">ممنون که برایمان نوشتی. از راه ارتباطی که وارد کردی پاسخ می‌دهیم.</p>
          <button type="button" onClick={() => setStatus("idle")} className="mt-8 border-b border-[#9e6577] pb-1 text-sm text-[#8d596b]">نوشتن پیام دیگر</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium text-[#68575b]">نام و نام خانوادگی <span className="text-[#a66e7c]">*</span></label>
              <input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="نامت را بنویس" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-xs font-medium text-[#68575b]">شماره تماس <span className="text-[#a66e7c]">*</span></label>
              <input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={7} maxLength={25} dir="ltr" placeholder="09..." className={`${fieldClass} text-left`} />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs font-medium text-[#68575b]">ایمیل <span className="font-normal text-[#ad9d9d]">(اختیاری)</span></label>
              <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={150} dir="ltr" placeholder="name@example.com" className={`${fieldClass} text-left`} />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-xs font-medium text-[#68575b]">موضوع <span className="font-normal text-[#ad9d9d]">(اختیاری)</span></label>
              <input id="contact-subject" name="subject" maxLength={120} placeholder="مثلاً درباره سفارش" className={fieldClass} />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-xs font-medium text-[#68575b]">متن پیام <span className="text-[#a66e7c]">*</span></label>
            <textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={5} placeholder="از کجا شروع کنیم؟" className={`${fieldClass} min-h-32 resize-y leading-8`} />
          </div>
          <div className="sr-only" aria-hidden="true"><label htmlFor="contact-website">وب‌سایت</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
          {error && <p role="alert" className="border-r-2 border-[#b86d73] bg-[#faeded] px-4 py-3 text-sm leading-7 text-[#934a52]">{error} <a href="mailto:hello@wingsgallery.ir" className="underline underline-offset-2">ارسال ایمیل</a></p>}
          <div className="flex flex-col gap-5 border-t border-[#e8deda] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xs text-xs leading-6 text-[#9b8c8b]">فیلدهای ستاره‌دار ضروری هستند.</p>
            <button type="submit" disabled={status === "sending"} className="group inline-flex min-h-12 items-center justify-center gap-5 self-start rounded-full bg-[#38282f] py-1.5 pr-6 pl-1.5 text-sm text-white transition-colors hover:bg-[#9d6276] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#38282f] disabled:cursor-wait disabled:opacity-60">
              {status === "sending" ? "در حال ارسال..." : "ارسال پیام"}
              <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-white/15 text-lg transition-transform group-hover:-translate-x-1 motion-reduce:transform-none">←</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
