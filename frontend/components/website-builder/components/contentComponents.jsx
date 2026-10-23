"use client";

import React, { useState } from "react";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { boxStyleFields, spacingFields } from "../fields/boxStyleFields.js";
import {
  selectField,
  numberField,
  textField,
  textareaField,
  radioField,
  colorField,
} from "../fields/helpers.js";
import { buildBoxStyle, getHoverClass } from "../layout/styleBuilders.js";
import { RenderIcon, ICON_PRESETS } from "./icons.jsx";

export const contentComponents = {
  // ------------------------------------------------------------------------
  // CARD (SLOT & CONTENT - HIGHLY CUSTOMIZABLE)
  // ------------------------------------------------------------------------
  Card: {
    label: "Card (Slot & Content)",
    fields: {
      content: { type: "slot" },
      imageUrl: textField("Header image URL (Optional)"),
      imageHeight: numberField("Image height (px)", 100, 600),
      imageFit: selectField("Image object-fit", [
        { label: "Cover (Fill)", value: "cover" },
        { label: "Contain (Natural)", value: "contain" },
      ]),
      title: textField("Card title"),
      titleSize: numberField("Title font size (px)", 14, 48),
      titleColor: colorField("Title text color"),
      description: textareaField("Card description"),
      descriptionColor: colorField("Description text color"),
      badge: textField("Small badge text (Optional)"),
      badgeBg: colorField("Badge background color"),
      badgeColor: colorField("Badge text color"),
      primaryButtonText: textField("Action button text (Optional)"),
      primaryButtonUrl: textField("Action link"),
      primaryButtonBg: colorField("Primary button background"),
      primaryButtonColor: colorField("Primary button text color"),
      secondaryButtonText: textField("Secondary link text (Optional)"),
      secondaryButtonUrl: textField("Secondary link URL"),
      ...boxStyleFields,
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      content: [],
      imageUrl:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      imageHeight: 220,
      imageFit: "cover",
      title: "Modern Flagship Experience",
      titleSize: 20,
      titleColor: "#0f172a",
      description:
        "Transform complex operational requirements into fluid, distinctive digital experiences that convert.",
      descriptionColor: "#64748b",
      badge: "FEATURED",
      badgeBg: "#eff6ff",
      badgeColor: "#1d4ed8",
      primaryButtonText: "Explore Project",
      primaryButtonUrl: "#",
      primaryButtonBg: "#4f46e5",
      primaryButtonColor: "#ffffff",
      secondaryButtonText: "",
      secondaryButtonUrl: "#",
      backgroundColor: "#ffffff",
      borderRadius: 16,
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
      hoverEffect: "lift-md",
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      content: Content,
      imageUrl,
      imageHeight = 220,
      imageFit = "cover",
      title,
      titleSize = 20,
      titleColor = "#0f172a",
      description,
      descriptionColor = "#64748b",
      badge,
      badgeBg = "#eff6ff",
      badgeColor = "#1d4ed8",
      primaryButtonText,
      primaryButtonUrl,
      primaryButtonBg = "#4f46e5",
      primaryButtonColor = "#ffffff",
      secondaryButtonText,
      secondaryButtonUrl,
      hoverEffect,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      ...props
    }) => (
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
          ...buildBoxStyle(props),
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {imageUrl && (
          <div style={{ width: "100%", height: `${imageHeight}px`, overflow: "hidden" }}>
            <img
              src={imageUrl}
              alt={title || ""}
              style={{ width: "100%", height: "100%", objectFit: imageFit, display: "block" }}
            />
          </div>
        )}
        <div style={{ padding: 24 }}>
          {badge && (
            <span
              style={{
                display: "inline-block",
                padding: "4px 10px",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                borderRadius: 999,
                backgroundColor: badgeBg || "#eff6ff",
                color: badgeColor || "#1d4ed8",
                marginBottom: 12,
              }}
            >
              {badge}
            </span>
          )}
          {title && (
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: titleColor || "#0f172a",
              }}
            >
              {title}
            </h3>
          )}
          {description && (
            <p
              style={{
                margin: "0 0 18px",
                fontSize: 14,
                color: descriptionColor || "#64748b",
                lineHeight: 1.65,
              }}
            >
              {description}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            {primaryButtonText && (
              <a
                href={primaryButtonUrl || "#"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 18px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  backgroundColor: primaryButtonBg || "#4f46e5",
                  color: primaryButtonColor || "#ffffff",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <span>{primaryButtonText}</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            )}
            {secondaryButtonText && (
              <a
                href={secondaryButtonUrl || "#"}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#64748b",
                  textDecoration: "underline",
                }}
              >
                {secondaryButtonText}
              </a>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <Content minEmptyHeight="30px" />
          </div>
        </div>
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // BADGE
  // ------------------------------------------------------------------------
  Badge: {
    label: "Micro Badge / Status Pill",
    fields: {
      text: textField("Badge text"),
      customBg: colorField("Background color"),
      customColor: colorField("Text color"),
      customDotColor: colorField("Pulse dot indicator color"),
      fontSize: numberField("Font size (px)", 9, 24),
      hasDot: radioField("Show pulse dot indicator", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      ...animationFields,
    },
    defaultProps: {
      text: "System Operational",
      customBg: "#ecfdf5",
      customColor: "#047857",
      customDotColor: "#10b981",
      fontSize: 12,
      hasDot: true,
      ...animationDefaults,
    },
    render: ({
      text,
      customBg = "#ecfdf5",
      customColor = "#047857",
      customDotColor = "#10b981",
      fontSize = 12,
      hasDot,
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
        style={{ display: "inline-block" }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 999,
            backgroundColor: customBg,
            color: customColor,
            fontSize: `${fontSize}px`,
            fontWeight: 600,
          }}
        >
          {hasDot && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: customDotColor,
              }}
            />
          )}
          <span>{text}</span>
        </span>
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // LIST
  // ------------------------------------------------------------------------
  List: {
    label: "List with Icons",
    fields: {
      items: {
        type: "array",
        label: "List items",
        arrayFields: {
          text: textField("Item text"),
        },
        defaultItemProps: {
          text: "Modular architecture designed for rapid iteration",
        },
        getItemSummary: (item) => item.text || "Item",
      },
      icon: selectField("Bullet Icon", ["check", "star", "zap", "arrow-right", "sparkles", "none"]),
      iconColor: colorField("Icon color"),
      color: colorField("Text color"),
      fontSize: numberField("Font size (px)", 12, 32),
      gap: numberField("Item spacing (px)", 4, 40),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      items: [
        { text: "Production-ready TypeScript & React architecture" },
        { text: "Zero layout shift with fluid clamp typography" },
        { text: "Server-side caching and sub-second asset streaming" },
      ],
      icon: "check",
      iconColor: "#10b981",
      color: "#334155",
      fontSize: 15,
      gap: 12,
      marginTop: "12px",
      marginBottom: "16px",
      ...animationDefaults,
    },
    render: ({
      items = [],
      icon,
      iconColor,
      color,
      fontSize,
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
      >
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            marginTop,
            marginBottom,
            display: "grid",
            gap: `${gap}px`,
          }}
        >
          {items.map((it, idx) => (
            <li
              key={`list-item-${idx}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: `${fontSize}px`,
                color: color || "#334155",
                lineHeight: 1.5,
              }}
            >
              {icon && icon !== "none" && (
                <RenderIcon name={icon} size={fontSize + 2} color={iconColor || "#10b981"} />
              )}
              <span>{it.text}</span>
            </li>
          ))}
        </ul>
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // ALERT BANNER / NOTICE
  // ------------------------------------------------------------------------
  AlertBanner: {
    label: "Alert / Notification Box",
    fields: {
      title: textField("Alert title"),
      message: textareaField("Alert message content"),
      icon: selectField("Icon", ["sparkles", "check", "flame", "shield", "bell", "none"]),
      bgColor: colorField("Background color"),
      borderColor: colorField("Border line color"),
      textColor: colorField("Text color"),
      dismissible: radioField("Allow dismiss button", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      title: "Scheduled Maintenance Window",
      message: "Platform updates are scheduled for Sunday at 02:00 UTC. Zero downtime expected.",
      icon: "sparkles",
      bgColor: "#eff6ff",
      borderColor: "#bfdbfe",
      textColor: "#1e40af",
      dismissible: true,
      marginTop: "16px",
      marginBottom: "20px",
      ...animationDefaults,
    },
    render: function RenderAlertBanner({
      title,
      message,
      icon,
      bgColor = "#eff6ff",
      borderColor = "#bfdbfe",
      textColor = "#1e40af",
      dismissible,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) {
      const [dismissed, setDismissed] = useState(false);

      if (dismissed) return null;

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            padding: "16px 20px",
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: 14,
            color: textColor,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginTop,
            marginBottom,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {icon && icon !== "none" && <RenderIcon name={icon} size={20} color={textColor} />}
            <div>
              {title && (
                <h5 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>{title}</h5>
              )}
              <p style={{ margin: 0, fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>{message}</p>
            </div>
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: textColor,
                fontSize: 18,
                cursor: "pointer",
                padding: 4,
                lineHeight: 1,
                opacity: 0.7,
              }}
            >
              &#x2715;
            </button>
          )}
        </AnimationWrapper>
      );
    },
  },
};
