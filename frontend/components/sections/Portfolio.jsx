import React from 'react';
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getGridColumnsClass, getTypographyStyle } from "@/lib/sectionLayout";
export default function Portfolio({ content, config }) {
  const { eyebrow, heading, projects } = content || {};
  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass, itemsClass } = getAlignmentClasses(config, { layout: { alignment: "left" } });
  const gridColumns = getGridColumnsClass(config, { layout: { columns: 3 } });
  const defaultProjects = [
    {
      title: "Apex Capital",
      category: "Product Design · Full-Stack Web · FinTech",
      outcome: "+184% Conversion · $450M Flow",
      description: "Modern institutional banking and portfolio dashboard designed for high-frequency liquidity management.",
      color: "from-slate-900 to-indigo-950",
      accent: "text-emerald-400",
      type: "fintech",
      link: "#"
    },
    {
      title: "Aura Spatial Systems",
      category: "Brand Identity · Spatial Architecture · Hardware",
      outcome: "Awwwards Site of the Day · 3.2M Impressions",
      description: "Complete visual identity, editorial packaging, and interactive 3D web experience for high-end spatial audio.",
      color: "from-stone-900 via-neutral-900 to-stone-950",
      accent: "text-amber-300",
      type: "brand",
      link: "#"
    },
    {
      title: "Synthetix Cloud",
      category: "AI Systems · Distributed Infrastructure · 2026",
      outcome: "12x Latency Reduction · Sub-40ms P99",
      description: "Autonomous data orchestration platform and developer console for real-time inference at global edge nodes.",
      color: "from-zinc-950 to-neutral-900",
      accent: "text-blue-400",
      type: "ai",
      link: "#"
    }
  ];

  const projectItems = projects && projects.length > 0 ? projects : defaultProjects;

  return (
    <section 
      className="w-full flex flex-col" 
      style={getSectionStyle(config, {
        spacing: { padding: { top: 112, bottom: 112, left: 24, right: 24 } }
      })}
    >
      <div className={`mx-auto w-full ${textClass} ${itemsClass}`} style={{ maxWidth: contentMaxWidth }}>
        <div className="flex flex-col @md:flex-row @md:items-end justify-between gap-6 mb-16 @md:mb-20">
          <div>
            <div
              className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-3"
              style={getTypographyStyle(config, "eyebrow")}
            >
              {eyebrow || "Featured Case Studies"}
            </div>
            <h2
              className="text-3xl @sm:text-4xl @md:text-5xl font-bold tracking-tight text-neutral-950 [text-wrap:balance]"
              style={getTypographyStyle(config, "heading")}
            >
              {heading || "Selected projects that show what we can do."}
            </h2>
          </div>
          <div className="text-sm text-neutral-500 max-w-xs">
            A curated selection of digital products, brand identities, and high-performance web systems.
          </div>
        </div>

        <div className={`grid gap-8 w-full ${gridColumns}`}>
          {projectItems.map((project, index) => (
            <div 
              key={index} 
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-xl hover:shadow-neutral-950/5 hover:-translate-y-1 hover:border-neutral-300"
            >
              <div>
                {/* Project Image or Clean Placeholder */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 border border-neutral-200/50 bg-neutral-100 flex items-center justify-center">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.alt || project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color || 'from-neutral-100 to-neutral-200'} opacity-90 flex items-center justify-center p-6 text-center`}>
                      <span className={`font-bold text-lg ${project.accent || 'text-neutral-900'} opacity-80 mix-blend-overlay`}>
                        {project.title}
                      </span>
                    </div>
                  )}
                  
                  {/* Outcome Badge */}
                  {project.outcome && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-neutral-900 shadow-sm backdrop-blur-sm border border-black/5">
                        {project.outcome}
                      </span>
                    </div>
                  )}
                </div>

                {/* Metadata unboxed text */}
                <div 
                  className="text-xs text-neutral-500 mb-2 font-medium"
                  style={getTypographyStyle(config, "projects", index, "category")}
                >
                  {project.category}
                </div>

                <h3
                  className="text-xl font-bold text-neutral-950 mb-2 tracking-tight group-hover:text-neutral-700 transition-colors"
                  style={getTypographyStyle(config, "projects", index, "title")}
                >
                  {project.title}
                </h3>

                <p 
                  className="text-sm text-neutral-600 leading-relaxed mb-6"
                  style={getTypographyStyle(config, "projects", index, "description")}
                >
                  {project.description || "Comprehensive product design and scalable web application engineering."}
                </p>
              </div>

              {/* Single Line Action */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 group-hover:text-neutral-600 transition-colors">
                  View Case Study
                </span>
                <span className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-950 group-hover:text-white group-hover:border-neutral-950 transition-all duration-200">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
