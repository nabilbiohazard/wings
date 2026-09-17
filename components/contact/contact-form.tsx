"use client";

import { useState } from "react";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <Reveal>
      <div className="rounded-[40px] bg-[#faf8f5] p-6 sm:p-10 lg:p-12">
        <div className="text-right">
          <p className="text-xs tracking-[5px] text-black/40">SEND MESSAGE</p>

          <h2 className="mt-5 font-serif text-3xl sm:text-4xl">با ما در ارتباط باش</h2>
        </div>

        {sent ? (
          <div className="mt-10 flex min-h-[300px] flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
              <Icon name="check" size={30} />
            </span>

            <h3 className="mt-6 text-xl">پیام شما ارسال شد</h3>

            <p className="mt-3 text-sm text-black/60">به زودی پاسخ شما را خواهیم داد.</p>
          </div>
        ) : (
          <form
            className="mt-10 space-y-5"

            onSubmit={(e) => {
              e.preventDefault();

              setSent(true);
            }}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <input
                required

                placeholder="نام شما"

                className="h-14 rounded-2xl border border-black/10 bg-white px-5 text-right text-sm transition outline-none focus:border-black"
              />

              <input
                required

                type="email"

                placeholder="ایمیل"

                className="h-14 rounded-2xl border border-black/10 bg-white px-5 text-right text-sm transition outline-none focus:border-black"
              />
            </div>

            <input
              placeholder="موضوع"

              className="h-14 w-full rounded-2xl border border-black/10 bg-white px-5 text-right text-sm transition outline-none focus:border-black"
            />

            <textarea
              required

              rows={5}

              placeholder="پیام شما..."

              className="w-full resize-none rounded-2xl border border-black/10 bg-white p-5 text-right text-sm leading-8 transition outline-none focus:border-black"
            />

            <button
              type="submit"

              className="group flex w-full items-center justify-center gap-4 rounded-full bg-black px-8 py-4 text-sm text-white transition-all duration-300 hover:bg-pink-400 hover:text-black"
            >
              ارسال پیام
              <Icon
                name="arrow"

                size={18}

                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
            </button>
          </form>
        )}
      </div>
    </Reveal>
  );
}
