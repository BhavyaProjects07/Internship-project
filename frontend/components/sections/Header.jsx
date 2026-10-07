"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { getContentMaxWidth, getTypographyStyle, getButtonStyle } from "@/lib/sectionLayout";
export default function Header({ content, config }) {
  const { logo, navigation, buttonText, buttonLink, buttonTarget = "_self" } = content || {};
  const { backgroundColor = "transparent", textColor = "#111827", sticky = true } = config || {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentMaxWidth = getContentMaxWidth(config);

  const defaultNav = [
    { label: "Services", link: "#services" },
    { label: "About", link: "#about" },
    { label: "Work", link: "#portfolio" },
    { label: "Process", link: "#process" },
    { label: "Testimonials", link: "#testimonials" },
  ];

  const navItems = navigation && navigation.length > 0 ? navigation : defaultNav;
  const ctaText = buttonText || "Let's Talk";
  const ctaLink = buttonLink || "#contact";

  return (
    <header
      className={`w-full py-4 px-6 md:px-12 z-50 transition-all duration-300 ${
        sticky ? 'sticky top-0 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]' : ''
      }`}
      style={{
        backgroundColor: sticky ? undefined : backgroundColor,
        color: textColor,
      }}
    >
      <div className="mx-auto flex items-center justify-between w-full" style={{ maxWidth: contentMaxWidth }}>
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="text-lg md:text-xl font-bold tracking-tight text-neutral-950 hover:opacity-85 transition-opacity"
            style={getTypographyStyle(config, "logo")}
          >
            {logo || "Modern Agency"}
          </Link>
        </div>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.link || "#"}
              className="relative py-1 hover:text-neutral-950 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-neutral-950 after:transition-all after:duration-200 hover:after:w-full whitespace-nowrap"
              style={getTypographyStyle(config, "navigation", index, "label")}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {(() => {
            const btnStyleProps = getButtonStyle(config, "cta-button");
            return (
          <a
            href={ctaLink}
            target={buttonTarget}
            rel={buttonTarget === "_blank" ? "noopener noreferrer" : undefined}
            className={`inline-flex items-center justify-center rounded-lg bg-theme-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:opacity-90 hover:shadow-sm whitespace-nowrap ${btnStyleProps.className || ''}`}
            style={{
              ...getTypographyStyle(config, "cta-button"),
              ...btnStyleProps.style
            }}
          >
            {ctaText}
            <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
            );
          })()}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {(() => {
            const btnStyleProps = getButtonStyle(config, "cta-button");
            return (
          <a
            href={ctaLink}
            target={buttonTarget}
            rel={buttonTarget === "_blank" ? "noopener noreferrer" : undefined}
            className={`rounded-lg bg-theme-primary px-3.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap ${btnStyleProps.className || ''}`}
            style={{
              ...getTypographyStyle(config, "cta-button"),
              ...btnStyleProps.style
            }}
          >
            {ctaText}
          </a>
            );
          })()}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 text-neutral-700 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 rounded-lg"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-6 border-t border-neutral-100 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3 px-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link || "#"}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50 rounded-lg transition-colors"
                style={getTypographyStyle(config, "navigation", index, "label")}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
