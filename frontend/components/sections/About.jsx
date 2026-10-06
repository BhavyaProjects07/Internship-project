import React from "react";
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getGridColumnsClass, getTypographyStyle } from "@/lib/sectionLayout";
export default function About({ content, config }) {
  const {
    eyebrow,
    heading,
    description,
    highlightText,
    metadata = [],
    pillars = [],
  } = content || {};

  // =========================================================
  // UNIVERSAL LAYOUT CONFIG
  // =========================================================

  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass, itemsClass } = getAlignmentClasses(config, {
    layout: { alignment: "left" }
  });
  
  // Use config.layout.columns directly for conditional logic
  const columns = config?.layout?.columns || 1;
  const gridColumns = getGridColumnsClass(config);

  /*
   * About is naturally a two-column editorial section.
   *
   * We preserve that design for 1/2 columns while allowing
   * the universal column setting to affect the layout.
   */

  const finalGridColumns =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
      ? "grid-cols-1 md:grid-cols-3"
      : columns === 4
      ? "grid-cols-1 md:grid-cols-4"
      : "grid-cols-1 lg:grid-cols-12";

  return (
    <section
      id="about"
      className={`relative w-full flex flex-col ${itemsClass}`}
      style={getSectionStyle(config, {
        spacing: { padding: { top: 112, bottom: 112, left: 24, right: 24 } }
      })}
    >
      <div
        className={`mx-auto w-full ${textClass}`}
        style={{
          maxWidth: contentMaxWidth,
        }}
      >
        {/* ===================================================
            ONE COLUMN
        ==================================================== */}

        {columns === 1 ? (
          <div className="mx-auto max-w-4xl">
            {/* Eyebrow */}

            <div
              className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500"
              style={getTypographyStyle(config, "eyebrow")}
            >
              {eyebrow || "Who We Are"}
            </div>

            {/* Heading */}

            <h2
              className="text-3xl font-bold leading-[1.12] tracking-tight text-neutral-950 sm:text-4xl md:text-5xl"
              style={getTypographyStyle(config, "heading")}
            >
              {heading ||
                "We turn complex ideas into simple digital experiences."}
            </h2>

            {/* Description */}

            {description && (
              <p
                className="mt-8 text-lg leading-relaxed text-neutral-600 md:text-xl"
                style={getTypographyStyle(config, "description")}
              >
                {description}
              </p>
            )}

            {/* Highlight */}

            {highlightText && (
              <div className="my-8 border-l-2 border-neutral-950 py-1 pl-6">
                <blockquote
                  className="font-serif text-xl italic leading-snug text-neutral-900 md:text-2xl"
                  style={getTypographyStyle(config, "highlight")}
                >
                  "{highlightText}"
                </blockquote>
              </div>
            )}

            {/* Metadata */}

            {metadata.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-neutral-200/80 pt-8 text-xs text-neutral-500">
                {metadata.map((item, index) => (
                  <React.Fragment key={index}>
                    <span style={getTypographyStyle(config, "metadata")}>{item.label}</span>

                    {index < metadata.length - 1 && (
                      <span aria-hidden="true">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Pillars */}

            {pillars.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-6 border-t border-neutral-200/80 pt-8 sm:grid-cols-3">
                {pillars.map((pillar, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${textClass}`}
                  >
                    <span 
                      className="mb-2 font-mono text-xs font-semibold text-neutral-400"
                      style={getTypographyStyle(config, "pillars")}
                    >
                      {pillar.number ||
                        String(index + 1).padStart(2, "0")}
                    </span>

                    <h4
                      className="mb-1 text-sm font-semibold text-neutral-900"
                      style={getTypographyStyle(config, "pillars")}
                    >
                      {pillar.title}
                    </h4>

                    <p 
                      className="text-xs leading-relaxed text-neutral-500"
                      style={getTypographyStyle(config, "pillars")}
                    >
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* =================================================
             MULTI COLUMN
          ================================================== */

          <div
            className={finalGridColumns}
            style={{
              alignItems:
                config?.layout?.verticalAlignment === "top"
                  ? "start"
                  : config?.layout?.verticalAlignment === "bottom"
                  ? "end"
                  : "center",
            }}
          >
            {/* =================================================
                LEFT COLUMN
            ================================================== */}

            <div className="lg:col-span-5">
              {/* Eyebrow */}

              <div
                className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500"
                style={getTypographyStyle(config, "eyebrow")}
              >
                {eyebrow || "Who We Are"}
              </div>

              {/* Heading */}

              <h2
                className="text-3xl font-bold leading-[1.12] tracking-tight text-neutral-950 sm:text-4xl md:text-5xl"
                style={getTypographyStyle(config, "heading")}
              >
                {heading ||
                  "We turn complex ideas into simple digital experiences."}
              </h2>

              {/* Metadata */}

              {metadata.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-neutral-200/80 pt-8 text-xs text-neutral-500">
                  {metadata.map((item, index) => (
                    <React.Fragment key={index}>
                      <span style={getTypographyStyle(config, "metadata")}>{item.label}</span>

                      {index < metadata.length - 1 && (
                        <span aria-hidden="true">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================== */}

            <div className="lg:col-span-7 flex flex-col">
              {/* Description */}

              {description && (
                <p
                  className="text-lg leading-relaxed text-neutral-600 md:text-xl"
                  style={getTypographyStyle(config, "description")}
                >
                  {description}
                </p>
              )}

              {/* Highlight */}

              {highlightText && (
                <div className="my-8 border-l-2 border-neutral-950 py-1 pl-6">
                  <blockquote
                    className="font-serif text-xl italic leading-snug text-neutral-900 md:text-2xl"
                    style={getTypographyStyle(config, "highlight")}
                  >
                    "{highlightText}"
                  </blockquote>
                </div>
              )}

              {/* Pillars */}

              {pillars.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-6 border-t border-neutral-200/80 pt-8 sm:grid-cols-3">
                  {pillars.map((pillar, index) => (
                    <div
                      key={index}
                      className="flex flex-col"
                    >
                      <span 
                        className="mb-2 font-mono text-xs font-semibold text-neutral-400"
                        style={getTypographyStyle(config, "pillars")}
                      >
                        {pillar.number ||
                          String(index + 1).padStart(2, "0")}
                      </span>

                      <h4
                        className="mb-1 text-sm font-semibold text-neutral-900"
                        style={getTypographyStyle(config, "pillars")}
                      >
                        {pillar.title}
                      </h4>

                      <p 
                        className="text-xs leading-relaxed text-neutral-500"
                        style={getTypographyStyle(config, "pillars")}
                      >
                        {pillar.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}