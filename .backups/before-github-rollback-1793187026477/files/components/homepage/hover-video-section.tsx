"use client";

import { useEffect, useRef, type ReactNode } from "react";

type HoverVideoSectionProps = {
  as?: "article" | "section";
  children: ReactNode;
  className: string;
  dir?: "ltr" | "rtl";
  id?: string;
  src: string;
  playNearOnMobile?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function HoverVideoSection({
  as: Tag = "section",
  children,
  src,
  playNearOnMobile = false,
  ...sectionProps
}: HoverVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playNearOnMobile) return;
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const mobile = window.matchMedia("(max-width: 767px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nearby = false;
    function updatePlayback() {
      if (mobile.matches && nearby && !reducedMotion.matches && !document.hidden) {
        void video!.play().catch(() => {});
      } else {
        video!.pause();
      }
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        nearby = entry.isIntersecting;
        if (mobile.matches) updatePlayback();
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );
    observer.observe(container);
    mobile.addEventListener("change", updatePlayback);
    reducedMotion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      mobile.removeEventListener("change", updatePlayback);
      reducedMotion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, [playNearOnMobile]);

  function playVideo() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const playAttempt = videoRef.current?.play();
    void playAttempt?.catch(() => {});
  }

  function pauseVideo() {
    if (playNearOnMobile && window.matchMedia("(max-width: 767px)").matches) return;
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
  }

  return (
    <div
      ref={containerRef}
      className="relative isolate overflow-hidden rounded-none p-[2px] md:rounded-[26px]"
      onMouseEnter={playVideo}
      onMouseLeave={pauseVideo}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_80deg,#f9a8d4_140deg,#f472b6_180deg,#f9a8d4_220deg,transparent_300deg)] motion-reduce:animate-none"
      />
      <Tag {...sectionProps} className={`${sectionProps.className} z-10 rounded-none md:rounded-[24px]`}>
        <video
          ref={videoRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          loop
          muted
          playsInline
          preload="metadata"
          src={src}
        />
        {children}
      </Tag>
    </div>
  );
}
