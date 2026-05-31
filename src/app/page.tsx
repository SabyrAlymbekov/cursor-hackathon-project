import { HeroSection } from "@/components/landing/hero-section";
import { TemplatesSection } from "@/components/landing/templates-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <HeroSection />
      <TemplatesSection />
      <Footer />
    </main>
  );
}
