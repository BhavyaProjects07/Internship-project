"use client";

import React, { useState } from "react";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { spacingFields, commonDesignDefaults } from "../fields/boxStyleFields.js";
import {
  selectField,
  numberField,
  textField,
  textareaField,
  radioField,
  colorField,
  imageField,
  responsiveField,
} from "../fields/helpers.js";
import { getHoverClass } from "../layout/styleBuilders.js";
import { buildResponsiveStyles } from "../layout/responsiveStyles.js";
import { ALIGNMENT_OPTIONS, HOVER_EFFECT_OPTIONS, RADIUS_OPTIONS, SHADOW_PRESETS, SPACING_OPTIONS } from "../tokens/index.js";
import { RenderIcon, ICON_PRESETS } from "./icons.jsx";

export const marketingComponents = {
  // ------------------------------------------------------------------------
  // HERO SECTION (ADVANCED COMPOSABLE & DYNAMIC)
  // ------------------------------------------------------------------------
  Hero: {
    label: "Hero Section (Advanced)",
    fields: {
      contentMode: selectField("Hero Building Mode", [
        { label: "⚡ Preset Layout (Fast High-Converting Hero)", value: "preset" },
        { label: "🎨 Build from Scratch (Full Drag & Drop Slots)", value: "custom" },
      ]),

      // Slots for Full Composable Drag-and-Drop Freedom
      leftSlot: { type: "slot" },
      rightSlot: { type: "slot" },
      heroContent: { type: "slot" },
      heroMediaSlot: { type: "slot" },

      layout: selectField("Layout arrangement", [
        { label: "Split (Content Left, Visual Right)", value: "split" },
        { label: "Centered Hero", value: "centered" },
        { label: "Full Height 100vh Hero (With scroll indicator)", value: "fullHeight" },
        { label: "Full Background Visual", value: "background" },
      ]),
      columnRatio: selectField("Column Width Ratio (Split Mode)", [
        { label: "50% / 50% (Equal Split)", value: "50-50" },
        { label: "60% Content / 40% Visual", value: "60-40" },
        { label: "40% Content / 60% Visual", value: "40-60" },
        { label: "70% Content / 30% Visual", value: "70-30" },
      ]),
      reverseColumns: radioField("Reverse Columns (Visual Left, Content Right)", [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ]),
      verticalAlign: selectField("Vertical Column Alignment", [
        { label: "Center Aligned", value: "center" },
        { label: "Top Aligned", value: "start" },
        { label: "Bottom Aligned", value: "end" },
      ]),

      // Eyebrow Badge
      showBadgePill: radioField("Show Eyebrow Badge", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      eyebrow: textField("Eyebrow badge / category text"),
      pulseDot: radioField("Pulsing Live Beacon Dot", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),

      // Headline & Highlight
      title: textField("Main hero headline"),
      highlightText: textField("Headline Gradient Highlight Word(s)"),
      highlightGradient: textField("Highlight Gradient (CSS, e.g. linear-gradient(135deg, #818cf8, #c084fc))"),
      description: textareaField("Supporting description"),

      // Primary CTA Button
      primaryButtonText: textField("Primary CTA button text"),
      primaryButtonUrl: textField("Primary link URL"),
      primaryButtonVariant: selectField("Primary Button Style", [
        { label: "Solid Color", value: "solid" },
        { label: "Gradient Aurora", value: "gradient" },
        { label: "Ambient Glow", value: "glow" },
        { label: "Outline", value: "outline" },
      ]),

      // Secondary Button
      showSecondaryButton: radioField("Show secondary button", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      secondaryButtonText: textField("Secondary CTA label"),
      secondaryButtonUrl: textField("Secondary link URL"),
      showPlayIcon: radioField("Show Video Play Icon on Secondary Button", [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ]),

      // Social Proof & Ratings
      showRatings: radioField("Show Customer Social Proof Bar", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      showAvatarStack: radioField("Show Verified Customer Avatars", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      ratingsText: textField("Rating label (e.g. 4.95 / 5 from 3,400+ satisfied builders)"),

      // Visual Media Column
      imageUrl: imageField("Split visual / Hero image URL"),
      imageAlt: textField("Image alt text"),
      imageWidth: numberField("Split visual width (%)", 30, 70),
      mockupFrame: selectField("Visual Presentation Frame", [
        { label: "Modern Card with Ambient Shadow", value: "card" },
        { label: "Browser Safari Window Mockup", value: "browser" },
        { label: "Glass Floating Canvas", value: "glass" },
        { label: "Raw Unstyled Image", value: "raw" },
      ]),

      // Floating Metric Stat Cards
      showFloatingCard1: radioField("Show Floating Stat Card 1", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      floatingCard1Title: textField("Card 1 Title"),
      floatingCard1Value: textField("Card 1 Stat Value"),
      showFloatingCard2: radioField("Show Floating Stat Card 2", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      floatingCard2Title: textField("Card 2 Title"),
      floatingCard2Value: textField("Card 2 Stat Value"),

      // Background Aesthetics
      backgroundColor: colorField("Background color"),
      backgroundGradient: radioField("Enable gradient overlay", [
        { label: "Disabled", value: false },
        { label: "Enabled", value: true },
      ]),
      gradientFrom: colorField("Gradient color from"),
      gradientTo: colorField("Gradient color to"),
      backgroundImage: imageField("Background image URL"),
      overlayOpacity: numberField("Background overlay opacity (%)", 0, 100),
      patternOverlay: selectField("Background Grid Texture", [
        { label: "None", value: "none" },
        { label: "Subtle Dot Matrix", value: "dots" },
        { label: "Architectural Grid Lines", value: "grid" },
      ]),
      enableMeshGlow: radioField("Ambient Aurora / Mesh Glow", [
        { label: "Enabled", value: true },
        { label: "Disabled", value: false },
      ]),
      meshGlowColor: colorField("Mesh Glow Accent Color"),

      // Colors & Sizing
      textColor: colorField("Text color"),
      accentColor: colorField("Accent highlight color"),
      paddingY: numberField("Vertical padding (px)", 40, 240),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),

      responsive: responsiveField("Responsive overrides", [
        { name: "paddingY", label: "Vertical padding (px)", type: "number", min: 20, max: 240 },
        { name: "imageWidth", label: "Split image width (%)", type: "number", min: 30, max: 100 },
      ]),
      ...animationFields,
    },
    defaultProps: {
      contentMode: "preset",
      layout: "split",
      columnRatio: "50-50",
      reverseColumns: false,
      verticalAlign: "center",
      showBadgePill: true,
      eyebrow: "NEXT GENERATION WEB EXPERIENCES",
      pulseDot: true,
      title: "Digital Products Built for Ambitious Brands",
      highlightText: "Ambitious Brands",
      highlightGradient: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
      description:
        "We architect, design, and engineer high-performance platforms that transform industry standards and convert visitors into loyal advocates.",
      primaryButtonText: "Explore Templates",
      primaryButtonUrl: "#explore",
      primaryButtonVariant: "glow",
      showSecondaryButton: true,
      secondaryButtonText: "Book Discovery Call",
      secondaryButtonUrl: "#contact",
      showPlayIcon: false,
      showRatings: true,
      showAvatarStack: true,
      ratingsText: "4.95 / 5 from 3,400+ satisfied builders",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Digital platform dashboard",
      imageWidth: 50,
      mockupFrame: "browser",
      showFloatingCard1: true,
      floatingCard1Title: "Conversion Rate",
      floatingCard1Value: "🚀 +240%",
      showFloatingCard2: true,
      floatingCard2Title: "Uptime SLA",
      floatingCard2Value: "⚡ 99.99%",
      backgroundColor: "#090d16",
      backgroundGradient: true,
      gradientFrom: "#090d16",
      gradientTo: "#111827",
      backgroundImage: "",
      overlayOpacity: 40,
      patternOverlay: "dots",
      enableMeshGlow: true,
      meshGlowColor: "#6366f1",
      textColor: "#ffffff",
      accentColor: "#6366f1",
      paddingY: 100,
      borderRadius: 0,
      responsive: {
        tablet: {
          paddingY: 64,
          imageWidth: 80,
        },
        mobile: {
          paddingY: 40,
          imageWidth: 100,
        },
      },
      ...animationDefaults,
    },
    render: ({
      contentMode = "preset",
      leftSlot: LeftSlot,
      rightSlot: RightSlot,
      heroContent: HeroContent,
      heroMediaSlot: HeroMediaSlot,
      layout = "split",
      columnRatio = "50-50",
      reverseColumns = false,
      verticalAlign = "center",
      showBadgePill = true,
      eyebrow,
      pulseDot = true,
      title,
      highlightText,
      highlightGradient,
      description,
      primaryButtonText,
      primaryButtonUrl,
      primaryButtonVariant = "glow",
      showSecondaryButton,
      secondaryButtonText,
      secondaryButtonUrl,
      showPlayIcon = false,
      showRatings,
      showAvatarStack = true,
      ratingsText,
      imageUrl,
      imageAlt,
      imageWidth = 50,
      mockupFrame = "browser",
      showFloatingCard1 = false,
      floatingCard1Title,
      floatingCard1Value,
      showFloatingCard2 = false,
      floatingCard2Title,
      floatingCard2Value,
      backgroundColor = "#090d16",
      backgroundGradient,
      gradientFrom,
      gradientTo,
      backgroundImage,
      overlayOpacity = 40,
      patternOverlay = "dots",
      enableMeshGlow = true,
      meshGlowColor = "#6366f1",
      textColor = "#ffffff",
      accentColor = "#6366f1",
      paddingY = 100,
      borderRadius = 0,
      responsive,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const isCentered = layout === "centered";
      const isSplit = layout === "split";
      const isFullHeight = layout === "fullHeight";

      const heroBgColor = backgroundColor || "#090d16";
      const cleanBgImage = (backgroundImage || "").trim().replace(/["\\\n\r]/g, "");
      const hasBgImage = Boolean(cleanBgImage);

      let heroBgImage = undefined;
      if (hasBgImage && backgroundGradient) {
        heroBgImage = `url("${cleanBgImage}"), linear-gradient(135deg, ${gradientFrom || "#090d16"}, ${gradientTo || "#131b2e"})`;
      } else if (hasBgImage) {
        heroBgImage = `url("${cleanBgImage}")`;
      } else if (backgroundGradient) {
        heroBgImage = `linear-gradient(135deg, ${gradientFrom || "#090d16"}, ${gradientTo || "#131b2e"})`;
      }

      const showOverlay = (hasBgImage || layout === "background" || overlayOpacity > 0) && overlayOpacity > 0;

      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          paddingY: "--puck-padding-y",
          imageWidth: "--puck-image-width",
        },
      });

      // Split ratios
      const contentRatioMap = {
        "50-50": "1fr 1fr",
        "60-40": "1.4fr 1fr",
        "40-60": "1fr 1.4fr",
        "70-30": "1.8fr 1fr",
      };

      // Headline renderer with gradient highlight
      const renderHeadline = () => {
        if (!title) return null;
        if (!highlightText || !title.includes(highlightText)) {
          return title;
        }

        const parts = title.split(highlightText);
        return (
          <>
            {parts[0]}
            <span
              style={{
                backgroundImage:
                  highlightGradient ||
                  "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              {highlightText}
            </span>
            {parts.slice(1).join(highlightText)}
          </>
        );
      };

      // Button variant styles
      const getPrimaryBtnStyles = () => {
        const base = {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "16px 34px",
          borderRadius: 14,
          fontSize: 15,
          fontWeight: 700,
          textDecoration: "none",
          transition: "all 180ms ease",
          cursor: "pointer",
          whiteSpace: "nowrap",
        };

        if (primaryButtonVariant === "gradient") {
          return {
            ...base,
            backgroundImage: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
            color: "#ffffff",
            boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.45)",
          };
        }
        if (primaryButtonVariant === "glow") {
          return {
            ...base,
            backgroundColor: accentColor || "#6366f1",
            color: "#ffffff",
            boxShadow: `0 0 30px ${accentColor ? accentColor + "80" : "rgba(99, 102, 241, 0.6)"}`,
          };
        }
        if (primaryButtonVariant === "outline") {
          return {
            ...base,
            backgroundColor: "transparent",
            color: accentColor || "#ffffff",
            border: `2px solid ${accentColor || "#6366f1"}`,
          };
        }
        return {
          ...base,
          backgroundColor: accentColor || "#6366f1",
          color: "#ffffff",
          boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
        };
      };

      return (
        <AnimationWrapper
          as="section"
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            position: "relative",
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: heroBgColor,
            backgroundImage: heroBgImage,
            backgroundSize: hasBgImage ? "cover" : undefined,
            backgroundPosition: hasBgImage ? "center" : undefined,
            backgroundRepeat: hasBgImage ? "no-repeat" : undefined,
            color: textColor || "#ffffff",
            paddingTop: isFullHeight ? "120px" : `var(--puck-padding-y, ${paddingY}px)`,
            paddingBottom: isFullHeight ? "100px" : `var(--puck-padding-y, ${paddingY}px)`,
            minHeight: isFullHeight ? "100vh" : undefined,
            display: isFullHeight ? "flex" : "block",
            flexDirection: isFullHeight ? "column" : undefined,
            justifyContent: isFullHeight ? "center" : undefined,
            borderRadius: `${borderRadius}px`,
            overflow: "hidden",
          }}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}

          {/* Ambient Mesh Glow Aurora Effect */}
          {enableMeshGlow && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-15%",
                left: isCentered ? "50%" : "30%",
                transform: isCentered ? "translateX(-50%)" : "none",
                width: "min(800px, 90vw)",
                height: "min(600px, 80vh)",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${meshGlowColor || "#6366f1"}38 0%, rgba(99, 102, 241, 0.12) 40%, transparent 70%)`,
                filter: "blur(60px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          )}

          {/* Pattern Texture Overlay */}
          {patternOverlay === "dots" && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `radial-gradient(${textColor || "#ffffff"}22 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
                opacity: 0.6,
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          )}
          {patternOverlay === "grid" && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(${textColor || "#ffffff"}10 1px, transparent 1px), linear-gradient(90deg, ${textColor || "#ffffff"}10 1px, transparent 1px)`,
                backgroundSize: "48px 48px",
                opacity: 0.5,
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          )}

          {/* Dark Overlay */}
          {showOverlay && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#000000",
                opacity: Math.min(1, Math.max(0, overlayOpacity / 100)),
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          )}

          {/* Main Container */}
          <div
            className={respClass}
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1320,
              margin: "0 auto",
              padding: "0 28px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* -------------------------------------------------------- */}
            {/* BUILD FROM SCRATCH MODE (Full Slot Composable Canvas)   */}
            {/* -------------------------------------------------------- */}
            {contentMode === "custom" ? (
              isSplit ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: contentRatioMap[columnRatio] || "1fr 1fr",
                    gap: 48,
                    alignItems: verticalAlign === "start" ? "start" : verticalAlign === "end" ? "end" : "center",
                  }}
                >
                  <div
                    style={{
                      order: reverseColumns ? 2 : 1,
                      minHeight: 120,
                    }}
                  >
                    {LeftSlot && <LeftSlot minEmptyHeight="140px" />}
                  </div>

                  <div
                    style={{
                      order: reverseColumns ? 1 : 2,
                      minHeight: 120,
                    }}
                  >
                    {RightSlot && <RightSlot minEmptyHeight="140px" />}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isCentered ? "center" : "flex-start",
                    textAlign: isCentered ? "center" : "left",
                    gap: 32,
                    maxWidth: isCentered ? 960 : "100%",
                    margin: isCentered ? "0 auto" : 0,
                  }}
                >
                  {HeroContent && <HeroContent minEmptyHeight="140px" />}
                  {HeroMediaSlot && <HeroMediaSlot minEmptyHeight="140px" />}
                </div>
              )
            ) : (
              /* -------------------------------------------------------- */
              /* PRESET MODE (High-Impact Styled Hero)                   */
              /* -------------------------------------------------------- */
              <div
                style={{
                  display: "flex",
                  flexDirection: isSplit ? (reverseColumns ? "row-reverse" : "row") : "column",
                  alignItems: verticalAlign === "start" ? "flex-start" : verticalAlign === "end" ? "flex-end" : "center",
                  justifyContent: "space-between",
                  textAlign: isCentered ? "center" : "left",
                  gap: 56,
                  flexWrap: "wrap",
                }}
              >
                {/* Content Column */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 280,
                    maxWidth: isCentered ? 840 : 660,
                    margin: isCentered ? "0 auto" : undefined,
                  }}
                >
                  {/* Eyebrow Badge Pill */}
                  {showBadgePill && eyebrow && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        borderRadius: 999,
                        backgroundColor: "rgba(99, 102, 241, 0.14)",
                        border: "1px solid rgba(99, 102, 241, 0.32)",
                        color: "#a5b4fc",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        textTransform: "uppercase",
                        marginBottom: 24,
                      }}
                    >
                      {pulseDot && (
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            backgroundColor: "#818cf8",
                            boxShadow: "0 0 10px #818cf8",
                            display: "inline-block",
                          }}
                        />
                      )}
                      <span>{eyebrow}</span>
                    </div>
                  )}

                  {/* Headline */}
                  <h1
                    style={{
                      fontSize: "clamp(34px, 5.2vw, 64px)",
                      fontWeight: 850,
                      lineHeight: 1.1,
                      letterSpacing: -1.2,
                      margin: "0 0 22px",
                      color: textColor || "#ffffff",
                    }}
                  >
                    {renderHeadline()}
                  </h1>

                  {/* Subtitle */}
                  {description && (
                    <p
                      style={{
                        fontSize: "clamp(16px, 1.8vw, 20px)",
                        lineHeight: 1.65,
                        color: textColor || "#ffffff",
                        opacity: 0.85,
                        margin: isCentered ? "0 auto 36px" : "0 0 36px",
                        maxWidth: 620,
                      }}
                    >
                      {description}
                    </p>
                  )}

                  {/* Buttons Group */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: isCentered ? "center" : "flex-start",
                      gap: 16,
                      marginBottom: showRatings ? 36 : 0,
                    }}
                  >
                    {primaryButtonText && (
                      <a
                        href={primaryButtonUrl || "#"}
                        className="hover-lift-sm"
                        style={getPrimaryBtnStyles()}
                      >
                        <span>{primaryButtonText}</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    )}

                    {showSecondaryButton && secondaryButtonText && (
                      <a
                        href={secondaryButtonUrl || "#"}
                        className="hover-lift-sm"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "16px 30px",
                          borderRadius: 14,
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "#ffffff",
                          fontSize: 15,
                          fontWeight: 600,
                          textDecoration: "none",
                          cursor: "pointer",
                        }}
                      >
                        {showPlayIcon && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                        <span>{secondaryButtonText}</span>
                      </a>
                    )}
                  </div>

                  {/* Social Proof / Ratings */}
                  {showRatings && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCentered ? "center" : "flex-start",
                        gap: 14,
                        fontSize: 13,
                        opacity: 0.9,
                      }}
                    >
                      {showAvatarStack && (
                        <div style={{ display: "flex", marginLeft: 4 }}>
                          {[
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
                          ].map((src, i) => (
                            <img
                              key={`avatar-${i}`}
                              src={src}
                              alt="Customer avatar"
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                border: "2px solid #090d16",
                                marginLeft: i === 0 ? 0 : -8,
                                objectFit: "cover",
                                display: "inline-block",
                              }}
                            />
                          ))}
                        </div>
                      )}

                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <div style={{ display: "flex", gap: 3 }}>
                          {[0, 1, 2, 3, 4].map((i) => (
                            <RenderIcon
                              key={`star-rating-${i}`}
                              name="star"
                              size={15}
                              color="#f59e0b"
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>
                          {ratingsText}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Optional Composable Content Drop Zone inside Preset Hero */}
                  {HeroContent && (
                    <div style={{ marginTop: 24 }}>
                      <HeroContent minEmptyHeight="80px" />
                    </div>
                  )}
                </div>

                {/* Visual / Media Column */}
                {(isSplit || isCentered) && (imageUrl || HeroMediaSlot) && (
                  <div
                    style={{
                      width: isSplit
                        ? `var(--puck-image-width, ${imageWidth}%)`
                        : "100%",
                      maxWidth: isCentered ? 1040 : "100%",
                      flexShrink: 0,
                      minWidth: 280,
                      position: "relative",
                      marginTop: isCentered ? 40 : 0,
                    }}
                  >
                    {mockupFrame === "browser" ? (
                      /* Safari Window Mockup Frame */
                      <div
                        style={{
                          borderRadius: 18,
                          backgroundColor: "#1e293b",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.6)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "12px 16px",
                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                          }}
                        >
                          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" }} />
                          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10b981" }} />
                          <div
                            style={{
                              marginLeft: 12,
                              height: 20,
                              borderRadius: 6,
                              backgroundColor: "rgba(255, 255, 255, 0.06)",
                              padding: "0 12px",
                              display: "flex",
                              alignItems: "center",
                              fontSize: 10,
                              color: "#94a3b8",
                              flex: 1,
                              maxWidth: 320,
                            }}
                          >
                            https://preview.yourbrand.com
                          </div>
                        </div>

                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={imageAlt || "Hero visual"}
                            style={{
                              width: "100%",
                              display: "block",
                              maxHeight: 520,
                              objectFit: "cover",
                            }}
                          />
                        )}

                        {HeroMediaSlot && <HeroMediaSlot minEmptyHeight="100px" />}
                      </div>
                    ) : (
                      /* Modern Card Frame */
                      <div
                        style={{
                          borderRadius: 20,
                          overflow: "hidden",
                          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={imageAlt || "Hero visual"}
                            style={{
                              width: "100%",
                              display: "block",
                              maxHeight: 520,
                              objectFit: "cover",
                            }}
                          />
                        )}
                        {HeroMediaSlot && <HeroMediaSlot minEmptyHeight="100px" />}
                      </div>
                    )}

                    {/* Floating Stat Card 1 */}
                    {showFloatingCard1 && floatingCard1Value && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 24,
                          left: -16,
                          padding: "12px 20px",
                          borderRadius: 14,
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255, 255, 255, 0.16)",
                          boxShadow: "0 14px 28px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          animation: "puckFadeIn 300ms ease",
                        }}
                      >
                        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
                          {floatingCard1Title || "Performance"}
                        </span>
                        <span style={{ fontSize: 18, color: "#ffffff", fontWeight: 800 }}>
                          {floatingCard1Value}
                        </span>
                      </div>
                    )}

                    {/* Floating Stat Card 2 */}
                    {showFloatingCard2 && floatingCard2Value && (
                      <div
                        style={{
                          position: "absolute",
                          top: 24,
                          right: -16,
                          padding: "12px 20px",
                          borderRadius: 14,
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255, 255, 255, 0.16)",
                          boxShadow: "0 14px 28px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          animation: "puckFadeIn 300ms ease",
                        }}
                      >
                        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
                          {floatingCard2Title || "Rating"}
                        </span>
                        <span style={{ fontSize: 18, color: "#ffffff", fontWeight: 800 }}>
                          {floatingCard2Value}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Full Height Animated Scroll Indicator Arrow */}
          {isFullHeight && (
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                color: textColor || "#ffffff",
                opacity: 0.75,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              <span>Scroll to explore</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                style={{
                  animation: "puckBounce 1.5s infinite",
                }}
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
          )}
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // CALL TO ACTION (CTA BANNER)
  // ------------------------------------------------------------------------
  CallToAction: {
    label: "Call to Action Banner",
    fields: {
      ctaSlot: { type: "slot" },
      headline: textField("Call to action headline"),
      description: textareaField("Supporting description"),
      badgeText: textField("Small top tag (Optional)"),
      primaryButtonText: textField("Primary CTA button text"),
      primaryButtonUrl: textField("Primary link URL"),
      secondaryButtonText: textField("Secondary CTA label (Optional)"),
      secondaryButtonUrl: textField("Secondary link URL"),
      backgroundColor: colorField("Banner background color"),
      backgroundGradient: radioField("Enable gradient", [
        { label: "Disabled", value: false },
        { label: "Enabled", value: true },
      ]),
      gradientFrom: colorField("Gradient color 1"),
      gradientTo: colorField("Gradient color 2"),
      textColor: colorField("Text color"),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      boxShadow: selectField("Shadow preset", SHADOW_PRESETS),
      responsive: responsiveField("Responsive overrides", [
        { name: "paddingY", label: "Vertical padding (px)", type: "number", min: 20, max: 160 },
        { name: "paddingX", label: "Horizontal padding (px)", type: "number", min: 12, max: 80 },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      ctaSlot: [],
      headline: "Ready to Transform Your Digital Presence?",
      description:
        "Join 10,000+ top designers and engineering teams who build modern, hyper-optimized web applications with our visual platform.",
      badgeText: "INSTANT ACCESS",
      primaryButtonText: "Explore Templates Now",
      primaryButtonUrl: "#templates",
      secondaryButtonText: "Schedule Architecture Review",
      secondaryButtonUrl: "#demo",
      backgroundColor: "#0f172a",
      backgroundGradient: true,
      gradientFrom: "#1e1b4b",
      gradientTo: "#0f172a",
      textColor: "#ffffff",
      borderRadius: 24,
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
      marginTop: "24px",
      marginBottom: "32px",
      responsive: {
        tablet: {
          paddingY: 48,
          paddingX: 24,
        },
        mobile: {
          paddingY: 32,
          paddingX: 16,
        },
      },
      ...animationDefaults,
    },
    render: ({
      ctaSlot: CtaSlot,
      headline,
      description,
      badgeText,
      primaryButtonText,
      primaryButtonUrl,
      secondaryButtonText,
      secondaryButtonUrl,
      backgroundColor,
      backgroundGradient,
      gradientFrom,
      gradientTo,
      textColor,
      borderRadius,
      boxShadow,
      marginTop,
      marginBottom,
      responsive,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const ctaBgColor = backgroundColor || "#0f172a";
      const ctaBgImage = backgroundGradient
        ? `linear-gradient(135deg, ${gradientFrom || "#1e1b4b"}, ${gradientTo || "#0f172a"})`
        : undefined;

      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          paddingY: "--puck-padding-y",
          paddingX: "--puck-padding-x",
        },
      });

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: ctaBgColor,
            backgroundImage: ctaBgImage,
            color: textColor || "#ffffff",
            borderRadius: `${borderRadius}px`,
            boxShadow: boxShadow === "none" ? undefined : boxShadow,
            padding: "var(--puck-padding-y, 56px) var(--puck-padding-x, 40px)",
            textAlign: "center",
            marginTop,
            marginBottom,
            position: "relative",
            overflow: "hidden",
          }}
          className={respClass}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          {badgeText && (
            <span
              style={{
                display: "inline-block",
                padding: "6px 14px",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(8px)",
                marginBottom: 20,
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {badgeText}
            </span>
          )}
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: -0.5,
              margin: "0 0 16px",
            }}
          >
            {headline}
          </h2>
          {description && (
            <p
              style={{
                maxWidth: 640,
                margin: "0 auto 32px",
                fontSize: 18,
                lineHeight: 1.7,
                opacity: 0.9,
              }}
            >
              {description}
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
            {primaryButtonText && (
              <a
                href={primaryButtonUrl || "#"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 28px",
                  borderRadius: 12,
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                {primaryButtonText}
              </a>
            )}
            {secondaryButtonText && (
              <a
                href={secondaryButtonUrl || "#"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 28px",
                  borderRadius: 12,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {secondaryButtonText}
              </a>
            )}
          </div>
          {CtaSlot && (
            <div style={{ marginTop: 24 }}>
              <CtaSlot />
            </div>
          )}
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // PRICING TABLE CARD
  // ------------------------------------------------------------------------
  PricingTable: {
    label: "Pricing Plan Card",
    fields: {
      customSlot: { type: "slot" },
      planName: textField("Tier title (e.g. Pro, Growth)"),
      badge: textField("Featured badge text (e.g. MOST POPULAR)"),
      isPopular: radioField("Highlight as Featured", [
        { label: "Standard Plan", value: false },
        { label: "Popular (Glowing Border)", value: true },
      ]),
      currency: textField("Currency symbol"),
      price: textField("Price figure"),
      period: textField("Billing interval (e.g. /month, /year)"),
      description: textareaField("Tier summary description"),
      features: {
        type: "array",
        label: "Included features",
        arrayFields: {
          text: textField("Feature description"),
          included: radioField("Included in plan?", [
            { label: "Yes (Checkmark)", value: true },
            { label: "No (Excluded)", value: false },
          ]),
        },
        defaultItemProps: { text: "Full API Access", included: true },
        getItemSummary: (item) => item.text || "Feature item",
      },
      buttonText: textField("Button call to action"),
      buttonUrl: textField("Button destination URL"),
      backgroundColor: colorField("Card background"),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      hoverEffect: selectField("Hover micro-animation", HOVER_EFFECT_OPTIONS),
      responsive: responsiveField("Responsive overrides", [
        { name: "marginTop", label: "Top margin", type: "select", options: SPACING_OPTIONS },
        { name: "marginBottom", label: "Bottom margin", type: "select", options: SPACING_OPTIONS },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      customSlot: [],
      planName: "Professional",
      badge: "MOST POPULAR",
      isPopular: true,
      currency: "$",
      price: "79",
      period: "/month",
      description:
        "Perfect for scaling businesses needing advanced visual capabilities and priority infrastructure.",
      features: [
        { text: "Unlimited templates and landing pages", included: true },
        { text: "Full Puck visual block customizer", included: true },
        { text: "Custom domain & SSL certificate", included: true },
        { text: "Collaborative multi-user editing", included: true },
        { text: "Dedicated account architect", included: false },
      ],
      buttonText: "Start 14-Day Free Trial",
      buttonUrl: "#checkout",
      backgroundColor: "#ffffff",
      borderRadius: 20,
      hoverEffect: "lift-md",
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      customSlot: CustomSlot,
      planName,
      badge,
      isPopular,
      currency,
      price,
      period,
      description,
      features = [],
      buttonText,
      buttonUrl,
      backgroundColor,
      borderRadius,
      hoverEffect,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => (
      <AnimationWrapper
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        className={getHoverClass(hoverEffect)}
        style={{
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: backgroundColor || "#ffffff",
          borderRadius: `${borderRadius}px`,
          padding: "36px 32px",
          border: isPopular ? "2px solid #4f46e5" : "1px solid #e2e8f0",
          boxShadow: isPopular
            ? "0 20px 25px -5px rgba(79, 70, 229, 0.15)"
            : "0 4px 6px -1px rgba(0,0,0,0.05)",
          marginTop,
          marginBottom,
        }}
      >
        {isPopular && badge && (
          <div
            style={{
              position: "absolute",
              top: -14,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundImage: "linear-gradient(135deg, #4f46e5, #06b6d4)",
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              padding: "4px 16px",
              borderRadius: 999,
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)",
            }}
          >
            {badge}
          </div>
        )}
        <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
          {planName}
        </h3>
        {description && (
          <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
            {description}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>{currency}</span>
          <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1, color: "#0f172a" }}>
            {price}
          </span>
          <span style={{ fontSize: 15, color: "#64748b", fontWeight: 500 }}>{period}</span>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "grid", gap: 12 }}>
          {features.map((feat, idx) => (
            <li
              key={`feat-${idx}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 14,
                color: feat.included ? "#334155" : "#94a3b8",
                textDecoration: feat.included ? "none" : "line-through",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: feat.included ? "#ecfdf5" : "#f1f5f9",
                  color: feat.included ? "#059669" : "#94a3b8",
                  flexShrink: 0,
                }}
              >
                <RenderIcon
                  name={feat.included ? "check" : "none"}
                  size={13}
                  color={feat.included ? "#059669" : "#94a3b8"}
                />
              </span>
              <span>{feat.text}</span>
            </li>
          ))}
        </ul>
        {buttonText && (
          <a
            href={buttonUrl || "#"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "14px 20px",
              borderRadius: 12,
              backgroundColor: isPopular ? "#4f46e5" : "#0f172a",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: isPopular ? "0 8px 16px rgba(79, 70, 229, 0.3)" : "none",
              transition: "all 150ms ease",
            }}
          >
            {buttonText}
          </a>
        )}
        {CustomSlot && (
          <div style={{ marginTop: 16 }}>
            <CustomSlot />
          </div>
        )}
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // COMPARISON TABLE
  // ------------------------------------------------------------------------
  ComparisonTable: {
    label: "Feature Comparison Table",
    fields: {
      headline: textField("Comparison headline"),
      plan1Name: textField("Tier 1 title"),
      plan2Name: textField("Tier 2 title (e.g. Pro)"),
      plan3Name: textField("Tier 3 title (e.g. Enterprise)"),
      features: {
        type: "array",
        label: "Feature rows",
        arrayFields: {
          name: textField("Feature name"),
          p1: textField("Tier 1 value (e.g. Yes, No, 5GB)"),
          p2: textField("Tier 2 value (e.g. Yes, 50GB)"),
          p3: textField("Tier 3 value (e.g. Unlimited)"),
        },
        defaultItemProps: { name: "Custom Domain", p1: "No", p2: "Yes", p3: "Unlimited" },
        getItemSummary: (it) => it.name || "Feature",
      },
      responsive: responsiveField("Responsive overrides", [
        { name: "marginTop", label: "Top margin", type: "select", options: SPACING_OPTIONS },
        { name: "marginBottom", label: "Bottom margin", type: "select", options: SPACING_OPTIONS },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      headline: "Detailed Feature Matrix",
      plan1Name: "Starter",
      plan2Name: "Professional",
      plan3Name: "Enterprise",
      features: [
        { name: "Visual Block Canvas", p1: "Yes", p2: "Yes", p3: "Yes" },
        { name: "Custom Domains", p1: "1 Domain", p2: "5 Domains", p3: "Unlimited" },
        { name: "Animation Presets", p1: "Basic", p2: "Advanced", p3: "Full Engine" },
        { name: "Team Members", p1: "1", p2: "5", p3: "Unlimited" },
        { name: "Dedicated SLA", p1: "No", p2: "No", p3: "99.99%" },
      ],
      marginTop: "24px",
      marginBottom: "32px",
      ...animationDefaults,
    },
    render: ({
      headline,
      plan1Name,
      plan2Name,
      plan3Name,
      features = [],
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => (
      <AnimationWrapper
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        style={{
          width: "100%",
          overflowX: "auto",
          marginTop,
          marginBottom,
        }}
      >
        {headline && (
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
            {headline}
          </h3>
        )}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#ffffff",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "16px 20px", textAlign: "left", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                Feature
              </th>
              <th style={{ padding: "16px 20px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                {plan1Name}
              </th>
              <th style={{ padding: "16px 20px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#4f46e5" }}>
                {plan2Name}
              </th>
              <th style={{ padding: "16px 20px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                {plan3Name}
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((row, idx) => (
              <tr key={`comp-${idx}`} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#334155" }}>
                  {row.name}
                </td>
                <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 14, color: "#64748b" }}>
                  {row.p1}
                </td>
                <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#4f46e5" }}>
                  {row.p2}
                </td>
                <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 14, color: "#64748b" }}>
                  {row.p3}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // TESTIMONIAL CARD
  // ------------------------------------------------------------------------
  Testimonial: {
    label: "Testimonial / Review",
    fields: {
      stars: numberField("Rating (1 - 5 stars)", 1, 5),
      quote: textareaField("Review or testimony text"),
      authorName: textField("Customer name"),
      authorRole: textField("Title & Company"),
      avatarUrl: textField("Avatar photo URL"),
      verified: radioField("Show verified customer check", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      backgroundColor: colorField("Card background"),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      hoverEffect: selectField("Hover micro-animation", HOVER_EFFECT_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      stars: 5,
      quote:
        "This website builder surpassed our every expectation. The level of customization allowed us to deploy our company flagship in 3 days instead of 3 months.",
      authorName: "Sophia Martinez",
      authorRole: "Head of Product at Nexus Dynamics",
      avatarUrl: "https://i.pravatar.cc/150?u=sophia",
      verified: true,
      backgroundColor: "#ffffff",
      borderRadius: 18,
      hoverEffect: "lift-sm",
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      stars = 5,
      quote,
      authorName,
      authorRole,
      avatarUrl,
      verified,
      backgroundColor,
      borderRadius,
      hoverEffect,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const starCount = Math.min(5, Math.max(1, parseInt(stars, 10) || 5));

      return (
        <AnimationWrapper
          as="article"
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          className={getHoverClass(hoverEffect)}
          style={{
            boxSizing: "border-box",
            backgroundColor: backgroundColor || "#ffffff",
            padding: "32px",
            borderRadius: `${borderRadius}px`,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            marginTop,
            marginBottom,
          }}
        >
          <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
            {Array.from({ length: starCount }).map((_, i) => (
              <RenderIcon key={`star-${i}`} name="star" size={18} color="#f59e0b" />
            ))}
          </div>
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 16,
              color: "#334155",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={authorName}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <strong style={{ fontSize: 15, color: "#0f172a" }}>{authorName}</strong>
                {verified && (
                  <span
                    title="Verified Client"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      color: "#ffffff",
                    }}
                  >
                    <RenderIcon name="check" size={11} color="#ffffff" />
                  </span>
                )}
              </div>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>{authorRole}</p>
            </div>
          </div>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // FEATURE CARD
  // ------------------------------------------------------------------------
  FeatureCard: {
    label: "Feature / Service Box",
    fields: {
      icon: selectField("Icon Symbol", ICON_PRESETS),
      iconColor: colorField("Icon color"),
      iconBg: colorField("Icon container background"),
      badge: textField("Small badge text (Optional)"),
      title: textField("Feature title"),
      description: textareaField("Feature description"),
      linkText: textField("Action link text (Optional)"),
      linkUrl: textField("Action link URL"),
      backgroundColor: colorField("Card background"),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      hoverEffect: selectField("Hover micro-animation", HOVER_EFFECT_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      icon: "rocket",
      iconColor: "#4f46e5",
      iconBg: "#eef2ff",
      badge: "NEW",
      title: "Sub-Second Deployment",
      description:
        "Built on high-performance edge infrastructure, delivering instantaneous load times and zero downtime transitions.",
      linkText: "Learn more",
      linkUrl: "#",
      backgroundColor: "#ffffff",
      borderRadius: 16,
      hoverEffect: "lift-md",
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      icon,
      iconColor,
      iconBg,
      badge,
      title,
      description,
      linkText,
      linkUrl,
      backgroundColor,
      borderRadius,
      hoverEffect,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => (
      <AnimationWrapper
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        className={getHoverClass(hoverEffect)}
        style={{
          boxSizing: "border-box",
          backgroundColor: backgroundColor || "#ffffff",
          borderRadius: `${borderRadius}px`,
          padding: "32px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          marginTop,
          marginBottom,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: iconBg || "#eef2ff",
            }}
          >
            <RenderIcon name={icon} size={24} color={iconColor || "#4f46e5"} />
          </div>
          {badge && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: 999,
                backgroundColor: "#f1f5f9",
                color: "#475569",
                letterSpacing: 1,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <h3 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
          {title}
        </h3>
        <p style={{ margin: "0 0 18px", fontSize: 15, color: "#64748b", lineHeight: 1.65 }}>
          {description}
        </p>
        {linkText && (
          <a
            href={linkUrl || "#"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: iconColor || "#4f46e5",
              textDecoration: "none",
            }}
          >
            <span>{linkText}</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        )}
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // STATS COUNTER / METRIC
  // ------------------------------------------------------------------------
  StatsCounter: {
    label: "Metric / Stats Counter",
    fields: {
      number: textField("Big stat value (e.g. 99.9, 10M, 400k)"),
      prefix: textField("Prefix symbol (e.g. $, +)"),
      suffix: textField("Suffix symbol (e.g. %, +, K)"),
      label: textField("Metric label"),
      description: textField("Subtext / description (Optional)"),
      trend: textField("Growth trend badge (e.g. +24% YoY)"),
      color: colorField("Number highlight color"),
      alignment: selectField("Alignment", ALIGNMENT_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      number: "99.98",
      prefix: "",
      suffix: "%",
      label: "Uptime SLA Guarantee",
      description: "Enterprise reliability tested under peak concurrent load.",
      trend: "+0.4% this quarter",
      color: "#4f46e5",
      alignment: "left",
      marginTop: "16px",
      marginBottom: "20px",
      ...animationDefaults,
    },
    render: ({
      number,
      prefix,
      suffix,
      label,
      description,
      trend,
      color,
      alignment,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => (
      <AnimationWrapper
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        style={{
          width: "100%",
          textAlign: alignment,
          marginTop,
          marginBottom,
        }}
      >
        {trend && (
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 999,
              backgroundColor: "#ecfdf5",
              color: "#059669",
              marginBottom: 10,
            }}
          >
            {trend}
          </span>
        )}
        <div
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -1.5,
            color: color || "#4f46e5",
            marginBottom: 8,
          }}
        >
          {prefix}
          {number}
          {suffix}
        </div>
        <h4 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
          {label}
        </h4>
        {description && (
          <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
            {description}
          </p>
        )}
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // ACCORDION / FAQ
  // ------------------------------------------------------------------------
  Accordion: {
    label: "Accordion / FAQ List",
    fields: {
      items: {
        type: "array",
        label: "Accordion items",
        arrayFields: {
          title: textField("Question / Heading"),
          content: textareaField("Answer / Details content"),
        },
        defaultItemProps: {
          title: "How does the template editor work?",
          content:
            "The visual editor gives you real-time drag-and-drop customization with WordPress-grade blocks and instantaneous preview.",
        },
        getItemSummary: (item) => item.title || "Accordion item",
      },
      accentColor: colorField("Active icon color"),
      bordered: radioField("Card bordered items", [
        { label: "Bordered cards", value: true },
        { label: "Clean underline dividers", value: false },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      items: [
        {
          title: "Can I customize typography, colors, and layout from scratch?",
          content:
            "Yes! Every component supports full custom styling: font sizes, weights, line heights, linear gradients, custom shadows, and nested containers.",
        },
        {
          title: "Does this support nested columns and layouts?",
          content:
            "Absolutely. Drop Columns, Containers, or Grids, and nest any elements inside them without limitation.",
        },
        {
          title: "Are published pages mobile-responsive?",
          content:
            "All blocks are architected with modern flexbox and grid styling to adapt effortlessly to mobile, tablet, and desktop viewports.",
        },
      ],
      accentColor: "#4f46e5",
      bordered: true,
      marginTop: "20px",
      marginBottom: "28px",
      ...animationDefaults,
    },
    render: function RenderAccordion({
      items = [],
      accentColor,
      bordered,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) {
      const [openIndexes, setOpenIndexes] = useState([0]);

      const toggle = (idx) => {
        setOpenIndexes((prev) =>
          prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
        );
      };

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            width: "100%",
            marginTop,
            marginBottom,
            display: "grid",
            gap: bordered ? 12 : 0,
          }}
        >
          {items.map((item, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={`faq-${idx}`}
                style={{
                  backgroundColor: bordered
                    ? isOpen
                      ? "#faf5ff"
                      : "#ffffff"
                    : "transparent",
                  border: bordered
                    ? `1px solid ${isOpen ? accentColor || "#4f46e5" : "#e2e8f0"}`
                    : "none",
                  borderBottom: !bordered ? "1px solid #e2e8f0" : undefined,
                  borderRadius: bordered ? 12 : 0,
                  overflow: "hidden",
                  transition: "all 200ms ease",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: bordered ? "18px 22px" : "18px 4px",
                    backgroundColor: "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 700,
                    color: isOpen ? accentColor || "#4f46e5" : "#0f172a",
                  }}
                >
                  <span>{item.title}</span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: isOpen ? accentColor || "#4f46e5" : "#f1f5f9",
                      color: isOpen ? "#ffffff" : "#64748b",
                      fontSize: 16,
                      fontWeight: 700,
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 200ms ease",
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: bordered ? "0 22px 20px" : "0 4px 18px",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "#475569",
                    }}
                  >
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // TABS COMPONENT
  // ------------------------------------------------------------------------
  Tabs: {
    label: "Interactive Tabs",
    fields: {
      tabStyle: selectField("Tabs header style", [
        { label: "Pills with background", value: "pills" },
        { label: "Underlined border tabs", value: "underline" },
      ]),
      accentColor: colorField("Active tab accent color"),
      tabs: {
        type: "array",
        label: "Tabs list",
        arrayFields: {
          title: textField("Tab label"),
          headline: textField("Panel title"),
          content: textareaField("Panel content"),
        },
        defaultItemProps: {
          title: "Tab 1",
          headline: "Powerful Engine",
          content: "Customize all layout aspects with visual feedback.",
        },
        getItemSummary: (item) => item.title || "Tab",
      },
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      tabStyle: "pills",
      accentColor: "#4f46e5",
      tabs: [
        {
          title: "Performance",
          headline: "Engineered for Sub-Second Speed",
          content:
            "Our rendering pipeline outputs optimized static HTML and lightweight CSS, ensuring your templates score 99+ on Google Lighthouse.",
        },
        {
          title: "Customization",
          headline: "Boundless Creative Freedom",
          content:
            "Granular controls for typography, linear gradients, corner curves, box shadows, and nested slots enable bespoke design implementations.",
        },
        {
          title: "Integrations",
          headline: "Connect With Your Modern Stack",
          content:
            "Seamlessly export clean JSON documents and connect directly with REST APIs, webhooks, and modern relational stores.",
        },
      ],
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: function RenderTabs({
      tabStyle,
      accentColor,
      tabs = [],
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) {
      const [activeTab, setActiveTab] = useState(0);
      const current = tabs[activeTab] || tabs[0] || {};

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{ width: "100%", marginTop, marginBottom }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: tabStyle === "pills" ? 8 : 24,
              borderBottom: tabStyle === "underline" ? "1px solid #e2e8f0" : "none",
              marginBottom: 24,
            }}
          >
            {tabs.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={`tab-${idx}`}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  style={{
                    padding: tabStyle === "pills" ? "9px 18px" : "12px 4px",
                    borderRadius: tabStyle === "pills" ? 10 : 0,
                    border: "none",
                    borderBottom:
                      tabStyle === "underline" && isActive
                        ? `2px solid ${accentColor || "#4f46e5"}`
                        : "none",
                    backgroundColor:
                      tabStyle === "pills"
                        ? isActive
                          ? accentColor || "#4f46e5"
                          : "#f1f5f9"
                        : "transparent",
                    color:
                      tabStyle === "pills"
                        ? isActive
                          ? "#ffffff"
                          : "#475569"
                        : isActive
                        ? accentColor || "#4f46e5"
                        : "#64748b",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
          <div
            style={{
              padding: "32px",
              backgroundColor: "#f8fafc",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
              {current.headline || current.title}
            </h3>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#475569" }}>
              {current.content}
            </p>
          </div>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // LOGO CLOUD (PARTNERS)
  // ------------------------------------------------------------------------
  LogoCloud: {
    label: "Logo Cloud / Partners",
    fields: {
      headline: textField("Section Eyebrow text"),
      grayscale: radioField("Monochrome / Grayscale logos", [
        { label: "Yes (Clean grayscale)", value: true },
        { label: "No (Original colors)", value: false },
      ]),
      opacity: numberField("Logo opacity (%)", 10, 100),
      logos: {
        type: "array",
        label: "Logos list",
        arrayFields: {
          name: textField("Company name"),
          imageUrl: imageField("Logo image URL (SVG/PNG)"),
        },
        defaultItemProps: {
          name: "Partner",
          imageUrl:
            "https://tailwindui.com/plus/img/logos/158x48/transistor-logo-gray-900.svg",
        },
        getItemSummary: (item) => item.name || "Logo",
      },
      responsive: responsiveField("Responsive overrides", [
        { name: "marginTop", label: "Top margin", type: "select", options: SPACING_OPTIONS },
        { name: "marginBottom", label: "Bottom margin", type: "select", options: SPACING_OPTIONS },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      headline: "TRUSTED BY INNOVATIVE TEAMS AT",
      grayscale: true,
      opacity: 75,
      logos: [
        {
          name: "Transistor",
          imageUrl:
            "https://tailwindui.com/plus/img/logos/158x48/transistor-logo-gray-900.svg",
        },
        {
          name: "Reform",
          imageUrl:
            "https://tailwindui.com/plus/img/logos/158x48/reform-logo-gray-900.svg",
        },
        {
          name: "Tuple",
          imageUrl:
            "https://tailwindui.com/plus/img/logos/158x48/tuple-logo-gray-900.svg",
        },
        {
          name: "SavvyCal",
          imageUrl:
            "https://tailwindui.com/plus/img/logos/158x48/savvycal-logo-gray-900.svg",
        },
        {
          name: "Statamic",
          imageUrl:
            "https://tailwindui.com/plus/img/logos/158x48/statamic-logo-gray-900.svg",
        },
      ],
      marginTop: "20px",
      marginBottom: "28px",
      ...animationDefaults,
    },
    render: ({
      headline,
      grayscale,
      opacity = 75,
      logos = [],
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => (
      <AnimationWrapper
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        style={{ width: "100%", textAlign: "center", marginTop, marginBottom }}
      >
        {headline && (
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#64748b",
              marginBottom: 24,
            }}
          >
            {headline}
          </p>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          {logos.map((logo, idx) => (
            <img
              key={`logo-${idx}`}
              src={logo.imageUrl}
              alt={logo.name || "Partner logo"}
              style={{
                height: 38,
                maxWidth: 160,
                objectFit: "contain",
                filter: grayscale ? "grayscale(100%)" : "none",
                opacity: opacity / 100,
                transition: "opacity 200ms ease, filter 200ms ease",
              }}
              className="hover:!opacity-100 hover:!grayscale-0"
            />
          ))}
        </div>
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // TIMELINE / PROCESS STEPS
  // ------------------------------------------------------------------------
  Timeline: {
    label: "Process Steps / Timeline",
    fields: {
      steps: {
        type: "array",
        label: "Process steps list",
        arrayFields: {
          stepNumber: textField("Step number (e.g. 01)"),
          title: textField("Step title"),
          description: textareaField("Step explanation"),
        },
        defaultItemProps: {
          stepNumber: "01",
          title: "Discovery & Strategy",
          description: "Deep dive into objectives and market landscape.",
        },
        getItemSummary: (item) => `${item.stepNumber}: ${item.title}`,
      },
      stepColor: colorField("Step pill background color"),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      steps: [
        {
          stepNumber: "01",
          title: "Strategy & Architecture",
          description: "Mapping core conversion funnels, data schemas, and user journeys.",
        },
        {
          stepNumber: "02",
          title: "High-Fidelity Design",
          description:
            "Crafting bespoke design systems, typographic hierarchies, and micro-interactions.",
        },
        {
          stepNumber: "03",
          title: "Visual Assembly",
          description:
            "Constructing modular pages using the visual builder engine with live preview.",
        },
        {
          stepNumber: "04",
          title: "Global Launch",
          description: "Sub-second CDN propagation, performance validation, and domain activation.",
        },
      ],
      stepColor: "#4f46e5",
      marginTop: "24px",
      marginBottom: "32px",
      ...animationDefaults,
    },
    render: ({
      steps = [],
      stepColor,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => (
      <AnimationWrapper
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`,
          gap: 28,
          width: "100%",
          marginTop,
          marginBottom,
        }}
      >
        {steps.map((st, idx) => (
          <div
            key={`step-${idx}`}
            style={{
              position: "relative",
              padding: "28px 24px",
              backgroundColor: "#f8fafc",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: stepColor || "#4f46e5",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              {st.stepNumber || `0${idx + 1}`}
            </div>
            <h4 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
              {st.title}
            </h4>
            <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
              {st.description}
            </p>
          </div>
        ))}
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // TEAM MEMBER
  // ------------------------------------------------------------------------
  TeamMember: {
    label: "Team Member Card",
    fields: {
      name: textField("Full name"),
      role: textField("Designation / Role"),
      bio: textareaField("Short bio"),
      avatarUrl: textField("Photo URL"),
      socialTwitter: textField("Twitter/X profile URL"),
      socialLinkedIn: textField("LinkedIn profile URL"),
      socialGitHub: textField("GitHub profile URL"),
      backgroundColor: colorField("Card background"),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      hoverEffect: selectField("Hover micro-animation", HOVER_EFFECT_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      name: "Alex Rivera",
      role: "Principal Product Architect",
      bio: "Former design director at Vercel. Obsessed with sub-second interfaces and typographic rigor.",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      socialTwitter: "https://twitter.com",
      socialLinkedIn: "https://linkedin.com",
      socialGitHub: "https://github.com",
      backgroundColor: "#ffffff",
      borderRadius: 18,
      hoverEffect: "lift-md",
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      name,
      role,
      bio,
      avatarUrl,
      socialTwitter,
      socialLinkedIn,
      socialGitHub,
      backgroundColor,
      borderRadius,
      hoverEffect,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => (
      <AnimationWrapper
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        className={getHoverClass(hoverEffect)}
        style={{
          boxSizing: "border-box",
          backgroundColor: backgroundColor || "#ffffff",
          borderRadius: `${borderRadius}px`,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          marginTop,
          marginBottom,
        }}
      >
        {avatarUrl && (
          <div style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden" }}>
            <img
              src={avatarUrl}
              alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}
        <div style={{ padding: 24 }}>
          <h4 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 700, color: "#0f172a" }}>
            {name}
          </h4>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#4f46e5" }}>
            {role}
          </p>
          {bio && (
            <p style={{ margin: "0 0 16px", fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
              {bio}
            </p>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            {socialTwitter && (
              <a
                href={socialTwitter}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}
              >
                Twitter
              </a>
            )}
            {socialLinkedIn && (
              <a
                href={socialLinkedIn}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}
              >
                LinkedIn
              </a>
            )}
            {socialGitHub && (
              <a
                href={socialGitHub}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // COUNTDOWN TIMER
  // ------------------------------------------------------------------------
  Countdown: {
    label: "Countdown Timer (Urgency)",
    fields: {
      headline: textField("Urgency title"),
      targetDays: numberField("Days remaining", 0, 365),
      targetHours: numberField("Hours remaining", 0, 23),
      targetMinutes: numberField("Minutes remaining", 0, 59),
      targetSeconds: numberField("Seconds remaining", 0, 59),
      boxBg: colorField("Timer boxes background"),
      boxColor: colorField("Timer digits color"),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      headline: "EXCLUSIVE EARLY ACCESS CLOSES IN:",
      targetDays: 4,
      targetHours: 18,
      targetMinutes: 32,
      targetSeconds: 45,
      boxBg: "#0f172a",
      boxColor: "#ffffff",
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      headline,
      targetDays = 4,
      targetHours = 18,
      targetMinutes = 32,
      targetSeconds = 45,
      boxBg,
      boxColor,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const units = [
        { val: targetDays, label: "Days" },
        { val: targetHours, label: "Hours" },
        { val: targetMinutes, label: "Mins" },
        { val: targetSeconds, label: "Secs" },
      ];

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{ width: "100%", textAlign: "center", marginTop, marginBottom }}
        >
          {headline && (
            <p
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "#64748b",
                marginBottom: 16,
              }}
            >
              {headline}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {units.map((u, idx) => (
              <div
                key={`unit-${idx}`}
                style={{
                  minWidth: 72,
                  padding: "16px 14px",
                  borderRadius: 14,
                  backgroundColor: boxBg || "#0f172a",
                  color: boxColor || "#ffffff",
                  boxShadow: "0 8px 20px -4px rgba(0,0,0,0.15)",
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{u.val}</div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    opacity: 0.7,
                    marginTop: 6,
                  }}
                >
                  {u.label}
                </div>
              </div>
            ))}
          </div>
        </AnimationWrapper>
      );
    },
  },
};

// Aliases for backward compatibility with templates that might reference Features
marketingComponents.Features = marketingComponents.FeatureCard;
