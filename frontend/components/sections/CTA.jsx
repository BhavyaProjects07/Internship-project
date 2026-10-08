import React from 'react';
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getTypographyStyle, getButtonStyle } from "@/lib/sectionLayout";
export default function CTA({ content, config }) {
  const { heading, description, buttonText: ctaButtonText, buttonLink: ctaButtonLink, buttonTarget: ctaButtonTarget = "_self" } = content || {};
  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass } = getAlignmentClasses(config);
  const ctaHeading = heading || "Let's build something remarkable together.";
  const ctaDesc = description || "Ready to transform your digital presence or engineer your next flagship product? Schedule a discovery call with our partners.";

  return (
    <section 
      className="relative overflow-hidden w-full flex flex-col" 
      style={getSectionStyle(config, {
        spacing: { padding: { top: 128, bottom: 128, left: 24, right: 24 } },
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff"
      })}
    >
      {/* Ambient Radial Gradient Mesh */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-neutral-900/40 to-transparent blur-3xl pointer-events-none" 
      />

      <div className={`mx-auto w-full relative z-10 ${textClass}`} style={{ maxWidth: contentMaxWidth }}>
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-400 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Accepting Select Q2 & Q3 Engagements</span>
        </div>

        <h2
          className="text-4xl @sm:text-6xl @md:text-7xl font-bold tracking-tight mb-8 text-white [text-wrap:balance]"
          style={getTypographyStyle(config, "heading")}
        >
          {ctaHeading}
        </h2>

        <p
          className="text-lg @sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed [text-wrap:balance]"
          style={getTypographyStyle(config, "description")}
        >
          {ctaDesc}
        </p>

        <div className="flex flex-col @sm:flex-row items-center justify-center gap-4">
          {(() => {
            const btnStyleProps = getButtonStyle(config, "button");
            return (
          <a
            href={ctaButtonLink}
            target={ctaButtonTarget}
            rel={ctaButtonTarget === "_blank" ? "noopener noreferrer" : undefined}
            className={`group inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-semibold text-neutral-950 transition-all duration-200 hover:bg-neutral-100 hover:shadow-xl hover:shadow-white/10 active:scale-[0.99] whitespace-nowrap ${btnStyleProps.className || ''}`}
            style={{
              ...getTypographyStyle(config, "button"),
              ...btnStyleProps.style
            }}
          >
            <span>{ctaButtonText}</span>
            <svg 
              className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
            );
          })()}

          <a
            href="mailto:contact@modernagency.studio"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/60 px-8 py-4 text-sm font-semibold text-neutral-300 transition-all duration-200 hover:bg-neutral-800 hover:text-white whitespace-nowrap"
          >
            Direct Inquiry: contact@modernagency.studio
          </a>
        </div>

        <div className="mt-12 text-xs text-neutral-400 flex items-center justify-center gap-3">
          <span>Non-Disclosure Protected</span>
          <span aria-hidden="true">·</span>
          <span>Response within 24 Hours</span>
          <span aria-hidden="true">·</span>
          <span>No Obligation Exploration</span>
        </div>
      </div>
    </section>
  );
}
