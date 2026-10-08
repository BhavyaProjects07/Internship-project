"use client";

import React from 'react';
import Link from 'next/link';
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getTypographyStyle } from "@/lib/sectionLayout";
export default function Footer({ content, config }) {
  const { logo, description, columns, social, copyright } = content || {};
  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass } = getAlignmentClasses(config, { layout: { alignment: "left" } });
  const defaultColumns = [
    {
      title: "Services",
      links: [
        { label: "Product Strategy", link: "#services" },
        { label: "Brand Systems", link: "#services" },
        { label: "Web Engineering", link: "#services" },
        { label: "Cloud Platforms", link: "#services" }
      ]
    },
    {
      title: "Agency",
      links: [
        { label: "About Studio", link: "#about" },
        { label: "Selected Works", link: "#portfolio" },
        { label: "Methodology", link: "#process" },
        { label: "Client Reviews", link: "#testimonials" }
      ]
    },
    {
      title: "Offices",
      links: [
        { label: "San Francisco · CA", link: "#" },
        { label: "Berlin · Mitte", link: "#" },
        { label: "London · Shoreditch", link: "#" },
        { label: "Remote Worldwide", link: "#" }
      ]
    }
  ];

  const defaultSocial = [
    { platform: "Twitter / X", link: "https://twitter.com" },
    { platform: "LinkedIn", link: "https://linkedin.com" },
    { platform: "GitHub", link: "https://github.com" },
    { platform: "Dribbble", link: "https://dribbble.com" }
  ];

  const footerCols = columns && columns.length > 0 ? columns : defaultColumns;
  const footerSocial = social && social.length > 0 ? social : defaultSocial;

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer 
      className="border-t border-neutral-200/80 relative w-full flex flex-col" 
      style={getSectionStyle(config, {
        spacing: { padding: { top: 80, bottom: 48, left: 24, right: 24 } }
      })}
    >
      <div className={`mx-auto w-full ${textClass}`} style={{ maxWidth: contentMaxWidth }}>
        <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-12 gap-12 @lg:gap-8 pb-16 border-b border-neutral-200/70">
          {/* Brand Manifesto Column (5 cols) */}
          <div className="@lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="text-xl font-bold tracking-tight text-neutral-950 inline-block mb-4"
                style={getTypographyStyle(config, "logo")}
              >
                {logo || "Modern Agency"}
              </Link>
              <p
                className="text-sm text-neutral-600 leading-relaxed max-w-sm [text-wrap:balance]"
                style={getTypographyStyle(config, "description")}
              >
                {description || "We engineer digital flagships, brand identities, and high-performance applications for industry-defining companies."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-mono text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Studio Status: All Systems Operational · Q2/Q3 Available</span>
            </div>
          </div>

          {/* Links Columns (7 cols) */}
          <div className="@lg:col-span-7 grid grid-cols-2 @sm:grid-cols-3 gap-8">
            {footerCols.map((col, idx) => (
              <div key={idx}>
                <h4 
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-5"
                  style={getTypographyStyle(config, "columns", idx, "title")}
                >
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links?.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a 
                        href={link.link || link.url || "#"} 
                        className="text-xs @sm:text-sm text-neutral-500 hover:text-neutral-950 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright, Socials, Back to Top */}
        <div className="pt-8 flex flex-col @sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div style={getTypographyStyle(config, "copyright")}>
            {copyright || `© ${new Date().getFullYear()} Modern Agency. All rights reserved.`}
          </div>

          <div className="flex items-center gap-6">
            {footerSocial.map((item, idx) => (
              <a 
                key={idx} 
                href={item.link || item.url || "#"} 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-neutral-950 transition-colors"
              >
                {item.platform}
              </a>
            ))}

            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-neutral-950 transition-colors flex items-center gap-1 cursor-pointer pl-2 border-l border-neutral-200"
            >
              <span>Back to Top</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
