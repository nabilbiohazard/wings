"use client";

import { useEffect, useState } from "react";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

export function Hero() {
  const [word, setWord] = useState<"style" | "story">("style");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      const timeout = setTimeout(() => {
        setWord((current) =>
          current === "style" ? "story" : "style"
        );

        setVisible(true);
      }, 400);

      return () => clearTimeout(timeout);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-dvh min-h-dvh overflow-hidden text-white">
      
      {/* HERO BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="/videos/videoplayback.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-linear-to-l from-black/80 via-black/45 to-black/20" />

        <div className="absolute top-1/2 -left-30 h-137.5 w-137.5 -translate-y-1/2 rounded-full bg-pink-300/10 blur-[130px]" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 flex h-full items-center justify-center px-5 pt-20 text-center sm:px-8">
        <Reveal className="mx-auto w-full site-container ">
          <div className="items-center gap-12">
            <div className="mx-auto max-w-xl text-center">

              <div className="my-8 flex items-center justify-center gap-4 text-xs tracking-[5px] text-white/60">
                <span>-THE LITTLE JOYS COLLECTION-</span>
              </div>

              {/* ANIMATED TITLE */}
              <h1 className="flex items-center justify-center gap-[0.2em] font-serif text-6xl leading-[1.05] sm:text-7xl lg:text-8xl">
                

                <span className="relative inline-flex min-w-[2.5em] justify-start overflow-hidden">
                  <span
                    className={`
                      text-pink-300 italic
                      transition-all duration-400 ease-out
                      ${
                        visible
                          ? "translate-y-0 opacity-100 blur-0"
                          : "-translate-y-3 opacity-0 blur-[4px]"
                      }
                    `}
                  >
                    {word}
                  </span>
                </span>
                <span>Your</span>
              </h1>

              {/* BUILD YOUR OWN */}
              <div className="relative mx-auto mt-8 w-full max-w-[420px]">
                <div className="absolute -inset-3 animate-pulse rounded-[30px] bg-pink-300/20 blur-2xl" />

                <div className="group relative overflow-hidden rounded-[26px] p-[1px]">
                  <div className="absolute -inset-[150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_80deg,#f9a8d4_140deg,white_180deg,#f9a8d4_220deg,transparent_300deg)]" />

                  <a
                    href="/custom-design"
                    className="relative flex items-center justify-between rounded-[25px] border border-white/10 bg-black/85 px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-black/90"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg text-black shadow-[0_0_25px_rgba(249,168,212,0.55)] transition-transform duration-500 group-hover:rotate-45">
                        ✦
                      </span>

                      <div className="text-right">
                        <p className="text-base font-medium text-white">
                          خودت بساز
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          ترکیب چارم‌های مخصوص تو
                        </p>
                      </div>
                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 group-hover:border-pink-300 group-hover:text-pink-300">
                      <Icon name="arrow" size={15} />
                    </span>
                  </a>
                </div>
              </div>

              <p className="mt-8 text-lg leading-9 text-white/80">
                اکسسوری‌هایی برای لحظه‌هایی که فقط متعلق به تو هستند.
                <br />
                هر انتخاب، یک داستان تازه.
              </p>

              <div className="mt-10 flex items-center justify-center gap-5">
                <a
                  href="#new-arrivals"
                  className="group relative inline-flex items-center gap-5 overflow-hidden rounded-full border border-white/25 bg-white/10 py-1.5 pr-6 pl-1.5 text-white shadow-[0_16px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-pink-300/70 hover:bg-white/15 hover:shadow-[0_20px_60px_rgba(249,168,212,0.2)]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative text-right" dir="rtl">
                    <span className="block text-[10px] tracking-[2px] text-pink-200/75">
                      تازه‌ترین‌ها
                    </span>
                    <span className="mt-0.5 block text-sm font-medium">
                      کشف کالکشن
                    </span>
                  </span>

                  <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-pink-300 text-black shadow-[0_0_24px_rgba(249,168,212,0.45)] transition-transform duration-500 group-hover:rotate-[-45deg] group-hover:scale-105">
                    <Icon name="arrow" size={17} />
                  </span>
                </a>
              </div>

            </div>
          </div>
        </Reveal>
      </div>

      {/* SCROLL */}
      <div className="absolute right-10 bottom-10 z-10 hidden items-center gap-4 text-xs tracking-[4px] text-white/60 lg:flex">
        SCROLL ↓
      </div>
    </section>
  );
}
