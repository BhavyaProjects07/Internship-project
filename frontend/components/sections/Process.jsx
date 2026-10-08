import React from 'react';
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getGridColumnsClass, getTypographyStyle } from "@/lib/sectionLayout";
export default function Process({ content, config }) {
  const { eyebrow, heading, steps } = content || {};
  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass, itemsClass } = getAlignmentClasses(config, { layout: { alignment: "left" } });
  const gridColumns = getGridColumnsClass(config, { layout: { columns: 5 } });
  const defaultSteps = [
    {
      num: "01",
      title: "Discover",
      description: "Deep dive into business goals, technical constraints, and user frictions through stakeholder immersion."
    },
    {
      num: "02",
      title: "Define",
      description: "Architectural blue-printing, feature prioritization, data models, and measurable launch KPIs."
    },
    {
      num: "03",
      title: "Design",
      description: "Iterative high-fidelity wireframing, component tokens, interactive prototypes, and motion choreographies."
    },
    {
      num: "04",
      title: "Build",
      description: "Production-grade engineering with clean component architectures, robust types, and continuous integration."
    },
    {
      num: "05",
      title: "Launch",
      description: "Zero-downtime deployment, observability setup, performance profiling, and strategic post-launch support."
    }
  ];

  const stepItems = steps && steps.length > 0 ? steps.map((s, i) => ({
    num: String(i + 1).padStart(2, '0'),
    title: s.title,
    description: s.description
  })) : defaultSteps;

  return (
    <section 
      className="border-b border-neutral-200/70 w-full flex flex-col" 
      style={getSectionStyle(config, {
        spacing: { padding: { top: 112, bottom: 112, left: 24, right: 24 } }
      })}
    >
      <div className={`mx-auto w-full ${textClass} ${itemsClass}`} style={{ maxWidth: contentMaxWidth }}>
        <div className="max-w-3xl mb-16 @md:mb-20">
          <div
            className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-3"
            style={getTypographyStyle(config, "eyebrow")}
          >
            {eyebrow || "Methodology"}
          </div>
          <h2
            className="text-3xl @sm:text-4xl @md:text-5xl font-bold tracking-tight text-neutral-950 [text-wrap:balance]"
            style={getTypographyStyle(config, "heading")}
          >
            {heading || "How we work together — From discovery to launch"}
          </h2>
        </div>

        <div className={`grid gap-6 @md:gap-4 relative w-full ${gridColumns}`}>
          {stepItems.map((step, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 transition-all duration-300 hover:bg-white hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-950/5"
            >
              {/* Step Index Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold text-neutral-900 bg-white border border-neutral-200 px-2.5 py-1 rounded-md group-hover:bg-neutral-950 group-hover:text-white group-hover:border-neutral-950 transition-colors">
                  {step.num}
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  Phase {index + 1}
                </span>
              </div>

              <h3
                className="text-lg font-bold text-neutral-950 mb-3 tracking-tight"
                style={getTypographyStyle(config, "steps", index, "title")}
              >
                {step.title}
              </h3>

              <p 
                className="text-xs @sm:text-sm text-neutral-600 leading-relaxed"
                style={getTypographyStyle(config, "steps", index, "description")}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
