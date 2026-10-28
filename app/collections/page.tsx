"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpLeft,
  Asterisk,
  Check,
  Flower2,
  Sparkles,
} from "lucide-react";
import { HeaderBackdrop } from "@/components/header-backdrop";
import { useShop } from "@/components/shop-provider";
import styles from "./collections.module.css";

const collections = [
  {
    id: "necklace",
    number: "01",
    english: "Necklaces",
    name: "گردنبندها",
    note: "نزدیک به قلب تو",
    description: "یک نشانهٔ کوچک، برای تمام چیزهایی که دوستشان داری.",
    image: "/images/collection-necklaces.png",
    tag: "داستانی برای پوشیدن",
  },
  {
    id: "bracelet",
    number: "02",
    english: "Bracelets",
    name: "دستبندها",
    note: "همراهِ هر روز تو",
    description: "خاطره‌هایت را کنار هم بچین؛ روی مچ دستت.",
    image: "/images/collection-bracelets.png",
    tag: "جزئیات دوست‌داشتنی",
  },
  {
    id: "charms",
    number: "03",
    english: "Charms",
    name: "چارم‌ها",
    note: "کوچک، اما پر از معنا",
    description: "از یک علاقهٔ ساده تا یک خاطرهٔ دور؛ برای هر داستان، یک چارم.",
    image: "/images/charms.png",
    tag: "کمی بیشتر شبیه تو",
  },
  {
    id: "earrings",
    number: "04",
    english: "Earrings",
    name: "گوشواره‌ها",
    note: "آخرین لمسِ یک استایل",
    description: "درخششی ظریف برای وقتی که می‌خواهی خودت باشی.",
    image: "/images/earrings.png",
    tag: "درخشش به سبک تو",
  },
] as const;

export default function CollectionsPage() {
  const { setCategory } = useShop();
  const [filter, setFilter] = useState("all");
  const visible = collections.filter(
    (item) => filter === "all" || item.id === filter,
  );
  return (
    <main className={styles.page}>
      <HeaderBackdrop />
      <div className={`site-container ${styles.container}`}>
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link href="/">خانه</Link>
          <span>/</span>
          <span aria-current="page">کالکشن‌ها</span>
        </nav>
        <section className={styles.hero} aria-labelledby="collections-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span /> دنیای کالکشن‌های وینگز
            </p>
            <h1 id="collections-title">
              جزئیات کوچک،
              <br />
              <span>داستان‌های تو.</span>
            </h1>
            <p className={styles.heroDescription}>
              بعضی چیزها فقط زیورآلات نیستند؛ تکه‌ای از سلیقه، خاطره و حالِ خوب
              تو هستند. اینجا، قطعهٔ خودت را پیدا کن.
            </p>
            <a href="#collection-edit" className={styles.primaryLink}>
              کالکشن‌ها را کشف کن
              <span>
                <ArrowDown size={18} />
              </span>
            </a>
            <div className={styles.heroFootnote}>
              <span className={styles.tinyStar} aria-hidden="true">
                <Asterisk size={33} strokeWidth={1.2} />
              </span>
              <p>
                انتخاب‌های کوچک.
                <br />
                <strong>حس‌های ماندگار.</strong>
              </p>
              <span className={styles.heroRule} />
              <span lang="en" dir="ltr">
                A LITTLE MORE YOU.
              </span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroImage}>
              <Image
                src="/images/collection-necklaces.png"
                alt="گردنبند وینگز با چارم‌های رنگی و شخصی"
                fill
                preload
                sizes="(max-width: 767px) 75vw, 40vw"
                className={styles.cover}
              />
            </div>
            <div className={styles.insetImage}>
              <Image
                src="/images/collection-bracelets.png"
                alt="جزئیات دستبند چارم‌دار وینگز"
                fill
                sizes="(max-width: 767px) 32vw, 18vw"
                className={styles.cover}
              />
              <span lang="en">Little things, big feelings.</span>
            </div>
            <div className={styles.seal} aria-hidden="true">
              <Sparkles size={23} strokeWidth={1} />
              <span>به سلیقهٔ تو</span>
              <small>WINGS GALLERY</small>
            </div>
            <span className={styles.visualLabel} lang="en" dir="ltr">
              THE COLLECTIONS — A PERSONAL AFFAIR
            </span>
            <span className={styles.visualStar} aria-hidden="true">
              <Asterisk size={42} strokeWidth={1} />
            </span>
          </div>
        </section>
        <div className={styles.manifesto} aria-hidden="true">
          <span>برای هر روز</span>
          <span>✧</span>
          <span>برای هر حال</span>
          <span>✧</span>
          <span>برای خودِ تو</span>
          <span className={styles.manifestoEnglish} lang="en" dir="ltr">
            SMALL DETAILS. BIG FEELINGS.
          </span>
        </div>
        <section
          id="collection-edit"
          className={styles.explore}
          aria-labelledby="edit-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow} lang="en" dir="ltr">
                THE WINGS EDIT / 01—04
              </p>
              <h2 id="edit-title">کدام دنیا، شبیه توست؟</h2>
            </div>
            <p>
              چهار دنیای کوچک برای کشف کردن.
              <br />
              از هر کدام، کمی از خودت را پیدا کن.
            </p>
          </div>
          <div className={styles.collectionToolbar}>
            <div
              className={styles.filters}
              role="group"
              aria-label="فیلتر کالکشن‌ها"
            >
              {[{ id: "all", name: "همهٔ کالکشن‌ها" }, ...collections].map(
                (item) => (
                  <button
                    type="button"
                    key={item.id}
                    aria-pressed={filter === item.id}
                    onClick={() => setFilter(item.id)}
                  >
                    {filter === item.id && <Check size={13} />}
                    {item.name}
                  </button>
                ),
              )}
            </div>
            <span className={styles.resultCount} role="status">
              {visible.length.toLocaleString("fa-IR")} کالکشن
            </span>
          </div>
          <div className={styles.grid} data-filtered={filter !== "all"}>
            {visible.map((item) => (
              <Link
                key={item.id}
                href="/shop"
                onClick={() => setCategory(item.id)}
                className={styles.card}
                aria-label={`مشاهده ${item.name} در فروشگاه`}
              >
                <div className={styles.cardImage}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 60vw"
                    className={styles.cover}
                  />
                  <div className={styles.cardTop}>
                    <span lang="en">N° {item.number}</span>
                    <span>{item.tag}</span>
                  </div>
                  <span className={styles.cardEnglish} lang="en" dir="ltr">
                    {item.english}
                    <i>.</i>
                  </span>
                  <span className={styles.cardNote}>{item.note}</span>
                  <span className={styles.cardArrow} aria-hidden="true">
                    <ArrowUpLeft size={23} strokeWidth={1.4} />
                  </span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <span className={styles.discover}>
                    کشف کالکشن <ArrowUpLeft size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <section className={styles.atelier} aria-labelledby="atelier-title">
        <div className={`site-container ${styles.atelierInner}`}>
          <div className={styles.atelierCopy}>
            <p className={styles.eyebrow} lang="en" dir="ltr">
              THE PERSONAL ATELIER
            </p>
            <span className={styles.atelierEnglish} lang="en" dir="ltr">
              Made by <em>you.</em>
            </span>
            <h2 id="atelier-title">
              زیباترین کالکشن؟
              <br />
              همانی که خودت می‌سازی.
            </h2>
            <p>
              محصولت را انتخاب کن، چارم‌های محبوبت را کنارش بگذار و ترکیبی بساز
              که امضای خودت را دارد.
            </p>
            <Link href="/custom-design" className={styles.primaryLink}>
              ورود به استودیوی طراحی
              <span>
                <ArrowUpLeft size={19} />
              </span>
            </Link>
            <div className={styles.atelierSteps}>
              <span>۰۱ انتخاب محصول</span>
              <i />
              <span>۰۲ چیدن چارم‌ها</span>
              <i />
              <span>۰۳ طرح تو</span>
            </div>
          </div>
          <div className={styles.atelierArt}>
            <Image
              src="/images/custom-hero.png"
              alt="میز طراحی زیورآلات و چارم‌ها برای ساخت طرح شخصی"
              fill
              sizes="(max-width: 767px) 100vw, 55vw"
              className={styles.cover}
            />
            <span className={styles.artTag}>
              <Sparkles size={15} /> این بار، طراح تویی.
            </span>
          </div>
        </div>
      </section>
      <section
        className={`site-container ${styles.closing}`}
        aria-labelledby="closing-title"
      >
        <span className={styles.closingFlower} aria-hidden="true">
          <Flower2 size={42} strokeWidth={1} />
        </span>
        <p className={styles.eyebrow} lang="en" dir="ltr">
          FIND YOUR EVERYDAY FAVORITE
        </p>
        <h2 id="closing-title">
          یک قطعهٔ کوچک،
          <br />
          <span>یک حسِ کاملاً شخصی.</span>
        </h2>
        <Link
          href="/shop"
          onClick={() => setCategory("all")}
          className={styles.allProducts}
        >
          تمام انتخاب‌های وینگز <ArrowUpLeft size={19} />
        </Link>
        <span className={styles.closingWord} lang="en" aria-hidden="true">
          Wings, with love.
        </span>
      </section>
    </main>
  );
}
