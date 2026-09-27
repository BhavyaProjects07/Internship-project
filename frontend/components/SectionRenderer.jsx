import Hero from "./sections/Hero";
import Header from "./sections/Header";
import LogoCloud from "./sections/LogoCloud";
import About from "./sections/About";
import Services from "./sections/Services";
import Portfolio from "./sections/Portfolio";
import Stats from "./sections/Stats";
import Process from "./sections/Process";
import Testimonials from "./sections/Testimonials";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";

const sectionRegistry = {
  header: Header,
  hero: Hero,
  logocloud: LogoCloud,
  about: About,
  services: Services,
  portfolio: Portfolio,
  stats: Stats,
  process: Process,
  testimonials: Testimonials,
  cta: CTA,
  footer: Footer,
};

export default function SectionRenderer({ section }) {
  const Component = sectionRegistry[section.type];

  if (!Component) {
    return null;
  }

  return (
    <Component
      content={section.content}
      config={section.config}
    />
  );
}
