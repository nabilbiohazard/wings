import Link from "next/link";
import { Hero } from "@/components/homepage/hero";
import { Collections } from "@/components/homepage/collections";
import { NewArrivals } from "@/components/homepage/new-arrivals";
import { Charms } from "@/components/homepage/charms";
import { AboutJournal } from "@/components/homepage/about-journal";
import { EditorialSection } from "@/components/homepage/editorial-section";
import { ServiceBar } from "@/components/homepage/service-bar";

import { CustomDesignFeature } from "@/components/homepage/custom-design-feature";
import { WingsManifesto } from "@/components/homepage/wings-manifesto";
import { HomeJournal } from "@/components/homepage/home-journal";

import { getPosts } from "@/lib/get-posts";

export default async function Home() {
  const posts = await getPosts().catch((error: unknown) => {
    console.error("Homepage journal could not be loaded:", error);
    return [];
  });

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

        <Collections />

        <NewArrivals />

        <Charms />

        <AboutJournal />

        <section
          aria-labelledby="handmade-heading"
          className="relative isolate w-full overflow-hidden bg-[#756058] text-white"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/videos/handmade-craft.mp4" type="video/mp4" />
          </video>
          <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#24171e]/70 via-transparent to-[#24171e]/20" />

          <div className="relative flex min-h-[480px] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[560px] sm:py-20 lg:min-h-[720px]">
            <p lang="en" dir="ltr" className="mb-8 text-[10px] tracking-[0.35em] text-white/80 sm:text-xs">
              THE ART OF MAKING · WINGS
            </p>
            <h2
              id="handmade-heading"
              lang="en"
              dir="ltr"
              className="font-['Cormorant_Garamond'] text-[clamp(4.5rem,12vw,10rem)] leading-[0.8] font-normal tracking-[-0.045em]"
            >
              Hand made.
              <span className="mt-3 block text-[#f7c9dc] italic sm:mt-5">Heart made.</span>
            </h2>
            <div dir="rtl" className="mt-9 sm:mt-12">
              <p className="text-sm leading-8 text-white/90 sm:text-base">
                ساخته‌شده با دست، جان‌گرفته از عشق.
              </p>
              <Link
                href="/custom-design"
                className="group mt-6 inline-flex min-h-12 items-center gap-6 rounded-full bg-[#f7c9dc] py-2 pr-6 pl-2 text-sm font-medium text-[#35232c] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                دنیای دست‌سازها
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/50 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none">
                  ←
                </span>
              </Link>
            </div>
          </div>
        </section>

        <CustomDesignFeature />

        <EditorialSection />

        <WingsManifesto />

        <HomeJournal posts={posts.slice(0, 3)} />

        <ServiceBar />
      </main>
    </>
  );
}
