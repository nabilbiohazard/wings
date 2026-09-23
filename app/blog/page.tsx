import { BlogHero } from "@/components/blog/blog-hero";
import { FeaturedPost } from "@/components/blog/featured-post";
import { BlogCategories } from "@/components/blog/blog-categories";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogNewsletter } from "@/components/blog/blog-newsletter";
import { BrandMarquee } from "@/components/homepage/brand-marquee";

import { getPosts } from "@/lib/get-posts";

export default async function BlogPage() {
  const posts = await getPosts();

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-white">
      <BlogHero />
      <BrandMarquee />

      {featuredPost && <FeaturedPost post={featuredPost} />}

      <BlogCategories />

      <BlogGrid posts={remainingPosts} />

      <BlogNewsletter />
    </main>
  );
}
