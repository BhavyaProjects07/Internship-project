"use client";

import React from "react";
import "./animation/animation.css";

import { FONT_FAMILY_OPTIONS } from "./tokens/index.js";
import { selectField, textField, radioField, colorField } from "./fields/helpers.js";

import { layoutComponents } from "./components/layoutComponents.jsx";
import { typographyComponents } from "./components/typographyComponents.jsx";
import { actionComponents } from "./components/actionComponents.jsx";
import { mediaComponents } from "./components/mediaComponents.jsx";
import { contentComponents } from "./components/contentComponents.jsx";
import { navigationComponents } from "./components/navigationComponents.jsx";
import { marketingComponents } from "./components/marketingComponents.jsx";
import { formComponents } from "./components/formComponents.jsx";
import { industryComponents } from "./components/industryComponents.jsx";

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
      contentWidth: selectField("Content container width", [
        { label: "Narrow (760px)", value: "760px" },
        { label: "Standard (1140px)", value: "1140px" },
        { label: "Wide (1320px)", value: "1320px" },
        { label: "Extra Wide (1536px)", value: "1536px" },
        { label: "Full width (100%)", value: "100%" },
      ]),
      fontFamily: selectField("Global font family", FONT_FAMILY_OPTIONS),
    },
    defaultProps: {
      title: "Untitled Page",
      backgroundColor: "#ffffff",
      backgroundGradient: false,
      gradientFrom: "#ffffff",
      gradientTo: "#f8fafc",
      contentWidth: "100%",
      fontFamily: "inherit",
    },
    render: ({
      children,
      backgroundColor,
      backgroundGradient,
      gradientFrom,
      gradientTo,
      contentWidth,
      fontFamily,
    }) => {
      const rootBgColor = backgroundColor || "#ffffff";
      const rootBgImage = backgroundGradient
        ? `linear-gradient(180deg, ${gradientFrom || "#ffffff"}, ${gradientTo || "#f8fafc"})`
        : undefined;

      return (
        <div
          style={{
            boxSizing: "border-box",
            backgroundColor: rootBgColor,
            backgroundImage: rootBgImage,
            fontFamily: fontFamily || "inherit",
            width: "100%",
            minWidth: 0,
            minHeight: "100%",
            paddingBottom: "120px",
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              width: "100%",
              maxWidth: contentWidth || "100%",
              minWidth: 0,
              marginInline: "auto",
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
        "Grid",
        "Stack",
        "Spacer",
        "Divider",
        "BackgroundWrapper",
      ],
      defaultExpanded: true,
    },
    hero: {
      title: "Hero & Header",
      components: ["Hero", "Navbar"],
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