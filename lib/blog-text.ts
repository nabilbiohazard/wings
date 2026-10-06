import { decodeHTML } from "entities";
import type { BlogPost } from "./types";

// Text conversion only; HTML body sanitization lives in blog-content.ts.
export function plainText(html: string) {
  return decodeHTML(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}
export function postCategories(post: BlogPost) {
  return (
    post._embedded?.["wp:term"]
      ?.flat()
      .filter((term) => term.taxonomy === "category") ?? []
  );
}
export function dateLabel(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? ""
    : new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(parsed);
}
export function normalizeSearch(text: string) {
  return text
    .trim()
    .toLocaleLowerCase("fa")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک");
}

export function filterPosts(
  posts: BlogPost[],
  category: string,
  query: string,
) {
  const needle = normalizeSearch(query);
  return posts.filter(
    (post) =>
      (category === "all" ||
        postCategories(post).some((item) => item.slug === category)) &&
      (!needle ||
        normalizeSearch(
          `${plainText(post.title?.rendered ?? "")} ${plainText(post.excerpt?.rendered ?? "")}`,
        ).includes(needle)),
  );
}

export function postMedia(post: BlogPost) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.source_url) return undefined;
  try {
    const url = new URL(media.source_url);
    // Match the existing next/image policy rather than broadening remote access.
    return url.protocol === "https:" && url.hostname === "api.testvedad.ir"
      ? media
      : undefined;
  } catch {
    return undefined;
  }
}

export function postImageSources(post: BlogPost): string[] {
  const bodyImage = post.content?.rendered.match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
  return [...new Set([
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    bodyImage,
  ].filter((src): src is string => Boolean(src)).map(decodeHTML))].filter((src) => {
    try {
      const url = new URL(src);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return src.startsWith("/") && !src.startsWith("//");
    }
  });
}
