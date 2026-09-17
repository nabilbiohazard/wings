import { BlogHero } from "@/components/blog/blog-hero";
import { FeaturedPost } from "@/components/blog/featured-post";
import { BlogCategories } from "@/components/blog/blog-categories";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogNewsletter } from "@/components/blog/blog-newsletter";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <BlogHero />

      <FeaturedPost />

      <BlogCategories />

      <BlogGrid />

      <BlogNewsletter />
    </main>
  );
}
