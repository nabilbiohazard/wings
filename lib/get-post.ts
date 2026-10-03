import { wpFetch } from "./wordpress";
import type { BlogPost } from "./types";

export async function getPost(slug:string): Promise<BlogPost | null> {
  const posts = await wpFetch<BlogPost[]>(`/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`);
  return posts[0] ?? null;
}
