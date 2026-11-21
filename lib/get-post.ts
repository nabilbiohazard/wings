import { wpFetch } from "./wordpress";
import type { BlogPost } from "./types";
import { journalArticles } from "./journal-articles";

export async function getPost(slug: string): Promise<BlogPost | null> {
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    /* Keep a literal slug with malformed escapes. */
  }
  const localArticle = journalArticles.find(
    (post) => post.slug === decodedSlug,
  );
  if (localArticle) return localArticle;
  const posts = await wpFetch<BlogPost[]>(
    `/wp/v2/posts?slug=${encodeURIComponent(decodedSlug)}&_embed=1`,
  );
  return posts[0] ?? null;
}
