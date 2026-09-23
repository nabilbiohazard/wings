import { AboutHero } from "@/components/about/about-hero";
import { AboutPhilosophy } from "@/components/about/about-philosophy";
import { AboutStory } from "@/components/about/about-story";
import { AboutValues } from "@/components/about/about-values";
import { AboutCTA } from "@/components/about/about-cta";
import { BrandMarquee } from "@/components/homepage/brand-marquee";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      
      <BrandMarquee />

      <AboutPhilosophy />

      <AboutStory />

      <AboutValues />

      <AboutCTA />
    </main>
  );
}
