"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

const scrollPreviewQuery = "(max-width: 767px), (hover: none)";

function playVideo(video: HTMLVideoElement | null, src: string) {
  if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (video.getAttribute("src") !== src) video.src = src;
  void video.play().catch(() => {});
}

function pauseVideo(video: HTMLVideoElement | null) {
  if (!video) return;
  video.pause();
  video.currentTime = 0;
}

type HoverVideoSectionProps = {
  as?: "article" | "section";
  children: ReactNode;
  className: string;
  dir?: "ltr" | "rtl";
  id?: string;
  poster: string;
  src: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function HoverVideoSection({
  as: Tag = "section",
  children,
  poster,
  src,
  ...sectionProps
}: HoverVideoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollPreview, setScrollPreview] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const media = window.matchMedia(scrollPreviewQuery);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Wait until enough of the card is visible to preview it.
    const observer = new IntersectionObserver(([entry]) => {
      const visible = media.matches && entry.intersectionRatio >= 0.35;
      setInView(visible);
      if (visible) playVideo(video, src);
      else pauseVideo(video);
    }, { threshold: 0.35 });

    const updatePreview = () => {
      observer.disconnect();
      setScrollPreview(media.matches);
      setInView(false);
      pauseVideo(video);
      if (media.matches) observer.observe(section);
    };

    updatePreview();
    media.addEventListener("change", updatePreview);
    motion.addEventListener("change", updatePreview);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", updatePreview);
      motion.removeEventListener("change", updatePreview);
    };
  }, [src]);

  return (
    <div
      ref={sectionRef}
      className="relative isolate overflow-hidden rounded-[26px] p-[2px]"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && !scrollPreview) playVideo(videoRef.current, src);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && !scrollPreview) pauseVideo(videoRef.current);
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_80deg,#f9a8d4_140deg,#f472b6_180deg,#f9a8d4_220deg,transparent_300deg)] motion-reduce:animate-none"
      />
      <Tag
        {...sectionProps}
        data-scroll-preview={scrollPreview ? (inView ? "active" : "inactive") : undefined}
        className={`${sectionProps.className} z-10 rounded-[24px] transition-[filter] duration-500 data-[scroll-preview=active]:[filter:none]! data-[scroll-preview=inactive]:[filter:grayscale(1)]! motion-reduce:transition-none`}
      >
        <Image
          src={poster}
          alt=""
          fill
          unoptimized
          className="pointer-events-none object-cover"
        />
        <video
          ref={videoRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          loop
          muted
          playsInline
          preload="none"
        />
        {children}
      </Tag>
    </div>
  );
}
