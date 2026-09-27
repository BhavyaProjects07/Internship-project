import React from 'react';

export default function About({ content, config }) {
  const { eyebrow, heading, description, highlightText } = content || {};
  const { backgroundColor = "#ffffff", textColor = "#111827" } = config || {};

  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor, color: textColor }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column */}
          <div>
            {eyebrow && (
              <h2 className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-6">
                {eyebrow}
              </h2>
            )}
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-balance">
              {heading}
            </h3>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-center">
            {description && (
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                {description}
              </p>
            )}
            {highlightText && (
              <div className="pl-6 border-l-2 border-black">
                <p className="text-xl md:text-2xl font-medium italic">
                  "{highlightText}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
