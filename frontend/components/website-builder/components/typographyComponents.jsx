"use client";

import React from "react";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { boxStyleFields, spacingFields, commonDesignDefaults } from "../fields/boxStyleFields.js";
import {
  selectField,
  numberField,
  textField,
  textareaField,
  radioField,
  colorField,
  responsiveField,
} from "../fields/helpers.js";
import { typographyFields, typographyDefaults } from "../fields/typographyFields.js";
import { buildElementStyle, getHoverClass } from "../layout/styleBuilders.js";
import { buildResponsiveStyles } from "../layout/responsiveStyles.js";
import { RADIUS_OPTIONS, ALIGNMENT_OPTIONS, SPACING_OPTIONS } from "../tokens/index.js";
import { RenderIcon, ICON_PRESETS } from "./icons.jsx";

export const typographyComponents = {
  // ------------------------------------------------------------------------
  // HEADING
  // ------------------------------------------------------------------------
  Heading: {
    label: "Heading (H1 - H6)",
    fields: {
      text: textField("Heading text"),
      level: selectField("HTML Tag level", [
        { label: "H1 — Main Title", value: "h1" },
        { label: "H2 — Section Title", value: "h2" },
        { label: "H3 — Subsection Title", value: "h3" },
        { label: "H4 — Card Title", value: "h4" },
        { label: "H5 — Small Title", value: "h5" },
        { label: "H6 — Micro Title", value: "h6" },
      ]),
      ...typographyFields,
      responsive: responsiveField("Responsive overrides", [
        { name: "fontSize", label: "Font size (px)", type: "number", min: 8, max: 160 },
        { name: "lineHeight", label: "Line height", type: "number", min: 0.5, max: 3, step: 0.1 },
        { name: "letterSpacing", label: "Letter spacing (px)", type: "number", min: -10, max: 30, step: 0.5 },
        { name: "textAlign", label: "Text align", type: "select", options: ALIGNMENT_OPTIONS },
        { name: "marginBottom", label: "Bottom margin", type: "select", options: SPACING_OPTIONS },
      ]),
      ...spacingFields,
      ...boxStyleFields,
      ...animationFields,
    },
    defaultProps: {
      text: "Design Without Limits",
      level: "h2",
      ...typographyDefaults,
      fontSize: 42,
      fontWeight: "800",
      lineHeight: 1.15,
      letterSpacing: -1,
      color: "#0f172a",
      ...commonDesignDefaults,
      marginBottom: "16px",
      ...animationDefaults,
    },
    render: ({
      text,
      level,
      hoverEffect,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      responsive,
      ...props
    }) => {
      const Tag = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(level) ? level : "h2";
      const { className: respClass, css: respCss } = buildResponsiveStyles({ responsive });

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <Tag className={`${getHoverClass(hoverEffect)} ${respClass}`.trim()} style={buildElementStyle(props)}>
            {text}
          </Tag>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // TEXT / PARAGRAPH
  // ------------------------------------------------------------------------
  Text: {
    label: "Paragraph",
    fields: {
      text: textareaField("Paragraph text content"),
      dropCap: radioField("Drop cap (First big letter)", [
        { label: "Disabled", value: false },
        { label: "Enabled", value: true },
      ]),
      ...typographyFields,
      responsive: responsiveField("Responsive overrides", [
        { name: "fontSize", label: "Font size (px)", type: "number", min: 8, max: 80 },
        { name: "lineHeight", label: "Line height", type: "number", min: 0.5, max: 3, step: 0.1 },
        { name: "textAlign", label: "Text align", type: "select", options: ALIGNMENT_OPTIONS },
        { name: "marginBottom", label: "Bottom margin", type: "select", options: SPACING_OPTIONS },
      ]),
      ...spacingFields,
      ...boxStyleFields,
      ...animationFields,
    },
    defaultProps: {
      text: "Empower your creative vision with unprecedented control. Every element, spacing, typography, and animation can be tuned with precision to match your highest standards.",
      dropCap: false,
      ...typographyDefaults,
      fontSize: 18,
      color: "#475569",
      lineHeight: 1.75,
      ...commonDesignDefaults,
      marginBottom: "20px",
      ...animationDefaults,
    },
    render: ({
      text,
      dropCap,
      hoverEffect,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      responsive,
      ...props
    }) => {
      const style = buildElementStyle(props);
      const { className: respClass, css: respCss } = buildResponsiveStyles({ responsive });

      if (dropCap && text && text.length > 1) {
        const firstLetter = text[0];
        const remainingText = text.slice(1);
        return (
          <AnimationWrapper
            trigger={animTrigger}
            preset={animPreset}
            loop={animLoop}
            duration={animDuration}
            delay={animDelay}
            easing={animEasing}
          >
            {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
            <p className={`${getHoverClass(hoverEffect)} ${respClass}`.trim()} style={style}>
              <span
                style={{
                  float: "left",
                  fontSize: "3.2em",
                  lineHeight: "0.8",
                  paddingRight: "8px",
                  paddingTop: "4px",
                  fontWeight: 800,
                  color: props.color || "#0f172a",
                }}
              >
                {firstLetter}
              </span>
              {remainingText}
            </p>
          </AnimationWrapper>
        );
      }

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <p className={`${getHoverClass(hoverEffect)} ${respClass}`.trim()} style={style}>
            {text}
          </p>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // RICH TEXT
  // ------------------------------------------------------------------------
  RichText: {
    label: "Rich Text",
    fields: {
      text: textareaField("Rich content (accepts HTML or paragraphs)"),
      ...typographyFields,
      responsive: responsiveField("Responsive overrides", [
        { name: "fontSize", label: "Font size (px)", type: "number", min: 8, max: 80 },
        { name: "textAlign", label: "Text align", type: "select", options: ALIGNMENT_OPTIONS },
        { name: "marginBottom", label: "Bottom margin", type: "select", options: SPACING_OPTIONS },
      ]),
      ...spacingFields,
      ...boxStyleFields,
      ...animationFields,
    },
    defaultProps: {
      text: "Elevate your digital presence. Craft bespoke visual identities with modular design components engineered for speed, beauty, and conversion.",
      ...typographyDefaults,
      fontSize: 16,
      color: "#334155",
      lineHeight: 1.8,
      ...commonDesignDefaults,
      marginBottom: "16px",
      ...animationDefaults,
    },
    render: ({
      text,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      responsive,
      ...props
    }) => {
      const { className: respClass, css: respCss } = buildResponsiveStyles({ responsive });

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <div className={respClass} style={buildElementStyle(props)}>
            {text}
          </div>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // LABEL / EYEBROW
  // ------------------------------------------------------------------------
  Label: {
    label: "Badge / Eyebrow Text",
    fields: {
      text: textField("Badge text"),
      icon: selectField("Icon (Optional)", ["none", ...ICON_PRESETS]),
      pillStyle: selectField("Style preset", [
        { label: "Modern Violet", value: "violet" },
        { label: "Emerald Success", value: "emerald" },
        { label: "Blue Tech", value: "blue" },
        { label: "Amber Warning", value: "amber" },
        { label: "Dark Minimal", value: "dark" },
        { label: "Ghost / Outline", value: "outline" },
        { label: "Custom Colors", value: "custom" },
      ]),
      customBg: colorField("Custom background"),
      customColor: colorField("Custom text color"),
      customBorder: colorField("Custom border color"),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      fontSize: numberField("Font size (px)", 8, 30),
      responsive: responsiveField("Responsive overrides", [
        { name: "fontSize", label: "Font size (px)", type: "number", min: 8, max: 30 },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      text: "NEXT GENERATION STUDIO",
      icon: "sparkles",
      pillStyle: "violet",
      customBg: "#f5f3ff",
      customColor: "#6d28d9",
      customBorder: "#ddd6fe",
      borderRadius: 9999,
      fontSize: 12,
      marginTop: "0px",
      marginBottom: "12px",
      ...animationDefaults,
    },
    render: ({
      text,
      icon,
      pillStyle,
      customBg,
      customColor,
      customBorder,
      borderRadius,
      fontSize,
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
      const presets = {
        violet: { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
        emerald: { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0" },
        blue: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
        amber: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
        dark: { bg: "#0f172a", color: "#ffffff", border: "#1e293b" },
        outline: { bg: "transparent", color: "#475569", border: "#cbd5e1" },
        custom: { bg: customBg, color: customColor, border: customBorder },
      };

      const current = presets[pillStyle] || presets.violet;
      const { className: respClass, css: respCss } = buildResponsiveStyles({ responsive });

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{ display: "inline-flex", marginTop, marginBottom }}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <span
            className={respClass}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              fontSize: `var(--puck-font-size, ${fontSize}px)`,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              backgroundColor: current.bg,
              color: current.color,
              border: `1px solid ${current.border}`,
              borderRadius: `${borderRadius}px`,
            }}
          >
            {icon && icon !== "none" && (
              <RenderIcon name={icon} size={fontSize + 2} color={current.color} />
            )}
            {text}
          </span>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // BLOCKQUOTE
  // ------------------------------------------------------------------------
  Blockquote: {
    label: "Blockquote / Pull Quote",
    fields: {
      quote: textareaField("Quote text"),
      author: textField("Author name"),
      role: textField("Author role / company"),
      avatarUrl: textField("Author avatar image URL"),
      accentColor: colorField("Accent border color"),
      quoteSize: numberField("Quote font size (px)", 14, 48),
      responsive: responsiveField("Responsive overrides", [
        { name: "fontSize", label: "Quote size (px)", type: "number", min: 12, max: 60 },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      quote:
        "Good design is obvious. Great design is transparent. We don't just build websites; we build the future of brand experiences.",
      author: "Marcus Vance",
      role: "Chief Design Officer, Apex Global",
      avatarUrl: "https://i.pravatar.cc/150?u=quote",
      accentColor: "#6366f1",
      quoteSize: 22,
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      quote,
      author,
      role,
      avatarUrl,
      accentColor,
      quoteSize,
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
      const { className: respClass, css: respCss } = buildResponsiveStyles({ responsive });

      return (
        <AnimationWrapper
          as="figure"
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            margin: 0,
            marginTop,
            marginBottom,
            padding: "24px 32px",
            borderLeft: `4px solid ${accentColor || "#6366f1"}`,
            backgroundColor: "#f8fafc",
            borderRadius: "0 16px 16px 0",
          }}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <blockquote
            className={respClass}
            style={{
              margin: 0,
              fontSize: `var(--puck-font-size, ${quoteSize}px)`,
              lineHeight: 1.6,
              fontWeight: 600,
              fontStyle: "italic",
              color: "#0f172a",
            }}
          >
            &ldquo;{quote}&rdquo;
          </blockquote>
          {(author || role) && (
            <figcaption
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 16,
              }}
            >
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt={author}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#1e293b",
                  }}
                >
                  {author}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                  {role}
                </p>
              </div>
            </figcaption>
          )}
        </AnimationWrapper>
      );
    },
  },
};
