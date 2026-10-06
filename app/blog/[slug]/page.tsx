import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { HeaderBackdrop } from "@/components/header-backdrop";
import { ArticleImage } from "@/components/blog/article-image";
import { BlogImage } from "@/components/blog/blog-image";
import { getPost } from "@/lib/get-post";
import { getPosts } from "@/lib/get-posts";
import { dateLabel, plainText, postCategories, postImageSources } from "@/lib/blog-text";
import { sanitizePostContent } from "@/lib/blog-content";
import styles from "./article.module.css";

type Props = { params: Promise<{ slug: string }> };
const loadPost = cache(getPost);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await loadPost((await params).slug);
  if (!post) return { title: "مقاله پیدا نشد | وینگز" };
  const title = plainText(post.title.rendered);
  const description = plainText(post.excerpt?.rendered ?? "").slice(0, 160);
  const image = postImageSources(post)[0];
  return {
    title: `${title} | مجله وینگز`,
    description,
    openGraph: { title, description, type: "article", publishedTime: post.date, ...(image ? { images: [image] } : {}) },
  };
}

export default async function ArticlePage({ params }: Props) {
  const post = await loadPost((await params).slug);
  if (!post) notFound();
  const title = plainText(post.title.rendered);
  const excerpt = plainText(post.excerpt?.rendered ?? "");
  const content = sanitizePostContent(post.content?.rendered ?? "");
  const readingTime = Math.max(1, Math.ceil(plainText(content).split(/\s+/).filter(Boolean).length / 200));
  const category = postCategories(post)[0];
  const sources = postImageSources(post);
  const related = (await getPosts().catch(() => []))
    .filter((item) => item.id !== post.id)
    .sort((a, b) => Number(postCategories(b).some((item) => item.id === category?.id)) - Number(postCategories(a).some((item) => item.id === category?.id)))
    .slice(0, 3);

  return (
    <main dir="rtl" className={styles.page}>
      <HeaderBackdrop />
      <div className="site-container">
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link href="/">وینگز</Link><span aria-hidden="true">/</span>
          <Link href="/blog">مجله وینگز</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>

        <header className={styles.articleHeader}>
          <div className={styles.titleBlock}>
            <p className={styles.eyebrow}><span aria-hidden="true">✦</span> {plainText(category?.name ?? "مجله وینگز")}</p>
            <h1>{title}</h1>
            {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
            <div className={styles.meta}>
              <span>مجله وینگز</span><span aria-hidden="true">•</span>
              <time dateTime={post.date}>{dateLabel(post.date)}</time><span aria-hidden="true">•</span>
              <span>{readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span>
            </div>
          </div>
          <ArticleImage sources={sources} alt={title} />
        </header>

        <div className={styles.readingLayout}>
          <article className={styles.content} aria-label={title}>
            {content ? <div dangerouslySetInnerHTML={{ __html: content }} /> : <p>{excerpt || "متن این مقاله به‌زودی تکمیل می‌شود."}</p>}
            <div className={styles.articleEnd}>
              <span aria-hidden="true">✦</span>
              <p>جزئیات کوچک، داستان‌های بزرگ.</p>
              <Link href="/blog">بازگشت به مجله <span aria-hidden="true">←</span></Link>
            </div>
          </article>
          <aside className={styles.sidebar} aria-label="الهام برای انتخاب">
            <div className={styles.note}>
              <span className={styles.noteMark} aria-hidden="true">W</span>
              <p className={styles.eyebrow}>از خواندن تا ساختن</p>
              <h2>داستان بعدی را<br />خودت بساز.</h2>
              <p>چارم‌هایی انتخاب کن که یادآور لحظه‌ها و علاقه‌های تو هستند.</p>
              <Link href="/custom-design">دستبندت را بساز <span aria-hidden="true">←</span></Link>
              <Link href="/shop" className={styles.shopLink}>کشف انتخاب‌های وینگز</Link>
            </div>
          </aside>
        </div>

        {related.length > 0 && <section className={styles.related} aria-labelledby="related-title">
          <div className={styles.relatedHeading}>
            <div><p className={styles.eyebrow}>ادامهٔ داستان</p><h2 id="related-title">برای کمی الهام بیشتر</h2></div>
            <Link href="/blog">همهٔ مقاله‌ها <span aria-hidden="true">←</span></Link>
          </div>
          <div className={styles.relatedGrid}>{related.map((item) => (
            <article key={item.id} className="group min-w-0">
              <Link href={`/blog/${item.slug}`} className={styles.relatedImage} aria-label={`مطالعه ${plainText(item.title.rendered)}`}>
                <BlogImage sources={postImageSources(item)} alt={plainText(item.title.rendered)} sizes="(max-width: 767px) 100vw, 450px" />
              </Link>
              <p className={styles.relatedDate}>{dateLabel(item.date)}</p>
              <h3><Link href={`/blog/${item.slug}`}>{plainText(item.title.rendered)}</Link></h3>
            </article>
          ))}</div>
        </section>}
      </div>
    </main>
  );
}
