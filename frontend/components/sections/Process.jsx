import React from 'react';

export default function Process({ content, config }) {
  const { eyebrow, heading, steps } = content || {};
  const { backgroundColor = "#ffffff", textColor = "#111827" } = config || {};

  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor, color: textColor }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          {eyebrow && (
            <h2 className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
              {eyebrow}
            </h2>
          )}
          {heading && (
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
              {heading}
            </h3>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps?.map((step, index) => (
            <div key={index} className="relative flex flex-col group">
              {/* Connector line for desktop */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-12 w-full h-[1px] bg-gray-200"></div>
              )}
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-sm font-bold mb-6 relative z-10 group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h4 className="text-xl font-bold mb-3">{step.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
