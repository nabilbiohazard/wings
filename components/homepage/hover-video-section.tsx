"use client";

import { useRef, type ReactNode } from "react";

type HoverVideoSectionProps = {
  as?: "article" | "section";
  children: ReactNode;
  className: string;
  dir?: "ltr" | "rtl";
  id?: string;
  src: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function HoverVideoSection({
  as: Tag = "section",
  children,
  src,
  ...sectionProps
}: HoverVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function playVideo() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const playAttempt = videoRef.current?.play();
    void playAttempt?.catch(() => {});
  }

  function pauseVideo() {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
  }

  return (
    <div
      className="relative isolate overflow-hidden rounded-[26px] p-[2px]"
      onMouseEnter={playVideo}
      onMouseLeave={pauseVideo}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_80deg,#f9a8d4_140deg,#f472b6_180deg,#f9a8d4_220deg,transparent_300deg)] motion-reduce:animate-none"
      />
      <Tag {...sectionProps} className={`${sectionProps.className} z-10 rounded-[24px]`}>
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
