"use client";

import React, { useState } from "react";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { spacingFields } from "../fields/boxStyleFields.js";
import { selectField, numberField, textField, textareaField, radioField, colorField, arrayField } from "../fields/helpers.js";
import { getHoverClass } from "../layout/styleBuilders.js";
import { RADIUS_OPTIONS, HOVER_EFFECT_OPTIONS, ALIGNMENT_OPTIONS } from "../tokens/index.js";
import { RenderIcon } from "./icons.jsx";

export const industryComponents = {
  // ==========================================================================
  // PORTFOLIO & AGENCY COMPONENTS
  // ==========================================================================

  // ------------------------------------------------------------------------
  // PROJECT CARD
  // ------------------------------------------------------------------------
  ProjectCard: {
    label: "Project Card (Portfolio)",
    fields: {
      title: textField("Project title"),
      category: textField("Project category / industry"),
      year: textField("Year completed"),
      client: textField("Client / Brand name"),
      summary: textareaField("Short project summary"),
      imageUrl: textField("Project cover image URL"),
      linkUrl: textField("Case study link URL"),
      linkText: textField("Link label"),
      outcomeMetric: textField("Key outcome metric (e.g. +140% Conversions)"),
      cardBg: colorField("Card background color"),
      borderColor: colorField("Card border color"),
      titleColor: colorField("Title color"),
      summaryColor: colorField("Summary text color"),
      categoryColor: colorField("Category tag color"),
      metricBg: colorField("Outcome badge background"),
      metricTextColor: colorField("Outcome badge text color"),
      linkColor: colorField("Link color"),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      hoverEffect: selectField("Hover micro-animation", HOVER_EFFECT_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      title: "Fintech Platform Architecture",
      category: "Fintech & SaaS",
      year: "2026",
      client: "Aura Capital",
      summary: "End-to-end redesign of enterprise wealth management platform handling $4B+ in daily settlement.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
      linkUrl: "#case-study",
      linkText: "View Case Study",
      outcomeMetric: "+320% User Engagement",
      cardBg: "#ffffff",
      borderColor: "#e2e8f0",
      titleColor: "#0f172a",
      summaryColor: "#64748b",
      categoryColor: "#6366f1",
      metricBg: "rgba(15, 23, 42, 0.85)",
      metricTextColor: "#10b981",
      linkColor: "#4f46e5",
      borderRadius: 16,
      hoverEffect: "lift-md",
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      title,
      category,
      year,
      client,
      summary,
      imageUrl,
      linkUrl,
      linkText,
      outcomeMetric,
      cardBg = "#ffffff",
      borderColor = "#e2e8f0",
      titleColor = "#0f172a",
      summaryColor = "#64748b",
      categoryColor = "#6366f1",
      metricBg = "rgba(15, 23, 42, 0.85)",
      metricTextColor = "#10b981",
      linkColor = "#4f46e5",
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
        as="article"
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        className={getHoverClass(hoverEffect)}
        style={{
          borderRadius: `${borderRadius}px`,
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginTop,
          marginBottom,
        }}
      >
        {imageUrl && (
          <div style={{ width: "100%", height: 260, overflow: "hidden", position: "relative" }}>
            <img
              src={imageUrl}
              alt={title || "Project image"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {outcomeMetric && (
              <span
                style={{
                  position: "absolute",
                  bottom: 14,
                  right: 14,
                  padding: "6px 12px",
                  borderRadius: 999,
                  backgroundColor: metricBg,
                  backdropFilter: "blur(8px)",
                  color: metricTextColor,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {outcomeMetric}
              </span>
            )}
          </div>
        )}
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: categoryColor, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {category}
            </span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{client} &bull; {year}</span>
          </div>
          <h3 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 700, color: titleColor }}>
            {title}
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: summaryColor, lineHeight: 1.6 }}>
            {summary}
          </p>
          {linkText && (
            <a
              href={linkUrl || "#"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 700,
                color: linkColor,
                textDecoration: "none",
              }}
            >
              <span>{linkText}</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // SKILL BAR
  // ------------------------------------------------------------------------
  SkillBar: {
    label: "Skill / Capability Bar",
    fields: {
      skillName: textField("Skill / Expertise name"),
      percentage: numberField("Proficiency percentage", 0, 100),
      category: textField("Category badge"),
      barColor: colorField("Fill progress color"),
      trackColor: colorField("Track background color"),
      titleColor: colorField("Skill label color"),
      pctColor: colorField("Percentage number color"),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      skillName: "Next.js & React Architecture",
      percentage: 95,
      category: "Frontend & Full Stack",
      barColor: "#4f46e5",
      trackColor: "#e2e8f0",
      titleColor: "#0f172a",
      pctColor: "#4f46e5",
      marginTop: "8px",
      marginBottom: "16px",
      ...animationDefaults,
    },
    render: ({
      skillName,
      percentage = 90,
      category,
      barColor = "#4f46e5",
      trackColor = "#e2e8f0",
      titleColor = "#0f172a",
      pctColor = "#4f46e5",
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const pct = Math.min(100, Math.max(0, parseInt(percentage, 10) || 0));

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: titleColor }}>
              {skillName}
              {category && <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, color: "#64748b" }}>({category})</span>}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: pctColor }}>{pct}%</span>
          </div>
          <div
            style={{
              width: "100%",
              height: 10,
              borderRadius: 999,
              backgroundColor: trackColor,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                borderRadius: 999,
                backgroundColor: barColor,
                transition: "width 800ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        </AnimationWrapper>
      );
    },
  },

  // ==========================================================================
  // SAAS & PRODUCT COMPONENTS
  // ==========================================================================

  // ------------------------------------------------------------------------
  // PRODUCT HERO (WITH APP FRAME / BROWSER MOCKUP)
  // ------------------------------------------------------------------------
  ProductHero: {
    label: "Product Hero (App Frame)",
    fields: {
      badge: textField("Top announcement badge"),
      title: textField("Product headline"),
      description: textareaField("Value proposition"),
      primaryCta: textField("Primary CTA button label"),
      primaryCtaUrl: textField("Primary CTA link"),
      secondaryCta: textField("Secondary CTA button label"),
      secondaryCtaUrl: textField("Secondary CTA link"),
      screenshotUrl: textField("App screenshot or UI frame URL"),
      windowTitle: textField("Browser window tab title"),
      badgeBg: colorField("Announcement badge background"),
      badgeTextColor: colorField("Announcement badge text color"),
      titleColor: colorField("Headline color"),
      descColor: colorField("Description text color"),
      primaryBtnBg: colorField("Primary CTA background"),
      primaryBtnColor: colorField("Primary CTA text color"),
      secondaryBtnBg: colorField("Secondary CTA background"),
      secondaryBtnColor: colorField("Secondary CTA text color"),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      badge: "PLATFORM V3.0 NOW LIVE",
      title: "The Operating System for Visual Web Applications",
      description: "Design, animate, and deploy production-grade visual websites with zero boilerplate. Built for modern product teams.",
      primaryCta: "Start Free Trial",
      primaryCtaUrl: "#signup",
      secondaryCta: "View Interactive Demo",
      secondaryCtaUrl: "#demo",
      screenshotUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      windowTitle: "app.acme.com/analytics",
      badgeBg: "#eff6ff",
      badgeTextColor: "#1d4ed8",
      titleColor: "#0f172a",
      descColor: "#475569",
      primaryBtnBg: "#0f172a",
      primaryBtnColor: "#ffffff",
      secondaryBtnBg: "#f1f5f9",
      secondaryBtnColor: "#0f172a",
      marginTop: "32px",
      marginBottom: "48px",
      ...animationDefaults,
    },
    render: ({
      badge,
      title,
      description,
      primaryCta,
      primaryCtaUrl,
      secondaryCta,
      secondaryCtaUrl,
      screenshotUrl,
      windowTitle,
      badgeBg = "#eff6ff",
      badgeTextColor = "#1d4ed8",
      titleColor = "#0f172a",
      descColor = "#475569",
      primaryBtnBg = "#0f172a",
      primaryBtnColor = "#ffffff",
      secondaryBtnBg = "#f1f5f9",
      secondaryBtnColor = "#0f172a",
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
        {badge && (
          <span
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 999,
              backgroundColor: badgeBg,
              color: badgeTextColor,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {badge}
          </span>
        )}
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800,
            letterSpacing: -1.2,
            color: titleColor,
            margin: "0 auto 20px",
            maxWidth: 820,
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: descColor,
              margin: "0 auto 32px",
              maxWidth: 620,
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
          {primaryCta && (
            <a
              href={primaryCtaUrl || "#"}
              className="hover-lift-sm"
              style={{
                padding: "14px 28px",
                borderRadius: 12,
                backgroundColor: primaryBtnBg,
                color: primaryBtnColor,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 8px 20px -4px rgba(15, 23, 42, 0.2)",
              }}
            >
              {primaryCta}
            </a>
          )}
          {secondaryCta && (
            <a
              href={secondaryCtaUrl || "#"}
              className="hover-lift-sm"
              style={{
                padding: "14px 28px",
                borderRadius: 12,
                backgroundColor: secondaryBtnBg,
                color: secondaryBtnColor,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                border: "1px solid #cbd5e1",
              }}
            >
              {secondaryCta}
            </a>
          )}
        </div>

        {/* Browser Mockup Window */}
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            borderRadius: 16,
            border: "1px solid #cbd5e1",
            boxShadow: "0 25px 60px -15px rgba(0,0,0,0.15)",
            overflow: "hidden",
            backgroundColor: "#f8fafc",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              backgroundColor: "#f1f5f9",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#10b981" }} />
            </div>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{windowTitle}</span>
            <div style={{ width: 40 }} />
          </div>
          {screenshotUrl && (
            <img
              src={screenshotUrl}
              alt="Application Interface"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          )}
        </div>
      </AnimationWrapper>
    ),
  },

  // ==========================================================================
  // EDITORIAL & BLOG COMPONENTS
  // ==========================================================================

  // ------------------------------------------------------------------------
  // ARTICLE HERO
  // ------------------------------------------------------------------------
  ArticleHero: {
    label: "Article Hero (Blog Header)",
    fields: {
      category: textField("Article category"),
      title: textField("Article headline"),
      readTime: textField("Estimated reading time (e.g. 6 min read)"),
      publishDate: textField("Publish date"),
      authorName: textField("Author full name"),
      authorRole: textField("Author role / title"),
      authorAvatar: textField("Author avatar image URL"),
      heroImageUrl: textField("Featured hero image URL"),
      categoryColor: colorField("Category label color"),
      titleColor: colorField("Headline color"),
      metaColor: colorField("Meta date/read-time color"),
      authorColor: colorField("Author name color"),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      category: "ARCHITECTURE & DESIGN",
      title: "Building Deterministic Animation Systems with Modern CSS & Observers",
      readTime: "7 min read",
      publishDate: "October 24, 2026",
      authorName: "Marcus Vance",
      authorRole: "Principal Systems Engineer",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      heroImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      categoryColor: "#4f46e5",
      titleColor: "#0f172a",
      metaColor: "#64748b",
      authorColor: "#0f172a",
      marginTop: "24px",
      marginBottom: "40px",
      ...animationDefaults,
    },
    render: ({
      category,
      title,
      readTime,
      publishDate,
      authorName,
      authorRole,
      authorAvatar,
      heroImageUrl,
      categoryColor = "#4f46e5",
      titleColor = "#0f172a",
      metaColor = "#64748b",
      authorColor = "#0f172a",
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
        as="header"
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        style={{ width: "100%", maxWidth: 880, margin: "0 auto", marginTop, marginBottom }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: categoryColor,
            }}
          >
            {category}
          </span>
          <span style={{ color: "#cbd5e1" }}>&bull;</span>
          <span style={{ fontSize: 13, color: metaColor }}>{publishDate}</span>
          <span style={{ color: "#cbd5e1" }}>&bull;</span>
          <span style={{ fontSize: 13, color: metaColor }}>{readTime}</span>
        </div>
        <h1
          style={{
            fontSize: "clamp(30px, 4.5vw, 48px)",
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: -1,
            color: titleColor,
            margin: "0 0 24px",
          }}
        >
          {title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          {authorAvatar && (
            <img
              src={authorAvatar}
              alt={authorName}
              style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
            />
          )}
          <div>
            <h4 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 700, color: authorColor }}>
              {authorName}
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: metaColor }}>{authorRole}</p>
          </div>
        </div>
        {heroImageUrl && (
          <div style={{ width: "100%", borderRadius: 20, overflow: "hidden", maxHeight: 460 }}>
            <img
              src={heroImageUrl}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}
      </AnimationWrapper>
    ),
  },

  // ------------------------------------------------------------------------
  // BLOG CARD
  // ------------------------------------------------------------------------
  BlogCard: {
    label: "Blog Post Card",
    fields: {
      title: textField("Article title"),
      excerpt: textareaField("Excerpt summary"),
      category: textField("Category badge"),
      date: textField("Publish date"),
      readTime: textField("Read time"),
      imageUrl: textField("Thumbnail image URL"),
      authorName: textField("Author name"),
      postUrl: textField("Article destination URL"),
      cardBg: colorField("Card background color"),
      borderColor: colorField("Border color"),
      titleColor: colorField("Title color"),
      excerptColor: colorField("Excerpt text color"),
      categoryColor: colorField("Category badge color"),
      authorColor: colorField("Author name color"),
      linkColor: colorField("Read article link color"),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      hoverEffect: selectField("Hover micro-animation", HOVER_EFFECT_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      title: "How Visual Editors Accelerate Enterprise Product Velocity",
      excerpt: "Analyzing the transition from code-only staging environments to visual component manipulation for distributed design organizations.",
      category: "Engineering",
      date: "Oct 20, 2026",
      readTime: "5 min read",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      authorName: "Elena Rostova",
      postUrl: "#article",
      cardBg: "#ffffff",
      borderColor: "#e2e8f0",
      titleColor: "#0f172a",
      excerptColor: "#64748b",
      categoryColor: "#6366f1",
      authorColor: "#334155",
      linkColor: "#4f46e5",
      borderRadius: 16,
      hoverEffect: "lift-md",
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      title,
      excerpt,
      category,
      date,
      readTime,
      imageUrl,
      authorName,
      postUrl,
      cardBg = "#ffffff",
      borderColor = "#e2e8f0",
      titleColor = "#0f172a",
      excerptColor = "#64748b",
      categoryColor = "#6366f1",
      authorColor = "#334155",
      linkColor = "#4f46e5",
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
        as="article"
        trigger={animTrigger}
        preset={animPreset}
        loop={animLoop}
        duration={animDuration}
        delay={animDelay}
        easing={animEasing}
        className={getHoverClass(hoverEffect)}
        style={{
          borderRadius: `${borderRadius}px`,
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          marginTop,
          marginBottom,
        }}
      >
        {imageUrl && (
          <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
            <img
              src={imageUrl}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: categoryColor, textTransform: "uppercase" }}>
              {category}
            </span>
            <span style={{ color: "#cbd5e1" }}>&bull;</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{date} &bull; {readTime}</span>
          </div>
          <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: titleColor, lineHeight: 1.4 }}>
            {title}
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: excerptColor, lineHeight: 1.6 }}>
            {excerpt}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: authorColor }}>By {authorName}</span>
            <a
              href={postUrl || "#"}
              style={{ fontSize: 13, fontWeight: 700, color: linkColor, textDecoration: "none" }}
            >
              Read Article &rarr;
            </a>
          </div>
        </div>
      </AnimationWrapper>
    ),
  },

  // ==========================================================================
  // E-COMMERCE & STOREFRONT PRESENTATION COMPONENTS
  // ==========================================================================

  // ------------------------------------------------------------------------
  // PRODUCT GRID (MULTIPLE PRODUCTS - ROWS, GRIDS, CAROUSELS, CUSTOMIZABLE)
  // ------------------------------------------------------------------------
  ProductGrid: {
    label: "Product Grid / Showcase (Multiple Cards)",
    fields: {
      sectionTitle: textField("Section headline"),
      sectionSubtitle: textareaField("Section description / eyebrow"),
      headerAlignment: selectField("Header text alignment", ALIGNMENT_OPTIONS),
      showViewAll: radioField("Show 'View All' link in header", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      viewAllText: textField("View all link label"),
      viewAllUrl: textField("View all link destination"),
      layout: selectField("Layout presentation", [
        { label: "Responsive Grid (Auto Columns)", value: "grid" },
        { label: "Horizontal Scroll Row / Carousel", value: "row" },
        { label: "Compact List Row", value: "compact" },
      ]),
      columns: selectField("Grid columns (Desktop)", [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
        { label: "4 Columns", value: "4" },
        { label: "5 Columns", value: "5" },
        { label: "6 Columns", value: "6" },
      ]),
      gap: selectField("Spacing between cards", [
        { label: "Compact (12px)", value: "12px" },
        { label: "Standard (20px)", value: "20px" },
        { label: "Comfortable (28px)", value: "28px" },
        { label: "Spacious (36px)", value: "36px" },
      ]),
      showCategoryFilter: radioField("Show category filter tabs", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      filterCategories: textField("Category chips (comma-separated, e.g. All, Ceramics, Lighting, Decor)"),
      cardBg: colorField("Card background color"),
      cardBorderColor: colorField("Card border color"),
      cardRadius: selectField("Card corner radius", RADIUS_OPTIONS),
      titleColor: colorField("Product title color"),
      priceColor: colorField("Current price color"),
      originalPriceColor: colorField("Original price strike color"),
      badgeBg: colorField("Ribbon badge background"),
      badgeTextColor: colorField("Ribbon badge text color"),
      buttonBg: colorField("Action button background"),
      buttonTextColor: colorField("Action button text color"),
      starColor: colorField("Star rating color"),
      imageHeight: numberField("Product image height (px)", 120, 600, 10),
      imageFit: selectField("Image display mode", [
        { label: "Cover (Fill card width)", value: "cover" },
        { label: "Contain (Fit full image)", value: "contain" },
      ]),
      hoverEffect: selectField("Card hover micro-animation", HOVER_EFFECT_OPTIONS),
      products: {
        type: "array",
        label: "Product Catalog Items",
        arrayFields: {
          name: textField("Product name"),
          category: textField("Category tag"),
          price: textField("Current price (e.g. $129)"),
          originalPrice: textField("Original price (e.g. $169)"),
          badge: textField("Ribbon badge (e.g. 25% OFF, NEW)"),
          rating: numberField("Star rating (1-5)", 1, 5),
          reviewsCount: numberField("Review count", 0, 5000),
          inStock: selectField("Inventory status", [
            { label: "In Stock", value: "in-stock" },
            { label: "Low Stock", value: "low-stock" },
            { label: "Out of Stock", value: "out-of-stock" },
            { label: "Hidden", value: "none" },
          ]),
          swatches: textField("Color swatches (comma-separated hex codes, e.g. #0f172a,#e2e8f0,#4f46e5)"),
          imageUrl: textField("Product image URL"),
          buttonText: textField("Action button text"),
          buttonUrl: textField("Product link URL"),
        },
        defaultItemProps: {
          name: "Minimalist Stoneware Carafe",
          category: "Ceramics",
          price: "$88",
          originalPrice: "$110",
          badge: "NEW",
          rating: 5,
          reviewsCount: 38,
          inStock: "in-stock",
          swatches: "#0f172a,#d97706,#4f46e5",
          imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
          buttonText: "Add to Bag",
          buttonUrl: "#shop",
        },
        getItemSummary: (it) => (it && it.name ? `${it.name} (${it.price || ""})` : "Product Item"),
      },
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      sectionTitle: "Curated Seasonal Collection",
      sectionSubtitle: "Handcrafted architectural pieces designed for timeless living spaces.",
      headerAlignment: "left",
      showViewAll: true,
      viewAllText: "Browse Complete Catalog",
      viewAllUrl: "#catalog",
      layout: "grid",
      columns: "4",
      gap: "24px",
      showCategoryFilter: true,
      filterCategories: "All, Ceramics, Lighting, Furniture, Accessories",
      cardBg: "#ffffff",
      cardBorderColor: "#e2e8f0",
      cardRadius: 16,
      titleColor: "#0f172a",
      priceColor: "#0f172a",
      originalPriceColor: "#94a3b8",
      badgeBg: "#0f172a",
      badgeTextColor: "#ffffff",
      buttonBg: "#0f172a",
      buttonTextColor: "#ffffff",
      starColor: "#f59e0b",
      imageHeight: 240,
      imageFit: "cover",
      hoverEffect: "lift-md",
      products: [
        {
          name: "Architectural Ceramic Vessel No. 04",
          category: "Ceramics",
          price: "$120",
          originalPrice: "$160",
          badge: "25% OFF",
          rating: 5,
          reviewsCount: 148,
          inStock: "in-stock",
          swatches: "#1e293b,#f1f5f9,#ca8a04",
          imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
          buttonText: "Quick View",
          buttonUrl: "#product-1",
        },
        {
          name: "Hand-Blown Smoked Glass Pendant",
          category: "Lighting",
          price: "$210",
          originalPrice: "",
          badge: "POPULAR",
          rating: 5,
          reviewsCount: 94,
          inStock: "in-stock",
          swatches: "#334155,#f59e0b",
          imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
          buttonText: "Quick View",
          buttonUrl: "#product-2",
        },
        {
          name: "Solid White Oak Floating Bench",
          category: "Furniture",
          price: "$480",
          originalPrice: "$550",
          badge: "LIMITED",
          rating: 5,
          reviewsCount: 62,
          inStock: "low-stock",
          swatches: "#d97706,#78350f,#1c1917",
          imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
          buttonText: "Quick View",
          buttonUrl: "#product-3",
        },
        {
          name: "Raw Terracotta Sculptural Vase",
          category: "Ceramics",
          price: "$95",
          originalPrice: "$125",
          badge: "",
          rating: 4,
          reviewsCount: 31,
          inStock: "in-stock",
          swatches: "#c2410c,#78350f",
          imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80",
          buttonText: "Quick View",
          buttonUrl: "#product-4",
        },
      ],
      marginTop: "24px",
      marginBottom: "48px",
      ...animationDefaults,
    },
    render: ({
      sectionTitle,
      sectionSubtitle,
      headerAlignment = "left",
      showViewAll,
      viewAllText,
      viewAllUrl,
      layout = "grid",
      columns = "4",
      gap = "24px",
      showCategoryFilter,
      filterCategories = "All, Ceramics, Lighting, Furniture, Accessories",
      cardBg = "#ffffff",
      cardBorderColor = "#e2e8f0",
      cardRadius = 16,
      titleColor = "#0f172a",
      priceColor = "#0f172a",
      originalPriceColor = "#94a3b8",
      badgeBg = "#0f172a",
      badgeTextColor = "#ffffff",
      buttonBg = "#0f172a",
      buttonTextColor = "#ffffff",
      starColor = "#f59e0b",
      imageHeight = 240,
      imageFit = "cover",
      hoverEffect = "lift-md",
      products = [],
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) => {
      const [selectedCat, setSelectedCat] = useState("All");

      const categoryList = filterCategories
        ? filterCategories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

      const filteredProducts =
        selectedCat === "All" || !selectedCat
          ? products
          : products.filter(
              (p) =>
                (p.category || "").toLowerCase() === selectedCat.toLowerCase()
            );

      const colCount = parseInt(columns, 10) || 4;

      return (
        <AnimationWrapper
          as="section"
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{ width: "100%", marginTop, marginBottom }}
        >
          {/* Section Header */}
          {(sectionTitle || sectionSubtitle || showViewAll) && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: headerAlignment === "center" ? "center" : "flex-end",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: showCategoryFilter && categoryList.length > 0 ? 20 : 32,
                textAlign: headerAlignment,
              }}
            >
              <div style={{ maxWidth: headerAlignment === "center" ? "100%" : 680, flex: 1 }}>
                {sectionSubtitle && (
                  <p
                    style={{
                      margin: "0 0 6px",
                      fontSize: 13,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      color: "#6366f1",
                    }}
                  >
                    {sectionSubtitle}
                  </p>
                )}
                {sectionTitle && (
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "clamp(24px, 3.5vw, 36px)",
                      fontWeight: 800,
                      letterSpacing: -0.8,
                      color: "#0f172a",
                      lineHeight: 1.2,
                    }}
                  >
                    {sectionTitle}
                  </h2>
                )}
              </div>
              {showViewAll && viewAllText && (
                <a
                  href={viewAllUrl || "#"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#4f46e5",
                    textDecoration: "none",
                  }}
                >
                  <span>{viewAllText}</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </div>
          )}

          {/* Interactive Category Filter Pills */}
          {showCategoryFilter && categoryList.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 32,
                justifyContent: headerAlignment === "center" ? "center" : "flex-start",
              }}
            >
              {categoryList.map((cat) => {
                const isActive = selectedCat.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCat(cat)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: isActive ? "1px solid #0f172a" : "1px solid #e2e8f0",
                      backgroundColor: isActive ? "#0f172a" : "#ffffff",
                      color: isActive ? "#ffffff" : "#475569",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Catalog Layout Container */}
          <div
            style={
              layout === "row"
                ? {
                    display: "flex",
                    overflowX: "auto",
                    gap,
                    paddingBottom: 16,
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                  }
                : layout === "compact"
                ? {
                    display: "flex",
                    flexDirection: "column",
                    gap,
                  }
                : {
                    display: "grid",
                    gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                    gap,
                  }
            }
          >
            {filteredProducts.map((prod, idx) => {
              const starCount = Math.min(5, Math.max(1, parseInt(prod.rating, 10) || 5));
              const swatchColors = prod.swatches
                ? prod.swatches
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s.startsWith("#") || s.startsWith("rgb"))
                : [];

              const inStock = prod.inStock || "in-stock";

              return (
                <div
                  key={`prod-item-${idx}`}
                  className={getHoverClass(hoverEffect)}
                  style={{
                    flex: layout === "row" ? `0 0 clamp(240px, ${100 / colCount}%, 340px)` : undefined,
                    scrollSnapAlign: layout === "row" ? "start" : undefined,
                    borderRadius: `${cardRadius}px`,
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorderColor}`,
                    overflow: "hidden",
                    display: layout === "compact" ? "flex" : "flex",
                    flexDirection: layout === "compact" ? "row" : "column",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                    position: "relative",
                  }}
                >
                  {/* Badge Ribbon */}
                  {prod.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        padding: "4px 10px",
                        borderRadius: 999,
                        backgroundColor: badgeBg,
                        color: badgeTextColor,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      {prod.badge}
                    </span>
                  )}

                  {/* Product Image */}
                  {prod.imageUrl && (
                    <div
                      style={{
                        width: layout === "compact" ? 180 : "100%",
                        height: layout === "compact" ? "auto" : imageHeight,
                        overflow: "hidden",
                        backgroundColor: "#f8fafc",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.name || "Product"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: imageFit,
                          display: "block",
                        }}
                      />
                    </div>
                  )}

                  {/* Product Content Details */}
                  <div
                    style={{
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                  >
                    <div>
                      {/* Category & Stock Pill */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {prod.category}
                        </span>
                        {inStock !== "none" && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              color:
                                inStock === "in-stock"
                                  ? "#16a34a"
                                  : inStock === "low-stock"
                                  ? "#d97706"
                                  : "#dc2626",
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor:
                                  inStock === "in-stock"
                                    ? "#16a34a"
                                    : inStock === "low-stock"
                                    ? "#d97706"
                                    : "#dc2626",
                              }}
                            />
                            {inStock === "in-stock"
                              ? "In Stock"
                              : inStock === "low-stock"
                              ? "Low Stock"
                              : "Sold Out"}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          margin: "0 0 8px",
                          fontSize: 16,
                          fontWeight: 700,
                          color: titleColor,
                          lineHeight: 1.35,
                        }}
                      >
                        {prod.name}
                      </h3>

                      {/* Star Rating */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                        <div style={{ display: "flex", gap: 2 }}>
                          {Array.from({ length: starCount }).map((_, i) => (
                            <RenderIcon key={`star-${idx}-${i}`} name="star" size={13} color={starColor} />
                          ))}
                        </div>
                        {prod.reviewsCount !== undefined && (
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>
                            ({prod.reviewsCount})
                          </span>
                        )}
                      </div>

                      {/* Color Swatches */}
                      {swatchColors.length > 0 && (
                        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 14 }}>
                          {swatchColors.map((swatch, sIdx) => (
                            <span
                              key={`swatch-${idx}-${sIdx}`}
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                backgroundColor: swatch,
                                border: "1px solid rgba(0,0,0,0.15)",
                                display: "inline-block",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                        paddingTop: 10,
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: priceColor }}>
                          {prod.price}
                        </span>
                        {prod.originalPrice && (
                          <span
                            style={{
                              fontSize: 13,
                              color: originalPriceColor,
                              textDecoration: "line-through",
                            }}
                          >
                            {prod.originalPrice}
                          </span>
                        )}
                      </div>
                      <a
                        href={prod.buttonUrl || "#"}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "8px 14px",
                          borderRadius: 8,
                          backgroundColor: buttonBg,
                          color: buttonTextColor,
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        {prod.buttonText || "View"}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // PRODUCT CARD (SINGLE PRODUCT / HERO PRESENTATION)
  // ------------------------------------------------------------------------
  ProductCard: {
    label: "Product Card (Catalog Presentation)",
    fields: {
      name: textField("Product title"),
      category: textField("Category badge"),
      price: textField("Current price (e.g. $149)"),
      originalPrice: textField("Original price (e.g. $199)"),
      badge: textField("Ribbon tag (e.g. 25% OFF, NEW)"),
      rating: numberField("Rating (1-5 stars)", 1, 5),
      reviewsCount: numberField("Review count", 0, 5000),
      inStock: selectField("Inventory status", [
        { label: "In Stock", value: "in-stock" },
        { label: "Low Stock", value: "low-stock" },
        { label: "Out of Stock", value: "out-of-stock" },
        { label: "Hidden", value: "none" },
      ]),
      swatches: textField("Color swatches (comma-separated hex, e.g. #000,#fff,#6366f1)"),
      imageUrl: textField("Product photo URL"),
      imageHeight: numberField("Product image height (px)", 140, 600, 10),
      imageFit: selectField("Image display mode", [
        { label: "Cover (Fill)", value: "cover" },
        { label: "Contain (Fit full)", value: "contain" },
      ]),
      buttonText: textField("Action button text"),
      buttonUrl: textField("Product page link"),
      cardBg: colorField("Card background color"),
      cardBorderColor: colorField("Card border color"),
      titleColor: colorField("Title text color"),
      categoryColor: colorField("Category label color"),
      priceColor: colorField("Current price color"),
      originalPriceColor: colorField("Original price strike color"),
      badgeBg: colorField("Ribbon badge background"),
      badgeTextColor: colorField("Ribbon badge text color"),
      buttonBg: colorField("Action button background"),
      buttonTextColor: colorField("Action button text color"),
      starColor: colorField("Star rating color"),
      borderRadius: selectField("Corner radius", RADIUS_OPTIONS),
      hoverEffect: selectField("Hover micro-animation", HOVER_EFFECT_OPTIONS),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      name: "Architectural Ceramic Vessel No. 04",
      category: "Home & Ceramics",
      price: "$120",
      originalPrice: "$160",
      badge: "LIMITED RELEASE",
      rating: 5,
      reviewsCount: 148,
      inStock: "in-stock",
      swatches: "#0f172a,#f1f5f9,#ca8a04",
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
      imageHeight: 260,
      imageFit: "cover",
      buttonText: "View Product",
      buttonUrl: "#product",
      cardBg: "#ffffff",
      cardBorderColor: "#e2e8f0",
      titleColor: "#0f172a",
      categoryColor: "#64748b",
      priceColor: "#0f172a",
      originalPriceColor: "#94a3b8",
      badgeBg: "#0f172a",
      badgeTextColor: "#ffffff",
      buttonBg: "#0f172a",
      buttonTextColor: "#ffffff",
      starColor: "#f59e0b",
      borderRadius: 16,
      hoverEffect: "lift-md",
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      name,
      category,
      price,
      originalPrice,
      badge,
      rating = 5,
      reviewsCount = 148,
      inStock = "in-stock",
      swatches = "",
      imageUrl,
      imageHeight = 260,
      imageFit = "cover",
      buttonText,
      buttonUrl,
      cardBg = "#ffffff",
      cardBorderColor = "#e2e8f0",
      titleColor = "#0f172a",
      categoryColor = "#64748b",
      priceColor = "#0f172a",
      originalPriceColor = "#94a3b8",
      badgeBg = "#0f172a",
      badgeTextColor = "#ffffff",
      buttonBg = "#0f172a",
      buttonTextColor = "#ffffff",
      starColor = "#f59e0b",
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
      const starCount = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
      const swatchColors = swatches
        ? swatches
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.startsWith("#") || s.startsWith("rgb"))
        : [];

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
            borderRadius: `${borderRadius}px`,
            backgroundColor: cardBg,
            border: `1px solid ${cardBorderColor}`,
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            marginTop,
            marginBottom,
            position: "relative",
          }}
        >
          {badge && (
            <span
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                zIndex: 2,
                padding: "4px 10px",
                borderRadius: 999,
                backgroundColor: badgeBg,
                color: badgeTextColor,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {badge}
            </span>
          )}
          {imageUrl && (
            <div style={{ width: "100%", height: imageHeight, overflow: "hidden", backgroundColor: "#f8fafc" }}>
              <img
                src={imageUrl}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: imageFit, display: "block" }}
              />
            </div>
          )}
          <div style={{ padding: 22 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: categoryColor, textTransform: "uppercase" }}>
                {category}
              </span>
              {inStock !== "none" && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    color:
                      inStock === "in-stock"
                        ? "#16a34a"
                        : inStock === "low-stock"
                        ? "#d97706"
                        : "#dc2626",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor:
                        inStock === "in-stock"
                          ? "#16a34a"
                          : inStock === "low-stock"
                          ? "#d97706"
                          : "#dc2626",
                    }}
                  />
                  {inStock === "in-stock"
                    ? "In Stock"
                    : inStock === "low-stock"
                    ? "Low Stock"
                    : "Sold Out"}
                </span>
              )}
            </div>
            <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: titleColor, lineHeight: 1.35 }}>
              {name}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: starCount }).map((_, i) => (
                  <RenderIcon key={`prod-star-${i}`} name="star" size={14} color={starColor} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>({reviewsCount})</span>
            </div>

            {/* Color Swatches */}
            {swatchColors.length > 0 && (
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 14 }}>
                {swatchColors.map((swatch, sIdx) => (
                  <span
                    key={`prod-swatch-${sIdx}`}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: swatch,
                      border: "1px solid rgba(0,0,0,0.15)",
                      display: "inline-block",
                    }}
                  />
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: priceColor }}>{price}</span>
                {originalPrice && (
                  <span style={{ fontSize: 14, color: originalPriceColor, textDecoration: "line-through" }}>
                    {originalPrice}
                  </span>
                )}
              </div>
              <a
                href={buttonUrl || "#"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 16px",
                  borderRadius: 10,
                  backgroundColor: buttonBg,
                  color: buttonTextColor,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                <span>{buttonText}</span>
              </a>
            </div>
          </div>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // PROMO BANNER (SEASONAL SALE)
  // ------------------------------------------------------------------------
  PromoBanner: {
    label: "Promo Banner (Sale / Coupon)",
    fields: {
      headline: textField("Promotional headline"),
      subtext: textField("Promotional details"),
      couponCode: textField("Discount coupon code"),
      buttonText: textField("CTA Button text"),
      buttonUrl: textField("Shop link"),
      bgColor: colorField("Banner background color"),
      textColor: colorField("Text color"),
      couponBg: colorField("Coupon code badge background"),
      couponBorderColor: colorField("Coupon dashed border color"),
      buttonBg: colorField("CTA button background"),
      buttonTextColor: colorField("CTA button text color"),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      headline: "Spring Design Collection — Up to 35% Off",
      subtext: "Use checkout code for instant savings across all featured creator assets.",
      couponCode: "STUDIO35",
      buttonText: "Shop Collection",
      buttonUrl: "#catalog",
      bgColor: "#4f46e5",
      textColor: "#ffffff",
      couponBg: "rgba(255, 255, 255, 0.2)",
      couponBorderColor: "rgba(255, 255, 255, 0.4)",
      buttonBg: "#ffffff",
      buttonTextColor: "#0f172a",
      marginTop: "16px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: ({
      headline,
      subtext,
      couponCode,
      buttonText,
      buttonUrl,
      bgColor = "#4f46e5",
      textColor = "#ffffff",
      couponBg = "rgba(255, 255, 255, 0.2)",
      couponBorderColor = "rgba(255, 255, 255, 0.4)",
      buttonBg = "#ffffff",
      buttonTextColor = "#0f172a",
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
          borderRadius: 18,
          backgroundColor: bgColor,
          color: textColor,
          padding: "36px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
          marginTop,
          marginBottom,
        }}
      >
        <div style={{ maxWidth: 540 }}>
          <h3 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, color: textColor }}>
            {headline}
          </h3>
          <p style={{ margin: 0, fontSize: 15, opacity: 0.9, lineHeight: 1.5, color: textColor }}>
            {subtext}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {couponCode && (
            <div
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                backgroundColor: couponBg,
                border: `1px dashed ${couponBorderColor}`,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 1.5,
                color: textColor,
              }}
            >
              CODE: {couponCode}
            </div>
          )}
          {buttonText && (
            <a
              href={buttonUrl || "#"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "12px 24px",
                borderRadius: 10,
                backgroundColor: buttonBg,
                color: buttonTextColor,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              {buttonText}
            </a>
          )}
        </div>
      </AnimationWrapper>
    ),
  },
};
