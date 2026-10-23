"use client";

import React from "react";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { spacingFields, commonDesignDefaults } from "../fields/boxStyleFields.js";
import { selectField, numberField, textField, textareaField, radioField, colorField } from "../fields/helpers.js";
import { buildBoxStyle, getHoverClass } from "../layout/styleBuilders.js";
import {
  ALIGNMENT_OPTIONS,
  HOVER_EFFECT_OPTIONS,
  RADIUS_OPTIONS,
  SHADOW_PRESETS,
} from "../tokens/index.js";
import { RenderIcon, ICON_PRESETS } from "./icons.jsx";

export const mediaComponents = {
  // ------------------------------------------------------------------------
  // IMAGE
  // ------------------------------------------------------------------------
  Image: {
    label: "Image (Single)",
    fields: {
      src: textField("Image URL"),
      alt: textField("Alternative text"),
      caption: textField("Image caption (Optional)"),
      aspectRatio: selectField("Aspect ratio", [
        { label: "Auto (Natural)", value: "auto" },
        { label: "16:9 (Landscape)", value: "16 / 9" },
        { label: "4:3 (Classic)", value: "4 / 3" },
        { label: "1:1 (Square)", value: "1 / 1" },
        { label: "9:16 (Story / Vertical)", value: "9 / 16" },
        { label: "21:9 (Cinematic)", value: "21 / 9" },
      ]),
      objectFit: selectField("Image fit", [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Fill", value: "fill" },
      ]),
      height: numberField("Height (px, 0 for auto)", 0, 1600),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      boxShadow: selectField("Shadow preset", SHADOW_PRESETS),
      opacity: numberField("Opacity (%)", 0, 100),
      hoverEffect: selectField("Hover micro-animation", HOVER_EFFECT_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      alt: "Creative studio workspace",
      caption: "",
      aspectRatio: "16 / 9",
      objectFit: "cover",
      height: 0,
      borderRadius: 16,
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.09)",
      opacity: 100,
      hoverEffect: "lift-sm",
      ...commonDesignDefaults,
      ...animationDefaults,
    },
    render: ({
      src,
      alt,
      caption,
      aspectRatio,
      objectFit,
      height,
      borderRadius,
      boxShadow,
      opacity,
      hoverEffect,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      ...spacing
    }) => (
      <AnimationWrapper
        as="figure"
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        style={{
          ...buildBoxStyle(spacing),
          margin: 0,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          className={getHoverClass(hoverEffect)}
          style={{
            overflow: "hidden",
            borderRadius: `${borderRadius}px`,
            boxShadow: boxShadow === "none" ? undefined : boxShadow,
            aspectRatio: aspectRatio === "auto" ? undefined : aspectRatio,
            height: height > 0 ? `${height}px` : "auto",
            width: "100%",
          }}
        >
          <img
            src={src || "https://placehold.co/1200x700?text=Select+Image"}
            alt={alt || ""}
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit,
              opacity: opacity / 100,
            }}
          />
        </div>
        {caption && (
          <figcaption
            style={{
              marginTop: 8,
              color: "#64748b",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {caption}
          </figcaption>
        )}
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // IMAGE GALLERY
  // ------------------------------------------------------------------------
  ImageGallery: {
    label: "Image Gallery Grid",
    fields: {
      columns: selectField("Gallery columns", [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
        { label: "4 Columns", value: "4" },
      ]),
      gap: numberField("Grid gap (px)", 4, 60),
      images: {
        type: "array",
        label: "Gallery images list",
        arrayFields: {
          url: textField("Image URL"),
          alt: textField("Alt description"),
          caption: textField("Caption"),
        },
        defaultItemProps: {
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
          alt: "Code and design",
          caption: "Modern architecture",
        },
        getItemSummary: (item) => item.caption || item.alt || "Gallery item",
      },
      aspectRatio: selectField("Aspect ratio", [
        { label: "Square (1:1)", value: "1 / 1" },
        { label: "Landscape (4:3)", value: "4 / 3" },
        { label: "Widescreen (16:9)", value: "16 / 9" },
      ]),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      columns: "3",
      gap: 16,
      images: [
        {
          url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          alt: "Analytics",
          caption: "Data Driven",
        },
        {
          url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
          alt: "Collaboration",
          caption: "Team Synergy",
        },
        {
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
          alt: "Fintech",
          caption: "Financial Growth",
        },
      ],
      aspectRatio: "4 / 3",
      borderRadius: 12,
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      columns,
      gap,
      images = [],
      aspectRatio,
      borderRadius,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const count = Number(columns) || 3;
      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
            gap: `${gap}px`,
            width: "100%",
            marginTop,
            marginBottom,
          }}
        >
          {images.map((img, idx) => (
            <div
              key={`gallery-${idx}`}
              className="group relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                borderRadius: `${borderRadius}px`,
                aspectRatio,
              }}
            >
              <img
                src={img.url}
                alt={img.alt || ""}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {img.caption && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // VIDEO PLAYER
  // ------------------------------------------------------------------------
  Video: {
    label: "Video Embed (YouTube / MP4)",
    fields: {
      url: textField("Video URL (YouTube embed or MP4 direct link)"),
      aspectRatio: selectField("Aspect ratio", [
        { label: "16:9 (Standard Widescreen)", value: "16 / 9" },
        { label: "4:3 (Classic TV)", value: "4 / 3" },
        { label: "1:1 (Square)", value: "1 / 1" },
        { label: "9:16 (Shorts / Reels)", value: "9 / 16" },
      ]),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      boxShadow: selectField("Shadow preset", SHADOW_PRESETS),
      autoplay: radioField("Autoplay (Muted)", [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      aspectRatio: "16 / 9",
      borderRadius: 16,
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
      autoplay: false,
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      url,
      aspectRatio,
      borderRadius,
      boxShadow,
      autoplay,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const isEmbed =
        url &&
        (url.includes("youtube") ||
          url.includes("vimeo") ||
          url.includes("embed"));
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
            aspectRatio,
            borderRadius: `${borderRadius}px`,
            boxShadow: boxShadow === "none" ? undefined : boxShadow,
            overflow: "hidden",
            marginTop,
            marginBottom,
            backgroundColor: "#000000",
          }}
        >
          {isEmbed ? (
            <iframe
              src={`${url}${autoplay ? "?autoplay=1&mute=1" : ""}`}
              title="Video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: "100%",
                height: "100%",
                border: 0,
                display: "block",
              }}
            />
          ) : (
            <video
              src={url}
              controls
              autoPlay={autoplay}
              muted={autoplay}
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // ICON BOX
  // ------------------------------------------------------------------------
  IconBox: {
    label: "Icon / Feature Badge",
    fields: {
      icon: selectField("Icon Symbol", ICON_PRESETS),
      iconSize: numberField("Icon size (px)", 12, 120),
      iconColor: colorField("Icon color"),
      backgroundShape: selectField("Background container shape", [
        { label: "None (Raw icon)", value: "none" },
        { label: "Circle", value: "circle" },
        { label: "Rounded square", value: "rounded" },
        { label: "Sharp square", value: "square" },
      ]),
      backgroundColor: colorField("Background color"),
      border: radioField("Include border ring", [
        { label: "No border", value: false },
        { label: "1px border ring", value: true },
      ]),
      borderColor: colorField("Border ring color"),
      alignment: selectField("Alignment", ALIGNMENT_OPTIONS),
      hoverEffect: selectField("Hover micro-animation", HOVER_EFFECT_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      icon: "zap",
      iconSize: 28,
      iconColor: "#4f46e5",
      backgroundShape: "rounded",
      backgroundColor: "#eef2ff",
      border: true,
      borderColor: "#c7d2fe",
      alignment: "left",
      hoverEffect: "lift-sm",
      marginTop: "8px",
      marginBottom: "16px",
      ...animationDefaults,
    },
    render: ({
      icon,
      iconSize,
      iconColor,
      backgroundShape,
      backgroundColor,
      border,
      borderColor,
      alignment,
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
      const isNone = backgroundShape === "none";
      const radius =
        backgroundShape === "circle"
          ? "50%"
          : backgroundShape === "rounded"
          ? "14px"
          : "0px";
      const padding = isNone ? 0 : iconSize * 0.55;

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
          <div
            className={getHoverClass(hoverEffect)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: `${padding}px`,
              backgroundColor: isNone ? "transparent" : backgroundColor,
              borderRadius: radius,
              border: border && !isNone ? `1px solid ${borderColor}` : "none",
            }}
          >
            <RenderIcon name={icon} size={iconSize} color={iconColor} />
          </div>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // MAP EMBED
  // ------------------------------------------------------------------------
  MapEmbed: {
    label: "Map Embed",
    fields: {
      location: textField("Location query or address"),
      zoom: numberField("Zoom level", 1, 20),
      height: numberField("Height (px)", 150, 800),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      location: "San Francisco, CA",
      zoom: 14,
      height: 380,
      borderRadius: 16,
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      location,
      zoom,
      height,
      borderRadius,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const encoded = encodeURIComponent(location || "San Francisco, CA");
      const mapUrl = `https://maps.google.com/maps?q=${encoded}&z=${zoom || 14}&output=embed`;

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
            height: `${height}px`,
            borderRadius: `${borderRadius}px`,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            marginTop,
            marginBottom,
          }}
        >
          <iframe
            src={mapUrl}
            title="Interactive map"
            style={{ width: "100%", height: "100%", border: 0 }}
            loading="lazy"
          />
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // CODE SNIPPET (TERMINAL WINDOW)
  // ------------------------------------------------------------------------
  CodeSnippet: {
    label: "Code Snippet / Terminal",
    fields: {
      code: textareaField("Code contents"),
      language: textField("Language badge (e.g. typescript, bash, python)"),
      windowTitle: textField("Window title (Optional)"),
      theme: selectField("Terminal theme", [
        { label: "Dark Slate", value: "dark" },
        { label: "Monokai Black", value: "black" },
        { label: "Clean White", value: "light" },
      ]),
      fontSize: numberField("Font size (px)", 10, 24),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      code: `import { createClient } from "@studio/engine";\n\nconst client = createClient({\n  apiKey: process.env.API_KEY,\n  environment: "production"\n});\n\nawait client.sites.deploy();`,
      language: "typescript",
      windowTitle: "terminal ~ bash",
      theme: "dark",
      fontSize: 14,
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      code,
      language,
      windowTitle,
      theme,
      fontSize,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const bg =
        theme === "black" ? "#000000" : theme === "light" ? "#f8fafc" : "#0f172a";
      const textClr = theme === "light" ? "#0f172a" : "#e2e8f0";
      const borderClr = theme === "light" ? "#e2e8f0" : "#1e293b";

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
            backgroundColor: bg,
            borderRadius: 14,
            border: `1px solid ${borderClr}`,
            overflow: "hidden",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
            marginTop,
            marginBottom,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 16px",
              borderBottom: `1px solid ${borderClr}`,
              backgroundColor: theme === "light" ? "#f1f5f9" : "#1e293b",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <span
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                }}
              />
              <span
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  backgroundColor: "#f59e0b",
                }}
              />
              <span
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                }}
              />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>
              {windowTitle}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#64748b",
              }}
            >
              {language}
            </span>
          </div>
          <pre
            style={{
              margin: 0,
              padding: 20,
              fontFamily: "var(--font-geist-mono), 'JetBrains Mono', monospace",
              fontSize: `${fontSize}px`,
              lineHeight: 1.6,
              color: textClr,
              overflowX: "auto",
            }}
          >
            <code>{code}</code>
          </pre>
        </AnimationWrapper>
      );
    },
  },
};
