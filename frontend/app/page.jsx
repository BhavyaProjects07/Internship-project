import HomeHeader from "@/components/home/Header";
import HomeHero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import TemplateShowcase from "@/components/home/TemplateShowcase";
import EditorSpotlight from "@/components/home/EditorSpotlight";
import HomeCTASection from "@/components/home/CTASection";
import HomeFooter from "@/components/home/Footer";

export const metadata = {
  title: "SiteBuilder — The Modern Visual Website Builder",
  description:
    "Build, customize, and publish beautiful websites visually with a WordPress Gutenberg-inspired block editor.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900 selection:bg-blue-600 selection:text-white antialiased">
      {/* WordPress-style Top Header */}
      <HomeHeader />

      {/* Main Landing Flow */}
      <main className="flex-1">
        {/* Hero Section with Gutenberg Canvas Preview */}
        <HomeHero />

        {/* Feature Grid: Block Engine, Inspector, Responsive Breakpoints */}
        <FeatureGrid />

        {/* Visual Block Editor Spotlight */}
        <EditorSpotlight />

        

        {/* High-Impact Closing CTA */}
        <HomeCTASection />
      </main>

      {/* WordPress-style Mega Footer */}
      <HomeFooter />
    </div>
  );
}
