import React from "react";
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getGridColumnsClass, getTypographyStyle } from "@/lib/sectionLayout";
export default function Services({ content, config }) {
  const {
    eyebrow = "Core Capabilities",
    heading = "Everything you need to build what comes next.",
    serviceLabel = "Service Domain",
    deliverablesLabel = "Key Deliverables",
    buttonText = "Explore Capability",
    services = [],
  } = content || {};

  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass, itemsClass } = getAlignmentClasses(config, {
    layout: { alignment: "left" }
  });
  const gridColumns = getGridColumnsClass(config, { layout: { columns: 3 } });

  return (
    <section
      id="services"
      className="relative w-full flex flex-col"
      style={getSectionStyle(config, {
        layout: { alignment: "left" },
        spacing: { padding: { top: 112, bottom: 112, left: 24, right: 24 } },
        backgroundColor: "#f9fafb"
      })}
    >
      <div className={`mx-auto w-full ${textClass} ${itemsClass}`} style={{ maxWidth: contentMaxWidth }}>

        {/* SECTION HEADER */}
        <div className="mb-16 max-w-3xl @md:mb-20">
          <div
            className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500"
            style={getTypographyStyle(config, "eyebrow")}
          >
            {eyebrow}
          </div>

          <h2
            className="text-3xl font-bold tracking-tight text-neutral-950 [text-wrap:balance] @sm:text-4xl @md:text-5xl"
            style={getTypographyStyle(config, "heading")}
          >
            {heading}
          </h2>
        </div>

        {/* SERVICES */}
        <div className={`grid gap-8 ${gridColumns}`}>
          {services.map((service, index) => {
            const deliverables = Array.isArray(service.deliverables)
              ? service.deliverables
              : [];

            return (
              <div
                key={index}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-950/5 @sm:p-10"
              >
                <div>
                  {/* SERVICE INDEX */}
                  <div className="mb-8 flex items-center justify-between border-b border-neutral-100 pb-4">
                    <span className="text-xs font-mono font-bold tracking-wider text-neutral-400">
                      {String(index + 1).padStart(2, "0")}.
                    </span>

                    <span className="text-xs font-medium text-neutral-400 transition-colors group-hover:text-neutral-900">
                      {serviceLabel}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3
                    className="mb-4 text-xl font-bold tracking-tight text-neutral-950 @sm:text-2xl"
                    style={getTypographyStyle(config, "services", index, "title")}
                  >
                    {service.title}
                  </h3>

                  {/* DESCRIPTION */}
                  {service.description && (
                    <p 
                      className="mb-8 text-sm leading-relaxed text-neutral-600 @sm:text-base"
                      style={getTypographyStyle(config, "services", index, "description")}
                    >
                      {service.description}
                    </p>
                  )}
                </div>

                <div>
                  {/* DELIVERABLES */}
                  {deliverables.length > 0 && (
                    <div className="mb-6 border-t border-neutral-100 pt-6">
                      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                        {deliverablesLabel}
                      </div>

                      <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs leading-relaxed text-neutral-600">
                        {deliverables.map((item, dIdx) => (
                          <React.Fragment key={dIdx}>
                            <span className="transition-colors hover:text-neutral-950">
                              {item}
                            </span>

                            {dIdx < deliverables.length - 1 && (
                              <span
                                aria-hidden="true"
                                className="text-neutral-300"
                              >
                                ·
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ACTION */}
                  {service.link && (
                    <a
                      href={service.link}
                      className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-colors group-hover:text-neutral-700"
                    >
                      <span>{buttonText}</span>

                      <svg
                        className="ml-2 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}