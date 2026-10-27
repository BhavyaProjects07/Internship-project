"use client";

import React from "react";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { spacingFields, commonDesignDefaults } from "../fields/boxStyleFields.js";
import {
  selectField,
  numberField,
  textField,
  radioField,
  colorField,
  responsiveField,
} from "../fields/helpers.js";
import { typographyFields, typographyDefaults } from "../fields/typographyFields.js";
import { buildElementStyle, getHoverClass } from "../layout/styleBuilders.js";
import { buildResponsiveStyles } from "../layout/responsiveStyles.js";
import {
  ALIGNMENT_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  HOVER_EFFECT_OPTIONS,
  RADIUS_OPTIONS,
  SPACING_OPTIONS,
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
      icon: selectField("Leading / Trailing Icon", ICON_PRESETS),
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
      responsive: responsiveField("Responsive overrides", [
        { name: "fontSize", label: "Font size (px)", type: "number", min: 10, max: 36 },
        { name: "paddingX", label: "Horizontal padding (px)", type: "number", min: 4, max: 80 },
        { name: "paddingY", label: "Vertical padding (px)", type: "number", min: 4, max: 60 },
      ]),
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
      responsive: {
        mobile: {
          fullWidth: true,
          fontSize: 14,
        },
      },
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
      responsive,
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

      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          paddingX: "--puck-padding-x",
          paddingY: "--puck-padding-y",
          fontSize: "--puck-font-size",
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
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <a
            href={href || "#"}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className={`${getHoverClass(hoverEffect)} ${respClass}`.trim()}
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
              fontSize: `var(--puck-font-size, ${fontSize}px)`,
              fontWeight,
              padding: `var(--puck-padding-y, ${paddingY}px) var(--puck-padding-x, ${paddingX}px)`,
              borderRadius: `${borderRadius}px`,
              border,
              boxShadow: shadow,
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 200ms ease",
              maxWidth: "100%",
            }}
          >
            {iconPosition === "left" && iconEl}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {label}
            </span>
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
      responsive: responsiveField("Responsive overrides", [
        {
          name: "direction",
          label: "Stacking direction",
          type: "select",
          options: [
            { label: "Row (Side by side)", value: "row" },
            { label: "Column (Stacked vertically)", value: "column" },
          ],
        },
        { name: "gap", label: "Spacing between buttons (px)", type: "number", min: 0, max: 60 },
      ]),
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
      responsive: {
        mobile: {
          direction: "column",
          fullWidth: true,
        },
      },
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
      responsive,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          direction: "--puck-flex-direction",
          gap: "--puck-gap",
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
            marginTop,
            marginBottom,
          }}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <div
            className={respClass}
            style={{
              display: "flex",
              flexDirection: "var(--puck-flex-direction, row)",
              flexWrap: "wrap",
              alignItems: "stretch",
              justifyContent:
                alignment === "center"
                  ? "center"
                  : alignment === "right"
                  ? "flex-end"
                  : "flex-start",
              gap: `var(--puck-gap, ${gap}px)`,
              width: "100%",
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
                  boxSizing: "border-box",
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
                  boxSizing: "border-box",
                }}
              >
                {secondaryText}
              </a>
            )}
          </div>
        </AnimationWrapper>
      );
    },
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
      responsive: responsiveField("Responsive overrides", [
        { name: "fontSize", label: "Font size (px)", type: "number", min: 10, max: 36 },
        { name: "textAlign", label: "Text align", type: "select", options: ALIGNMENT_OPTIONS },
      ]),
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
      responsive: {},
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
          style={{ display: "inline-block" }}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <a
            href={href || "#"}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className={respClass}
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
      );
    },
  },
};
