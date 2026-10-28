"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpLeft,
  BookOpen,
  Check,
  Clock3,
  Flower2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { BlogImage } from "./blog-image";
import {
  dateLabel,
  plainText,
  postCategories,
  postImageSources,
} from "@/lib/blog-text";
import type { BlogPost } from "@/lib/types";
import styles from "./journal.module.css";

const normalize = (text: string) =>
  text
    .normalize("NFKC")
    .toLocaleLowerCase("fa")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim();
function readingTime(post: BlogPost) {
  return Math.max(
    1,
    Math.ceil(
      plainText(post.content?.rendered || post.excerpt?.rendered || "")
        .split(/\s+/)
        .filter(Boolean).length / 200,
    ),
  ).toLocaleString("fa-IR");
}
function PostPicture({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  const sources = [...postImageSources(post), "/images/blog-hero.png"];
  return (
    <BlogImage
      key={sources.join("|")}
      sources={sources}
      alt={plainText(post.title.rendered)}
      sizes={
        featured
          ? "(max-width: 767px) 100vw, 55vw"
          : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
      }
      preload={featured}
    />
  );
}
function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className={styles.meta}>
      <time dateTime={post.date}>{dateLabel(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>
        <Clock3 size={12} />
        {readingTime(post)} دقیقه مطالعه
      </span>
    </div>
  );
}

export function Journal({
  posts,
  failed = false,
}: {
  posts: BlogPost[];
  failed?: boolean;
}) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(9);
  const categories = useMemo(() => {
    const found = new Map<string, ReturnType<typeof postCategories>[number]>();
    posts.forEach((post) =>
      postCategories(post).forEach((item) => found.set(item.slug, item)),
    );
    return [...found.values()];
  }, [posts]);
  const filtered = useMemo(
    () =>
      posts.filter(
        (post) =>
          (category === "all" ||
            postCategories(post).some((item) => item.slug === category)) &&
          normalize(
            `${plainText(post.title.rendered)} ${plainText(post.excerpt?.rendered || "")}`,
          ).includes(normalize(query)),
      ),
    [posts, category, query],
  );
  const isFiltered = category !== "all" || Boolean(query.trim());
  const featured = posts[0];
  const archive = isFiltered ? filtered : posts.slice(1);
  function reset() {
    setCategory("all");
    setQuery("");
    setVisible(9);
  }
  return (
    <>
      <div className={`site-container ${styles.container}`}>
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link href="/">خانه</Link>
          <span>/</span>
          <span aria-current="page">مجله وینگز</span>
        </nav>
        <header className={styles.masthead}>
          <div className={styles.mastheadTop}>
            <span lang="en" dir="ltr">
              NOTES ON LITTLE THINGS
            </span>
            <span>
              <Sparkles size={13} /> جایی برای کمی مکث و الهام
            </span>
          </div>
          <div className={styles.mastheadTitle}>
            <span className={styles.sideNote} lang="en" dir="ltr">
              STYLE.
              <br />
              STORIES.
              <br />
              SMALL JOYS.
            </span>
            <div>
              <p className={styles.eyebrow}>مجلهٔ وینگز</p>
              <h1 lang="en" dir="ltr">
                The <em>Journal</em>
                <span>.</span>
              </h1>
            </div>
            <Flower2
              className={styles.flower}
              size={67}
              strokeWidth={0.7}
              aria-hidden="true"
            />
          </div>
          <div className={styles.mastheadBottom}>
            <p>
              از جزئیات کوچک می‌نویسیم؛ از چیزهایی که زندگی را بیشتر شبیه تو
              می‌کنند.
            </p>
            <a href="#journal-posts">
              ورق بزن <ArrowDown size={14} />
            </a>
          </div>
        </header>

        {featured && (
          <section className={styles.featured} aria-labelledby="featured-title">
            <Link
              href={`/blog/${featured.slug}`}
              className={styles.featuredImage}
              aria-label={`مطالعه ${plainText(featured.title.rendered)}`}
            >
              <PostPicture post={featured} featured />
              <span className={styles.imageTag}>
                <BookOpen size={14} /> تازه‌ترین داستان
              </span>
              <span className={styles.imageNumber} lang="en">
                THE LATEST CHAPTER / 01
              </span>
            </Link>
            <div className={styles.featuredCopy}>
              <p className={styles.eyebrow}>
                <span />
                {plainText(
                  postCategories(featured)[0]?.name || "یادداشت وینگز",
                )}
              </p>
              <h2 id="featured-title">
                <Link href={`/blog/${featured.slug}`}>
                  {plainText(featured.title.rendered)}
                </Link>
              </h2>
              <p className={styles.featuredExcerpt}>
                {plainText(featured.excerpt?.rendered || "")}
              </p>
              <PostMeta post={featured} />
              <Link
                className={styles.primaryLink}
                href={`/blog/${featured.slug}`}
              >
                این داستان را بخوان
                <span>
                  <ArrowUpLeft size={19} />
                </span>
              </Link>
              <span className={styles.featuredSignature} lang="en" dir="ltr">
                A little inspiration, just for you.
              </span>
            </div>
          </section>
        )}

        <section
          id="journal-posts"
          className={styles.archive}
          aria-labelledby="journal-posts-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow} lang="en" dir="ltr">
                THE READING ROOM
              </p>
              <h2 id="journal-posts-title">
                برای سلیقهٔ کنجکاو تو<span>.</span>
              </h2>
            </div>
            <p>
              کمی الهام برای استایل،
              <br />
              کمی داستان برای حالِ خوب.
            </p>
          </div>
          {posts.length > 0 && (
            <>
              <div className={styles.toolbar}>
                <div
                  className={styles.filters}
                  role="group"
                  aria-label="دسته‌بندی مقاله‌ها"
                >
                  {[{ slug: "all", name: "همهٔ داستان‌ها" }, ...categories].map(
                    (item) => (
                      <button
                        key={item.slug}
                        type="button"
                        aria-pressed={category === item.slug}
                        onClick={() => {
                          setCategory(item.slug);
                          setVisible(9);
                        }}
                      >
                        {category === item.slug && <Check size={13} />}
                        {plainText(item.name)}
                      </button>
                    ),
                  )}
                </div>
                <label className={styles.search}>
                  <Search size={17} />
                  <input
                    type="search"
                    aria-label="جستجو در مقاله‌ها"
                    placeholder="دنبال چه داستانی می‌گردی؟"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setVisible(9);
                    }}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setVisible(9);
                      }}
                      aria-label="پاک کردن جستجو"
                    >
                      <X size={15} />
                    </button>
                  )}
                </label>
              </div>
              <div className={styles.results}>
                <span aria-live="polite">
                  {isFiltered
                    ? `${filtered.length.toLocaleString("fa-IR")} مقاله پیدا شد`
                    : `${posts.length.toLocaleString("fa-IR")} داستان در مجله`}
                </span>
                {isFiltered && (
                  <button type="button" onClick={reset}>
                    پاک‌کردن فیلترها <X size={12} />
                  </button>
                )}
              </div>
            </>
          )}
          {archive.length > 0 ? (
            <div
              className={styles.postGrid}
              data-count={Math.min(archive.length, visible)}
            >
              {archive.slice(0, visible).map((post, index) => (
                <article key={post.id} className={styles.postCard}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className={styles.postImage}
                    aria-label={`مطالعه ${plainText(post.title.rendered)}`}
                  >
                    <PostPicture post={post} />
                    <span className={styles.postCategory}>
                      {plainText(postCategories(post)[0]?.name || "مجله وینگز")}
                    </span>
                    <span className={styles.postArrow} aria-hidden="true">
                      <ArrowUpLeft size={20} />
                    </span>
                  </Link>
                  <div className={styles.postCardTop}>
                    <span lang="en">
                      {String(index + (isFiltered ? 1 : 2)).padStart(2, "0")}
                    </span>
                    <PostMeta post={post} />
                  </div>
                  <h3>
                    <Link href={`/blog/${post.slug}`}>
                      {plainText(post.title.rendered)}
                    </Link>
                  </h3>
                  <p>{plainText(post.excerpt?.rendered || "")}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className={styles.readLink}
                    aria-label={`خواندن مقاله ${plainText(post.title.rendered)}`}
                  >
                    ادامهٔ داستان <ArrowUpLeft size={15} />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <BookOpen size={32} strokeWidth={1} />
              <h3>
                {failed
                  ? "مجله فعلاً در دسترس نیست."
                  : !posts.length
                    ? "اولین داستان، به‌زودی اینجاست."
                    : isFiltered
                      ? "این داستان هنوز پیدا نشده."
                      : "داستان بعدی در راه است."}
              </h3>
              <p>
                {failed
                  ? "کمی بعد دوباره سر بزن؛ داستان‌ها منتظرت می‌مانند."
                  : isFiltered
                    ? "عبارت دیگری بنویس یا همهٔ داستان‌ها را ببین."
                    : "تا داستان بعدی، دنیای کالکشن‌های وینگز را کشف کن."}
              </p>
              {isFiltered ? (
                <button type="button" onClick={reset}>
                  نمایش همه مقاله‌ها <ArrowUpLeft size={16} />
                </button>
              ) : (
                <Link href="/collections">
                  کشف کالکشن‌ها <ArrowUpLeft size={16} />
                </Link>
              )}
            </div>
          )}
          {archive.length > visible && (
            <div className={styles.loadMore}>
              <button
                type="button"
                onClick={() => setVisible((count) => count + 9)}
              >
                داستان‌های بیشتر <ArrowDown size={16} />
              </button>
              <span>
                {Math.min(visible, archive.length).toLocaleString("fa-IR")} از{" "}
                {archive.length.toLocaleString("fa-IR")} مقاله
              </span>
            </div>
          )}
        </section>
      </div>
      <section className={styles.interlude}>
        <div className={`site-container ${styles.interludeInner}`}>
          <Flower2 size={36} strokeWidth={1} aria-hidden="true" />
          <blockquote>
            استایل، از جزئیات شروع می‌شود.
            <br />
            <span>از همان چیزهای کوچکی که دوستشان داری.</span>
          </blockquote>
          <span lang="en" dir="ltr">
            THE WINGS POINT OF VIEW
          </span>
        </div>
      </section>
      <section
        className={`site-container ${styles.storyCta}`}
        aria-labelledby="story-cta-title"
      >
        <div className={styles.ctaImage}>
          <Image
            src="/images/custom-hero.png"
            alt="چارم‌ها و ابزار ساخت زیورآلات شخصی وینگز"
            fill
            sizes="(max-width: 767px) 100vw, 45vw"
            className="object-cover"
          />
          <span lang="en" dir="ltr">
            FROM INSPIRATION TO EXPRESSION
          </span>
        </div>
        <div className={styles.ctaCopy}>
          <p className={styles.eyebrow}>
            <Sparkles size={14} /> از خواندن تا ساختن
          </p>
          <h2 id="story-cta-title">
            داستان بعدی را
            <br />
            <span>خودت بساز.</span>
          </h2>
          <p>
            از میان علاقه‌هایت الهام بگیر، چارم‌ها را کنار هم بگذار و چیزی بساز
            که فقط شبیه خودت باشد.
          </p>
          <Link href="/custom-design" className={styles.primaryLink}>
            ورود به استودیوی طراحی
            <span>
              <ArrowUpLeft size={18} />
            </span>
          </Link>
          <Link href="/collections" className={styles.secondaryLink}>
            یا کالکشن‌های وینگز را کشف کن <ArrowUpLeft size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
