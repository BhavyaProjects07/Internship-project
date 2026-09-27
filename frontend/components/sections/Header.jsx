import React from 'react';

export default function Header({ content, config }) {
  const { logo, navigation, buttonText, buttonLink } = content || {};
  const { backgroundColor = "transparent", textColor = "#111827", sticky = true } = config || {};

  return (
    <header
      className={`w-full py-5 px-6 md:px-12 z-50 transition-all duration-300 ${sticky ? 'sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100' : ''}`}
      style={{
        backgroundColor: sticky ? undefined : backgroundColor,
        color: textColor,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/" className="text-xl md:text-2xl font-extrabold tracking-tight">
            {logo || "Modern Agency"}
          </a>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 items-center justify-center flex-1">
          {navigation?.map((link, index) => (
            <a
              key={index}
              href={link.link || "#"}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex flex-shrink-0">
          {buttonText && (
            <a
              href={buttonLink || "#"}
              className="group inline-flex items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg hover:shadow-black/20"
            >
              {buttonText}
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          )}
        </div>
        
        {/* Mobile menu button (visual only for POC) */}
        <button className="md:hidden p-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </header>
  );
}