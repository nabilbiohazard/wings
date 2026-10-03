import { CharmBuilder } from "@/components/custom-design/CharmBuilder";
import { CustomHero } from "@/components/custom-design/custom-hero";
export const metadata = {
  title: "Charm Builder",
};
 
export default function CharmBuilderPage() {
  return (
    <main className="min-h-screen bg-white">
       <div className="relative h-[140px] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

        <div className="absolute left-1/2 top-1/2 h-[140px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[90px]" />
      </div>
      <CharmBuilder />
    </main>
  );
}
 