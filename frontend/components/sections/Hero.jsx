import React from 'react';

export default function Hero({ content, config }) {
  const { eyebrow, heading, description, buttonText, buttonLink, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink } = content || {};
  const { alignment = "center", backgroundColor = "#ffffff", textColor = "#111827", paddingTop = "pt-32", paddingBottom = "pb-32" } = config || {};

  const alignClass = alignment === 'left' ? 'text-left items-start' : alignment === 'right' ? 'text-right items-end' : 'text-center items-center';
  const flexAlignClass = alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center';

  // Support old schema temporarily
  const btn1Text = primaryButtonText || buttonText;
  const btn1Link = primaryButtonLink || buttonLink;

  return (
    <section
      className={`relative w-full px-6 md:px-12 ${paddingTop} ${paddingBottom} overflow-hidden flex flex-col ${alignClass}`}
      style={{ backgroundColor, color: textColor }}
    >
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-gray-100 to-transparent opacity-50 blur-3xl rounded-full -z-10 pointer-events-none"></div>

      <div className={`mx-auto max-w-4xl flex flex-col ${alignClass} relative z-10`}>
        {eyebrow && (
          <span className="mb-6 inline-block rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold tracking-wider text-gray-600 uppercase">
            {eyebrow}
          </span>
        )}
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-balance">
          {heading || "Digital experiences built for ambitious brands."}
        </h1>

        <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-gray-600 text-balance">
          {description || "We design and build high-performance digital products that help ambitious companies turn ideas into meaningful growth."}
        </p>

        <div className={`mt-10 flex flex-wrap gap-4 ${flexAlignClass}`}>
          {btn1Text && (
            <a
              href={btn1Link || "#"}
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:scale-105"
            >
              {btn1Text}
            </a>
          )}
          {secondaryButtonText && (
            <a
              href={secondaryButtonLink || "#"}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-4 text-sm font-medium text-black transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              {secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}