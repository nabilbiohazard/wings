import Image from "next/image";
import Link from "next/link";

import { Icon } from "../icon";
import { Reveal } from "../reveal";

import type { BlogPost } from "@/lib/types";

type FeaturedPostProps = {
  post: BlogPost;
};

function getFeaturedImage(post: BlogPost) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/images/hero.png"
  );
}

function getExcerpt(post: BlogPost) {
  return post.excerpt?.rendered || "";
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const image = getFeaturedImage(post);

  return (
    <section className="w-full py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* IMAGE */}

            <div className="relative aspect-[4/3] overflow-hidden rounded-[40px]">
              <Image
                src={image}
                alt={post.title?.rendered || "مقاله ویژه وینگز"}
                fill
                sizes="
                  (max-width:900px) 100vw,
                  50vw
                "
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* CONTENT */}

            <div className="text-right">
              <p className="text-xs tracking-[5px] text-black/40">
                FEATURED STORY
              </p>

              <h2
                className="mt-6 font-serif text-4xl leading-relaxed sm:text-5xl"
                dangerouslySetInnerHTML={{
                  __html: post.title?.rendered || "",
                }}
              />

              {getExcerpt(post) && (
                <div
                  className="mt-6 text-sm leading-9 text-black/60"
                  dangerouslySetInnerHTML={{
                    __html: getExcerpt(post),
                  }}
                />
              )}

              <Link
                href={`/blog/${post.slug}`}
                className="mt-8 inline-flex items-center gap-3 text-sm transition hover:opacity-60"
              >
                مطالعه مقاله

                <Icon
                  name="arrow"
                  size={18}
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}