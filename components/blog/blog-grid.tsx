import Image from "next/image";
import Link from "next/link";

import { Icon } from "../icon";
import { Reveal } from "../reveal";

import type { BlogPost } from "@/lib/types";

type BlogGridProps = {
  posts: BlogPost[];
};

function getFeaturedImage(post: BlogPost) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/images/hero.png"
  );
}

function getPostCategory(post: BlogPost) {
  const terms = post._embedded?.["wp:term"] || [];

  const categories = terms
    .flat()
    .filter((term) => term.taxonomy === "category");

  return categories[0]?.name || "WINGS JOURNAL";
}

function formatDate(date: string) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="w-full py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-5">
            <h2 className="font-serif text-4xl sm:text-5xl">
              آخرین داستان‌ها
            </h2>

            <p className="hidden text-sm text-black/50 sm:block">
              WINGS JOURNAL
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post) => {
              const image = getFeaturedImage(post);
              const category = getPostCategory(post);

              return (
                <article
                  key={post.id}
                  className="group text-right"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
                      <Image
                        src={image}
                        alt={post.title?.rendered || ""}
                        fill
                        sizes="
                          (max-width:640px) 100vw,
                          (max-width:1024px) 50vw,
                          25vw
                        "
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <p className="mt-6 text-[11px] tracking-[3px] text-black/40">
                    {category}
                  </p>

                  <Link href={`/blog/${post.slug}`}>
                    <h3
                      className="mt-3 text-xl leading-8 transition group-hover:text-pink-400"
                      dangerouslySetInnerHTML={{
                        __html: post.title?.rendered || "",
                      }}
                    />
                  </Link>

                  {post.excerpt?.rendered && (
                    <div
                      className="mt-3 line-clamp-2 text-sm leading-7 text-black/60"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered,
                      }}
                    />
                  )}

                  <div className="mt-5 flex items-center justify-between text-xs text-black/40">
                    <span>{formatDate(post.date)}</span>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-2 text-black transition hover:text-pink-400"
                    >
                      مطالعه

                      <Icon
                        name="arrow"
                        size={14}
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}