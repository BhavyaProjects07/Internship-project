import React from "react";
import Link from "next/link";

export default function HomeCTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-white py-24 sm:py-32 text-neutral-900 border-b border-neutral-200/80">
      {/* Background ambient light */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-200/40 via-sky-100/30 to-transparent blur-3xl opacity-60" 
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-1 text-xs font-mono text-blue-700 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Ready for Immediate Deployment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-tight [text-wrap:balance]">
            Build your next website with freedom and confidence.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-neutral-600 leading-relaxed [text-wrap:balance]">
            Select a template, customize it visually in the block builder, and launch a blazing-fast digital product in minutes.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-600/25 transition-all duration-200 hover:bg-blue-500 hover:scale-105 active:scale-[0.99] whitespace-nowrap"
            >
              <span>Get Started with Templates</span>
              <svg 
                className="ml-2 h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-800 shadow-xs transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50 whitespace-nowrap"
            >
              Browse Library
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500 font-medium">
            <span>No Coding Required</span>
            <span aria-hidden="true">·</span>
            <span>WordPress Gutenberg Experience</span>
            <span aria-hidden="true">·</span>
            <span>Mobile-First Responsive</span>
          </div>
        </div>
      </div>
    </section>
  );
}
