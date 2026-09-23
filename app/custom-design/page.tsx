import { CustomBuilder } from "@/components/custom-design/custom-builder";
import { CustomHero } from "@/components/custom-design/custom-hero";
import { BrandMarquee } from "@/components/homepage/brand-marquee";

export default function CustomDesignPage() {
  return (
    <main className="min-h-screen bg-white">
      <CustomHero />
      <BrandMarquee />

      <CustomBuilder />
    </main>
  );
}
