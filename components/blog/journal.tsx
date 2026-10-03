"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";

type Category = { id: number; name: string; slug: string; taxonomy: string };

function plainText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function postCategories(post: BlogPost): Category[] {
  return post._embedded?.["wp:term"]?.flat().filter((term) => term.taxonomy === "category") ?? [];
}

function postImage(post: BlogPost) {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/images/blog-hero.png";
}

function dateLabel(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? ""
    : new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(parsed);
}

export function Journal({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(9);

  const categories = useMemo(() => {
    const found = new Map<string, Category>();
    posts.forEach((post) => postCategories(post).forEach((item) => found.set(item.slug, item)));
    return [...found.values()];
  }, [posts]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("fa").replace(/ي/g, "ی").replace(/ك/g, "ک");
    return posts.filter((post) => {
      if (category !== "all" && !postCategories(post).some((item) => item.slug === category)) return false;
      const text = `${plainText(post.title?.rendered ?? "")} ${plainText(post.excerpt?.rendered ?? "")}`
        .toLocaleLowerCase("fa")
        .replace(/ي/g, "ی")
        .replace(/ك/g, "ک");
      return !needle || text.includes(needle);
    });
  }, [posts, category, query]);

  const featured = category === "all" && !query.trim() ? filtered[0] : undefined;
  const gridPosts = featured ? filtered.slice(1) : filtered;
  const shownPosts = gridPosts.slice(0, visible);

  return (
    <>
      {featured && (
        <section className="mx-auto grid max-w-[1500px] items-center gap-8 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28" aria-labelledby="featured-title">
          <Link href={`/blog/${featured.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#eadfd7] sm:aspect-[16/11] lg:aspect-[5/4]">
            <Image src={postImage(featured)} alt={plainText(featured.title?.rendered ?? "مقاله ویژه وینگز")} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none" />
            <span className="absolute top-5 right-5 rounded-full bg-white/90 px-4 py-2 text-xs text-[#694958] backdrop-blur-sm">پیشنهاد مجله</span>
          </Link>
          <div dir="rtl" className="max-w-xl">
            <p className="text-[11px] tracking-[0.25em] text-[#a06b7d]" dir="ltr">FEATURED STORY · WINGS JOURNAL</p>
            <h2 id="featured-title" className="mt-5 text-3xl leading-[1.5] font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">{plainText(featured.title?.rendered ?? "")}</h2>
            {featured.excerpt?.rendered && <p className="mt-5 line-clamp-3 text-sm leading-9 text-[#786a6c]">{plainText(featured.excerpt.rendered)}</p>}
            <div className="mt-6 flex items-center gap-3 text-xs text-[#9c838b]"><span>{postCategories(featured)[0]?.name ?? "مجله وینگز"}</span><span aria-hidden="true">•</span><time dateTime={featured.date}>{dateLabel(featured.date)}</time></div>
            <Link href={`/blog/${featured.slug}`} className="mt-8 inline-flex min-h-12 items-center gap-5 rounded-full bg-[#49313b] px-7 py-3 text-sm text-white transition-colors hover:bg-[#945e73] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#49313b]">مطالعه مقاله <span aria-hidden="true">←</span></Link>
          </div>
        </section>
      )}

      <section id="journal-posts" className="bg-[#f3ebe7] px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="journal-posts-title">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end" dir="rtl">
            <div><p className="text-[11px] tracking-[0.25em] text-[#a06b7d]" dir="ltr">EXPLORE THE JOURNAL</p><h2 id="journal-posts-title" className="mt-4 text-4xl font-medium tracking-[-0.035em] sm:text-5xl">آخرین داستان‌ها<span className="text-[#b98295]">.</span></h2></div>
            <div className="w-full max-w-sm"><label htmlFor="journal-search" className="sr-only">جستجو در مقاله‌ها</label><input id="journal-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisible(9); }} placeholder="جستجو در مجله..." className="h-12 w-full rounded-full border border-[#ddcbd0] bg-white px-5 text-sm outline-none placeholder:text-[#ab999e] focus:border-[#a66c80]" /></div>
          </div>

          {categories.length > 0 && <div className="mt-9 flex gap-2 overflow-x-auto pb-2" dir="rtl" aria-label="دسته‌بندی مقاله‌ها"><button type="button" onClick={() => { setCategory("all"); setVisible(9); }} aria-pressed={category === "all"} className={`shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors ${category === "all" ? "bg-[#49313b] text-white" : "border border-[#dfcbd1] bg-white text-[#765e66] hover:bg-[#f8e4ea]"}`}>همه مقاله‌ها</button>{categories.map((item) => <button key={item.id} type="button" onClick={() => { setCategory(item.slug); setVisible(9); }} aria-pressed={category === item.slug} className={`shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors ${category === item.slug ? "bg-[#49313b] text-white" : "border border-[#dfcbd1] bg-white text-[#765e66] hover:bg-[#f8e4ea]"}`}>{item.name}</button>)}</div>}

          <p className="mt-6 text-xs text-[#927f85]" aria-live="polite" dir="rtl">{filtered.length.toLocaleString("fa-IR")} مقاله</p>

          {shownPosts.length > 0 ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8" dir="rtl">{shownPosts.map((post) => <article key={post.id} className="group flex min-w-0 flex-col overflow-hidden rounded-[25px] border border-[#e9dbd8] bg-[#fffdfa] p-2 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(71,43,50,0.1)] motion-reduce:transform-none"><Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden rounded-[19px] bg-[#eadfd7]"><Image src={postImage(post)} alt={plainText(post.title?.rendered ?? "مقاله مجله وینگز")} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none" /></Link><div className="flex flex-1 flex-col p-4 sm:p-5"><div className="flex items-center justify-between gap-3 text-[11px] text-[#9b7e86]"><span className="truncate">{postCategories(post)[0]?.name ?? "مجله وینگز"}</span><time className="shrink-0" dateTime={post.date}>{dateLabel(post.date)}</time></div><Link href={`/blog/${post.slug}`} className="mt-4"><h3 className="line-clamp-2 text-xl leading-8 font-medium transition-colors group-hover:text-[#a3667b]">{plainText(post.title?.rendered ?? "")}</h3></Link>{post.excerpt?.rendered && <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#817176]">{plainText(post.excerpt.rendered)}</p>}<Link href={`/blog/${post.slug}`} className="mt-auto inline-flex items-center gap-3 pt-6 text-sm text-[#8c5367] hover:text-[#4b303a]">ادامه مطلب <span aria-hidden="true">←</span></Link></div></article>)}</div> : featured ? <p className="mt-8 text-sm text-[#817176]" dir="rtl">داستان‌های بیشتری به‌زودی منتشر می‌شوند.</p> : <div className="mt-8 rounded-[25px] border border-[#e5d6d4] bg-white px-6 py-16 text-center" dir="rtl"><h3 className="text-xl font-medium">مقاله‌ای پیدا نشد</h3><p className="mt-3 text-sm text-[#817176]">جستجو یا دسته‌بندی دیگری را امتحان کنید.</p><button type="button" onClick={() => { setCategory("all"); setQuery(""); setVisible(9); }} className="mt-6 rounded-full bg-[#49313b] px-6 py-3 text-sm text-white">نمایش همه مقاله‌ها</button></div>}

          {visible < gridPosts.length && <div className="mt-12 text-center"><button type="button" onClick={() => setVisible((count) => count + 9)} className="rounded-full border border-[#a87385] px-8 py-3 text-sm text-[#805163] transition-colors hover:bg-[#f8e2e9]">نمایش مقاله‌های بیشتر</button></div>}
        </div>
      </section>
    </>
  );
}
