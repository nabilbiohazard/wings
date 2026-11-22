"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../icon";

const mobileViewport = "(max-width: 767px), (hover: none)";

export function Hero() {
  const [word, setWord] = useState<"style" | "story">("style");
  const [visible, setVisible] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const posterRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setVisible(false);

      timeout = setTimeout(() => {
        setWord((current) =>
          current === "style" ? "story" : "style"
        );

        setVisible(true);
      }, 400);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const poster = posterRef.current;
    const video = videoRef.current;
    if (!poster || !video) return;

    const playback = window.matchMedia("(prefers-reduced-motion: no-preference)");
    video.muted = true;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.1 || !playback.matches) {
        video.pause();
        return;
      }

      // Keep the film out of the initial request queue while the poster loads.
      if (!video.hasAttribute("src")) {
        video.src = window.matchMedia(mobileViewport).matches
          ? "/videos/home-hero-mobile.mp4"
          : "/videos/videoplayback.mp4";
      }
      void video.play().catch(() => {});
    }, { threshold: 0.1 });

    const updatePlayback = () => {
      observer.disconnect();
      if (playback.matches && poster.complete) {
        observer.observe(video);
      } else {
        video.pause();
        setVideoPlaying(false);
      }
    };

    updatePlayback();
    poster.addEventListener("load", updatePlayback);
    poster.addEventListener("error", updatePlayback);
    playback.addEventListener("change", updatePlayback);
    return () => {
      observer.disconnect();
      video.pause();
      poster.removeEventListener("load", updatePlayback);
      poster.removeEventListener("error", updatePlayback);
      playback.removeEventListener("change", updatePlayback);
    };
  }, []);

  return (
    <section className="relative h-dvh min-h-dvh overflow-hidden bg-[#39242f] text-white">
      
      {/* HERO BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <picture>
          <source media="(max-width: 767px) and (orientation: portrait)" srcSet="/images/home-hero-mobile.webp" />
          <img
            ref={posterRef}
            src="/images/home-hero.webp"
            alt=""
            width={1280}
            height={720}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <video
          ref={videoRef}
          aria-hidden="true"
          loop
          muted
          playsInline
          preload="none"
          onPlaying={() => setVideoPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover ${videoPlaying ? "opacity-100" : "opacity-0"}`}
        />

        <div className="absolute inset-0 bg-linear-to-l from-black/80 via-black/45 to-black/20" />

        <div className="absolute top-1/2 -left-30 hidden h-137.5 w-137.5 -translate-y-1/2 rounded-full bg-pink-300/10 blur-[130px] md:block" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 flex h-full items-center justify-center px-5 pt-20 text-center sm:px-8">
        <div className="site-container">
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
                <div className="absolute -inset-3 hidden rounded-[30px] bg-pink-300/20 blur-2xl md:block motion-safe:md:animate-pulse" />

                <div className="group relative overflow-hidden rounded-[26px] p-[1px]">
                  <div className="absolute inset-0 bg-linear-to-br from-pink-300/70 via-white/25 to-pink-400/60 motion-safe:md:-inset-[150%] motion-safe:md:animate-[spin_5s_linear_infinite] motion-safe:md:bg-[conic-gradient(from_0deg,transparent_0deg,transparent_80deg,#f9a8d4_140deg,white_180deg,#f9a8d4_220deg,transparent_300deg)]" />

                  <a
                    href="/custom-design"
                    className="relative flex items-center justify-between rounded-[25px] border border-white/10 bg-black/85 px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1 hover:bg-black/90 md:backdrop-blur-2xl"
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
                  className="group relative inline-flex items-center gap-5 overflow-hidden rounded-full border border-white/25 bg-white/10 py-1.5 pr-6 pl-1.5 text-white shadow-[0_16px_50px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-1 hover:border-pink-300/70 hover:bg-white/15 hover:shadow-[0_20px_60px_rgba(249,168,212,0.2)] md:backdrop-blur-xl"
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
        </div>
      </div>

      {/* SCROLL */}
      <div className="absolute right-10 bottom-10 z-10 hidden items-center gap-4 text-xs tracking-[4px] text-white/60 lg:flex">
        SCROLL ↓
      </div>
    </section>
  );
}
