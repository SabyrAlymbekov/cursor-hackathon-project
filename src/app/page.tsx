import { HeroSection } from "@/components/landing/hero-section";
import { TemplatesSection } from "@/components/landing/templates-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <HeroSection />
      <HowItWorksSection />
      <TemplatesSection />
      <Footer />
    </main>
  );
}
