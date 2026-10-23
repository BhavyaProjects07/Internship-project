"use client";

import React from "react";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { spacingFields, commonDesignDefaults } from "../fields/boxStyleFields.js";
import { selectField, numberField, textField, radioField, colorField } from "../fields/helpers.js";
import { typographyFields, typographyDefaults } from "../fields/typographyFields.js";
import { buildElementStyle, getHoverClass } from "../layout/styleBuilders.js";
import {
  ALIGNMENT_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  HOVER_EFFECT_OPTIONS,
  RADIUS_OPTIONS,
} from "../tokens/index.js";
import { RenderIcon, ICON_PRESETS } from "./icons.jsx";

export const actionComponents = {
  // ------------------------------------------------------------------------
  // BUTTON
  // ------------------------------------------------------------------------
  Button: {
    label: "Interactive Button",
    fields: {
      label: textField("Button text"),
      href: textField("Destination link URL"),
      target: selectField("Open target", [
        { label: "Same tab (_self)", value: "_self" },
        { label: "New tab (_blank)", value: "_blank" },
      ]),
      variant: selectField("Button style variant", [
        { label: "Solid Primary", value: "solid" },
        { label: "Gradient Glow", value: "gradient" },
        { label: "Clean Outline", value: "outline" },
        { label: "Soft Tint", value: "soft" },
        { label: "Glassmorphism Blur", value: "glass" },
      ]),
      backgroundColor: colorField("Background color (for Solid)"),
      color: colorField("Text color"),
      gradientFrom: colorField("Gradient color 1 (From)"),
      gradientTo: colorField("Gradient color 2 (To)"),
      icon: selectField("Leading / Trailing Icon", ["none", ...ICON_PRESETS]),
      iconPosition: selectField("Icon position", [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ]),
      fontSize: numberField("Font size (px)", 10, 36),
      fontWeight: selectField("Font weight", FONT_WEIGHT_OPTIONS),
      paddingX: numberField("Horizontal padding (px)", 4, 80),
      paddingY: numberField("Vertical padding (px)", 4, 60),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      hoverEffect: selectField("Hover micro-animation", HOVER_EFFECT_OPTIONS),
      fullWidth: radioField("Full width width", [
        { label: "Auto width", value: false },
        { label: "Full width (100%)", value: true },
      ]),
      alignment: selectField("Alignment in container", ALIGNMENT_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      label: "Get Started Now",
      href: "#",
      target: "_self",
      variant: "solid",
      backgroundColor: "#0f172a",
      color: "#ffffff",
      gradientFrom: "#4f46e5",
      gradientTo: "#06b6d4",
      icon: "arrow-right",
      iconPosition: "right",
      fontSize: 15,
      fontWeight: "600",
      paddingX: 24,
      paddingY: 13,
      borderRadius: 10,
      hoverEffect: "lift-sm",
      fullWidth: false,
      alignment: "left",
      marginTop: "8px",
      marginBottom: "16px",
      ...animationDefaults,
    },
    render: ({
      label,
      href,
      target,
      variant,
      backgroundColor,
      color,
      gradientFrom,
      gradientTo,
      icon,
      iconPosition,
      fontSize,
      fontWeight,
      paddingX,
      paddingY,
      borderRadius,
      hoverEffect,
      fullWidth,
      alignment,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      let btnBgColor = backgroundColor || "#0f172a";
      let btnBgImage = undefined;
      let textClr = color || "#ffffff";
      let border = "none";
      let shadow = "0 1px 3px rgba(0,0,0,0.1)";

      if (variant === "gradient") {
        btnBgColor = undefined;
        btnBgImage = `linear-gradient(135deg, ${gradientFrom || "#4f46e5"}, ${gradientTo || "#06b6d4"})`;
        shadow = "0 8px 20px -4px rgba(79, 70, 229, 0.4)";
      } else if (variant === "outline") {
        btnBgColor = "transparent";
        textClr = backgroundColor || "#0f172a";
        border = `2px solid ${backgroundColor || "#0f172a"}`;
        shadow = "none";
      } else if (variant === "soft") {
        btnBgColor = "#f1f5f9";
        textClr = "#0f172a";
        shadow = "none";
      } else if (variant === "glass") {
        btnBgColor = "rgba(255, 255, 255, 0.2)";
        border = "1px solid rgba(255, 255, 255, 0.4)";
        shadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
      }

      const iconEl =
        icon && icon !== "none" ? (
          <RenderIcon name={icon} size={fontSize + 2} color={textClr} />
        ) : null;

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
            display: "flex",
            justifyContent:
              alignment === "center"
                ? "center"
                : alignment === "right"
                ? "flex-end"
                : "flex-start",
            marginTop,
            marginBottom,
          }}
        >
          <a
            href={href || "#"}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className={getHoverClass(hoverEffect)}
            style={{
              display: "inline-flex",
              width: fullWidth ? "100%" : "auto",
              boxSizing: "border-box",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: btnBgColor,
              backgroundImage: btnBgImage,
              color: textClr,
              fontSize: `${fontSize}px`,
              fontWeight,
              padding: `${paddingY}px ${paddingX}px`,
              borderRadius: `${borderRadius}px`,
              border,
              boxShadow: shadow,
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            {iconPosition === "left" && iconEl}
            <span>{label}</span>
            {iconPosition === "right" && iconEl}
          </a>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // BUTTON GROUP
  // ------------------------------------------------------------------------
  ButtonGroup: {
    label: "Button Pair / Actions Group",
    fields: {
      primaryText: textField("Primary button text"),
      primaryUrl: textField("Primary link URL"),
      primaryBg: colorField("Primary background color"),
      primaryColor: colorField("Primary text color"),
      secondaryText: textField("Secondary button text"),
      secondaryUrl: textField("Secondary link URL"),
      secondaryBg: colorField("Secondary background color"),
      secondaryColor: colorField("Secondary text color"),
      alignment: selectField("Alignment", ALIGNMENT_OPTIONS),
      gap: numberField("Spacing between buttons (px)", 0, 60),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      primaryText: "Start Building Free",
      primaryUrl: "#signup",
      primaryBg: "#0f172a",
      primaryColor: "#ffffff",
      secondaryText: "Book a Demo",
      secondaryUrl: "#demo",
      secondaryBg: "transparent",
      secondaryColor: "#0f172a",
      alignment: "left",
      gap: 16,
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      primaryText,
      primaryUrl,
      primaryBg,
      primaryColor,
      secondaryText,
      secondaryUrl,
      secondaryBg,
      secondaryColor,
      alignment,
      gap,
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
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent:
            alignment === "center"
              ? "center"
              : alignment === "right"
              ? "flex-end"
              : "flex-start",
          gap: `${gap}px`,
          width: "100%",
          marginTop,
          marginBottom,
        }}
      >
        {primaryText && (
          <a
            href={primaryUrl || "#"}
            className="transition-transform duration-150 hover:-translate-y-0.5"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "13px 26px",
              borderRadius: 10,
              backgroundColor: primaryBg || "#0f172a",
              color: primaryColor || "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
            }}
          >
            {primaryText}
          </a>
        )}
        {secondaryText && (
          <a
            href={secondaryUrl || "#"}
            className="transition-transform duration-150 hover:-translate-y-0.5"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "13px 24px",
              borderRadius: 10,
              backgroundColor: secondaryBg || "transparent",
              color: secondaryColor || "#0f172a",
              border: "1px solid #cbd5e1",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {secondaryText}
          </a>
        )}
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // LINK
  // ------------------------------------------------------------------------
  Link: {
    label: "Text Link",
    fields: {
      text: textField("Link label text"),
      href: textField("Destination URL"),
      target: selectField("Target", [
        { label: "Same tab (_self)", value: "_self" },
        { label: "New tab (_blank)", value: "_blank" },
      ]),
      arrow: radioField("Show animated arrow", [
        { label: "None", value: false },
        { label: "Include arrow →", value: true },
      ]),
      ...typographyFields,
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      text: "Explore our documentation",
      href: "#",
      target: "_self",
      arrow: true,
      ...typographyDefaults,
      color: "#4f46e5",
      fontWeight: "600",
      textDecoration: "none",
      ...commonDesignDefaults,
      ...animationDefaults,
    },
    render: ({
      text,
      href,
      target,
      arrow,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      ...props
    }) => (
      <AnimationWrapper
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        style={{ display: "inline-block" }}
      >
        <a
          href={href || "#"}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          style={{
            ...buildElementStyle(props),
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          <span>{text}</span>
          {arrow && <span aria-hidden="true">&rarr;</span>}
        </a>
      </AnimationWrapper>
    ),
  },
};
