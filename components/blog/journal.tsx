"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";

type Category = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

function plainText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (entity, code: string) => {
      const value = code.toLowerCase().startsWith("x")
        ? parseInt(code.slice(1), 16)
        : Number(code);

      return value >= 0 && value <= 0x10ffff
        ? String.fromCodePoint(value)
        : entity;
    })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"')
    .replace(/&hellip;/gi, "…")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("fa")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function postCategories(post: BlogPost): Category[] {
  return (
    post._embedded?.["wp:term"]
      ?.flat()
      .filter((term) => term.taxonomy === "category") ?? []
  );
}

function dateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function PostImage({
  post,
  sizes,
  priority = false,
}: {
  post: BlogPost;
  sizes: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const src = media?.source_url;

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#eadde1] text-[#805163]">
        <span aria-hidden="true" className="text-5xl font-light">
          W
        </span>
        <span className="mt-3 text-[10px] tracking-[0.3em]" dir="ltr">
          WINGS JOURNAL
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={plainText(post.title?.rendered ?? "مقاله وینگز")}
      fill
      priority={priority}
      sizes={sizes}
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:transform-none"
    />
  );
}

function PostMeta({ post }: { post: BlogPost }) {
  const date = dateLabel(post.date);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] leading-6">
      <span className="text-[#805163]">
        {plainText(postCategories(post)[0]?.name ?? "مجله وینگز")}
      </span>
      {date && (
        <>
          <span aria-hidden="true" className="text-[#b99ba7]">
            /
          </span>
          <time dateTime={post.date} className="text-[#75676c]">
            {date}
          </time>
        </>
      )}
    </div>
  );
}

function PostCard({
  post,
  large = false,
  compact = false,
}: {
  post: BlogPost;
  large?: boolean;
  compact?: boolean;
}) {
  const title = plainText(post.title?.rendered ?? "");
  const excerpt = plainText(post.excerpt?.rendered ?? "");
  const href = `/blog/${post.slug}`;

  return (
    <article className="group min-w-0">
      <Link
        href={href}
        aria-label={`مطالعه ${title}`}
        className={`relative block overflow-hidden rounded-md bg-[#eadde1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#805163] ${
          compact ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <PostImage
          post={post}
          sizes={
            large
              ? "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 720px"
              : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
          }
        />
      </Link>

      <div className={compact ? "pt-4" : "pt-5"}>
        <PostMeta post={post} />

        <h3
          className={`mt-2 font-medium leading-[1.7] ${
            large
              ? "text-2xl sm:text-[28px]"
              : compact
                ? "text-lg sm:text-xl"
                : "text-xl"
          }`}
        >
          <Link
            href={href}
            className="line-clamp-3 transition-colors hover:text-[#945e73] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#805163]"
          >
            {title}
          </Link>
        </h3>

        {!compact && excerpt && (
          <p className="mt-3 line-clamp-2 text-sm leading-8 text-[#75676c]">
            {excerpt}
          </p>
        )}

        {!compact && (
          <Link
            href={href}
            aria-label={`خواندن مقاله ${title}`}
            className="mt-4 inline-flex min-h-11 items-center gap-4 text-xs font-medium text-[#805163] hover:text-[#49313b]"
          >
            خواندن مقاله
            <span
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-1 motion-reduce:transform-none"
            >
              ←
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}

export function Journal({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(9);

  const categories = useMemo(() => {
    const found = new Map<string, Category>();

    posts.forEach((post) =>
      postCategories(post).forEach((item) => found.set(item.slug, item)),
    );

    return [...found.values()];
  }, [posts]);

  const filtered = useMemo(() => {
    const needle = normalize(query);

    return posts.filter((post) => {
      const matchesCategory =
        category === "all" ||
        postCategories(post).some((item) => item.slug === category);

      const text = normalize(
        `${plainText(post.title?.rendered ?? "")} ${plainText(
          post.excerpt?.rendered ?? "",
        )}`,
      );

      return matchesCategory && (!needle || text.includes(needle));
    });
  }, [posts, category, query]);

  const isFiltered = category !== "all" || Boolean(query.trim());
  const featured = !isFiltered ? filtered[0] : undefined;
  const gridPosts = featured ? filtered.slice(1) : filtered;
  const shownPosts = gridPosts.slice(0, visible);
  const editorial = !isFiltered && shownPosts.length >= 3;
  const remaining = editorial ? shownPosts.slice(3) : shownPosts;

  function resetFilters() {
    setCategory("all");
    setQuery("");
    setVisible(9);
  }

  return (
    <>
      {featured && (
        <section
          aria-labelledby="featured-title"
          className="mx-auto max-w-[1320px] px-5 pt-8 sm:px-8 sm:pt-12 lg:px-12"
        >
          <div className="relative lg:pb-16">
            <Link
              href={`/blog/${featured.slug}`}
              aria-label={`مطالعه ${plainText(featured.title?.rendered ?? "")}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-md bg-[#eadde1] sm:aspect-[16/9]"
            >
              <PostImage
                post={featured}
                priority
                sizes="(max-width: 1320px) 100vw, 1224px"
              />
            </Link>

            <div className="relative border-b border-[#ddcbd0] bg-[#faf7f4] py-7 lg:absolute lg:bottom-0 lg:right-8 lg:w-[48%] lg:border lg:p-8 xl:p-10">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-xs text-[#805163]">
                  تازه‌ترین داستان
                </span>
                <span
                  dir="ltr"
                  className="text-[9px] tracking-[0.2em] text-[#75676c]"
                >
                  WINGS / JOURNAL
                </span>
              </div>

              <h2
                id="featured-title"
                className="text-2xl font-medium leading-[1.6] sm:text-3xl xl:text-[36px]"
              >
                <Link
                  href={`/blog/${featured.slug}`}
                  className="transition-colors hover:text-[#945e73]"
                >
                  {plainText(featured.title?.rendered ?? "")}
                </Link>
              </h2>

              {featured.excerpt?.rendered && (
                <p className="mt-4 line-clamp-2 text-sm leading-8 text-[#75676c]">
                  {plainText(featured.excerpt.rendered)}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#ddcbd0] pt-4">
                <PostMeta post={featured} />
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex min-h-11 items-center gap-4 text-xs font-medium text-[#49313b] hover:text-[#945e73]"
                >
                  خواندن مقاله <span aria-hidden="true">←</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        id="journal-posts"
        aria-labelledby="journal-posts-title"
        className="mx-auto max-w-[1320px] scroll-mt-36 px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[#805163]">کمی الهام، کمی کشف</p>
            <h2
              id="journal-posts-title"
              className="mt-3 text-2xl font-medium leading-relaxed sm:text-4xl"
            >
              برای سلیقه کنجکاو تو
              <span className="text-[#b98295]">.</span>
            </h2>
          </div>
          <span
            dir="ltr"
            className="hidden text-[10px] tracking-[0.2em] text-[#805163] sm:block"
          >
            THE JOURNAL
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-y border-[#ddcbd0] py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div
            className="flex min-w-0 gap-6 overflow-x-auto py-1 lg:flex-1"
            aria-label="دسته‌بندی مقاله‌ها"
          >
            {[{ id: 0, slug: "all", name: "همه داستان‌ها" }, ...categories].map(
              (item) => (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={category === item.slug}
                  onClick={() => {
                    setCategory(item.slug);
                    setVisible(9);
                  }}
                  className={`min-h-11 shrink-0 border-b-2 px-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#805163] ${
                    category === item.slug
                      ? "border-[#b98295] font-medium text-[#49313b]"
                      : "border-transparent text-[#75676c] hover:text-[#49313b]"
                  }`}
                >
                  {plainText(item.name)}
                </button>
              ),
            )}
          </div>

          <div className="relative w-full shrink-0 lg:w-[280px]">
            <label htmlFor="journal-search" className="sr-only">
              جستجو در مقاله‌ها
            </label>

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#805163]"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>

            <input
              id="journal-search"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisible(9);
              }}
              placeholder="دنبال چه می‌گردی؟"
              className="h-12 w-full rounded-md border border-[#ddcbd0] bg-[#fffdfa] pl-3 pr-11 text-base outline-none placeholder:text-[#8d7a82] focus:border-[#945e73] focus:ring-2 focus:ring-[#945e73]/15"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-xs leading-6 text-[#75676c]">
            {isFiltered
              ? `${filtered.length.toLocaleString("fa-IR")} مقاله پیدا شد`
              : `${filtered.length.toLocaleString("fa-IR")} داستان در مجله`}
          </p>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-11 items-center gap-2 text-xs text-[#805163] underline underline-offset-4"
            >
              پاک‌کردن فیلترها <span aria-hidden="true">×</span>
            </button>
          )}
        </div>

        {shownPosts.length > 0 ? (
          <div className="mt-8">
            {editorial && (
              <div className="grid gap-10 border-b border-[#ddcbd0] pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
                <PostCard post={shownPosts[0]} large />

                <div className="grid content-start gap-8">
                  <PostCard post={shownPosts[1]} compact />
                  <PostCard post={shownPosts[2]} compact />
                </div>
              </div>
            )}

            {remaining.length > 0 && (
              <div
                className={`grid gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3 ${
                  editorial ? "mt-12" : ""
                }`}
              >
                {remaining.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : featured ? (
          <p className="py-10 text-sm leading-8 text-[#75676c]">
            داستان‌های بیشتری به‌زودی منتشر می‌شوند.
          </p>
        ) : (
          <div className="mt-8 border-y border-[#ddcbd0] px-5 py-16 text-center">
            <span aria-hidden="true" className="text-3xl text-[#b98295]">
              ✦
            </span>
            <h3 className="mt-4 text-xl font-medium">
              این داستان هنوز پیدا نشده.
            </h3>
            <p className="mt-3 text-sm leading-8 text-[#75676c]">
              عبارت دیگری بنویس یا همه مقاله‌ها را ببین.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 min-h-12 rounded-md bg-[#49313b] px-6 text-sm text-white hover:bg-[#704658]"
            >
              نمایش همه مقاله‌ها
            </button>
          </div>
        )}

        {visible < gridPosts.length && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((count) => count + 9)}
              className="inline-flex min-h-12 items-center gap-6 rounded-md border border-[#945e73] px-7 text-sm text-[#49313b] transition-colors hover:bg-[#f1e3e7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#805163]"
            >
              داستان‌های بیشتر <span aria-hidden="true">↓</span>
            </button>
          </div>
        )}

        <p className="sr-only" role="status">
          {(
            shownPosts.length + (featured ? 1 : 0)
          ).toLocaleString("fa-IR")}{" "}
          مقاله نمایش داده شده است.
        </p>
      </section>
    </>
  );
}