import { HomeJournalArticles } from "./home-journal-articles";
import {
  dateLabel,
  plainText,
  postCategories,
  postImageSources,
} from "@/lib/blog-text";
import type { BlogPost } from "@/lib/types";

type HomeJournalProps = {
  posts: BlogPost[];
};

const cardLabels: Partial<Record<string, string>> = {
  "choose-your-charms": "انتخاب چارم",
  "layer-your-necklaces": "ترکیب گردنبندها",
  "a-personal-jewelry-gift": "هدیهٔ شخصی",
};

export function HomeJournal({ posts }: HomeJournalProps) {
  if (!posts.length) {
    return null;
  }

  const articles = posts.map((post) => {
    const title = plainText(post.title?.rendered ?? "") || "مجله وینگز";

    return {
      id: post.id,
      href: `/blog/${post.slug}`,
      title,
      cardLabel:
        cardLabels[post.slug] ?? title.split(" ").slice(0, 3).join(" "),
      excerpt: plainText(post.excerpt?.rendered ?? ""),
      category: plainText(postCategories(post)[0]?.name ?? ""),
      date: dateLabel(post.date),
      dateTime: post.date,
      images: [...postImageSources(post), "/images/about-story-intro.png"],
    };
  });

  return (
    <section
      dir="rtl"
      aria-labelledby="home-journal-heading"
      className="w-full bg-[#140d12] py-16 text-[#fff8fb] sm:py-20 lg:py-24"
    >
      <div className="site-container">
        <h2
          id="home-journal-heading"
          lang="en"
          dir="ltr"
          className="border-b border-white/15 px-1 pb-7 text-center font-['Cormorant_Garamond',serif] text-[clamp(2.5rem,11.5vw,4rem)] leading-none font-bold tracking-[-0.045em] sm:pb-9 sm:text-[clamp(3.5rem,8vw,7.5rem)]"
        >
          Wings{" "}
          <span className="font-normal text-[#f7c9dc] italic">Magazine</span>
        </h2>

        <HomeJournalArticles articles={articles} />
      </div>
    </section>
  );
}
