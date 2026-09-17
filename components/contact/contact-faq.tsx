"use client";

import { useState } from "react";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

const questions = [
  {
    question: "چطور سفارش خودم را ثبت کنم؟",
    answer:
      "محصول مورد نظر خود را انتخاب کنید، به سبد خرید اضافه کنید و مراحل ثبت سفارش را کامل کنید.",
  },

  {
    question: "ارسال سفارش‌ها چقدر زمان می‌برد؟",
    answer:
      "زمان ارسال بسته به مقصد متفاوت است. پس از ثبت سفارش، اطلاعات ارسال برای شما ارسال خواهد شد.",
  },

  {
    question: "شرایط بازگشت کالا چگونه است؟",
    answer:
      "در صورت وجود مشکل، طبق قوانین بازگشت وینگز می‌توانید درخواست بررسی سفارش خود را ثبت کنید.",
  },

  {
    question: "آیا امکان طراحی اختصاصی وجود دارد؟",
    answer: "بله. در بخش «خودت بساز» می‌توانید ترکیب شخصی خودتان را ایجاد کنید.",
  },
];

export function ContactFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="w-full bg-[#faf8f5] py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs tracking-[5px] text-black/40">FAQ</p>

            <h2 className="mt-6 font-serif text-4xl sm:text-5xl">سوالات رایج</h2>
          </div>

          <div className="mt-12 space-y-4">
            {questions.map((item, index) => {
              const active = open === index;

              return (
                <div
                  key={item.question}

                  className="overflow-hidden rounded-[28px] border border-black/10 bg-white"
                >
                  <button
                    onClick={() => setOpen(active ? null : index)}

                    className="flex w-full items-center justify-between gap-5 p-6 text-right"
                  >
                    <span className="text-base font-medium">{item.question}</span>

                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                        active ? "rotate-45 bg-black text-white" : "bg-black/5 text-black"
                      } `}
                    >
                      <Icon
                        name="plus"

                        size={16}
                      />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-500 ${
                      active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    } `}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-8 text-black/60">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
