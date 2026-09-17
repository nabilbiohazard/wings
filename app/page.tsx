import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Collections } from "@/components/collections";
import { NewArrivals } from "@/components/new-arrivals";
import { EditorialSection } from "@/components/editorial-section";
import { ServiceBar } from "@/components/service-bar";
import { Footer } from "@/components/footer";

export default function Home() {
  return <>
    <a href="#main" className="skip-link">رفتن به محتوای اصلی</a>
    <Header />
    <main id="main"><Hero /><Collections /><NewArrivals /><EditorialSection /><ServiceBar /></main>
    <Footer />
  </>;
}
