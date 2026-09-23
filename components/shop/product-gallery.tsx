"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ProductGalleryProps = {
  images?: string[];
  fallbackImage?: string;
  productName: string;
};

export function ProductGallery({
  images = [],
  fallbackImage,
  productName,
}: ProductGalleryProps) {
  const gallery = useMemo(() => {
    const list = [
      ...images,
      ...(fallbackImage ? [fallbackImage] : []),
    ].filter(Boolean);

    return Array.from(new Set(list));
  }, [images, fallbackImage]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const hasMultiple = gallery.length > 1;

  const currentImage =
    gallery[activeIndex] ||
    fallbackImage ||
    "/images/product-placeholder.jpg";

  const previous = useCallback(() => {
    if (!hasMultiple) return;

    setActiveIndex((current) =>
      current === 0 ? gallery.length - 1 : current - 1
    );
  }, [gallery.length, hasMultiple]);

  const next = useCallback(() => {
    if (!hasMultiple) return;

    setActiveIndex((current) =>
      current === gallery.length - 1 ? 0 : current + 1
    );
  }, [gallery.length, hasMultiple]);

  useEffect(() => {
    if (!fullscreen) return;

    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFullscreen(false);
      }

      if (event.key === "ArrowLeft") {
        next();
      }

      if (event.key === "ArrowRight") {
        previous();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [fullscreen, next, previous]);

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    if (touchStartX.current === null) return;

    const endX =
      event.changedTouches[0]?.clientX;

    if (endX === undefined) return;

    const distance =
      endX - touchStartX.current;

    if (Math.abs(distance) > 45) {
      if (distance < 0) {
        next();
      } else {
        previous();
      }
    }

    touchStartX.current = null;
  }

  return (
    <>
      <div className="w-full">
        {/* MAIN IMAGE */}

        <div
          className="group/gallery relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[28px] bg-[#f6f6f6] sm:max-w-[580px] lg:max-w-[600px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="نمایش تمام صفحه تصویر محصول"
            className="absolute inset-0 z-10 block h-full w-full"
          >
            <Image
              key={currentImage}
              src={currentImage}
              alt={`${productName} - تصویر ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="object-cover transition-transform duration-700 ease-out group-hover/gallery:scale-[1.025]"
            />
          </button>

          {/* BOTTOM GRADIENT */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/gallery:opacity-100" />

          {/* FULLSCREEN */}

          <button
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="بزرگنمایی تصویر"
            className="absolute right-4 bottom-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-base text-black shadow-[0_8px_25px_rgba(0,0,0,0.10)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white"
          >
            ↗
          </button>

          {/* COUNTER */}

          {hasMultiple && (
            <div
              dir="ltr"
              className="absolute bottom-4 left-4 z-30 rounded-full bg-white/90 px-3 py-2 text-[10px] tracking-[1px] text-black/55 backdrop-blur-xl"
            >
              {String(activeIndex + 1).padStart(2, "0")}
              {" / "}
              {String(gallery.length).padStart(2, "0")}
            </div>
          )}

          {/* ARROWS */}

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previous();
                }}
                aria-label="تصویر قبلی"
                className="absolute right-4 top-1/2 z-40 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-[0_8px_25px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white sm:flex"
              >
                →
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  next();
                }}
                aria-label="تصویر بعدی"
                className="absolute left-4 top-1/2 z-40 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-[0_8px_25px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white sm:flex"
              >
                ←
              </button>
            </>
          )}
        </div>

        {/* THUMBNAILS */}

        {hasMultiple && (
          <div className="mx-auto mt-4 flex max-w-[600px] gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.map((image, index) => {
              const active =
                index === activeIndex;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  aria-label={`نمایش تصویر ${index + 1}`}
                  className={`relative h-[70px] w-[60px] shrink-0 overflow-hidden rounded-[14px] border transition-all duration-300 sm:h-[78px] sm:w-[66px] ${
                    active
                      ? "border-black opacity-100 shadow-[0_6px_18px_rgba(0,0,0,0.07)]"
                      : "border-black/[0.06] opacity-45 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productName} - تصویر ${index + 1}`}
                    fill
                    sizes="70px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {hasMultiple && (
          <p className="mt-3 text-center text-[10px] text-black/30 sm:hidden">
            برای مشاهده تصاویر بیشتر، ورق بزن
          </p>
        )}
      </div>

      {/* FULLSCREEN GALLERY */}

      {fullscreen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl sm:p-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="بستن گالری"
            className="absolute right-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl text-white backdrop-blur-xl transition-all hover:bg-white hover:text-black"
          >
            ×
          </button>

          <div
            dir="ltr"
            className="absolute left-5 top-7 z-30 text-[11px] tracking-[2px] text-white/50"
          >
            {String(activeIndex + 1).padStart(2, "0")}
            {" / "}
            {String(gallery.length).padStart(2, "0")}
          </div>

          {/* FULL IMAGE */}

          <div className="relative h-[78vh] w-[88vw] max-w-[1050px]">
            <Image
              key={`fullscreen-${currentImage}`}
              src={currentImage}
              alt={`${productName} - تصویر بزرگ`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="تصویر قبلی"
                className="absolute right-5 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl text-white backdrop-blur-xl transition-all hover:bg-white hover:text-black"
              >
                →
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="تصویر بعدی"
                className="absolute left-5 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl text-white backdrop-blur-xl transition-all hover:bg-white hover:text-black"
              >
                ←
              </button>
            </>
          )}

          {/* FULLSCREEN THUMBNAILS */}

          {hasMultiple && (
            <div className="absolute bottom-5 left-1/2 z-30 flex max-w-[85vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-[18px] border border-white/10 bg-black/30 p-2 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {gallery.map((image, index) => (
                <button
                  key={`full-${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  className={`relative h-12 w-10 shrink-0 overflow-hidden rounded-lg border transition-all ${
                    index === activeIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="50px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}