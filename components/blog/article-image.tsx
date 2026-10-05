"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "@/app/blog/[slug]/article.module.css";

export function ArticleImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className={styles.hero}>
      <Image
        src={src}
        alt={alt}
        fill
        preload
        onError={() => setFailed(true)}
        sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), (max-width: 1415px) calc((100vw - 152px) * 0.55), 695px"
        className="object-cover"
      />
    </div>
  );
}
