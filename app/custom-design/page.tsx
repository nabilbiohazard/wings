import { CharmBuilder } from "@/components/custom-design/CharmBuilder";
import { CustomHero } from "@/components/custom-design/custom-hero";
export const metadata = {
  title: "Charm Builder",
};
 
export default function CharmBuilderPage() {
  return (
    <main className="min-h-screen bg-white">
      <CustomHero/>
      <CharmBuilder />
    </main>
  );
}
 