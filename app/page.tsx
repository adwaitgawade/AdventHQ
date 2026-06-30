import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work/Work";
import Services from "@/components/Services";
import Studio from "@/components/Studio";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* 1. Preloader + Nav live in layout.tsx */}
      <Hero />
      {/* 2. Trust / capability marquee */}
      <Marquee />
      {/* 3. Selected Work — filter grid + featured + case-study morph */}
      <Work />
      {/* 4. Services — pinned horizontal scroll */}
      <Services />
      {/* 5. Studio / About */}
      <Studio />
      {/* 6. Process timeline */}
      <Process />
      {/* 7. Testimonials */}
      <Testimonials />
      {/* 8. Contact / CTA */}
      <Contact />
      {/* 9. Footer */}
      <Footer />
    </>
  );
}
