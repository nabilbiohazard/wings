import type { Metadata } from "next";
import { HeaderBackdrop } from "@/components/header-backdrop";
import { Journal } from "@/components/blog/journal";
import { getPosts } from "@/lib/get-posts";
import styles from "@/components/blog/journal.module.css";

export const metadata: Metadata = {
  title: "مجله وینگز | داستان‌ها، استایل و الهام",
  description:
    "از ایده‌های استایل تا داستان چارم‌ها؛ در مجله وینگز الهام بگیر و جزئیات دلخواهت را کشف کن.",
};

export default async function BlogPage() {
  const { posts, failed } = await getPosts()
    .then((posts) => ({ posts, failed: false }))
    .catch(() => ({ posts: [], failed: true }));
  return (
    <main dir="rtl" className={styles.page}>
      <HeaderBackdrop />
      <Journal posts={posts} failed={failed} />
    </main>
  );
}
