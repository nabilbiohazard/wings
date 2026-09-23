import { Hero } from "@/components/homepage/hero";
import { Collections } from "@/components/homepage/collections";
import { NewArrivals } from "@/components/homepage/new-arrivals";
import { EditorialSection } from "@/components/homepage/editorial-section";
import { ServiceBar } from "@/components/homepage/service-bar";

import { BrandMarquee } from "@/components/homepage/brand-marquee";
import { CustomDesignFeature } from "@/components/homepage/custom-design-feature";
import { WingsManifesto } from "@/components/homepage/wings-manifesto";
import { HomeJournal } from "@/components/homepage/home-journal";

import { getPosts } from "@/lib/get-posts";

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <a
        href="#main"
        className="fixed top-0 left-0 z-9999 -translate-y-full rounded-br-xl bg-black px-5 py-3 text-sm text-white transition-transform duration-300 focus:translate-y-0"
      >
        رفتن به محتوای اصلی
      </a>

      <main
        id="main"
        className="w-full overflow-hidden bg-white"
      >
        <Hero />

        <BrandMarquee />

        <Collections />

        <NewArrivals />

        <CustomDesignFeature />

        <EditorialSection />

        <WingsManifesto />

        <HomeJournal posts={posts.slice(0, 3)} />

        <ServiceBar />
      </main>
    </>
  );
}