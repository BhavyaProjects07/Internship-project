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

  // Prevent event bubbling if clicked in builder, so mobile menu opens reliably
  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const btnStyleProps = getButtonStyle(config, "cta-button");

  return (
    <header
      className={`@container w-full z-50 transition-all duration-300 ${
        sticky ? 'sticky top-0 bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-100' : 'relative'
      }`}
      style={{
        backgroundColor: sticky ? undefined : backgroundColor,
        color: textColor,
      }}
    >
      <div 
        className="mx-auto flex h-16 items-center justify-between px-4 @md:px-6 @lg:px-8 w-full transition-all duration-300"
        style={{ maxWidth: contentMaxWidth }}
      >
        {/* Brand Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link
            href="/"
            className="text-lg @md:text-xl font-bold tracking-tight hover:opacity-85 transition-opacity"
            style={getTypographyStyle(config, "logo")}
          >
            {logo || "Modern Agency"}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden @md:flex items-center gap-6 @lg:gap-8">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.link || "#"}
              className="text-sm font-medium hover:opacity-75 transition-opacity whitespace-nowrap"
              style={getTypographyStyle(config, "navigation", index, "label")}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA & Mobile Hamburger Container */}
        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <div className="hidden @md:block">
            <a
              href={ctaLink}
              target={buttonTarget}
              rel={buttonTarget === "_blank" ? "noopener noreferrer" : undefined}
              className={`inline-flex items-center justify-center rounded-lg bg-theme-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95 ${btnStyleProps.className || ''}`}
              style={{
                ...getTypographyStyle(config, "cta-button"),
                ...btnStyleProps.style
              }}
            >
              {ctaText}
            </a>
          </div>

          {/* Mobile Menu Toggle (Hamburger) */}
          <div className="flex @md:hidden items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-black/5 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                // Close icon (X)
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Absolute positioning so it overlays content) */}
      {mobileMenuOpen && (
        <div className="@md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-b border-neutral-100 origin-top animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link || "#"}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2.5 text-base font-medium hover:bg-neutral-50 transition-colors"
                style={getTypographyStyle(config, "navigation", index, "label")}
              >
                {item.label}
              </a>
            ))}
            
            <div className="pt-4 pb-2">
              <a
                href={ctaLink}
                target={buttonTarget}
                rel={buttonTarget === "_blank" ? "noopener noreferrer" : undefined}
                className={`block w-full text-center rounded-lg bg-theme-primary px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 ${btnStyleProps.className || ''}`}
                style={{
                  ...getTypographyStyle(config, "cta-button"),
                  ...btnStyleProps.style
                }}
              >
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
