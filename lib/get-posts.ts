import { wpFetch } from "./wordpress";
import type { BlogPost } from "./types";
import { journalArticles } from "./journal-articles";

export async function getPosts(): Promise<BlogPost[]> {
  const posts = await wpFetch<BlogPost[]>(
    "/wp/v2/posts?_embed=1&per_page=100&orderby=date&order=desc",
  );
  const localSlugs = new Set(journalArticles.map((post) => post.slug));
  return [
    ...posts.filter((post) => !localSlugs.has(post.slug)),
    ...journalArticles,
  ].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
