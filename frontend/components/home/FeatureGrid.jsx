import React from "react";

export default function FeatureGrid() {
  const features = [
    {
      title: "Gutenberg Block Canvas",
      description: "Visual drag-and-drop block orchestration. Reorder sections, adjust hierarchical nesting, and preview changes with zero latency.",
      badge: "Visual Editing",
      iconBg: "bg-blue-50 text-blue-600 border-blue-200/60",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      title: "Curated Agency Templates",
      description: "Production-grade templates like Modern Agency, built with anti-slop visual discipline, high typographic contrast, and intentional spacing.",
      badge: "Design Quality",
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-200/60",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "Responsive Viewport Switcher",
      description: "Instant device switching between Desktop (100%), Tablet (768px), and Mobile (390px) to verify layouts across every breakpoint.",
      badge: "Responsive Design",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Granular Block Inspector",
      description: "Edit headlines, descriptions, button targets, background tints, and alignment without touching raw CSS or JSX code.",
      badge: "Inspector Control",
      iconBg: "bg-purple-50 text-purple-600 border-purple-200/60",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      title: "Sub-Second Performance",
      description: "No slow PHP rendering or bloated plugin matrices. Built on Next.js App Router for instant page transitions and maximum Lighthouse scores.",
      badge: "Modern Stack",
      iconBg: "bg-amber-50 text-amber-600 border-amber-200/60",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Full-Screen Preview Mode",
      description: "Step away from editor toolbars with a single click to experience your creation exactly as your prospective visitors will.",
      badge: "Live Testing",
      iconBg: "bg-rose-50 text-rose-600 border-rose-200/60",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 bg-white border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 font-mono">
            Core Engine Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 [text-wrap:balance]">
            Everything you need to craft award-winning websites.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed [text-wrap:balance]">
            Designed for designers, engineers, and creators who want WordPress simplicity with next-generation frontend performance.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${feature.iconBg} transition-transform group-hover:scale-105 shadow-xs`}>
                      {feature.icon}
                    </div>
                    <span className="text-xs font-medium text-neutral-400 font-mono">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-950 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-500">
                  <span>{feature.badge}</span>
                  <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    Learn more →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
