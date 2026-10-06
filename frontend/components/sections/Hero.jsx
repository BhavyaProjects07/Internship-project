import React from "react";
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getGridColumnsClass, getTypographyStyle } from "@/lib/sectionLayout";
export default function Hero({ content, config }) {
  const {
    eyebrow,
    heading,
    description,
    buttonText,
    buttonLink,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
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

  const btn1Text =
    primaryButtonText ||
    buttonText ||
    "Start a Project";

  const btn1Link =
    primaryButtonLink ||
    buttonLink ||
    "#contact";

  const btn2Text =
    secondaryButtonText ||
    "View Selected Work";

  const btn2Link =
    secondaryButtonLink ||
    "#portfolio";

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
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-bold tracking-tight leading-[1.08] text-neutral-950 max-w-4xl [text-wrap:balance]"
          style={getTypographyStyle(config, "heading")}
        >
          {heading ||
            "Digital experiences built for ambitious brands."}
        </h1>

        {/* Description */}

        <p
          className="mt-8 max-w-2xl text-lg sm:text-xl text-neutral-600 leading-relaxed [text-wrap:balance]"
          style={getTypographyStyle(config, "description")}
        >
          {description ||
            "We design and build high-performance digital products that help ambitious companies turn ideas into meaningful growth."}
        </p>

        {/* Buttons */}

        <div
          className={`mt-10 flex flex-wrap items-center gap-4 ${justifyClass}`}
        >
          {btn1Text && (
            <a
              href={btn1Link}
              className="group inline-flex items-center justify-center rounded-xl bg-theme-primary px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-neutral-950/10 active:scale-[0.99] whitespace-nowrap"
              style={getTypographyStyle(config, "primary-button")}
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
          )}

          {btn2Text && (
            <a
              href={btn2Link}
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300/80 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-800 transition-all duration-200 hover:bg-neutral-50 hover:border-neutral-400 whitespace-nowrap"
              style={getTypographyStyle(config, "secondary-button")}
            >
              {btn2Text}
            </a>
          )}
        </div>

        {/* =================================================
            SHOWCASE CARD
        ================================================== */}

        <div
          className="mt-16 w-full rounded-2xl border border-neutral-200/90 bg-neutral-900 p-2 shadow-2xl shadow-neutral-950/15 overflow-hidden"
        >
          {/* Browser Header */}

          <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
            </div>

            <div className="text-[11px] font-mono tracking-tight text-neutral-400 truncate max-w-xs">
              modernagency.studio / selected-works-2026
            </div>

            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE PREVIEW
            </div>
          </div>

          {/* Showcase */}

          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full bg-neutral-950 rounded-xl overflow-hidden flex flex-col justify-between p-6 md:p-10 text-left border border-neutral-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

            <div className="absolute bottom-0 left-10 w-72 h-72 bg-gradient-to-tr from-amber-500/10 to-transparent blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">
                Case Spotlight · Global FinTech Ecosystem
              </div>

              <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight max-w-xl">
                Redesigning institutional capital infrastructure for the next billion users.
              </h3>
            </div>

            {/* =================================================
                STATS
            ================================================== */}

            <div
              className={`relative z-10 pt-6 border-t border-neutral-800/80 grid ${gridColumns} gap-4 md:gap-8`}
            >
              <div>
                <div className="text-xl md:text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
                  +184%
                </div>

                <div className="text-xs text-neutral-400 mt-1">
                  Conversion velocity
                </div>
              </div>

              <div>
                <div className="text-xl md:text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
                  $450M+
                </div>

                <div className="text-xs text-neutral-400 mt-1">
                  Transaction flow
                </div>
              </div>

              <div>
                <div className="text-xl md:text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
                  0.38s
                </div>

                <div className="text-xs text-neutral-400 mt-1">
                  Sub-second P99 speed
                </div>
              </div>

              {columns >= 4 && (
                <div>
                  <div className="text-xl md:text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
                    99.9%
                  </div>

                  <div className="text-xs text-neutral-400 mt-1">
                    Platform reliability
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}