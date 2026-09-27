import React from 'react';

export default function CTA({ content, config }) {
  const { heading, description, buttonText, buttonLink } = content || {};
  const { backgroundColor = "#000000", textColor = "#ffffff" } = config || {};

  return (
    <section className="py-32 px-6 md:px-12 relative overflow-hidden" style={{ backgroundColor, color: textColor }}>
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-balance">
          {heading || "Have a project in mind?"}
        </h2>
        {description && (
          <p className="text-xl md:text-2xl opacity-70 mb-12 text-balance">
            {description}
          </p>
        )}
        {buttonText && (
          <a
            href={buttonLink || "#"}
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-medium text-black transition-all hover:scale-105"
          >
            {buttonText}
            <span className="ml-2 inline-block transition-transform hover:translate-x-1">→</span>
          </a>
        )}
      </div>
    </section>
  );
}
