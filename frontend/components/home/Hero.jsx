import React from "react";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-neutral-50/30 to-white pt-16 pb-24 text-neutral-900 lg:pt-24 lg:pb-32 border-b border-neutral-200/80">
      {/* Ambient background decoration */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[550px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-indigo-50/30 to-transparent blur-3xl opacity-70" />
        <div className="absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-1/3 left-1/5 h-64 w-64 rounded-full bg-sky-100/50 blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-xs backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Modern Gutenberg Visual Engine</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="text-neutral-500 font-mono font-normal">Next.js Studio Edition</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-neutral-950 leading-[1.08] [text-wrap:balance]">
            Build anything. <br className="hidden sm:inline" />
            Publish with <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">complete freedom.</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-neutral-600 leading-relaxed [text-wrap:balance]">
            The modern visual website builder inspired by WordPress Gutenberg. Pick a template, reorder drag-and-drop sections, customize typography and colors, and launch instantly.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/templates"
              className="group inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <span>Explore Templates</span>
              <svg 
                className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <a
              href="#editor"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-800 shadow-xs transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50"
            >
              See How It Works
            </a>
          </div>

          {/* Trust reassurance */}
          <div className="mt-8 text-xs text-neutral-500 flex flex-wrap items-center justify-center gap-3">
            <span className="flex items-center gap-1 font-medium text-neutral-700">
              <span className="text-emerald-600 font-bold">✓</span> Open Component Architecture
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="flex items-center gap-1 font-medium text-neutral-700">
              <span className="text-emerald-600 font-bold">✓</span> Visual Drag & Drop Canvas
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="flex items-center gap-1 font-medium text-neutral-700">
              <span className="text-emerald-600 font-bold">✓</span> 100% Responsive Breakpoints
            </span>
          </div>
        </div>

        {/* Builder Interface Light-Theme Mockup Frame */}
        <div className="mt-16 sm:mt-20 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xl shadow-neutral-900/10">
          {/* Top Window Bar */}
          <div className="flex h-11 items-center justify-between border-b border-neutral-200/80 bg-neutral-50/90 px-4 text-xs font-mono text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-neutral-500 hidden sm:inline font-sans font-medium text-xs">
                sitebuilder.studio / editor / modern-agency
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-700 border border-blue-200/60 font-semibold text-[11px]">
                Gutenberg Canvas
              </span>
              <span className="text-emerald-600 flex items-center gap-1.5 font-sans font-medium text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Live Preview
              </span>
            </div>
          </div>

          {/* Builder Simulated Canvas Workspace */}
          <div className="grid grid-cols-12 bg-neutral-100/70 min-h-[460px]">
            {/* Left Layers Sidebar */}
            <div className="hidden md:block col-span-3 border-r border-neutral-200/80 bg-white p-4 space-y-2 text-xs">
              <div className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] mb-3 flex justify-between items-center">
                <span>Document Outline</span>
                <span className="font-mono text-neutral-500">6 Blocks</span>
              </div>
              {[
                { name: "Header Navigation", type: "header", active: false },
                { name: "Hero Showcase", type: "hero", active: true },
                { name: "Client Logo Cloud", type: "logocloud", active: false },
                { name: "Capabilities (3 Bento)", type: "services", active: false },
                { name: "Selected Portfolio", type: "portfolio", active: false },
                { name: "Studio Footer", type: "footer", active: false },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-all ${
                    item.active
                      ? "bg-blue-50 border border-blue-200 text-blue-900 font-semibold shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] text-neutral-400 font-mono">{idx + 1}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded ${
                    item.active ? "bg-blue-100 text-blue-800" : "bg-neutral-100 text-neutral-500"
                  }`}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>

            {/* Center Canvas Area */}
            <div className="col-span-12 md:col-span-6 p-6 flex flex-col justify-center items-center bg-neutral-100/60 relative">
              {/* Floating Gutenberg Block Toolbar */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-3 py-1.5 text-xs shadow-xl">
                <span className="text-blue-400 font-bold uppercase text-[10px] font-mono">Block: Hero</span>
                <span className="h-3 w-[1px] bg-neutral-700" />
                <span className="text-neutral-300 text-[11px]">Align: Center</span>
                <span className="h-3 w-[1px] bg-neutral-700" />
                <span className="text-emerald-400 font-mono text-[10px]">60-30-10</span>
              </div>

              {/* Selected Block Preview Container */}
              <div className="w-full max-w-lg rounded-xl border-2 border-blue-500 bg-white p-7 text-neutral-900 shadow-xl relative ring-4 ring-blue-500/10">
                <div className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase text-neutral-500 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Digital Studio · Global Practice</span>
                </div>
                <h4 className="text-2xl font-bold tracking-tight text-neutral-950 mb-2.5">
                  Digital experiences built for ambitious brands.
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed mb-5">
                  We design and build high-performance digital products that help ambitious companies turn ideas into meaningful growth.
                </p>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-lg bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-xs">
                    Start a Project →
                  </span>
                  <span className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800">
                    View Selected Work
                  </span>
                </div>
              </div>
            </div>

            {/* Right Inspector Panel */}
            <div className="hidden lg:block col-span-3 border-l border-neutral-200/80 bg-white p-4 space-y-4 text-xs">
              <div className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] pb-2 border-b border-neutral-100">
                Block Inspector
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-700 block mb-1">Canvas Width</span>
                  <div className="rounded-lg bg-neutral-50 border border-neutral-200 px-2.5 py-1.5 text-neutral-800 font-mono text-[11px]">
                    100% (Desktop 1440px)
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-neutral-700 block mb-1.5">Surface Background</span>
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md border border-neutral-300 bg-white shadow-xs" />
                    <span className="font-mono text-neutral-800 text-[11px]">#ffffff (Pure White)</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-neutral-700 block mb-1.5">Typography Scale</span>
                  <div className="rounded-lg bg-neutral-50 border border-neutral-200 px-2.5 py-1.5 text-neutral-800 font-mono text-[11px]">
                    Geist Sans Display · 4.75rem
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">WCAG AA Contrast</span>
                    <span className="font-bold text-emerald-600 font-mono">16.4:1 (Pass)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
