import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/lib/types";

type HomeJournalProps = {
  posts: BlogPost[];
};

function getFeaturedImage(post: BlogPost) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/images/blog-1.jpg"
  );
}

function getCategory(post: BlogPost) {
  return (
    post._embedded?.["wp:term"]
      ?.flat()
      .find((term) => term.taxonomy === "category")
      ?.name || "WINGS JOURNAL"
  );
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
    return "";
  }
}

export function HomeJournal({
  posts,
}: HomeJournalProps) {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="w-full py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        {/* HEADER */}

        <div className="flex items-end justify-between gap-6">
          <div>
            <p
              dir="ltr"
              className="text-[10px] tracking-[5px] text-black/30"
            >
              WINGS JOURNAL
            </p>

            <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
              از مجله وینگز
            </h2>
          </div>

          <Link
            href="/blog"
            className="
              group hidden
              items-center gap-3
              text-sm text-black/55
              transition
              hover:text-black
              sm:flex
            "
          >
            همه مقالات

            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
          </Link>
        </div>

        {/* POSTS */}

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {posts.map((post, index) => {
            const image = getFeaturedImage(post);

            return (
              <article
                key={post.id}
                className="group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div
                    className={`
                      relative overflow-hidden
                      ${
                        index === 0
                          ? "aspect-[4/5] rounded-[34px]"
                          : "aspect-[4/5] rounded-[30px]"
                      }
                    `}
                  >
                    <Image
                      src={image}
                      alt={post.title?.rendered || ""}
                      fill
                      sizes="
                        (max-width:768px) 100vw,
                        33vw
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-105
                      "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="absolute bottom-5 right-5 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      ←
                    </div>
                  </div>
                </Link>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-[10px] tracking-[2px] text-black/30">
                    <span>
                      {getCategory(post)}
                    </span>

                    <span>
                      {formatDate(post.date)}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                  >
                    <h3
                      className="
                        mt-4
                        text-xl leading-8
                        transition-colors
                        duration-300
                        group-hover:text-black/50
                      "
                      dangerouslySetInnerHTML={{
                        __html:
                          post.title?.rendered || "",
                      }}
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* MOBILE LINK */}

        <div className="mt-10 sm:hidden">
          <Link
            href="/blog"
            className="flex items-center justify-between border-t border-black/10 pt-5 text-sm"
          >
            مشاهده همه مقالات

            <span>
              ←
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}