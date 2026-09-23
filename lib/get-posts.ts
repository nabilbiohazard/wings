import { wpFetch } from "./wordpress";
import type { BlogPost } from "./types";

export async function getPosts(): Promise<BlogPost[]> {
  return wpFetch<BlogPost[]>(
    "/wp/v2/posts?_embed=1&per_page=20&orderby=date&order=desc"
  );
}