import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactFaq } from "@/components/contact/contact-faq";
import { ContactCTA } from "@/components/contact/contact-cta";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactHero />

      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <ContactInfo />

          <ContactForm />
        </div>
      </section>

      <ContactFaq />

      <ContactCTA />
    </main>
  );
}
