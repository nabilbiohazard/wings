"use client";

import { BlogImage } from "./blog-image";
import styles from "@/app/blog/[slug]/article.module.css";

export function ArticleImage({ sources, alt }: { sources: string[]; alt: string }) {
  return (
    <div className={styles.hero}>
      <BlogImage
        key={sources.join("|")}
        sources={sources}
        alt={alt}
        preload
        sizes="(max-width: 640px) 100vw, 1376px"
      />
    </div>
  );
}
