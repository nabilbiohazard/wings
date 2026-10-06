import { wpFetch } from "./wordpress";
import type { BlogPost } from "./types";

export async function getPost(slug:string): Promise<BlogPost | null> {
  let decodedSlug = slug;
  try { decodedSlug = decodeURIComponent(slug); } catch { /* Keep a literal slug with malformed escapes. */ }
  const posts = await wpFetch<BlogPost[]>(`/wp/v2/posts?slug=${encodeURIComponent(decodedSlug)}&_embed=1`);
  return posts[0] ?? null;
}
