"use client";

import { useState } from "react";
import Link from "next/link";

import { BlogImage } from "@/components/blog/blog-image";
import { Icon } from "@/components/icon";

type JournalArticle = {
  id: number;
  href: string;
  title: string;
  cardLabel: string;
  excerpt: string;
  category: string;
  date: string;
  dateTime: string;
  images: string[];
};

export function HomeJournalArticles({
  articles,
}: {
  articles: JournalArticle[];
}) {
  const [activeId, setActiveId] = useState(articles[0].id);
  const activeArticle =
    articles.find((article) => article.id === activeId) ?? articles[0];

  return (
    <div className="mt-7 sm:mt-9">
      <div className="flex h-[clamp(13rem,39vw,31rem)] gap-1.5 sm:gap-3 lg:gap-4">
        {articles.map((article) => (
          <button
            key={article.id}
            type="button"
            aria-label={article.title}
            aria-pressed={article.id === activeArticle.id}
            aria-controls="home-journal-details"
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") setActiveId(article.id);
            }}
            onFocus={() => setActiveId(article.id)}
            onClick={() => setActiveId(article.id)}
            className="group relative min-w-0 flex-[1_1_0px] cursor-pointer overflow-hidden rounded-xl bg-[#35232c] ring-1 ring-inset ring-white/15 aria-pressed:grow-[2.25] sm:aria-pressed:grow-[5] aria-pressed:ring-pink-200/45 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pink-200 motion-safe:transition-[flex-grow] motion-safe:duration-500 motion-safe:ease-out sm:rounded-[24px]"
          >
            <span className="absolute inset-0 brightness-75 grayscale transition-[filter] duration-500 group-aria-pressed:brightness-100 group-aria-pressed:grayscale-0 motion-reduce:transition-none">
              <BlogImage
                sources={article.images}
                alt=""
                sizes="(max-width: 639px) 70vw, (max-width: 1200px) 68vw, 840px"
              />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-[#140d12]/95 to-[#140d12]/0 px-2 pt-10 pb-3 text-right text-sm leading-snug font-medium text-[#fff8fb] opacity-0 wrap-break-word group-aria-pressed:opacity-100 motion-safe:transition-opacity motion-safe:duration-200 sm:px-6 sm:pt-16 sm:pb-5 sm:text-xl"
            >
              {article.cardLabel}
            </span>
          </button>
        ))}
        <Link
          href="/blog"
          className="group flex min-w-14 flex-[1_1_0px] flex-col items-center justify-center gap-3 rounded-xl bg-[#f7c9dc] px-1 text-center text-xs leading-snug font-medium text-[#35232c] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pink-200 sm:min-w-24 sm:gap-4 sm:rounded-[24px] sm:px-3 sm:text-sm"
        >
          <span>همه مقالات</span>
          <span className="flex size-7 items-center justify-center rounded-full bg-white/60 transition-transform motion-safe:group-hover:-translate-x-1 sm:size-10">
            <Icon name="arrow" size={16} />
          </span>
        </Link>
      </div>

      <div
        id="home-journal-details"
        className="mt-5 border-t border-white/15 pt-5 sm:mt-7 sm:pt-7"
      >
        <div className="w-full text-right sm:max-w-[min(50%,36rem)]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-6">
            {activeArticle.category && (
              <span className="text-[#f7c9dc]">{activeArticle.category}</span>
            )}
            {activeArticle.date && (
              <time className="text-white/65" dateTime={activeArticle.dateTime}>
                {activeArticle.date}
              </time>
            )}
          </div>
          <h3 className="mt-1 text-xl leading-relaxed font-medium wrap-break-word sm:text-2xl">
            {activeArticle.title}
          </h3>
          <div className="mt-3 flex flex-col items-start gap-3">
            {activeArticle.excerpt && (
              <p className="line-clamp-3 max-w-xl text-sm leading-7 text-white/70">
                {activeArticle.excerpt}
              </p>
            )}
            <Link
              href={activeArticle.href}
              className="group inline-flex min-h-11 shrink-0 items-center gap-2.5 self-end rounded-full border border-pink-200/35 px-3 text-xs sm:min-h-12 sm:gap-5 sm:self-start sm:px-5 sm:text-sm font-medium text-[#f7c9dc] transition-colors hover:border-pink-200 hover:bg-pink-200 hover:text-[#35232c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-200"
            >
              خواندن مقاله
              <Icon
                name="arrow"
                size={17}
                className="transition-transform motion-safe:group-hover:-translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
