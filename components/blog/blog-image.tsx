"use client";

import Image from "next/image";
import { useState } from "react";

export function BlogImage({ sources, alt, sizes, preload = false }: {
  sources: string[];
  alt: string;
  sizes: string;
  preload?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const src = sources[index];

  if (!src) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#eadde1] text-[#805163]" role="img" aria-label={alt}>
        <span aria-hidden="true" className="font-serif text-6xl">W</span>
        <span aria-hidden="true" className="mt-3 text-[10px] tracking-[0.3em]" dir="ltr">WINGS JOURNAL</span>
      </div>
    );
  }

  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      fill
      unoptimized
      preload={preload}
      sizes={sizes}
      onError={() => setIndex((current) => current + 1)}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
    />
  );
}
