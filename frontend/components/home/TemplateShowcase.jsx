import React from "react";
import Link from "next/link";

export default function TemplateShowcase() {
  const templates = [
    {
      id: "modern-agency",
      name: "Modern Agency",
      category: "Agency · Studio · Flagship",
      description: "A high-craft agency website featuring asymmetric Bento grids, case studies, quantitative stats, and attributable testimonials.",
      badge: "Flagship Template",
      sections: "11 Sections · Complete Flow",
      bgGradient: "from-blue-50/90 via-indigo-50/50 to-sky-50/80 border-blue-200/80 text-neutral-900",
      accentTag: "bg-blue-100 text-blue-800 border-blue-200",
      featured: true,
    },
    {
      id: "creator-portfolio",
      name: "Minimalist Portfolio",
      category: "Creative · Photography · Design",
      description: "Clean editorial showcase designed for photographers, 3D artists, and product designers with high visual impact.",
      badge: "Editorial Archetype",
      sections: "7 Sections · Gallery Focus",
      bgGradient: "from-stone-50 via-neutral-50 to-stone-100/80 border-stone-200/80 text-neutral-900",
      accentTag: "bg-stone-100 text-stone-800 border-stone-200",
      featured: false,
    },
    {
      id: "saas-launch",
      name: "SaaS Launchpad",
      category: "Software · B2B · Conversion",
      description: "Conversion-optimized landing page featuring feature breakdowns, interactive pricing cards, and lead capture workflows.",
      badge: "SaaS & App",
      sections: "9 Sections · High Conversion",
      bgGradient: "from-sky-50/90 via-slate-50 to-indigo-50/80 border-sky-200/80 text-neutral-900",
      accentTag: "bg-sky-100 text-sky-800 border-sky-200",
      featured: false,
    },
  ];

  return (
    <section id="showcase" className="py-24 sm:py-32 bg-white border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 font-mono">
              Template Directory
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 [text-wrap:balance]">
              Start with a designed foundation.
            </h2>
            <p className="mt-3 text-base text-neutral-600 max-w-xl">
              Every template is built with production-grade components ready for the Gutenberg visual canvas.
            </p>
          </div>

          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            <span>Browse All Templates</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {templates.map((tpl, idx) => (
            <div
              key={idx}
              className={`group flex flex-col justify-between rounded-2xl bg-white border border-neutral-200/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-300 ${
                tpl.featured ? "ring-2 ring-blue-600/20" : ""
              }`}
            >
              <div>
                {/* Luminous Light Preview Thumbnail Box */}
                <div className={`relative aspect-[16/10] rounded-xl overflow-hidden mb-6 bg-gradient-to-br ${tpl.bgGradient} border p-6 flex flex-col justify-between shadow-xs`}>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={`rounded-md px-2.5 py-0.5 font-semibold text-xs border ${tpl.accentTag}`}>
                      {tpl.badge}
                    </span>
                    <span className="text-neutral-500 font-medium">Gutenberg Ready</span>
                  </div>

                  <div className="my-auto py-2">
                    <div className="text-xs text-neutral-500 font-medium mb-1">{tpl.category}</div>
                    <div className="text-2xl font-bold tracking-tight text-neutral-950">{tpl.name}</div>
                  </div>

                  <div className="text-[10px] text-neutral-500 font-mono flex justify-between pt-2.5 border-t border-neutral-200/60">
                    <span>{tpl.sections}</span>
                    <span className="text-emerald-700 font-semibold">100% RESPONSIVE</span>
                  </div>
                </div>

                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  {tpl.category}
                </div>

                <h3 className="text-xl font-bold text-neutral-950 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
                  {tpl.name}
                </h3>

                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  {tpl.description}
                </p>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <Link
                  href="/templates"
                  className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
                >
                  Use Template
                </Link>

                <Link
                  href="/templates"
                  className="text-xs font-semibold text-neutral-600 hover:text-blue-600 transition-colors"
                >
                  Live Preview →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
