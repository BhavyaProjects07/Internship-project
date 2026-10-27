"use client";

import React from "react";
import "./animation/animation.css";

import { FONT_FAMILY_OPTIONS } from "./tokens/index.js";
import {
  selectField,
  textField,
  radioField,
  colorField,
  responsiveField,
} from "./fields/helpers.js";

import { layoutComponents } from "./components/layoutComponents.jsx";
import { typographyComponents } from "./components/typographyComponents.jsx";
import { actionComponents } from "./components/actionComponents.jsx";
import { mediaComponents } from "./components/mediaComponents.jsx";
import { contentComponents } from "./components/contentComponents.jsx";
import { navigationComponents } from "./components/navigationComponents.jsx";
import { marketingComponents } from "./components/marketingComponents.jsx";
import { formComponents } from "./components/formComponents.jsx";
import { industryComponents } from "./components/industryComponents.jsx";

export const DEFAULT_PAGE_RESPONSIVE = {
  desktop: {
    maxWidth: "1280px",
    paddingX: "24px",
    paddingY: "40px",
    baseFontSize: "16px",
  },
  tablet: {
    maxWidth: "768px",
    paddingX: "20px",
    paddingY: "32px",
    baseFontSize: "15px",
  },
  mobile: {
    maxWidth: "100%",
    paddingX: "16px",
    paddingY: "24px",
    baseFontSize: "14px",
  },
};

/**
 * Production-Grade Visual Website Builder Puck Configuration
 *
 * Architecture:
 * - Fully modularized component registries
 * - GPU-accelerated declarative animation runtime
 * - Shared design tokens and responsive layout utilities
 * - 100% backward compatible with existing saved templates and user websites
 */
export const puckConfig = {
  root: {
    fields: {
      title: textField("Page title"),
      backgroundColor: colorField("Page background"),
      backgroundGradient: radioField("Enable gradient", [
        { label: "Disabled", value: false },
        { label: "Enabled", value: true },
      ]),
      gradientFrom: colorField("Gradient color 1"),
      gradientTo: colorField("Gradient color 2"),
      fontFamily: selectField("Global font family", FONT_FAMILY_OPTIONS),
      responsive: responsiveField([
        {
          key: "maxWidth",
          label: "Page Container Width",
          type: "select",
          options: [
            { label: "Full width (100%)", value: "100%" },
            { label: "Extra Wide (1536px)", value: "1536px" },
            { label: "Wide (1440px)", value: "1440px" },
            { label: "Standard (1280px)", value: "1280px" },
            { label: "Compact (1024px)", value: "1024px" },
            { label: "Narrow (768px)", value: "768px" },
          ],
        },
        {
          key: "paddingX",
          label: "Page Horizontal Margins / Gutters",
          type: "select",
          options: [
            { label: "Edge-to-Edge (0px)", value: "0px" },
            { label: "Compact (12px)", value: "12px" },
            { label: "Standard Mobile (16px)", value: "16px" },
            { label: "Standard Desktop (24px)", value: "24px" },
            { label: "Spacious (32px)", value: "32px" },
            { label: "Editorial Wide (48px)", value: "48px" },
          ],
        },
        {
          key: "paddingY",
          label: "Page Vertical Spacing",
          type: "select",
          options: [
            { label: "None (0px)", value: "0px" },
            { label: "Compact (16px)", value: "16px" },
            { label: "Moderate (24px)", value: "24px" },
            { label: "Standard (40px)", value: "40px" },
            { label: "Spacious (56px)", value: "56px" },
            { label: "Hero Large (64px)", value: "64px" },
          ],
        },
        {
          key: "baseFontSize",
          label: "Base Typography Scale",
          type: "select",
          options: [
            { label: "Compact (14px)", value: "14px" },
            { label: "Clean / Modern (15px)", value: "15px" },
            { label: "Standard (16px)", value: "16px" },
            { label: "Editorial / Spacious (18px)", value: "18px" },
          ],
        },
      ]),
    },
    defaultProps: {
      title: "Untitled Page",
      backgroundColor: "#ffffff",
      backgroundGradient: false,
      gradientFrom: "#ffffff",
      gradientTo: "#f8fafc",
      fontFamily: "inherit",
      responsive: DEFAULT_PAGE_RESPONSIVE,
    },
    render: ({
      children,
      backgroundColor,
      backgroundGradient,
      gradientFrom,
      gradientTo,
      contentWidth,
      fontFamily,
      responsive,
    }) => {
      const rootBgColor = backgroundColor || "#ffffff";
      const rootBgImage = backgroundGradient
        ? `linear-gradient(180deg, ${gradientFrom || "#ffffff"}, ${gradientTo || "#f8fafc"})`
        : undefined;

      const pageResponsive = responsive || DEFAULT_PAGE_RESPONSIVE;
      const desktop = pageResponsive.desktop || {};
      const tablet = pageResponsive.tablet || {};
      const mobile = pageResponsive.mobile || {};

      const desktopMaxWidth = desktop.maxWidth || contentWidth || "1280px";
      const tabletMaxWidth = tablet.maxWidth || "768px";
      const mobileMaxWidth = mobile.maxWidth || "100%";

      const desktopPaddingX = desktop.paddingX || "24px";
      const tabletPaddingX = tablet.paddingX || "20px";
      const mobilePaddingX = mobile.paddingX || "16px";

      const desktopPaddingY = desktop.paddingY || "40px";
      const tabletPaddingY = tablet.paddingY || "32px";
      const mobilePaddingY = mobile.paddingY || "24px";

      const desktopFontSize = desktop.baseFontSize || "16px";
      const tabletFontSize = tablet.baseFontSize || "15px";
      const mobileFontSize = mobile.baseFontSize || "14px";

      return (
        <div
          className="website-page-root"
          style={{
            boxSizing: "border-box",
            backgroundColor: rootBgColor,
            backgroundImage: rootBgImage,
            fontFamily: fontFamily || "inherit",
            width: "100%",
            minWidth: 0,
            minHeight: "100%",
            paddingBottom: "120px",
            "--page-max-width-desktop": desktopMaxWidth,
            "--page-max-width-tablet": tabletMaxWidth,
            "--page-max-width-mobile": mobileMaxWidth,
            "--page-padding-x-desktop": desktopPaddingX,
            "--page-padding-x-tablet": tabletPaddingX,
            "--page-padding-x-mobile": mobilePaddingX,
            "--page-padding-y-desktop": desktopPaddingY,
            "--page-padding-y-tablet": tabletPaddingY,
            "--page-padding-y-mobile": mobilePaddingY,
            "--page-font-size-desktop": desktopFontSize,
            "--page-font-size-tablet": tabletFontSize,
            "--page-font-size-mobile": mobileFontSize,
          }}
        >
          <div
            className="website-page-container"
            style={{
              boxSizing: "border-box",
              width: "100%",
              maxWidth: desktopMaxWidth,
              minWidth: 0,
              marginInline: "auto",
              paddingInline: desktopPaddingX,
              paddingBlock: desktopPaddingY,
              fontSize: desktopFontSize,
            }}
          >
            {children}
          </div>
        </div>
      );
    },
  },

  categories: {
    layout: {
      title: "Structure & Layout",
      components: [
        "Section",
        "Container",
        "Columns",
        "FlexColumns",
        "FreeBox",
        "AngledSection",
        "Grid",
        "Stack",
        "Spacer",
        "Divider",
        "BackgroundWrapper",
      ],
      defaultExpanded: true,
    },
    navigation: {
      title: "Navigation & Menus",
      components: ["Navbar", "AnnouncementBar", "Footer"],
      defaultExpanded: true,
    },
    hero: {
      title: "Hero & Showcases",
      components: ["Hero", "ProductHero", "ArticleHero"],
      defaultExpanded: true,
    },
    typography: {
      title: "Typography",
      components: ["Heading", "Text", "RichText", "Label", "Blockquote"],
      defaultExpanded: true,
    },
    interactive: {
      title: "Marketing & Conversion",
      components: [
        "CallToAction",
        "PricingTable",
        "ComparisonTable",
        "Testimonial",
        "FeatureCard",
        "StatsCounter",
        "Accordion",
        "Tabs",
        "LogoCloud",
        "Timeline",
        "TeamMember",
        "Countdown",
      ],
      defaultExpanded: true,
    },
    media: {
      title: "Media & Embeds",
      components: ["Image", "ImageGallery", "Video", "IconBox", "MapEmbed", "CodeSnippet"],
      defaultExpanded: true,
    },
    actions: {
      title: "Actions & Buttons",
      components: ["Button", "ButtonGroup", "Link"],
      defaultExpanded: true,
    },
    forms: {
      title: "Forms & Capture",
      components: ["ContactForm", "Newsletter"],
      defaultExpanded: true,
    },
    content: {
      title: "Content & Badges",
      components: ["Card", "Badge", "List", "AlertBanner"],
      defaultExpanded: true,
    },
    portfolio: {
      title: "Portfolio & Agency",
      components: ["ProjectCard", "SkillBar"],
      defaultExpanded: false,
    },
    saas: {
      title: "SaaS & Landing",
      components: ["ProductHero"],
      defaultExpanded: false,
    },
    blog: {
      title: "Editorial & Blog",
      components: ["ArticleHero", "BlogCard"],
      defaultExpanded: false,
    },
    ecommerce: {
      title: "Storefront Presentation",
      components: ["ProductGrid", "ProductCard", "PromoBanner"],
      defaultExpanded: false,
    },
  },

  components: {
    // Layout
    ...layoutComponents,

    // Typography
    ...typographyComponents,

    // Actions
    ...actionComponents,

    // Media
    ...mediaComponents,

    // Content
    ...contentComponents,

    // Navigation
    ...navigationComponents,

    // Marketing & Conversion
    ...marketingComponents,

    // Forms
    ...formComponents,

    // Industry-specific (Portfolio, SaaS, Blog, E-commerce visual presentation)
    ...industryComponents,
  },
};

export default puckConfig;