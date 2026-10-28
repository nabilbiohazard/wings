"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpLeft,
  Asterisk,
  Check,
  Flower2,
  Gem,
  Heart,
  Play,
  Sparkles,
} from "lucide-react";
import { useShop } from "@/components/shop-provider";
import { ProductCard } from "@/components/product-card";
import { BlogImage } from "@/components/blog/blog-image";
import {
  dateLabel,
  plainText,
  postCategories,
  postImageSources,
} from "@/lib/blog-text";
import { isCharmProduct } from "@/lib/charm-products";
import type { BlogPost, Product } from "@/lib/types";
import styles from "./home-experience.module.css";

const collections = [
  {
    id: "necklace",
    name: "گردنبندها",
    english: "Necklaces",
    note: "نزدیکِ قلب تو",
    image: "/images/collection-necklaces.png",
  },
  {
    id: "bracelet",
    name: "دستبندها",
    english: "Bracelets",
    note: "همراهِ هر روز تو",
    image: "/images/collection-bracelets.png",
  },
  {
    id: "charms",
    name: "چارم‌ها",
    english: "Charms",
    note: "کوچک، اما پر از داستان",
    image: "/images/charms.png",
  },
  {
    id: "earrings",
    name: "گوشواره‌ها",
    english: "Earrings",
    note: "کمی درخشش، به سبک تو",
    image: "/images/earrings.png",
  },
];
const productFilters = [
  { id: "all", name: "همهٔ انتخاب‌ها" },
  ...collections.map(({ id, name }) => ({ id, name })),
];
function matches(product: Product, category: string) {
  if (category === "all") return true;
  if (category === "charms") return isCharmProduct(product);
  return (
    product.category === category ||
    product.categories?.some((item) => item.slug === category)
  );
}

export function HomeExperience({ posts }: { posts: BlogPost[] }) {
  const { products, productsLoading, productsError, setCategory } = useShop();
  const [filter, setFilter] = useState("all");
  const [playing, setPlaying] = useState(false);
  const selected = products.filter((item) => matches(item, filter)).slice(0, 4);
  return (
    <>
      <a href="#main" className={styles.skip}>
        رفتن به محتوای اصلی
      </a>
      <main id="main" dir="rtl" className={styles.page}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={`site-container ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span /> WINGS GALLERY · THE LITTLE JOYS
              </p>
              <h1 id="home-title">
                جزئیات کوچک،
                <br />
                <span>دنیای قشنگِ تو.</span>
              </h1>
              <p className={styles.heroDescription}>
                یک چارم از علاقه‌هایت، یک تکه از خاطره‌هایت.
                <br />
                زیورآلاتی که فقط زیبا نیستند؛ شبیه تو هستند.
              </p>
              <div className={styles.heroActions}>
                <Link
                  href="/shop"
                  onClick={() => setCategory("all")}
                  className={styles.button}
                >
                  انتخابِ حال خوب
                  <span>
                    <ArrowUpLeft size={19} />
                  </span>
                </Link>
                <Link href="/custom-design" className={styles.heroSecondary}>
                  <Sparkles size={16} /> خودت بساز
                </Link>
              </div>
              <div className={styles.heroSignature}>
                <Flower2 size={34} strokeWidth={1} />
                <span lang="en" dir="ltr">
                  A little more <em>you.</em>
                </span>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.heroImage}>
                <Image
                  src="/images/hero.png"
                  alt="گردنبند، گوشواره و دستبند وینگز با چارم‌های گل، قلب و پروانه"
                  fill
                  preload
                  sizes="(max-width: 767px) 100vw, 55vw"
                  className={styles.heroPhoto}
                />
                <span className={styles.heroImageNote} lang="en" dir="ltr">
                  JEWELRY WITH A LITTLE PERSONALITY.
                </span>
              </div>
              <div className={styles.heroSeal} aria-hidden="true">
                <Heart size={20} strokeWidth={1} />
                <span>ساخته برای تو</span>
                <small>WINGS PERSONAL EDIT</small>
              </div>
              <div className={styles.floatingCharm}>
                <div>
                  <Image
                    src="/images/charms/clover.png"
                    alt=""
                    fill
                    sizes="60px"
                    className="object-contain"
                  />
                </div>
                <span>
                  هر چارم، یک داستان<small>داستان بعدی، مال تو.</small>
                </span>
                <Sparkles size={15} />
              </div>
            </div>
          </div>
          <div className={`site-container ${styles.heroBottom}`}>
            <a href="#collections">
              <ArrowDown size={15} /> دنیای وینگز را کشف کن
            </a>
            <span lang="en" dir="ltr">
              SMALL DETAILS. BIG FEELINGS.
            </span>
            <span className={styles.heroEdition} lang="en">
              THE EVERYDAY EDIT / 01
            </span>
          </div>
        </section>

        <div className={styles.ribbon} aria-hidden="true">
          <span>برای هر روز</span>
          <Asterisk size={18} strokeWidth={1} />
          <span>برای هر حال</span>
          <Asterisk size={18} strokeWidth={1} />
          <span>برای خودِ تو</span>
          <span lang="en" dir="ltr">
            LITTLE THINGS, LOVELY FEELINGS.
          </span>
        </div>

        <section
          id="collections"
          className={`site-container ${styles.collections}`}
          aria-labelledby="collections-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow} lang="en" dir="ltr">
                FIND YOUR LITTLE WORLD
              </p>
              <h2 id="collections-title">
                کدام دنیا، شبیه توست<span>؟</span>
              </h2>
            </div>
            <Link href="/collections" className={styles.textLink}>
              همهٔ کالکشن‌ها <ArrowUpLeft size={17} />
            </Link>
          </div>
          <div className={styles.collectionGrid}>
            {collections.map((item, index) => (
              <Link
                href="/shop"
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={styles.collectionCard}
                aria-label={`کشف کالکشن ${item.name}`}
              >
                <div className={styles.collectionImage}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 639px) 50vw, 25vw"
                    className={styles.cover}
                  />
                  <span className={styles.collectionNumber} lang="en">
                    0{index + 1}
                  </span>
                  <span className={styles.collectionArrow} aria-hidden="true">
                    <ArrowUpLeft size={20} />
                  </span>
                  <span
                    className={styles.collectionEnglish}
                    lang="en"
                    dir="ltr"
                  >
                    {item.english}
                    <i>.</i>
                  </span>
                </div>
                <div className={styles.collectionCaption}>
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="new-arrivals"
          className={`site-container ${styles.arrivals}`}
          aria-labelledby="arrivals-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow} lang="en" dir="ltr">
                THE LATEST LITTLE LOVES
              </p>
              <h2 id="arrivals-title">
                انتخاب‌های تازه، برای تو<span>.</span>
              </h2>
            </div>
            <Link
              href="/shop"
              onClick={() => setCategory(filter)}
              className={styles.textLink}
            >
              دیدن همهٔ محصولات <ArrowUpLeft size={17} />
            </Link>
          </div>
          <div className={styles.productToolbar}>
            <div
              className={styles.productFilters}
              role="group"
              aria-label="دسته‌بندی محصولات تازه"
            >
              {productFilters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  {filter === item.id && <Check size={12} />}
                  {item.name}
                </button>
              ))}
            </div>
            <span lang="en" dir="ltr">
              PICK YOUR NEXT FAVORITE
            </span>
          </div>
          {productsLoading ? (
            <div
              className={styles.productGrid}
              aria-label="در حال دریافت محصولات"
              role="status"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : selected.length ? (
            <div className={styles.productGrid}>
              {selected.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw"
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyProducts}>
              <Gem size={27} strokeWidth={1} />
              <p>
                {productsError
                  ? "انتخاب‌های فروشگاه فعلاً دریافت نشدند."
                  : "در این دسته هنوز محصولی برای نمایش نیست."}
              </p>
              <Link href="/shop">
                رفتن به فروشگاه <ArrowUpLeft size={16} />
              </Link>
            </div>
          )}
        </section>

        <section
          id="build-your-own"
          className={styles.atelier}
          aria-labelledby="atelier-title"
        >
          <div className={`site-container ${styles.atelierInner}`}>
            <div className={styles.atelierCopy}>
              <p className={styles.eyebrow} lang="en" dir="ltr">
                THE WINGS PERSONAL ATELIER
              </p>
              <span className={styles.atelierEnglish} lang="en" dir="ltr">
                Your story.
                <br />
                <em>Your creation.</em>
              </span>
              <h2 id="atelier-title">این بار، طراح تویی.</h2>
              <p>
                از یک محصول ساده شروع کن. چارم‌هایی را که دوست داری انتخاب کن و
                کنار هم بچین؛ تا چیزی بسازی که داستانش فقط برای تو باشد.
              </p>
              <Link href="/custom-design" className={styles.button}>
                شروع طراحی من
                <span>
                  <ArrowUpLeft size={19} />
                </span>
              </Link>
              <div className={styles.designSteps}>
                <span>
                  <i>۰۱</i> محصولت را انتخاب کن
                </span>
                <span>
                  <i>۰۲</i> چارم‌ها را بچین
                </span>
                <span>
                  <i>۰۳</i> طرح تو آماده‌ست
                </span>
              </div>
            </div>
            <div className={styles.atelierVisual}>
              <div className={styles.atelierImage}>
                <Image
                  src="/images/custom-hero.png"
                  alt="چارم‌ها و ابزار ساخت زیورآلات برای طراحی شخصی وینگز"
                  fill
                  sizes="(max-width: 767px) 100vw, 55vw"
                  className={styles.cover}
                />
              </div>
              <div className={styles.atelierLabel}>
                <Sparkles size={18} />
                <span>به سلیقهٔ تو. با امضای تو.</span>
                <span lang="en">MADE PERSONAL</span>
              </div>
              <span className={styles.atelierStar} aria-hidden="true">
                <Asterisk size={65} strokeWidth={0.8} />
              </span>
            </div>
          </div>
        </section>

        <section
          id="charms"
          className={`site-container ${styles.charmStory}`}
          aria-labelledby="charm-story-title"
        >
          <div className={styles.charmImage}>
            <Image
              src="/images/charms.png"
              alt="چارم‌های قلب، پروانه، گیلاس و گل برای روایت علاقه‌های تو"
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
              className={styles.cover}
            />
            <span className={styles.charmHandwriting} lang="en">
              Little pieces of you.
            </span>
          </div>
          <div className={styles.charmCopy}>
            <p className={styles.eyebrow} lang="en" dir="ltr">
              MORE THAN A LITTLE CHARM
            </p>
            <h2 id="charm-story-title">
              یک علاقه.
              <br />
              یک خاطره.
              <br />
              <span>یک چارمِ کوچک.</span>
            </h2>
            <p>
              گاهی یک قلب، یک پروانه یا یک گل کوچک، بیشتر از هزار کلمه حرف دارد.
              نشانه‌های دنیای خودت را پیدا کن و همیشه همراهت داشته باش.
            </p>
            <Link
              href="/shop"
              onClick={() => setCategory("charms")}
              className={styles.textLink}
            >
              چارمِ داستانت را پیدا کن <ArrowUpLeft size={18} />
            </Link>
          </div>
        </section>

        <section
          id="our-story"
          className={styles.brandStory}
          aria-labelledby="brand-story-title"
        >
          <div className={`site-container ${styles.brandInner}`}>
            <div>
              <p className={styles.eyebrow} lang="en" dir="ltr">
                A NOTE FROM WINGS
              </p>
              <h2 id="brand-story-title">
                ما به شادی‌های
                <br />
                <span>کوچک باور داریم.</span>
              </h2>
              <p>
                به چیزی که بی‌دلیل لبخند می‌آورد. به هدیه‌ای که می‌گوید «به یادت
                بودم». به جزئیاتی که یک روز معمولی را، کمی بیشتر مالِ تو
                می‌کنند.
              </p>
              <Link href="/about" className={styles.textLink}>
                قصهٔ وینگز را بخوان <ArrowUpLeft size={17} />
              </Link>
            </div>
            <div className={styles.brandQuote}>
              <Flower2 size={43} strokeWidth={0.8} aria-hidden="true" />
              <p lang="en" dir="ltr">
                Not just jewelry.
                <br />
                <em>A little feeling.</em>
              </p>
              <span lang="en">WITH LOVE, WINGS.</span>
            </div>
          </div>
        </section>

        <section
          className={`site-container ${styles.making}`}
          aria-labelledby="making-title"
        >
          <div className={styles.makingHeader}>
            <p className={styles.eyebrow} lang="en" dir="ltr">
              THE ART OF MAKING
            </p>
            <h2 id="making-title" lang="en" dir="ltr">
              Hand made. <em>Heart made.</em>
            </h2>
            <p>
              جزئیاتی که با دست شکل می‌گیرند و با سلیقهٔ تو معنا پیدا می‌کنند.
            </p>
          </div>
          <div className={styles.film}>
            {playing ? (
              <video
                src="/videos/handcraft.mp4"
                controls
                autoPlay
                playsInline
                preload="metadata"
                aria-label="فیلم ساخت زیورآلات وینگز"
              />
            ) : (
              <>
                <Image
                  src="/images/custom-hero.png"
                  alt="میز ساخت زیورآلات؛ شروع یک قطعهٔ شخصی"
                  fill
                  sizes="100vw"
                  className={styles.cover}
                />
                <div className={styles.filmShade} />
                <button
                  type="button"
                  className={styles.playButton}
                  onClick={() => setPlaying(true)}
                  aria-label="پخش فیلم ساخت زیورآلات"
                >
                  <span>
                    <Play size={25} strokeWidth={1.1} />
                  </span>
                  <strong>تماشای لحظهٔ ساختن</strong>
                  <small lang="en" dir="ltr">
                    A LITTLE LOOK BEHIND THE SCENES
                  </small>
                </button>
              </>
            )}
          </div>
        </section>

        {posts.length > 0 && (
          <section
            className={`site-container ${styles.journal}`}
            aria-labelledby="home-journal-title"
          >
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow} lang="en" dir="ltr">
                  THE WINGS JOURNAL
                </p>
                <h2 id="home-journal-title">
                  کمی مکث، کمی الهام<span>.</span>
                </h2>
              </div>
              <Link href="/blog" className={styles.textLink}>
                ورق زدن مجله <ArrowUpLeft size={17} />
              </Link>
            </div>
            <div className={styles.journalGrid}>
              {posts.map((post) => (
                <article key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className={styles.journalImage}
                    aria-label={`مطالعه ${plainText(post.title.rendered)}`}
                  >
                    <BlogImage
                      sources={[
                        ...postImageSources(post),
                        "/images/blog-hero.png",
                      ]}
                      alt={plainText(post.title.rendered)}
                      sizes="(max-width: 639px) 100vw, 33vw"
                    />
                    <span>
                      <ArrowUpLeft size={19} />
                    </span>
                  </Link>
                  <div className={styles.journalMeta}>
                    <span>
                      {plainText(
                        postCategories(post)[0]?.name || "یادداشت وینگز",
                      )}
                    </span>
                    <time dateTime={post.date}>{dateLabel(post.date)}</time>
                  </div>
                  <h3>
                    <Link href={`/blog/${post.slug}`}>
                      {plainText(post.title.rendered)}
                    </Link>
                  </h3>
                  <Link href={`/blog/${post.slug}`} className={styles.textLink}>
                    ادامهٔ داستان <ArrowLeft size={15} />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <section
          className={styles.finalNote}
          aria-labelledby="final-note-title"
        >
          <div className={`site-container ${styles.finalInner}`}>
            <span className={styles.finalFlower}>
              <Flower2 size={40} strokeWidth={1} aria-hidden="true" />
            </span>
            <div>
              <p className={styles.eyebrow} lang="en" dir="ltr">
                SOMETHING SMALL. SOMETHING PERSONAL.
              </p>
              <h2 id="final-note-title">برای خودت، یا کسی که دوستش داری.</h2>
            </div>
            <Link
              href="/shop"
              onClick={() => setCategory("all")}
              className={styles.button}
            >
              کشف انتخاب‌های وینگز
              <span>
                <ArrowUpLeft size={18} />
              </span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
