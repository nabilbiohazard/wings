import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/get-post";
import styles from "./article.module.css";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const category = post._embedded?.["wp:term"]?.flat().find((term) => term.taxonomy === "category")?.name;
  const parsedDate = new Date(post.date);
  const date = Number.isNaN(parsedDate.getTime()) ? "" : new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(parsedDate);

  return (
    <main className="min-h-screen bg-[#faf7f4] text-[#30252a]">
      <div aria-hidden="true" className="h-[140px] bg-black" />
      <article dir="rtl" className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
        <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-2 text-xs text-[#9b8189]"><Link href="/" className="hover:text-[#7e4b5d]">خانه</Link><span aria-hidden="true">/</span><Link href="/blog" className="hover:text-[#7e4b5d]">مجله وینگز</Link><span aria-hidden="true">/</span><span>{category ?? "مقاله"}</span></nav>
        <header className="mx-auto mt-10 max-w-4xl text-center sm:mt-14">
          <p className="text-[11px] tracking-[0.22em] text-[#a46e80]" dir="ltr">WINGS JOURNAL</p>
          <h1 className="mt-5 text-4xl leading-[1.4] font-medium tracking-[-0.035em] sm:text-5xl lg:text-6xl" dangerouslySetInnerHTML={{ __html: post.title?.rendered ?? "" }} />
          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-[#967e85]"><span>{category ?? "مجله وینگز"}</span>{date && <><span aria-hidden="true">•</span><time dateTime={post.date}>{date}</time></>}</div>
        </header>
        {image && <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[28px] bg-[#eadfd7] sm:mt-14"><Image src={image} alt="" fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" /></div>}
        <div className="mx-auto mt-12 max-w-[760px] sm:mt-16">
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content?.rendered ?? "" }} />
          <div className="mt-16 flex flex-col items-start justify-between gap-5 border-t border-[#e5d7d6] pt-8 sm:flex-row sm:items-center"><p className="text-sm text-[#847178]">پایان این داستان، آغاز یک انتخاب تازه است.</p><Link href="/blog" className="inline-flex min-h-11 items-center gap-3 rounded-full border border-[#bd9ba6] px-6 py-2 text-sm text-[#805163] hover:bg-[#f3e4e9]">بازگشت به مجله <span aria-hidden="true">←</span></Link></div>
        </div>
      </article>
    </main>
  );
}
