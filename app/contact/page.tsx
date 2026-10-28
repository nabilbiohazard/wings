import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpLeft,
  Flower2,
  Heart,
  MessageCircle,
} from "lucide-react";
import { HeaderBackdrop } from "@/components/header-backdrop";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactFaq } from "@/components/contact/contact-faq";
import styles from "@/components/contact/contact.module.css";

export const metadata: Metadata = {
  title: "تماس با وینگز | شروع یک گفت‌وگوی دوست‌داشتنی",
  description:
    "برای راهنمایی خرید، پیگیری سفارش، همکاری یا پیشنهاد، با وینگز در ارتباط باش. هر پیام، آغاز یک گفت‌وگوی تازه است.",
};

export default function ContactPage() {
  return (
    <main dir="rtl" className={styles.page}>
      <HeaderBackdrop />
      <div className={`site-container ${styles.container}`}>
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link href="/">خانه</Link>
          <span>/</span>
          <span aria-current="page">تماس با ما</span>
        </nav>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span /> یک گفت‌وگوی کوچک با وینگز
            </p>
            <h1>
              از تو شنیدن،
              <br />
              <span>حالِ ما را خوب می‌کند.</span>
            </h1>
            <p className={styles.heroDescription}>
              یک سؤال، یک پیشنهاد یا داستانِ یک انتخاب؛ هر چه در ذهن داری
              برایمان بنویس. اینجا، حرف‌های کوچک هم مهم‌اند.
            </p>
            <a href="#contact-form" className={styles.primaryLink}>
              گفت‌وگو را شروع کنیم
              <span>
                <ArrowDown size={17} />
              </span>
            </a>
            <span className={styles.heroEnglish} lang="en" dir="ltr">
              Good things start with a little hello.
            </span>
          </div>
          <div className={styles.heroArt}>
            <Image
              src="/images/contact-hero.jpg"
              alt="هدیهٔ وینگز، گل‌های صورتی و یک یادداشت برای شروع گفت‌وگو"
              fill
              preload
              sizes="(max-width: 767px) 100vw, 55vw"
              className={styles.heroPhoto}
            />
            <span className={styles.photoNote} lang="en" dir="ltr">
              A LITTLE NOTE. A LOVELY CONNECTION.
            </span>
            <div className={styles.helloSeal} aria-hidden="true">
              <Heart size={21} strokeWidth={1} />
              <span lang="en">Say hello.</span>
              <small>WE’RE ALL EARS</small>
            </div>
          </div>
        </header>
        <nav className={styles.quickLinks} aria-label="دسترسی سریع تماس">
          <a href="#contact-form">
            <MessageCircle size={17} />
            <span>سؤالی داری؟ برایمان بنویس</span>
            <ArrowUpLeft size={16} />
          </a>
          <Link href="/account">
            <span className={styles.quickDot} />
            <span>دنبال سفارشت می‌گردی؟</span>
            <ArrowUpLeft size={16} />
          </Link>
          <a href="#contact-faq">
            <span className={styles.quickDot} />
            <span>شاید پاسخ همین‌جا باشد</span>
            <ArrowDown size={16} />
          </a>
        </nav>
        <section
          className={styles.conversation}
          aria-label="ارسال پیام و راه‌های ارتباطی"
        >
          <ContactInfo />
          <ContactForm />
        </section>
      </div>
      <ContactFaq />
      <section
        className={`site-container ${styles.closing}`}
        aria-label="با مهر از وینگز"
      >
        <Flower2 size={34} strokeWidth={1} aria-hidden="true" />
        <p>
          پشت هر انتخاب، یک آدم است.
          <br />
          <span>خوشحالیم که اینجا با تو در ارتباطیم.</span>
        </p>
        <span lang="en" dir="ltr">
          WITH LOVE, WINGS.
        </span>
      </section>
    </main>
  );
}
