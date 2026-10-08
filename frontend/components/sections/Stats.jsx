import React from 'react';
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getGridColumnsClass, getTypographyStyle } from "@/lib/sectionLayout";
export default function Stats({ content, config }) {
  const { stats } = content || {};
  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass } = getAlignmentClasses(config, { layout: { alignment: "left" } });
  const gridColumns = getGridColumnsClass(config, { layout: { columns: 4 } });
  const defaultStats = [
    { value: "12+", label: "Years of experience", sub: "Continuous production delivery" },
    { value: "80+", label: "Projects delivered", sub: "Enterprise & startup platforms" },
    { value: "24", label: "Countries reached", sub: "Global multi-region reach" },
    { value: "98%", label: "Client satisfaction", sub: "Long-term partnership retention" }
  ];

  const statItems = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section
      className="border-y border-neutral-800/80 relative overflow-hidden w-full flex flex-col" 
      style={getSectionStyle(config, {
        spacing: { padding: { top: 96, bottom: 96, left: 24, right: 24 } },
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff"
      })}
    >
      {/* Subtle radial ambient light */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/40 via-transparent to-transparent" 
      />

      <div className={`mx-auto w-full relative z-10 ${textClass}`} style={{ maxWidth: contentMaxWidth }}>
        <div className={`grid gap-8 @md:gap-12 divide-y @md:divide-y-0 @md:divide-x divide-neutral-800/80 ${gridColumns}`}>
          {statItems.map((stat, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${index !== 0 ? 'pt-8 @md:pt-0 @md:pl-10' : ''}`}
            >
              <div
                className="text-4xl @sm:text-5xl @md:text-6xl font-bold font-mono tabular-nums tracking-tight text-white mb-2"
                style={getTypographyStyle(config, "stats", index, "value")}
              >
                {stat.value}
              </div>
              <div 
                className="text-sm font-semibold text-neutral-200 tracking-wide uppercase"
                style={getTypographyStyle(config, "stats", index, "label")}
              >
                {stat.label}
              </div>
              {stat.sub && (
                <div 
                  className="text-xs text-neutral-500 mt-1 font-normal"
                  style={getTypographyStyle(config, "stats", index, "sub")}
                >
                  {stat.sub}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
