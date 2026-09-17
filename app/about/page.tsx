import { AboutHero } from "@/components/about/about-hero";
import { AboutPhilosophy } from "@/components/about/about-philosophy";
import { AboutStory } from "@/components/about/about-story";
import { AboutValues } from "@/components/about/about-values";
import { AboutCTA } from "@/components/about/about-cta";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />

      <AboutPhilosophy />

      <AboutStory />

      <AboutValues />

      <AboutCTA />
    </main>
  );
}
