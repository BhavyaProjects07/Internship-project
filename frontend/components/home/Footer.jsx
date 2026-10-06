"use client";

import React from "react";
import Link from "next/link";

export default function HomeFooter() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const columns = [
    {
      title: "Products & Tools",
      links: [
        { label: "Templates Directory", href: "/templates" },
        { label: "Gutenberg Canvas", href: "#editor" },
        { label: "Block Inspector", href: "#editor" },
        { label: "Responsive Studio", href: "#features" },
        { label: "Modern Agency Flagship", href: "/templates" },
      ],
    },
    {
      title: "Resources & Docs",
      links: [
        { label: "Block Documentation", href: "#" },
        { label: "Theme Guidelines", href: "#" },
        { label: "Component Architecture", href: "#" },
        { label: "Accessibility (WCAG)", href: "#" },
        { label: "API Reference", href: "#" },
      ],
    },
    {
      title: "Platform & Open Source",
      links: [
        { label: "About Platform", href: "#" },
        { label: "WordPress Heritage", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "System Status", href: "#" },
      ],
    },
  ];

  return (
    <footer id="community" className="bg-neutral-50/70 text-neutral-600 border-t border-neutral-200/80 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-200/70">
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49L5.347 11.23a7.842 7.842 0 011.666-.184c.85 0 1.25.13 1.25.13l2.84 8.283c.307.094.63.141.96.141.252 0 .497-.03.738-.088l2.91-8.336s.44.053 1.13.053c.123 0 .256-.002.396-.007L13.82 21.05C18.17 19.82 22 16.14 22 12c0-5.523-4.477-10-10-10zm-1.89 2.11c.6.01 1.22.08 1.82.23l2.58 7.42c-.44-.02-.8-.03-1.07-.03-.86 0-1.28.13-1.28.13L10.11 4.11zm-4.32 1.62c1.23-.96 2.76-1.57 4.42-1.7l3.87 11.33-4.22-12.35c-.41-.03-.78-.05-1.07-.05-.86 0-1.28.13-1.28.13L6.15 6.09l-.36-.36zM3.97 12c0-1.63.45-3.15 1.24-4.47l4.7 12.92C6.27 19.06 3.97 15.8 3.97 12z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-neutral-950">SiteBuilder</span>
                  <span className="text-[10px] font-mono uppercase text-blue-600 -mt-1 font-semibold">Studio Edition</span>
                </div>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
                Empowering creators, agencies, and businesses with modern block-first visual site building. An extensible, open web application platform.
              </p>
            </div>

            <div className="mt-8 text-xs font-mono text-neutral-500">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-2" />
              <span>Network: 100% Operational · Next.js v15 Engine</span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map((col, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        className="text-neutral-500 hover:text-blue-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} SiteBuilder Studio. Inspired by WordPress & the open web.
          </div>

          <div className="flex items-center gap-6">
            <span className="font-serif italic text-neutral-400">Code is poetry.</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-neutral-900 transition-colors flex items-center gap-1 cursor-pointer pl-3 border-l border-neutral-200"
            >
              <span>Back to top</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
