import React from 'react';

export default function LogoCloud({ content, config }) {
  const { heading, logos } = content || {};
  const { backgroundColor = "#ffffff", textColor = "#6b7280" } = config || {};

  return (
    <section className="py-16 px-6 md:px-12 border-b border-gray-100" style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl text-center">
        {heading && (
          <p className="text-sm font-medium tracking-wide uppercase mb-10" style={{ color: textColor }}>
            {heading}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos?.map((logo, index) => (
            <div key={index} className="flex items-center justify-center h-12">
              {/* Fallback to text if no image URL, otherwise use img */}
              {logo.imageUrl ? (
                <img src={logo.imageUrl} alt={logo.name || `Logo ${index + 1}`} className="max-h-8 object-contain" />
              ) : (
                <span className="text-xl font-bold tracking-tight text-gray-400">{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
