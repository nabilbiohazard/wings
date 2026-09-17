import { CustomBuilder } from "@/components/custom-design/custom-builder";
import { CustomHero } from "@/components/custom-design/custom-hero";

export default function CustomDesignPage() {
  return (
    <main className="min-h-screen bg-white">
      <CustomHero />
      <CustomBuilder />
    </main>
  );
}