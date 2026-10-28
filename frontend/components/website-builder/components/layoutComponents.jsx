"use client";

import React from "react";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { boxStyleFields, spacingFields, commonDesignDefaults } from "../fields/boxStyleFields.js";
import { buildBoxStyle, getHoverClass } from "../layout/styleBuilders.js";
import { buildResponsiveStyles } from "../layout/responsiveStyles.js";
import {
  SPACING_OPTIONS,
  VERTICAL_ALIGN_OPTIONS,
  BORDER_STYLE_OPTIONS,
  WIDTH_OPTIONS,
  RADIUS_OPTIONS,
} from "../tokens/index.js";

import {
  selectField,
  numberField,
  textField,
  radioField,
  colorField,
  responsiveField,
} from "../fields/helpers.js";



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
      responsive: responsiveField([
        {
          key: "paddingY",
          label: "Vertical padding",
          type: "select",
          options: [
            { label: "None (0px)", value: "0px" },
            { label: "Small (24px)", value: "24px" },
            { label: "Medium (40px)", value: "40px" },
            { label: "Large (64px)", value: "64px" },
            { label: "Extra Large (96px)", value: "96px" },
          ],
        },
        {
          key: "paddingX",
          label: "Horizontal padding",
          type: "select",
          options: SPACING_OPTIONS,
        },
        {
          key: "maxWidth",
          label: "Inner container width",
          type: "select",
          options: [
            { label: "Narrow (760px)", value: "760px" },
            { label: "Medium (1024px)", value: "1024px" },
            { label: "Standard (1240px)", value: "1240px" },
            { label: "Full width (100%)", value: "100%" },
          ],
        },
      ]),
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
      responsive: {
        tablet: {
          paddingY: "48px",
          paddingX: "20px",
        },
        mobile: {
          paddingY: "32px",
          paddingX: "16px",
        },
      },
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
      responsive,
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

      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          paddingY: "--puck-padding-y",
          paddingX: "--puck-padding-x",
          maxWidth: "--puck-max-width",
        },
      });

      return (
        <>
          {respCss && <style>{respCss}</style>}
          <AnimationWrapper
            as="section"
            trigger={animTrigger}
            preset={animPreset}
            loop={animLoop}
            duration={animDuration}
            delay={animDelay}
            easing={animEasing}
            className={respClass}
            style={{
              position: "relative",
              width: "100%",
              boxSizing: "border-box",
              backgroundColor: sectionBgColor,
              backgroundImage: sectionBgImage,
              backgroundSize: sectionBgImage ? "cover" : undefined,
              backgroundPosition: sectionBgImage ? "center" : undefined,
              backgroundRepeat: sectionBgImage ? "no-repeat" : undefined,
              paddingTop: `var(--puck-padding-y, ${paddingY})`,
              paddingBottom: `var(--puck-padding-y, ${paddingY})`,
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
                maxWidth: `var(--puck-max-width, ${maxWidth})`,
                marginInline: "auto",
                paddingInline: `var(--puck-padding-x, ${paddingX})`,
              }}
            >
              <Content minEmptyHeight="100px" />
            </div>
          </AnimationWrapper>
        </>
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
      widthMode: selectField("Width Mode", [
        { label: "Full Width (100%)", value: "100%" },
        { label: "Custom Width (px)", value: "custom" },
        { label: "Fit Content", value: "fit-content" },
        { label: "Auto", value: "auto" },
      ]),
      customWidth: numberField("Custom Width (px)", 40, 1600),
      rotateAngle: numberField("Rotation Angle (deg: -45° to +45°)", -45, 45),
      tiltAngle: numberField("Tilt Angle (deg: -15° to +15°)", -15, 15),
      skewAngle: numberField("Skew Angle (deg: -20° to +20°)", -20, 20),
      overflow: selectField("Content Overflow", [
        { label: "Visible", value: "visible" },
        { label: "Hidden (Clip Corners)", value: "hidden" },
        { label: "Auto Scroll", value: "auto" },
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
      responsive: responsiveField([
        {
          key: "display",
          label: "Display mode",
          type: "select",
          options: [
            { label: "Flex column (Stack)", value: "flex-col" },
            { label: "Flex row (Horizontal)", value: "flex-row" },
            { label: "Block", value: "block" },
          ],
        },
        {
          key: "width",
          label: "Width (e.g. 100%, 800px)",
          type: "text",
        },
        {
          key: "maxWidth",
          label: "Max width (e.g. 100%, 1200px)",
          type: "text",
        },
        {
          key: "gap",
          label: "Item spacing gap (px)",
          type: "number",
          min: 0,
          max: 120,
        },
        {
          key: "paddingTop",
          label: "Padding top",
          type: "select",
          options: SPACING_OPTIONS,
        },
        {
          key: "paddingBottom",
          label: "Padding bottom",
          type: "select",
          options: SPACING_OPTIONS,
        },
        {
          key: "paddingLeft",
          label: "Padding left",
          type: "select",
          options: SPACING_OPTIONS,
        },
        {
          key: "paddingRight",
          label: "Padding right",
          type: "select",
          options: SPACING_OPTIONS,
        },
      ]),
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
      widthMode: "100%",
      customWidth: 800,
      rotateAngle: 0,
      tiltAngle: 0,
      skewAngle: 0,
      overflow: "visible",
      justifyContent: "flex-start",
      alignItems: "stretch",
      gap: 16,
      responsive: {
        tablet: {
          paddingTop: "20px",
          paddingBottom: "20px",
          paddingLeft: "16px",
          paddingRight: "16px",
        },
        mobile: {
          paddingTop: "16px",
          paddingBottom: "16px",
          paddingLeft: "12px",
          paddingRight: "12px",
        },
      },
      ...animationDefaults,
    },
    render: ({
      content: Content,
      display,
      widthMode = "100%",
      customWidth = 800,
      rotateAngle = 0,
      tiltAngle = 0,
      skewAngle = 0,
      overflow = "visible",
      justifyContent,
      alignItems,
      gap,
      responsive,
      hoverEffect,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      ...props
    }) => {
      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          display: "--puck-display",
          width: "--puck-width",
          maxWidth: "--puck-max-width",
          gap: "--puck-gap",
          paddingTop: "--puck-padding-top",
          paddingBottom: "--puck-padding-bottom",
          paddingLeft: "--puck-padding-left",
          paddingRight: "--puck-padding-right",
        },
      });

      const resolvedWidth =
        widthMode === "custom" && customWidth
          ? `${customWidth}px`
          : widthMode || "100%";

      return (
        <>
          {respCss && <style>{respCss}</style>}
          <AnimationWrapper
            trigger={animTrigger}
            preset={animPreset}
            loop={animLoop}
            duration={animDuration}
            delay={animDelay}
            easing={animEasing}
            className={`${getHoverClass(hoverEffect)} ${respClass}`}
            style={{
              ...buildBoxStyle({
                ...props,
                width: resolvedWidth,
                rotateAngle,
                tiltAngle,
                skewAngle,
              }),
              width: resolvedWidth,
              display: display === "block" ? "block" : "flex",
              flexDirection: display === "flex-row" ? "row" : "column",
              justifyContent: display !== "block" ? justifyContent : undefined,
              alignItems: display !== "block" ? alignItems : undefined,
              flexWrap: display === "flex-row" ? "wrap" : undefined,
              gap: `var(--puck-gap, ${gap}px)`,
              minWidth: 0,
              overflow,
            }}
          >
            <Content
              style={{
                display: display === "block" ? "block" : "flex",
                flexDirection: display === "flex-row" ? "row" : "column",
                gap: `var(--puck-gap, ${gap}px)`,
                minWidth: 0,
                width: "100%",
              }}
              minEmptyHeight="60px"
            />
          </AnimationWrapper>
        </>
      );
    },
  },

  // ------------------------------------------------------------------------
  // FLEX COLUMNS (ASYMMETRIC & SIZED MULTI-ANGLE COLUMNS)
  // ------------------------------------------------------------------------
  FlexColumns: {
    label: "Flex Columns (Asymmetric & Sized)",
    fields: {
      col1: { type: "slot" },
      col2: { type: "slot" },
      col3: { type: "slot" },
      col4: { type: "slot" },

      layoutRatio: selectField("Column Widths & Ratio", [
        { label: "50% / 50% (Equal Halves)", value: "50-50" },
        { label: "33% / 67% (1/3 Left Sidebar + 2/3 Main)", value: "33-67" },
        { label: "67% / 33% (2/3 Main + 1/3 Right Sidebar)", value: "67-33" },
        { label: "25% / 75% (Narrow Left + Wide Content)", value: "25-75" },
        { label: "75% / 25% (Wide Content + Narrow Right)", value: "75-25" },
        { label: "33% / 33% / 33% (3 Equal)", value: "33-33-33" },
        { label: "25% / 50% / 25% (Hero Center Spotlight)", value: "25-50-25" },
        { label: "20% / 60% / 20% (Wide Center Focus)", value: "20-60-20" },
        { label: "25% / 25% / 25% / 25% (4 Equal)", value: "25-25-25-25" },
        { label: "Custom CSS Grid Ratio", value: "custom" },
      ]),
      customGrid: textField("Custom Ratio (e.g. 300px 1fr, 40% 60%, 2fr 1fr)"),
      gap: numberField("Column Gap (px)", 0, 100),
      verticalAlign: selectField("Vertical Alignment", VERTICAL_ALIGN_OPTIONS),
      reverseOnMobile: radioField("Stack Reverse on Mobile", [
        { label: "No (Left on top)", value: false },
        { label: "Yes (Right on top)", value: true },
      ]),
      tiltAngle: numberField("Container Tilt Angle (deg: -15° to +15°)", -15, 15),

      // Col 1 Styling
      col1Bg: colorField("Col 1 Background"),
      col1Padding: selectField("Col 1 Inner Padding", SPACING_OPTIONS),
      col1Radius: selectField("Col 1 Corner Radius", RADIUS_OPTIONS),

      // Col 2 Styling
      col2Bg: colorField("Col 2 Background"),
      col2Padding: selectField("Col 2 Inner Padding", SPACING_OPTIONS),
      col2Radius: selectField("Col 2 Corner Radius", RADIUS_OPTIONS),

      ...spacingFields,
      ...boxStyleFields,
      ...animationFields,
    },
    defaultProps: {
      col1: [],
      col2: [],
      col3: [],
      col4: [],
      layoutRatio: "33-67",
      customGrid: "",
      gap: 24,
      verticalAlign: "stretch",
      reverseOnMobile: false,
      tiltAngle: 0,
      col1Bg: "transparent",
      col1Padding: "0px",
      col1Radius: 0,
      col2Bg: "transparent",
      col2Padding: "0px",
      col2Radius: 0,
      ...commonDesignDefaults,
      ...animationDefaults,
    },
    render: ({
      col1: Col1,
      col2: Col2,
      col3: Col3,
      col4: Col4,
      layoutRatio = "33-67",
      customGrid,
      gap = 24,
      verticalAlign = "stretch",
      reverseOnMobile = false,
      tiltAngle = 0,
      col1Bg,
      col1Padding,
      col1Radius,
      col2Bg,
      col2Padding,
      col2Radius,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      ...props
    }) => {
      let gridTemplate = "1fr 2fr";
      let activeCols = 2;

      switch (layoutRatio) {
        case "50-50":
          gridTemplate = "1fr 1fr";
          activeCols = 2;
          break;
        case "33-67":
          gridTemplate = "1fr 2fr";
          activeCols = 2;
          break;
        case "67-33":
          gridTemplate = "2fr 1fr";
          activeCols = 2;
          break;
        case "25-75":
          gridTemplate = "1fr 3fr";
          activeCols = 2;
          break;
        case "75-25":
          gridTemplate = "3fr 1fr";
          activeCols = 2;
          break;
        case "33-33-33":
          gridTemplate = "1fr 1fr 1fr";
          activeCols = 3;
          break;
        case "25-50-25":
          gridTemplate = "1fr 2fr 1fr";
          activeCols = 3;
          break;
        case "20-60-20":
          gridTemplate = "1fr 3fr 1fr";
          activeCols = 3;
          break;
        case "25-25-25-25":
          gridTemplate = "1fr 1fr 1fr 1fr";
          activeCols = 4;
          break;
        case "custom":
          gridTemplate = customGrid || "1fr 1fr";
          activeCols = 4;
          break;
        default:
          gridTemplate = "1fr 2fr";
          activeCols = 2;
      }

      const allColSlots = [
        { slot: Col1, bg: col1Bg, pad: col1Padding, rad: col1Radius },
        { slot: Col2, bg: col2Bg, pad: col2Padding, rad: col2Radius },
        { slot: Col3, bg: "transparent", pad: "0px", rad: 0 },
        { slot: Col4, bg: "transparent", pad: "0px", rad: 0 },
      ];

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            ...buildBoxStyle({ ...props, tiltAngle }),
            width: "100%",
            minWidth: 0,
          }}
        >
          <div
            className="puck-flex-columns-grid"
            style={{
              display: "grid",
              gridTemplateColumns: gridTemplate,
              alignItems: verticalAlign,
              gap: `${gap}px`,
              width: "100%",
              minWidth: 0,
            }}
          >
            {allColSlots.slice(0, activeCols).map((colItem, idx) => {
              const SlotComp = colItem.slot;
              return (
                <div
                  key={`flex-col-${idx}`}
                  style={{
                    minWidth: 0,
                    width: "100%",
                    backgroundColor: colItem.bg || "transparent",
                    padding: colItem.pad || "0px",
                    borderRadius: colItem.rad ? `${colItem.rad}px` : undefined,
                    boxSizing: "border-box",
                  }}
                >
                  <SlotComp minEmptyHeight="80px" />
                </div>
              );
            })}
          </div>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // FREE BOX (POSITIONED ANYWHERE WITH ANY SIZE & ANGLE)
  // ------------------------------------------------------------------------
  FreeBox: {
    label: "Free Box (Any Size & Angle)",
    fields: {
      content: { type: "slot" },
      widthMode: selectField("Width Mode", [
        { label: "Contained Percentage (%)", value: "percent" },
        { label: "Fixed Width (px)", value: "fixed" },
        { label: "Full Width (100%)", value: "full" },
        { label: "Auto (Fit Content)", value: "auto" },
      ]),
      percentWidth: numberField("Width Percentage (%)", 10, 100),
      fixedWidth: numberField("Fixed Width (px)", 40, 1600),
      heightMode: selectField("Height Mode", [
        { label: "Auto (Grows with content)", value: "auto" },
        { label: "Minimum Height (px)", value: "min" },
        { label: "Fixed Height (px)", value: "fixed" },
      ]),
      customHeight: numberField("Height (px)", 20, 1200),
      alignment: selectField("Alignment / Float", [
        { label: "Center", value: "center" },
        { label: "Left Aligned", value: "left" },
        { label: "Right Aligned", value: "right" },
      ]),
      rotateAngle: numberField("Rotation Angle (deg: -45° to +45°)", -45, 45),
      skewAngle: numberField("Skew / Slant Angle (deg: -30° to +30°)", -30, 30),
      offsetX: numberField("Nudge Offset X (px)", -300, 300),
      offsetY: numberField("Nudge Offset Y / Overlap (px)", -300, 300),
      zIndex: numberField("Layer Z-Index", 0, 50),
      overflow: selectField("Content Overflow", [
        { label: "Visible", value: "visible" },
        { label: "Hidden (Clip Corners)", value: "hidden" },
        { label: "Auto Scroll", value: "auto" },
      ]),
      ...spacingFields,
      ...boxStyleFields,
      ...animationFields,
    },
    defaultProps: {
      content: [],
      widthMode: "percent",
      percentWidth: 80,
      fixedWidth: 600,
      heightMode: "auto",
      customHeight: 200,
      alignment: "center",
      rotateAngle: 0,
      skewAngle: 0,
      offsetX: 0,
      offsetY: 0,
      zIndex: 1,
      overflow: "visible",
      backgroundColor: "#ffffff",
      paddingTop: "24px",
      paddingRight: "24px",
      paddingBottom: "24px",
      paddingLeft: "24px",
      borderRadius: 16,
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.09), 0 4px 6px -4px rgba(0,0,0,0.05)",
      ...commonDesignDefaults,
      ...animationDefaults,
    },
    render: ({
      content: Content,
      widthMode = "percent",
      percentWidth = 80,
      fixedWidth = 600,
      heightMode = "auto",
      customHeight = 200,
      alignment = "center",
      rotateAngle = 0,
      skewAngle = 0,
      offsetX = 0,
      offsetY = 0,
      zIndex = 1,
      overflow = "visible",
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      ...props
    }) => {
      let resolvedWidth = "80%";
      if (widthMode === "percent") {
        resolvedWidth = `${percentWidth}%`;
      } else if (widthMode === "fixed") {
        resolvedWidth = `${fixedWidth}px`;
      } else if (widthMode === "full") {
        resolvedWidth = "100%";
      } else if (widthMode === "auto") {
        resolvedWidth = "fit-content";
      }

      let resolvedHeight = undefined;
      let resolvedMinHeight = undefined;
      if (heightMode === "fixed") {
        resolvedHeight = `${customHeight}px`;
      } else if (heightMode === "min") {
        resolvedMinHeight = `${customHeight}px`;
      }

      const marginInline =
        alignment === "center"
          ? "auto"
          : alignment === "right"
          ? "auto 0"
          : "0 auto";

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
            zIndex,
            position: "relative",
          }}
        >
          <AnimationWrapper
            trigger={animTrigger}
            preset={animPreset}
            loop={animLoop}
            duration={animDuration}
            delay={animDelay}
            easing={animEasing}
            style={{
              ...buildBoxStyle({
                ...props,
                width: resolvedWidth,
                rotateAngle,
                skewAngle,
                offsetX,
                offsetY,
              }),
              width: resolvedWidth,
              height: resolvedHeight,
              minHeight: resolvedMinHeight,
              marginInline,
              overflow,
              zIndex,
              position: "relative",
            }}
          >
            <Content minEmptyHeight="80px" />
          </AnimationWrapper>
        </div>
      );
    },
  },

  // ------------------------------------------------------------------------
  // ANGLED SECTION (SLANTED & DIAGONAL DIVIDERS)
  // ------------------------------------------------------------------------
  AngledSection: {
    label: "Angled Section (Slanted Dividers)",
    fields: {
      content: { type: "slot" },
      angleType: selectField("Divider Angle Shape", [
        { label: "Top Slanted Down-Right", value: "top-right" },
        { label: "Top Slanted Down-Left", value: "top-left" },
        { label: "Bottom Slanted Down-Right", value: "bottom-right" },
        { label: "Bottom Slanted Down-Left", value: "bottom-left" },
        { label: "Both Top & Bottom Angles", value: "both" },
        { label: "Full Container Skew Angle", value: "skew" },
      ]),
      angleHeight: numberField("Slant Slope Height (px)", 10, 160),
      skewDegrees: numberField("Skew Angle (deg: -15° to +15°)", -15, 15),
      slantFillColor: colorField("Adjacent Background Match Color"),
      backgroundColor: colorField("Section Background Color"),
      backgroundGradient: radioField("Linear Gradient", [
        { label: "Disabled", value: false },
        { label: "Enabled", value: true },
      ]),
      gradientAngle: numberField("Gradient Angle (deg)", 0, 360),
      gradientFrom: colorField("Gradient Color 1"),
      gradientTo: colorField("Gradient Color 2"),
      maxWidth: selectField("Inner Container Width", [
        { label: "Standard (1240px)", value: "1240px" },
        { label: "Medium (1024px)", value: "1024px" },
        { label: "Wide (1440px)", value: "1440px" },
        { label: "Narrow (760px)", value: "760px" },
        { label: "Full Width (100%)", value: "100%" },
      ]),
      paddingY: selectField("Vertical Padding", SPACING_OPTIONS),
      paddingX: selectField("Horizontal Padding", SPACING_OPTIONS),
      ...animationFields,
    },
    defaultProps: {
      content: [],
      angleType: "bottom-right",
      angleHeight: 60,
      skewDegrees: -3,
      slantFillColor: "#ffffff",
      backgroundColor: "#0f172a",
      backgroundGradient: false,
      gradientAngle: 135,
      gradientFrom: "#0f172a",
      gradientTo: "#1e1b4b",
      maxWidth: "1240px",
      paddingY: "64px",
      paddingX: "24px",
      ...animationDefaults,
    },
    render: ({
      content: Content,
      angleType = "bottom-right",
      angleHeight = 60,
      skewDegrees = -3,
      slantFillColor = "#ffffff",
      backgroundColor = "#0f172a",
      backgroundGradient,
      gradientAngle = 135,
      gradientFrom = "#0f172a",
      gradientTo = "#1e1b4b",
      maxWidth = "1240px",
      paddingY = "64px",
      paddingX = "24px",
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const bg = backgroundGradient
        ? `linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})`
        : backgroundColor;

      let clipPath = undefined;
      const h = Number(angleHeight) || 60;

      if (angleType === "top-right") {
        clipPath = `polygon(0 ${h}px, 100% 0, 100% 100%, 0 100%)`;
      } else if (angleType === "top-left") {
        clipPath = `polygon(0 0, 100% ${h}px, 100% 100%, 0 100%)`;
      } else if (angleType === "bottom-right") {
        clipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${h}px), 0 100%)`;
      } else if (angleType === "bottom-left") {
        clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - ${h}px))`;
      } else if (angleType === "both") {
        clipPath = `polygon(0 ${h}px, 100% 0, 100% calc(100% - ${h}px), 0 100%)`;
      }

      const isSkew = angleType === "skew";

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
            background: bg,
            clipPath: !isSkew ? clipPath : undefined,
            transform: isSkew ? `skewY(${skewDegrees}deg)` : undefined,
            paddingTop: `calc(${paddingY} + ${angleType.includes("top") || angleType === "both" ? `${h}px` : "0px"})`,
            paddingBottom: `calc(${paddingY} + ${angleType.includes("bottom") || angleType === "both" ? `${h}px` : "0px"})`,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              transform: isSkew ? `skewY(${-skewDegrees}deg)` : undefined,
              maxWidth,
              marginInline: "auto",
              paddingInline: paddingX,
              boxSizing: "border-box",
              width: "100%",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Content minEmptyHeight="100px" />
          </div>
        </AnimationWrapper>
      );
    },
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

      layoutRatio: selectField("Width Ratio / Proportions", [
        { label: "Equal Distribution", value: "equal" },
        { label: "50% / 50% (Equal Halves)", value: "50-50" },
        { label: "33% / 67% (1/3 Left, 2/3 Right)", value: "33-67" },
        { label: "67% / 33% (2/3 Left, 1/3 Right)", value: "67-33" },
        { label: "25% / 75% (1/4 Left, 3/4 Right)", value: "25-75" },
        { label: "75% / 25% (3/4 Left, 1/4 Right)", value: "75-25" },
        { label: "25% / 50% / 25% (Center Spotlight)", value: "25-50-25" },
        { label: "20% / 60% / 20% (Wide Center)", value: "20-60-20" },
        { label: "Custom Ratio", value: "custom" },
      ]),
      customRatio: textField("Custom Ratio (e.g. 320px 1fr, 30% 70%)"),

      gap: numberField("Column gap (px)", 0, 100),

      rotateAngle: numberField("Rotation Angle (deg: -45° to +45°)", -45, 45),
      tiltAngle: numberField("Tilt Angle (deg: -15° to +15°)", -15, 15),
      skewAngle: numberField("Skew Angle (deg: -30° to +30°)", -30, 30),
      offsetX: numberField("Offset X (px)", -200, 200),
      offsetY: numberField("Offset Y (px)", -200, 200),

      responsive: responsiveField([
        {
          key: "columns",
          label: "Number of columns",
          type: "select",
          options: [
            { label: "1 Column (Stack vertically)", value: "1" },
            { label: "2 columns", value: "2" },
            { label: "3 columns", value: "3" },
            { label: "4 columns", value: "4" },
            { label: "5 columns", value: "5" },
            { label: "6 columns", value: "6" },
          ],
        },
        {
          key: "gap",
          label: "Column gap (px)",
          type: "number",
          min: 0,
          max: 100,
          step: 1,
        },
      ]),

      alignItems: selectField(
        "Vertical alignment",
        VERTICAL_ALIGN_OPTIONS
      ),

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
      layoutRatio: "equal",
      customRatio: "",
      gap: 24,
      rotateAngle: 0,
      tiltAngle: 0,
      skewAngle: 0,
      offsetX: 0,
      offsetY: 0,
      alignItems: "stretch",
      responsive: {
        tablet: {
          columns: "2",
          gap: 16,
        },
        mobile: {
          columns: "1",
          gap: 12,
        },
      },

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
      layoutRatio = "equal",
      customRatio,
      gap,
      rotateAngle = 0,
      tiltAngle = 0,
      skewAngle = 0,
      offsetX = 0,
      offsetY = 0,
      alignItems,
      responsive,

      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,

      ...props
    }) => {
      const count = Math.min(
        6,
        Math.max(1, Number(columns) || 3)
      );

      const allSlots = [
        Column1,
        Column2,
        Column3,
        Column4,
        Column5,
        Column6,
      ];

      const { className, css } = buildResponsiveStyles({
        responsive,
        variableMap: {
          columns: "--puck-columns",
          gap: "--puck-gap",
        },
      });

      let gridTemplate = `repeat(var(--puck-columns, ${count}), minmax(0, 1fr))`;
      if (layoutRatio === "50-50") {
        gridTemplate = "1fr 1fr";
      } else if (layoutRatio === "33-67") {
        gridTemplate = "1fr 2fr";
      } else if (layoutRatio === "67-33") {
        gridTemplate = "2fr 1fr";
      } else if (layoutRatio === "25-75") {
        gridTemplate = "1fr 3fr";
      } else if (layoutRatio === "75-25") {
        gridTemplate = "3fr 1fr";
      } else if (layoutRatio === "25-50-25") {
        gridTemplate = "1fr 2fr 1fr";
      } else if (layoutRatio === "20-60-20") {
        gridTemplate = "1fr 3fr 1fr";
      } else if (layoutRatio === "custom" && customRatio?.trim()) {
        gridTemplate = customRatio.trim();
      }

      return (
        <>
          {css && <style>{css}</style>}

          <div
            className={className}
            style={{
              width: "100%",
              minWidth: 0,
            }}
          >
            <AnimationWrapper
              trigger={animTrigger}
              preset={animPreset}
              loop={animLoop}
              duration={animDuration}
              delay={animDelay}
              easing={animEasing}
              style={{
                ...buildBoxStyle({
                  ...props,
                  rotateAngle,
                  tiltAngle,
                  skewAngle,
                  offsetX,
                  offsetY,
                }),
                display: "grid",
                gridTemplateColumns: gridTemplate,
                alignItems,
                gap: `var(--puck-gap, ${Number(gap) || 0}px)`,
                width: "100%",
                minWidth: 0,
              }}
            >
              {allSlots.slice(0, count).map((Col, index) => (
                <div
                  key={`col-${index}`}
                  style={{
                    minWidth: 0,
                    width: "100%",
                  }}
                >
                  <Col minEmptyHeight="80px" />
                </div>
              ))}
            </AnimationWrapper>
          </div>
        </>
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
      responsive: responsiveField([
        {
          key: "minItemWidth",
          label: "Min item width (px)",
          type: "number",
          min: 100,
          max: 600,
        },
        {
          key: "gap",
          label: "Grid gap (px)",
          type: "number",
          min: 0,
          max: 80,
        },
      ]),
      ...spacingFields,
      ...boxStyleFields,
      ...animationFields,
    },
    defaultProps: {
      content: [],
      minItemWidth: 280,
      gap: 24,
      responsive: {
        tablet: {
          gap: 16,
        },
        mobile: {
          minItemWidth: 240,
          gap: 12,
        },
      },
      ...commonDesignDefaults,
      ...animationDefaults,
    },
    render: ({
      content: Content,
      minItemWidth,
      gap,
      responsive,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      ...props
    }) => {
      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          minItemWidth: "--puck-min-item-width",
          gap: "--puck-gap",
        },
      });

      return (
        <>
          {respCss && <style>{respCss}</style>}
          <AnimationWrapper
            trigger={animTrigger}
            preset={animPreset}
            loop={animLoop}
            duration={animDuration}
            delay={animDelay}
            easing={animEasing}
            className={respClass}
            style={{
              ...buildBoxStyle(props),
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, var(--puck-min-item-width, ${minItemWidth || 280}px)), 1fr))`,
              gap: `var(--puck-gap, ${gap}px)`,
              width: "100%",
              minWidth: 0,
            }}
          >
            <Content minEmptyHeight="80px" />
          </AnimationWrapper>
        </>
      );
    },
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
      responsive: responsiveField([
        {
          key: "direction",
          label: "Flex direction",
          type: "select",
          options: [
            { label: "Column (Vertical stack)", value: "column" },
            { label: "Row (Horizontal)", value: "row" },
          ],
        },
        {
          key: "gap",
          label: "Gap (px)",
          type: "number",
          min: 0,
          max: 100,
        },
        {
          key: "align",
          label: "Align items",
          type: "select",
          options: VERTICAL_ALIGN_OPTIONS,
        },
      ]),
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
      responsive: {},
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
      responsive,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
      ...props
    }) => {
      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          direction: "--puck-flex-direction",
          gap: "--puck-gap",
          align: "--puck-align-items",
        },
      });

      return (
        <>
          {respCss && <style>{respCss}</style>}
          <AnimationWrapper
            trigger={animTrigger}
            preset={animPreset}
            loop={animLoop}
            duration={animDuration}
            delay={animDelay}
            easing={animEasing}
            className={respClass}
            style={{
              ...buildBoxStyle(props),
              display: "flex",
              flexDirection: `var(--puck-flex-direction, ${direction})`,
              flexWrap: wrap,
              justifyContent: justify,
              alignItems: `var(--puck-align-items, ${align})`,
              gap: `var(--puck-gap, ${gap}px)`,
              width: "100%",
              minWidth: 0,
            }}
          >
            <Content minEmptyHeight="60px" />
          </AnimationWrapper>
        </>
      );
    },
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
      responsive: responsiveField([
        {
          key: "height",
          label: "Height (px)",
          type: "number",
          min: 0,
          max: 300,
        },
      ]),
    },
    defaultProps: { height: 48, responsive: {} },
    render: ({ height, responsive }) => {
      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: { height: "--puck-spacer-height" },
      });
      return (
        <>
          {respCss && <style>{respCss}</style>}
          <div
            aria-hidden="true"
            className={respClass}
            style={{
              height: `var(--puck-spacer-height, ${height}px)`,
              width: "100%",
              pointerEvents: "none",
            }}
          />
        </>
      );
    },
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
