import React from "react";
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getGridColumnsClass, getTypographyStyle, getButtonStyle } from "@/lib/sectionLayout";
export default function Hero({ content, config }) {
  const {
    eyebrow,
    heading,
    description,
    buttonText,
    buttonLink,
    primaryButtonText: btn1Text,
    primaryButtonLink: btn1Link,
    primaryButtonTarget: btn1Target = "_self",
    secondaryButtonText: btn2Text,
    secondaryButtonLink: btn2Link,
    secondaryButtonTarget: btn2Target = "_self",
  } = content || {};

  // =========================================================
  // UNIVERSAL LAYOUT CONFIG
  // =========================================================

  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass, itemsClass, justifyClass } = getAlignmentClasses(config);
  const gridColumns = getGridColumnsClass(config);
  const columns = config?.layout?.columns || 1;

  // =========================================================
  // BUTTONS
  // =========================================================



  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        ...getSectionStyle(config, {
          spacing: { padding: { top: 128, bottom: 128, left: 24, right: 24 } }
        }),
        minHeight: "650px",
      }}
    >
      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-10 opacity-70"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-100 via-transparent to-transparent blur-2xl" />

        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-amber-50/40 rounded-full blur-3xl" />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className={`relative z-10 mx-auto w-full flex flex-col ${textClass} ${itemsClass}`}
        style={{
          maxWidth: contentMaxWidth,
        }}
      >
        {/* Eyebrow */}

        <div
          className="mb-8 inline-flex items-center gap-2.5 text-xs font-medium tracking-wider uppercase text-neutral-600"
          style={getTypographyStyle(config, "eyebrow")}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

          <span>
            {eyebrow || "Digital Studio"}
          </span>

          <span
            aria-hidden="true"
            className="text-neutral-300"
          >
            ·
          </span>

          <span>
            Global Creative Engineering
          </span>
        </div>

        {/* Heading */}

        <h1
          className="text-4xl @sm:text-6xl @md:text-7xl @lg:text-[4.75rem] font-bold tracking-tight leading-[1.08] text-neutral-950 max-w-4xl [text-wrap:balance]"
          style={getTypographyStyle(config, "heading")}
        >
          {heading ||
            "Digital experiences built for ambitious brands."}
        </h1>

        {/* Description */}

        <p
          className="mt-8 max-w-2xl text-lg @sm:text-xl text-neutral-600 leading-relaxed [text-wrap:balance]"
          style={getTypographyStyle(config, "description")}
        >
          {description ||
            "We design and build high-performance digital products that help ambitious companies turn ideas into meaningful growth."}
        </p>

        {/* Buttons */}

        <div
          className={`mt-10 flex flex-wrap items-center gap-4 ${justifyClass}`}
        >
          {btn1Text && (() => {
            const btn1StyleProps = getButtonStyle(config, "primary-button");
            return (
            <a
              href={btn1Link}
              target={btn1Target}
              rel={btn1Target === "_blank" ? "noopener noreferrer" : undefined}
              className={`group inline-flex items-center justify-center rounded-xl bg-theme-primary px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-neutral-950/10 active:scale-[0.99] whitespace-nowrap ${btn1StyleProps.className || ''}`}
              style={{
                ...getTypographyStyle(config, "primary-button"),
                ...btn1StyleProps.style
              }}
            >
              <span>{btn1Text}</span>

              <svg
                className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
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
            );
          })()}

          {btn2Text && (() => {
            const btn2StyleProps = getButtonStyle(config, "secondary-button");
            return (
            <a
              href={btn2Link}
              target={btn2Target}
              rel={btn2Target === "_blank" ? "noopener noreferrer" : undefined}
              className={`inline-flex items-center justify-center rounded-xl border border-neutral-300/80 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-800 transition-all duration-200 hover:bg-neutral-50 hover:border-neutral-400 whitespace-nowrap ${btn2StyleProps.className || ''}`}
              style={{
                ...getTypographyStyle(config, "secondary-button"),
                ...btn2StyleProps.style
              }}
            >
              {btn2Text}
            </a>
            );
          })()}
        </div>

        
      </div>
    </section>
  );
}