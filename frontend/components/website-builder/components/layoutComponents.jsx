"use client";

import React from "react";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { boxStyleFields, spacingFields, commonDesignDefaults } from "../fields/boxStyleFields.js";
import { selectField, numberField, textField, radioField, colorField } from "../fields/helpers.js";
import { buildBoxStyle, getHoverClass } from "../layout/styleBuilders.js";
import { SPACING_OPTIONS, VERTICAL_ALIGN_OPTIONS, BORDER_STYLE_OPTIONS, WIDTH_OPTIONS } from "../tokens/index.js";

export const layoutComponents = {
  // ------------------------------------------------------------------------
  // SECTION (FULL-WIDTH SECTION WRAPPER)
  // ------------------------------------------------------------------------
  Section: {
    label: "Section (Full Width)",
    fields: {
      content: { type: "slot" },
      maxWidth: selectField("Inner container width", [
        { label: "Narrow (760px)", value: "760px" },
        { label: "Medium (1024px)", value: "1024px" },
        { label: "Standard (1240px)", value: "1240px" },
        { label: "Wide (1440px)", value: "1440px" },
        { label: "Full width (100%)", value: "100%" },
      ]),
      paddingY: selectField("Vertical padding", [
        { label: "None (0px)", value: "0px" },
        { label: "Small (32px)", value: "32px" },
        { label: "Medium (64px)", value: "64px" },
        { label: "Large (96px)", value: "96px" },
        { label: "Extra Large (128px)", value: "128px" },
        { label: "Hero Height (160px)", value: "160px" },
      ]),
      paddingX: selectField("Horizontal padding", SPACING_OPTIONS),
      backgroundColor: colorField("Background color"),
      backgroundGradient: radioField("Linear gradient", [
        { label: "Disabled", value: false },
        { label: "Enabled", value: true },
      ]),
      gradientAngle: numberField("Gradient angle (deg)", 0, 360),
      gradientFrom: colorField("Gradient color from"),
      gradientTo: colorField("Gradient color to"),
      backgroundImage: textField("Background image URL"),
      overlayColor: colorField("Background overlay color"),
      overlayOpacity: numberField("Overlay opacity (%)", 0, 100),
      borderBottom: radioField("Bottom border line", [
        { label: "None", value: false },
        { label: "Subtle border", value: true },
      ]),
      borderColor: colorField("Border line color"),
      ...animationFields,
    },
    defaultProps: {
      content: [],
      maxWidth: "1240px",
      paddingY: "64px",
      paddingX: "24px",
      backgroundColor: "#ffffff",
      backgroundGradient: false,
      gradientAngle: 180,
      gradientFrom: "#ffffff",
      gradientTo: "#f8fafc",
      backgroundImage: "",
      overlayColor: "#000000",
      overlayOpacity: 0,
      borderBottom: false,
      borderColor: "#e5e7eb",
      ...animationDefaults,
    },
    render: ({
      content: Content,
      maxWidth,
      paddingY,
      paddingX,
      backgroundColor,
      backgroundGradient,
      gradientAngle,
      gradientFrom,
      gradientTo,
      backgroundImage,
      overlayColor,
      overlayOpacity,
      borderBottom,
      borderColor,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const sectionBgColor = backgroundColor || "#ffffff";
      let sectionBgImage = undefined;

      if (backgroundImage && backgroundGradient) {
        sectionBgImage = `url("${backgroundImage.replace(/["\\\n\r]/g, "")}"), linear-gradient(${gradientAngle}deg, ${gradientFrom || "#ffffff"}, ${gradientTo || "#f8fafc"})`;
      } else if (backgroundImage) {
        sectionBgImage = `url("${backgroundImage.replace(/["\\\n\r]/g, "")}")`;
      } else if (backgroundGradient) {
        sectionBgImage = `linear-gradient(${gradientAngle}deg, ${gradientFrom || "#ffffff"}, ${gradientTo || "#f8fafc"})`;
      }

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
            backgroundColor: sectionBgColor,
            backgroundImage: sectionBgImage,
            backgroundSize: sectionBgImage ? "cover" : undefined,
            backgroundPosition: sectionBgImage ? "center" : undefined,
            backgroundRepeat: sectionBgImage ? "no-repeat" : undefined,
            paddingTop: paddingY,
            paddingBottom: paddingY,
            borderBottom: borderBottom ? `1px solid ${borderColor || "#e5e7eb"}` : undefined,
            overflow: "hidden",
          }}
        >
          {overlayOpacity > 0 && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: overlayColor || "#000000",
                opacity: overlayOpacity / 100,
                pointerEvents: "none",
              }}
            />
          )}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              boxSizing: "border-box",
              width: "100%",
              maxWidth,
              marginInline: "auto",
              paddingInline: paddingX,
            }}
          >
            <Content minEmptyHeight="100px" />
          </div>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // CONTAINER
  // ------------------------------------------------------------------------
  Container: {
    label: "Container Box",
    fields: {
      content: { type: "slot" },
      ...spacingFields,
      ...boxStyleFields,
      display: selectField("Display mode", [
        { label: "Flex column", value: "flex-col" },
        { label: "Flex row", value: "flex-row" },
        { label: "Block", value: "block" },
      ]),
      justifyContent: selectField("Justify content", [
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
        { label: "Space between", value: "space-between" },
        { label: "Space evenly", value: "space-evenly" },
      ]),
      alignItems: selectField("Align items", VERTICAL_ALIGN_OPTIONS),
      gap: numberField("Item spacing gap (px)", 0, 160),
      ...animationFields,
    },
    defaultProps: {
      content: [],
      ...commonDesignDefaults,
      backgroundColor: "transparent",
      paddingTop: "24px",
      paddingRight: "24px",
      paddingBottom: "24px",
      paddingLeft: "24px",
      borderRadius: 12,
      display: "flex-col",
      justifyContent: "flex-start",
      alignItems: "stretch",
      gap: 16,
      ...animationDefaults,
    },
    render: ({
      content: Content,
      display,
      justifyContent,
      alignItems,
      gap,
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
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        className={getHoverClass(hoverEffect)}
        style={{
          ...buildBoxStyle(props),
          display: display === "block" ? "block" : "flex",
          flexDirection: display === "flex-row" ? "row" : "column",
          justifyContent: display !== "block" ? justifyContent : undefined,
          alignItems: display !== "block" ? alignItems : undefined,
          flexWrap: display === "flex-row" ? "wrap" : undefined,
          gap: `${gap}px`,
          minWidth: 0,
        }}
      >
        <Content
          style={{
            display: display === "block" ? "block" : "flex",
            flexDirection: display === "flex-row" ? "row" : "column",
            gap: `${gap}px`,
            minWidth: 0,
            width: "100%",
          }}
          minEmptyHeight="60px"
        />
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // COLUMNS (UP TO 6 COLUMNS WITH RESPONSIVE BEHAVIOR)
  // ------------------------------------------------------------------------
  Columns: {
    label: "Columns (Multi-slot)",
    fields: {
      column1: { type: "slot" },
      column2: { type: "slot" },
      column3: { type: "slot" },
      column4: { type: "slot" },
      column5: { type: "slot" },
      column6: { type: "slot" },
      columns: selectField("Columns count", [
        { label: "2 Equal Columns", value: "2" },
        { label: "3 Equal Columns", value: "3" },
        { label: "4 Equal Columns", value: "4" },
        { label: "5 Equal Columns", value: "5" },
        { label: "6 Equal Columns", value: "6" },
      ]),
      gap: numberField("Column gap (px)", 0, 100),
      alignItems: selectField("Vertical alignment", VERTICAL_ALIGN_OPTIONS),
      ...spacingFields,
      ...boxStyleFields,
      ...animationFields,
    },
    defaultProps: {
      column1: [],
      column2: [],
      column3: [],
      column4: [],
      column5: [],
      column6: [],
      columns: "3",
      gap: 24,
      alignItems: "stretch",
      ...commonDesignDefaults,
      ...animationDefaults,
    },
    render: ({
      column1: Column1,
      column2: Column2,
      column3: Column3,
      column4: Column4,
      column5: Column5,
      column6: Column6,
      columns,
      gap,
      alignItems,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      ...props
    }) => {
      const count = Math.min(6, Math.max(2, Number(columns) || 3));
      const allSlots = [Column1, Column2, Column3, Column4, Column5, Column6];

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            ...buildBoxStyle(props),
            display: "grid",
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
            alignItems,
            gap: `${gap}px`,
            width: "100%",
          }}
        >
          {allSlots.slice(0, count).map((Col, index) => (
            <div key={`col-${index}`} style={{ minWidth: 0, width: "100%" }}>
              <Col minEmptyHeight="80px" />
            </div>
          ))}
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // GRID
  // ------------------------------------------------------------------------
  Grid: {
    label: "Responsive Grid Box",
    fields: {
      content: { type: "slot" },
      minItemWidth: numberField("Min item width (px)", 120, 600),
      gap: numberField("Grid gap (px)", 0, 80),
      ...spacingFields,
      ...boxStyleFields,
      ...animationFields,
    },
    defaultProps: {
      content: [],
      minItemWidth: 280,
      gap: 24,
      ...commonDesignDefaults,
      ...animationDefaults,
    },
    render: ({
      content: Content,
      minItemWidth,
      gap,
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
        style={{
          ...buildBoxStyle(props),
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth || 280}px, 1fr))`,
          gap: `${gap}px`,
          width: "100%",
        }}
      >
        <Content minEmptyHeight="80px" />
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // STACK (FLEX CONTAINER)
  // ------------------------------------------------------------------------
  Stack: {
    label: "Stack / Flex Row",
    fields: {
      content: { type: "slot" },
      direction: selectField("Direction", [
        { label: "Row (Horizontal)", value: "row" },
        { label: "Column (Vertical)", value: "column" },
      ]),
      wrap: radioField("Wrap children", [
        { label: "Wrap", value: "wrap" },
        { label: "No wrap", value: "nowrap" },
      ]),
      justify: selectField("Justify", [
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
        { label: "Space between", value: "space-between" },
        { label: "Space around", value: "space-around" },
      ]),
      align: selectField("Align", VERTICAL_ALIGN_OPTIONS),
      gap: numberField("Gap (px)", 0, 100),
      ...spacingFields,
      ...boxStyleFields,
      ...animationFields,
    },
    defaultProps: {
      content: [],
      direction: "row",
      wrap: "wrap",
      justify: "flex-start",
      align: "center",
      gap: 16,
      ...commonDesignDefaults,
      ...animationDefaults,
    },
    render: ({
      content: Content,
      direction,
      wrap,
      justify,
      align,
      gap,
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
        style={{
          ...buildBoxStyle(props),
          display: "flex",
          flexDirection: direction,
          flexWrap: wrap,
          justifyContent: justify,
          alignItems: align,
          gap: `${gap}px`,
          width: "100%",
        }}
      >
        <Content minEmptyHeight="60px" />
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // BACKGROUND WRAPPER (HERO / SECTION LAYER)
  // ------------------------------------------------------------------------
  BackgroundWrapper: {
    label: "Background Wrapper (Layered)",
    fields: {
      content: { type: "slot" },
      overlayColor: colorField("Overlay color"),
      overlayOpacity: numberField("Overlay opacity (%)", 0, 100),
      videoUrl: textField("Background video URL (mp4/webm)"),
      ...spacingFields,
      ...boxStyleFields,
      ...animationFields,
    },
    defaultProps: {
      content: [],
      overlayColor: "#000000",
      overlayOpacity: 30,
      videoUrl: "",
      ...commonDesignDefaults,
      minHeight: 300,
      borderRadius: 16,
      ...animationDefaults,
    },
    render: ({
      content: Content,
      overlayColor,
      overlayOpacity,
      videoUrl,
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
        style={{
          position: "relative",
          overflow: "hidden",
          ...buildBoxStyle(props),
        }}
      >
        {videoUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
            src={videoUrl}
          />
        )}
        {overlayOpacity > 0 && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: overlayColor || "#000000",
              opacity: overlayOpacity / 100,
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        )}
        <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
          <Content minEmptyHeight="80px" />
        </div>
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // SPACER
  // ------------------------------------------------------------------------
  Spacer: {
    label: "Spacer",
    fields: {
      height: numberField("Height (px)", 4, 400),
    },
    defaultProps: { height: 48 },
    render: ({ height }) => (
      <div
        aria-hidden="true"
        style={{
          height: `${height}px`,
          width: "100%",
          pointerEvents: "none",
        }}
      />
    ),
  },

  // ------------------------------------------------------------------------
  // DIVIDER
  // ------------------------------------------------------------------------
  Divider: {
    label: "Divider / Line",
    fields: {
      color: colorField("Line color"),
      thickness: numberField("Line thickness (px)", 1, 20),
      style: selectField("Line style", BORDER_STYLE_OPTIONS),
      width: selectField("Line width", WIDTH_OPTIONS),
      alignment: selectField("Alignment", [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ]),
      withBadge: radioField("Centered text / badge", [
        { label: "None", value: false },
        { label: "With text label", value: true },
      ]),
      badgeText: textField("Center badge text"),
      badgeColor: colorField("Badge text color"),
      badgeBg: colorField("Badge background color"),
      ...spacingFields,
    },
    defaultProps: {
      color: "#e5e7eb",
      thickness: 1,
      style: "solid",
      width: "100%",
      alignment: "center",
      withBadge: false,
      badgeText: "OR",
      badgeColor: "#6b7280",
      badgeBg: "#f9fafb",
      marginTop: "24px",
      marginBottom: "24px",
    },
    render: ({
      color,
      thickness,
      style,
      width,
      alignment,
      withBadge,
      badgeText,
      badgeColor,
      badgeBg,
      marginTop,
      marginBottom,
    }) => {
      if (withBadge && badgeText) {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width,
              marginInline:
                alignment === "center"
                  ? "auto"
                  : alignment === "right"
                  ? "auto 0"
                  : "0 auto",
              marginTop,
              marginBottom,
            }}
          >
            <div style={{ flex: 1, borderTop: `${thickness}px ${style} ${color}` }} />
            <span
              style={{
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: badgeColor,
                backgroundColor: badgeBg,
                borderRadius: 999,
                border: `1px solid ${color}`,
              }}
            >
              {badgeText}
            </span>
            <div style={{ flex: 1, borderTop: `${thickness}px ${style} ${color}` }} />
          </div>
        );
      }

      return (
        <div
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
          <hr
            style={{
              width,
              border: 0,
              borderTop: `${thickness}px ${style} ${color}`,
              margin: 0,
            }}
          />
        </div>
      );
    },
  },
};
