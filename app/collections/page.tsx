import { CollectionsHero } from "@/components/collections/collections-hero";
import { CollectionShowcase } from "@/components/collections/collection-showcase";
import { FeaturedCollection } from "@/components/collections/featured-collection";
import { CollectionsGrid } from "@/components/collections/collections-grid";
import { CollectionsCTA } from "@/components/collections/collections-cta";
import { BrandMarquee } from "@/components/homepage/brand-marquee";

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-white">
      <CollectionsHero />
      <BrandMarquee />

      <CollectionShowcase />

      <FeaturedCollection />

      <CollectionsGrid />

      <CollectionsCTA />
    </main>
  );
}
