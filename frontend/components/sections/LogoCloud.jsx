import React from 'react';
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getTypographyStyle } from "@/lib/sectionLayout";
export default function LogoCloud({ content, config }) {
  const { heading, logos } = content || {};
  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass } = getAlignmentClasses(config);
  const defaultLogos = [
    { name: "Acme Corp", symbol: "ACME" },
    { name: "Global Systems", symbol: "GLOBAL" },
    { name: "Nebula AI", symbol: "NEBULA" },
    { name: "Quantum Labs", symbol: "QUANTUM" },
    { name: "Horizon Media", symbol: "HORIZON" },
    { name: "Vertex Capital", symbol: "VERTEX" }
  ];

  const clientLogos = logos && logos.length > 0 ? logos : defaultLogos;

  return (
    <section
      className="border-y border-neutral-200/70 w-full flex flex-col"
      style={getSectionStyle(config, {
        spacing: { padding: { top: 56, bottom: 56, left: 24, right: 24 } }
      })}
    >
      <div className={`mx-auto w-full ${textClass}`} style={{ maxWidth: contentMaxWidth }}>
        <p 
          className="text-xs font-semibold tracking-widest uppercase mb-8"
          style={{ color: config?.textColor || "#737373", ...getTypographyStyle(config, "heading") }}
        >
          {heading || "Trusted by ambitious teams at industry-defining brands"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {clientLogos.map((logo, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center h-10 px-3 opacity-60 hover:opacity-100 transition-opacity duration-300 group cursor-default"
            >
              {logo.imageUrl ? (
                <img 
                  src={logo.imageUrl} 
                  alt={logo.name || `Partner logo ${index + 1}`} 
                  className="max-h-7 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-sm bg-neutral-900 group-hover:bg-neutral-600 transition-colors" />
                  <span
                    className="text-sm md:text-base font-bold tracking-tight text-neutral-800 font-mono"
                    style={getTypographyStyle(config, "logos")}
                  >
                    {logo.name || logo.symbol}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
