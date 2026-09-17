import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Collections } from "@/components/collections";
import { NewArrivals } from "@/components/new-arrivals";
import { EditorialSection } from "@/components/editorial-section";
import { ServiceBar } from "@/components/service-bar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      {/* Accessibility Skip Link */}

      <a
        href="#main"

        className="fixed top-0 left-0 z-9999 -translate-y-full rounded-br-xl bg-black px-5 py-3 text-sm text-white transition-transform duration-300 focus:translate-y-0"
      >
        رفتن به محتوای اصلی
      </a>

      <main
        id="main"

        className="w-full overflow-hidden"
      >
        <Hero />

        <Collections />

        <NewArrivals />

        <EditorialSection />

        <ServiceBar />
      </main>

      <Footer />
    </>
  );
}
