"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { spacingFields } from "../fields/boxStyleFields.js";
import {
  selectField,
  numberField,
  textField,
  textareaField,
  radioField,
  colorField,
  imageField,
  responsiveField,
} from "../fields/helpers.js";
import { buildResponsiveStyles } from "../layout/responsiveStyles.js";
import { RenderIcon } from "./icons.jsx";
import { useStudio } from "../context/StudioContext.jsx";

function SocialSvg({ name, size = 16, color = "currentColor" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (name) {
    case "twitter":
    case "x":
      return (
        <svg {...common}>
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill={color} />
        </svg>
      );
    case "discord":
      return (
        <svg {...common}>
          <path d="M18 6h0a14.5 14.5 0 0 0-4-1.25 10.3 10.3 0 0 0-.5 1.05 13.5 13.5 0 0 0-3 0 10.3 10.3 0 0 0-.5-1.05A14.5 14.5 0 0 0 6 6a15.7 15.7 0 0 0-2 10.5 14.6 14.6 0 0 0 4.5 2.25 11.3 11.3 0 0 0 1-1.6 9.4 9.4 0 0 1-1.6-.75c.13-.1.27-.2.4-.3a10.4 10.4 0 0 0 7.4 0c.13.1.27.2.4.3a9.4 9.4 0 0 1-1.6.75 11.3 11.3 0 0 0 1 1.6 14.6 14.6 0 0 0 4.5-2.25A15.7 15.7 0 0 0 18 6z" />
          <circle cx="8.5" cy="12" r="1.5" fill={color} />
          <circle cx="15.5" cy="12" r="1.5" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}

export const navigationComponents = {
  // ------------------------------------------------------------------------
  // NAVBAR (ADVANCED HEADER - HIGHLY CUSTOMIZABLE)
  // ------------------------------------------------------------------------
  Navbar: {
    label: "Navbar (Header Menu)",
    fields: {
      menuMode: selectField("Navigation Menu Source", [
        { label: "🛠️ Custom Links (Edit in Sidebar) [Recommended]", value: "custom" },
        { label: "⚡ Dynamic (Auto from Published Pages)", value: "auto" },
        { label: "🔀 Hybrid (Auto Pages + Custom Links)", value: "hybrid" },
      ]),
      quickLinksText: textareaField("⚡ Quick Links (One per line: Label | /url | Badge)"),
      autoSlugsExclude: textField("Auto Mode: Exclude page slugs (e.g. privacy, 404)"),
      includeHomeLink: radioField("Auto Mode: Include Home Link", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),

      // Drag and Drop Slots for Full Customizability
      leftSlot: { type: "slot" },
      navSlot: { type: "slot" },
      rightSlot: { type: "slot" },

      // Brand & Logo
      logoType: selectField("Logo Type", [
        { label: "Brand Text", value: "text" },
        { label: "Image Logo", value: "image" },
        { label: "Both Image & Text", value: "both" },
      ]),
      logoText: textField("Brand / Site Name"),
      logoUrl: imageField("Logo Image URL (Optional)"),
      logoWidth: numberField("Logo width (px)", 20, 320),
      logoSubtitle: textField("Small brand tagline (Optional)"),

      // Header Mode & Layout
      headerMode: selectField("Position & Header Style", [
        { label: "Sticky (Fixed to top on scroll)", value: "sticky" },
        { label: "Floating Island Pill (Modern blur pill)", value: "floating" },
        { label: "Glassmorphism Frosted", value: "glass" },
        { label: "Transparent Overlay (Floats over Hero)", value: "transparent" },
        { label: "Static (Scrolls with page)", value: "static" },
      ]),
      layoutStyle: selectField("Header Layout Alignment", [
        { label: "Space Between (Logo Left, Links Center, Actions Right)", value: "split" },
        { label: "Left Aligned (Logo & Links Left, Actions Right)", value: "left" },
        { label: "Centered (Links Around Logo)", value: "center" },
      ]),

      // Dimensions & Sizing (Adjustable from Right Sidebar)
      navHeight: selectField("Navbar Height Preset", [
        { label: "Slim / Compact (52px)", value: "52px" },
        { label: "Standard Modern (64px) [Default]", value: "64px" },
        { label: "Spacious (76px)", value: "76px" },
        { label: "Custom Height", value: "custom" },
      ]),
      customHeight: numberField("Custom Height (px)", 36, 160),
      paddingY: numberField("Vertical Inner Padding (px)", 2, 40),
      containerWidth: selectField("Navbar Max Width", [
        { label: "Standard (1240px) [Default]", value: "1240px" },
        { label: "Compact (1080px)", value: "1080px" },
        { label: "Narrow (960px)", value: "960px" },
        { label: "Wide (1440px)", value: "1440px" },
        { label: "Full Width (100%)", value: "100%" },
        { label: "Custom Width", value: "custom" },
      ]),
      customWidth: numberField("Custom Max Width (px)", 600, 1920),
      paddingX: numberField("Horizontal Inner Padding (px)", 8, 64),

      // Custom Links (Used when menuMode === 'custom' or fallback)
      links: {
        type: "array",
        label: "Custom Navigation Links List",
        arrayFields: {
          label: textField("Link label"),
          href: textField("Destination URL / Anchor"),
          badge: textField("Small badge (e.g. NEW, HOT, PRO)"),
          openNewTab: radioField("Open in New Tab", [
            { label: "No (Same tab)", value: false },
            { label: "Yes (New tab)", value: true },
          ]),
          hasSubmenu: radioField("Has Submenu Dropdown", [
            { label: "No", value: false },
            { label: "Yes", value: true },
          ]),
          submenuText: textareaField("Submenu items (Format: Title | /path | Subtitle description)"),
        },
        defaultItemProps: {
          label: "Services",
          href: "/services",
          badge: "",
          openNewTab: false,
          hasSubmenu: false,
          submenuText: "Web Design | /services/design | Custom UI & UX\nDevelopment | /services/dev | Full-stack engineering",
        },
        getItemSummary: (it) => it.label || "Link",
      },

      // Search Bar
      showSearch: radioField("Show search input bar", [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ]),
      searchPlaceholder: textField("Search placeholder text"),

      // Primary Action CTA
      showCTA: radioField("Show Primary CTA Button", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      ctaLabel: textField("Primary CTA button text"),
      ctaHref: textField("Primary CTA link URL"),
      ctaVariant: selectField("Primary CTA Style", [
        { label: "Solid Filled", value: "solid" },
        { label: "Gradient Aurora", value: "gradient" },
        { label: "Subtle Glow", value: "glow" },
        { label: "Outline", value: "outline" },
      ]),
      ctaBg: colorField("Primary button background"),
      ctaColor: colorField("Primary button text color"),

      // Secondary Action Button
      showSecondaryCTA: radioField("Show Secondary Button (e.g. Sign In)", [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ]),
      secondaryCtaLabel: textField("Secondary button text"),
      secondaryCtaHref: textField("Secondary link URL"),
      secondaryCtaVariant: selectField("Secondary button style", [
        { label: "Ghost / Minimal", value: "ghost" },
        { label: "Outline Border", value: "outline" },
      ]),

      // Social Media Quick Links
      showSocials: radioField("Show Social Media Icons", [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ]),
      twitterUrl: textField("Twitter / X URL"),
      githubUrl: textField("GitHub URL"),
      linkedinUrl: textField("LinkedIn URL"),
      instagramUrl: textField("Instagram URL"),

      // Announcement Top Strip
      showBanner: radioField("Show Announcement Banner", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      bannerText: textField("Announcement Top Banner Text"),
      bannerLink: textField("Banner Link URL (Optional)"),
      bannerBg: colorField("Banner background color"),
      bannerTextColor: colorField("Banner text color"),

      // Color Palette & Styling
      backgroundColor: colorField("Header background color"),
      textColor: colorField("Brand / text color"),
      linkColor: colorField("Link text color"),
      hoverColor: colorField("Link hover color"),
      activeColor: colorField("Active page indicator color"),
      borderBottom: radioField("Bottom separator line", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      borderColor: colorField("Border line color"),

      responsive: responsiveField([
        {
          key: "logoWidth",
          label: "Logo width (px)",
          type: "number",
          min: 40,
          max: 300,
        },
      ]),
      ...animationFields,
    },
    defaultProps: {
      menuMode: "custom",
      quickLinksText: "",
      autoSlugsExclude: "",
      includeHomeLink: true,
      logoType: "text",
      logoText: "STUDIO NOVA",
      logoUrl: "",
      logoWidth: 140,
      logoSubtitle: "",
      headerMode: "sticky",
      layoutStyle: "split",
      navHeight: "64px",
      customHeight: 64,
      paddingY: 8,
      containerWidth: "1240px",
      customWidth: 1240,
      paddingX: 24,
      links: [
        { label: "Home", href: "/", badge: "", hasSubmenu: false, submenuText: "" },
        {
          label: "Services",
          href: "#services",
          badge: "",
          hasSubmenu: true,
          submenuText: "Digital Design | #design | UI/UX & Brand Identity\nWeb Engineering | #web | Modern Full-Stack Platforms\nGrowth & SEO | #seo | Conversion rate optimization",
        },
        { label: "Showcase", href: "#work", badge: "HOT", hasSubmenu: false, submenuText: "" },
        { label: "Pricing", href: "#pricing", badge: "", hasSubmenu: false, submenuText: "" },
        { label: "Contact", href: "#contact", badge: "", hasSubmenu: false, submenuText: "" },
      ],
      showSearch: false,
      searchPlaceholder: "Search pages…",
      showCTA: true,
      ctaLabel: "Get Started",
      ctaHref: "#signup",
      ctaVariant: "solid",
      ctaBg: "#0f172a",
      ctaColor: "#ffffff",
      showSecondaryCTA: false,
      secondaryCtaLabel: "Sign In",
      secondaryCtaHref: "#login",
      secondaryCtaVariant: "ghost",
      showSocials: false,
      twitterUrl: "https://twitter.com",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      instagramUrl: "",
      showBanner: false,
      bannerText: "🚀 Discover our newly engineered agency templates →",
      bannerLink: "#",
      bannerBg: "#4f46e5",
      bannerTextColor: "#ffffff",
      backgroundColor: "#ffffff",
      textColor: "#0f172a",
      linkColor: "#334155",
      hoverColor: "#4f46e5",
      activeColor: "#4f46e5",
      borderBottom: true,
      borderColor: "#e2e8f0",
      responsive: {
        tablet: {
          logoWidth: 120,
        },
        mobile: {
          logoWidth: 100,
        },
      },
      ...animationDefaults,
    },
    render: function RenderNavbar({
      menuMode = "custom",
      quickLinksText = "",
      autoSlugsExclude = "",
      includeHomeLink = true,
      leftSlot: LeftSlot,
      navSlot: NavSlot,
      rightSlot: RightSlot,
      logoType = "text",
      logoText,
      logoUrl,
      logoWidth = 140,
      logoSubtitle,
      headerMode = "sticky",
      layoutStyle = "split",
      navHeight = "64px",
      customHeight = 64,
      paddingY = 8,
      containerWidth = "1240px",
      customWidth = 1240,
      paddingX = 24,
      links = [],
      showSearch = false,
      searchPlaceholder = "Search pages…",
      showCTA = true,
      ctaLabel = "Get Started",
      ctaHref = "#",
      ctaVariant = "solid",
      ctaBg = "#0f172a",
      ctaColor = "#ffffff",
      showSecondaryCTA = false,
      secondaryCtaLabel = "Sign In",
      secondaryCtaHref = "#",
      secondaryCtaVariant = "ghost",
      showSocials = false,
      twitterUrl,
      githubUrl,
      linkedinUrl,
      instagramUrl,
      showBanner = false,
      bannerText,
      bannerLink,
      bannerBg = "#4f46e5",
      bannerTextColor = "#ffffff",
      backgroundColor = "#ffffff",
      textColor = "#0f172a",
      linkColor = "#334155",
      hoverColor = "#4f46e5",
      activeColor = "#4f46e5",
      borderBottom = true,
      borderColor = "#e2e8f0",
      responsive,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) {
      const studio = useStudio();
      const [drawerOpen, setDrawerOpen] = useState(false);
      const [hoveredIdx, setHoveredIdx] = useState(null);
      const [activeDropdownIdx, setActiveDropdownIdx] = useState(null);
      const [mobileAccordionIdx, setMobileAccordionIdx] = useState(null);
      const drawerRef = useRef(null);

      const isSticky = headerMode === "sticky" || headerMode === "glass";
      const isFloating = headerMode === "floating";
      const isTransparent = headerMode === "transparent";
      const isGlass = headerMode === "glass" || isFloating;

      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          logoWidth: "--puck-logo-width",
          paddingY: "--puck-nav-pad-y",
          paddingX: "--puck-nav-pad-x",
          customHeight: "--puck-nav-height",
          customWidth: "--puck-nav-width",
        },
      });

      // Navigation links resolution: Custom, Quick Links, or Dynamic Auto
      const resolvedLinks = React.useMemo(() => {
        let customList = [];

        if (quickLinksText && typeof quickLinksText === "string" && quickLinksText.trim()) {
          customList = quickLinksText
            .split("\n")
            .map((line, idx) => {
              const parts = line.split("|").map((p) => p.trim());
              if (!parts[0]) return null;
              return {
                id: `quick-${idx}`,
                label: parts[0],
                href: parts[1] || "#",
                badge: parts[2] || "",
                isActive: false,
                hasSubmenu: false,
                submenuItems: [],
                openNewTab: false,
              };
            })
            .filter(Boolean);
        } else if (Array.isArray(links) && links.length > 0) {
          customList = links.map((link, idx) => {
            let submenuItems = [];
            if (link.hasSubmenu && link.submenuText) {
              submenuItems = link.submenuText
                .split("\n")
                .map((line) => {
                  const parts = line.split("|").map((p) => p.trim());
                  if (!parts[0]) return null;
                  return {
                    title: parts[0],
                    href: parts[1] || "#",
                    desc: parts[2] || "",
                  };
                })
                .filter(Boolean);
            }

            return {
              id: `link-${idx}`,
              label: link.label || "Link",
              href: link.href || "#",
              badge: link.badge || "",
              isActive: false,
              hasSubmenu: Boolean(link.hasSubmenu && submenuItems.length > 0),
              submenuItems,
              openNewTab: Boolean(link.openNewTab),
            };
          });
        }

        // Auto pages from Studio
        const autoItems = [];
        if (Array.isArray(studio?.pages) && studio.pages.length > 0) {
          const excluded = (autoSlugsExclude || "")
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);

          const sorted = [...studio.pages].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
          );

          for (const page of sorted) {
            const slug = (page.slug || "").toLowerCase();
            if (excluded.includes(slug)) continue;

            const isHome =
              slug === "home" ||
              page.isDefault ||
              (!sorted.some((p) => (p.slug || "").toLowerCase() === "home") &&
                autoItems.length === 0);

            if (isHome && !includeHomeLink) continue;

            const isActive =
              studio.activePageId === page.id ||
              (studio.activePageId && slug && studio.activePageId === slug);

            autoItems.push({
              id: page.id,
              label: page.name || (isHome ? "Home" : "Untitled Page"),
              href: isHome ? "/" : `/${page.slug || page.id}`,
              badge: isHome ? "" : page.badge || "",
              isHome,
              isActive,
              hasSubmenu: false,
              submenuItems: [],
              openNewTab: false,
            });
          }
        }

        // If quickLinksText was entered, user explicitly wants these links shown immediately!
        if (quickLinksText && typeof quickLinksText === "string" && quickLinksText.trim()) {
          return customList;
        }

        if (menuMode === "custom") {
          return customList.length > 0 ? customList : autoItems;
        }

        if (menuMode === "hybrid") {
          return [...customList, ...autoItems];
        }

        // Auto mode
        return autoItems.length > 0 ? autoItems : customList;
      }, [
        menuMode,
        quickLinksText,
        links,
        studio?.pages,
        studio?.activePageId,
        autoSlugsExclude,
        includeHomeLink,
      ]);

      // Handle ESC key to close drawer and dropdowns
      useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.key === "Escape") {
            setDrawerOpen(false);
            setActiveDropdownIdx(null);
          }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      }, []);

      // Prevent body scrolling while drawer is open
      useEffect(() => {
        if (!drawerOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = prevOverflow;
        };
      }, [drawerOpen]);

      // Dimension resolution
      let resolvedMaxWidth = "1240px";
      if (containerWidth === "custom" && customWidth) {
        resolvedMaxWidth = `${customWidth}px`;
      } else if (containerWidth) {
        resolvedMaxWidth = containerWidth;
      }

      const resolvedPadY = paddingY !== undefined && paddingY !== null ? `${paddingY}px` : (isFloating ? "6px" : "8px");
      const resolvedPadX = paddingX !== undefined && paddingX !== null ? `${paddingX}px` : (isFloating ? "18px" : "24px");
      const resolvedMinHeight = navHeight === "custom" && customHeight ? `${customHeight}px` : (navHeight || "64px");

      const displayBg = isTransparent
        ? "transparent"
        : isGlass
        ? "rgba(255, 255, 255, 0.88)"
        : backgroundColor || "#ffffff";

      const displayColor = isTransparent ? "#ffffff" : textColor || "#0f172a";
      const displayLinkColor = isTransparent ? "rgba(255, 255, 255, 0.9)" : linkColor;

      const getCtaStyles = () => {
        const base = {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 16px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
          transition: "all 180ms ease",
          cursor: "pointer",
          whiteSpace: "nowrap",
        };

        if (ctaVariant === "gradient") {
          return {
            ...base,
            backgroundImage: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
            color: "#ffffff",
            boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
            border: "none",
          };
        }
        if (ctaVariant === "glow") {
          return {
            ...base,
            backgroundColor: ctaBg || "#4f46e5",
            color: ctaColor || "#ffffff",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.55)",
            border: "none",
          };
        }
        if (ctaVariant === "outline") {
          return {
            ...base,
            backgroundColor: "transparent",
            color: ctaBg || "#4f46e5",
            border: `1.5px solid ${ctaBg || "#4f46e5"}`,
          };
        }
        return {
          ...base,
          backgroundColor: ctaBg || "#0f172a",
          color: ctaColor || "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          border: "none",
        };
      };

      return (
        <>
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <AnimationWrapper
            as="header"
            trigger={animTrigger}
            preset={animPreset}
            loop={animLoop}
            duration={animDuration}
            delay={animDelay}
            easing={animEasing}
            className={`puck-navbar-root ${respClass}`}
            style={{
              position: isTransparent
                ? "absolute"
                : isSticky || isFloating
                ? "sticky"
                : "relative",
              top: isFloating ? 12 : 0,
              left: 0,
              right: 0,
              zIndex: 100,
              width: isFloating ? "calc(100% - 32px)" : "100%",
              maxWidth: isFloating ? `var(--puck-nav-width, ${resolvedMaxWidth})` : "100%",
              margin: isFloating ? "0 auto" : 0,
              borderRadius: isFloating ? 16 : 0,
              boxShadow: isFloating
                ? "0 20px 40px -10px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.06)"
                : undefined,
              backgroundColor: displayBg,
              backdropFilter: isGlass ? "blur(16px)" : undefined,
              WebkitBackdropFilter: isGlass ? "blur(16px)" : undefined,
              borderTop: isFloating ? `1px solid ${borderColor}` : undefined,
              borderLeft: isFloating ? `1px solid ${borderColor}` : undefined,
              borderRight: isFloating ? `1px solid ${borderColor}` : undefined,
              borderBottom:
                isFloating || (borderBottom && !isTransparent)
                  ? `1px solid ${borderColor}`
                  : undefined,
              transition: "background-color 200ms ease, box-shadow 200ms ease",
            }}
          >
            {/* Announcement Top Banner */}
            {showBanner && bannerText && !isFloating && (
              <div
                style={{
                  backgroundColor: bannerBg,
                  color: bannerTextColor,
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span>{bannerText}</span>
                {bannerLink && (
                  <a
                    href={bannerLink}
                    style={{
                      color: "inherit",
                      textDecoration: "underline",
                      fontWeight: 700,
                      opacity: 0.95,
                    }}
                  >
                    Learn more →
                  </a>
                )}
              </div>
            )}

            <div
              style={{
                width: "100%",
                maxWidth: `var(--puck-nav-width, ${resolvedMaxWidth})`,
                margin: "0 auto",
                minHeight: `var(--puck-nav-height, ${resolvedMinHeight})`,
                paddingTop: `var(--puck-nav-pad-y, ${resolvedPadY})`,
                paddingBottom: `var(--puck-nav-pad-y, ${resolvedPadY})`,
                paddingLeft: `var(--puck-nav-pad-x, ${resolvedPadX})`,
                paddingRight: `var(--puck-nav-pad-x, ${resolvedPadX})`,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  layoutStyle === "center"
                    ? "center"
                    : layoutStyle === "left"
                    ? "flex-start"
                    : "space-between",
                gap: 20,
                minWidth: 0,
                position: "relative",
              }}
            >
              {/* BRAND / LOGO AREA */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  flexShrink: 0,
                  minWidth: 0,
                }}
              >
                <Link
                  href="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    textDecoration: "none",
                    color: displayColor,
                  }}
                >
                  {(logoType === "image" || logoType === "both") && logoUrl && (
                    <img
                      src={logoUrl}
                      alt={logoText || "Brand"}
                      style={{
                        width: `var(--puck-logo-width, ${logoWidth}px)`,
                        maxWidth: "min(var(--puck-logo-width, 180px), 100%)",
                        maxHeight: 34,
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  )}
                  {(logoType === "text" || logoType === "both" || !logoUrl) && (
                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          letterSpacing: -0.4,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {logoText || studio?.templateName || "STUDIO NOVA"}
                      </span>
                      {logoSubtitle && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                            opacity: 0.7,
                          }}
                        >
                          {logoSubtitle}
                        </span>
                      )}
                    </div>
                  )}
                </Link>

                {/* Left Drag & Drop Composable Slot */}
                {LeftSlot && (
                  <div
                    className="puck-nav-left-slot"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      minHeight: 28,
                    }}
                  >
                    <LeftSlot />
                  </div>
                )}
              </div>

              {/* DESKTOP NAVIGATION LINKS ROW */}
              <nav
                className="puck-nav-desktop-links"
                aria-label="Main Navigation"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flex: layoutStyle === "split" ? 1 : undefined,
                  justifyContent: layoutStyle === "split" ? "center" : "flex-start",
                  flexWrap: "nowrap",
                }}
              >
                {resolvedLinks.map((link, idx) => {
                  const isHovered = hoveredIdx === idx;
                  const isDropdownActive = activeDropdownIdx === idx;

                  return (
                    <div
                      key={`nav-link-${link.id || idx}`}
                      style={{ position: "relative" }}
                      onMouseEnter={() => {
                        setHoveredIdx(idx);
                        if (link.hasSubmenu) setActiveDropdownIdx(idx);
                      }}
                      onMouseLeave={() => {
                        setHoveredIdx(null);
                        if (link.hasSubmenu) setActiveDropdownIdx(null);
                      }}
                    >
                      <a
                        href={link.href}
                        target={link.openNewTab ? "_blank" : undefined}
                        rel={link.openNewTab ? "noopener noreferrer" : undefined}
                        onClick={(e) => {
                          if (link.hasSubmenu) {
                            e.preventDefault();
                            setActiveDropdownIdx(isDropdownActive ? null : idx);
                          }
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "6px 12px",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: link.isActive ? 700 : 600,
                          color: link.isActive
                            ? activeColor || hoverColor
                            : isHovered
                            ? hoverColor || "#4f46e5"
                            : displayLinkColor,
                          backgroundColor: link.isActive
                            ? "rgba(99, 102, 241, 0.08)"
                            : isHovered
                            ? "rgba(0, 0, 0, 0.04)"
                            : "transparent",
                          textDecoration: "none",
                          transition: "all 150ms ease",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span>{link.label}</span>

                        {link.badge && (
                          <span
                            style={{
                              padding: "2px 7px",
                              borderRadius: 999,
                              fontSize: 9,
                              fontWeight: 800,
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                              letterSpacing: 0.5,
                            }}
                          >
                            {link.badge}
                          </span>
                        )}

                        {link.hasSubmenu && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              transform: isDropdownActive ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 180ms ease",
                              opacity: 0.65,
                            }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )}
                      </a>

                      {/* Dropdown Submenu Panel */}
                      {link.hasSubmenu && isDropdownActive && (
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            minWidth: 260,
                            padding: "8px",
                            borderRadius: 14,
                            backgroundColor: "#ffffff",
                            boxShadow:
                              "0 20px 40px -10px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.08)",
                            zIndex: 110,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            animation: "puckFadeIn 160ms cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          {link.submenuItems.map((sub, sIdx) => (
                            <a
                              key={`sub-${sIdx}`}
                              href={sub.href}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "10px 12px",
                                borderRadius: 8,
                                textDecoration: "none",
                                color: "#0f172a",
                                transition: "background-color 140ms ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#f1f5f9";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                                {sub.title}
                              </span>
                              {sub.desc && (
                                <span style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                                  {sub.desc}
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Composable Navigation Slot */}
                {NavSlot && (
                  <div
                    className="puck-nav-center-slot"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginInline: 8,
                    }}
                  >
                    <NavSlot />
                  </div>
                )}
              </nav>

              {/* RIGHT ACTIONS / CTA GROUP */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  flexShrink: 0,
                }}
              >
                {/* Search Bar */}
                {showSearch && (
                  <div
                    className="puck-nav-search-bar"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#f8fafc",
                      maxWidth: 200,
                    }}
                  >
                    <RenderIcon name="search" size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        outline: "none",
                        fontSize: 13,
                        width: "100%",
                      }}
                    />
                  </div>
                )}

                {/* Social Media Icons */}
                {showSocials && (
                  <div
                    className="puck-nav-socials"
                    style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
                  >
                    {twitterUrl && (
                      <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Twitter / X"
                        style={{ color: displayLinkColor, opacity: 0.85 }}
                      >
                        <SocialSvg name="twitter" size={16} />
                      </a>
                    )}
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="GitHub"
                        style={{ color: displayLinkColor, opacity: 0.85 }}
                      >
                        <SocialSvg name="github" size={16} />
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="LinkedIn"
                        style={{ color: displayLinkColor, opacity: 0.85 }}
                      >
                        <SocialSvg name="linkedin" size={16} />
                      </a>
                    )}
                    {instagramUrl && (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Instagram"
                        style={{ color: displayLinkColor, opacity: 0.85 }}
                      >
                        <SocialSvg name="instagram" size={16} />
                      </a>
                    )}
                  </div>
                )}

                {/* Secondary Button */}
                {showSecondaryCTA && secondaryCtaLabel && (
                  <a
                    href={secondaryCtaHref || "#"}
                    className="puck-nav-secondary-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "7px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      color: displayColor,
                      border:
                        secondaryCtaVariant === "outline"
                          ? `1px solid ${borderColor || "#cbd5e1"}`
                          : "none",
                      backgroundColor: "transparent",
                      transition: "all 140ms ease",
                    }}
                  >
                    {secondaryCtaLabel}
                  </a>
                )}

                {/* Primary CTA Button */}
                {showCTA && ctaLabel && (
                  <a
                    href={ctaHref || "#"}
                    className="puck-nav-cta-btn"
                    style={getCtaStyles()}
                  >
                    {ctaLabel}
                  </a>
                )}

                {/* Right Drag & Drop Composable Slot */}
                {RightSlot && (
                  <div
                    className="puck-nav-right-slot"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      minHeight: 32,
                    }}
                  >
                    <RightSlot />
                  </div>
                )}

                {/* Mobile Hamburger Button */}
                <button
                  type="button"
                  className="puck-nav-hamburger-btn"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Open mobile navigation"
                  aria-expanded={drawerOpen}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    backgroundColor: "transparent",
                    color: displayColor,
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </AnimationWrapper>

          {/* Mobile Navigation Drawer Modal */}
          {drawerOpen && (
            <>
              {/* Backdrop */}
              <div
                role="presentation"
                onClick={() => setDrawerOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  backgroundColor: "rgba(15, 23, 42, 0.65)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  zIndex: 9998,
                }}
              />

              {/* Slide-over Drawer Panel */}
              <div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation drawer"
                style={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: "min(340px, 86vw)",
                  backgroundColor: backgroundColor || "#ffffff",
                  color: textColor || "#0f172a",
                  boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.25)",
                  zIndex: 9999,
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                }}
              >
                {/* Drawer Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 20px",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 800 }}>
                    {logoText || studio?.templateName || "Navigation"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close navigation drawer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 6,
                      cursor: "pointer",
                      color: textColor || "#0f172a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Drawer Links List */}
                <nav
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: "16px 14px",
                    overflowY: "auto",
                    flex: 1,
                  }}
                >
                  {resolvedLinks.map((link, idx) => (
                    <div key={`drawer-link-${idx}`}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <a
                          href={link.href}
                          onClick={() => {
                            if (!link.hasSubmenu) setDrawerOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 14px",
                            borderRadius: 8,
                            fontSize: 15,
                            fontWeight: link.isActive ? 700 : 600,
                            color: link.isActive ? activeColor || hoverColor : textColor || "#0f172a",
                            backgroundColor: link.isActive ? "rgba(99, 102, 241, 0.08)" : "transparent",
                            textDecoration: "none",
                            flex: 1,
                          }}
                        >
                          <span>{link.label}</span>
                          {link.badge && (
                            <span
                              style={{
                                padding: "2px 6px",
                                borderRadius: 999,
                                fontSize: 9,
                                fontWeight: 800,
                                backgroundColor: "#eff6ff",
                                color: "#2563eb",
                              }}
                            >
                              {link.badge}
                            </span>
                          )}
                        </a>

                        {link.hasSubmenu && (
                          <button
                            type="button"
                            onClick={() =>
                              setMobileAccordionIdx(mobileAccordionIdx === idx ? null : idx)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              padding: "10px 12px",
                              cursor: "pointer",
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              style={{
                                transform:
                                  mobileAccordionIdx === idx ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 180ms ease",
                              }}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Submenu Accordion */}
                      {link.hasSubmenu && mobileAccordionIdx === idx && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            paddingLeft: 20,
                            paddingTop: 4,
                            paddingBottom: 8,
                          }}
                        >
                          {link.submenuItems.map((sub, sIdx) => (
                            <a
                              key={`mob-sub-${sIdx}`}
                              href={sub.href}
                              onClick={() => setDrawerOpen(false)}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "8px 12px",
                                borderRadius: 6,
                                textDecoration: "none",
                              }}
                            >
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                                {sub.title}
                              </span>
                              {sub.desc && (
                                <span style={{ fontSize: 11, color: "#64748b" }}>{sub.desc}</span>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Drawer Footer Actions */}
                <div
                  style={{
                    padding: "16px 20px 24px",
                    borderTop: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {showCTA && ctaLabel && (
                    <a
                      href={ctaHref || "#"}
                      onClick={() => setDrawerOpen(false)}
                      style={{
                        ...getCtaStyles(),
                        width: "100%",
                        padding: "12px 18px",
                      }}
                    >
                      {ctaLabel}
                    </a>
                  )}

                  {showSecondaryCTA && secondaryCtaLabel && (
                    <a
                      href={secondaryCtaHref || "#"}
                      onClick={() => setDrawerOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        padding: "10px 18px",
                        borderRadius: 10,
                        border: "1px solid #cbd5e1",
                        fontSize: 14,
                        fontWeight: 600,
                        color: textColor || "#0f172a",
                        textDecoration: "none",
                      }}
                    >
                      {secondaryCtaLabel}
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      );
    },
  },

  // ------------------------------------------------------------------------
  // ANNOUNCEMENT BAR
  // ------------------------------------------------------------------------
  AnnouncementBar: {
    label: "Announcement Bar (Top Strip)",
    fields: {
      text: textField("Announcement text"),
      linkText: textField("Action link text"),
      linkHref: textField("Action link URL"),
      backgroundColor: colorField("Background color"),
      textColor: colorField("Text color"),
      icon: selectField("Icon", [
        { label: "Sparkles", value: "sparkles" },
        { label: "Zap", value: "zap" },
        { label: "Star", value: "star" },
        { label: "Flame", value: "flame" },
        { label: "Bell", value: "bell" },
        { label: "None", value: "none" },
      ]),
      closable: radioField("Show close button", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      ...animationFields,
    },
    defaultProps: {
      text: "⚡ Special Offer: Unlock 20% off all annual platform subscriptions today.",
      linkText: "Claim Deal →",
      linkHref: "#pricing",
      backgroundColor: "#0f172a",
      textColor: "#ffffff",
      icon: "sparkles",
      closable: true,
      ...animationDefaults,
    },
    render: function RenderAnnouncement({
      text,
      linkText,
      linkHref,
      backgroundColor,
      textColor,
      icon,
      closable,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) {
      const [closed, setClosed] = useState(false);
      if (closed) return null;

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            backgroundColor: backgroundColor || "#0f172a",
            color: textColor || "#ffffff",
            padding: "9px 20px",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {icon && icon !== "none" && (
              <RenderIcon name={icon} size={15} color={textColor || "#ffffff"} />
            )}
            <span>{text}</span>
            {linkText && (
              <a
                href={linkHref || "#"}
                style={{
                  color: "#60a5fa",
                  textDecoration: "underline",
                  fontWeight: 700,
                }}
              >
                {linkText}
              </a>
            )}
          </div>
          {closable && (
            <button
              type="button"
              onClick={() => setClosed(true)}
              style={{
                position: "absolute",
                right: 16,
                backgroundColor: "transparent",
                border: "none",
                color: textColor || "#ffffff",
                fontSize: 14,
                cursor: "pointer",
                opacity: 0.7,
              }}
              aria-label="Close announcement"
            >
              &#x2715;
            </button>
          )}
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // FOOTER (HIGHLY CUSTOMIZABLE MULTI-COLUMN BRAND FOOTER)
  // ------------------------------------------------------------------------
  Footer: {
    label: "Footer (Multi-Column)",
    fields: {
      menuMode: selectField("Navigation Links Mode", [
        { label: "🛠️ Custom Columns (Edit in Sidebar) [Recommended]", value: "custom" },
        { label: "🔀 Both (Auto Pages Column + Custom Columns)", value: "both" },
        { label: "⚡ Dynamic (Auto-populate Published Pages Only)", value: "auto" },
      ]),
      pagesColumnTitle: textField("Auto Mode: Pages Column Title"),

      // Slots for Full Composability
      footerTopSlot: { type: "slot" },
      brandSlot: { type: "slot" },
      footerBottomSlot: { type: "slot" },

      // Brand
      brandName: textField("Brand / Company name"),
      logoUrl: imageField("Logo image URL (Optional)"),
      description: textareaField("Brand summary description"),

      // Colors & Styling
      backgroundColor: colorField("Footer background color"),
      textColor: colorField("Text description color"),
      accentColor: colorField("Headings & brand color"),
      linkColor: colorField("Link color"),
      borderTopColor: colorField("Top border line color"),

      // Navigation Columns
      navColumns: {
        type: "array",
        label: "Footer Navigation Columns",
        arrayFields: {
          title: textField("Column header title"),
          linksList: textareaField("Column Links (One per line: Label | /url)"),
          link1Text: textField("Link 1 label (Optional)"),
          link1Url: textField("Link 1 URL (Optional)"),
          link2Text: textField("Link 2 label (Optional)"),
          link2Url: textField("Link 2 URL (Optional)"),
          link3Text: textField("Link 3 label (Optional)"),
          link3Url: textField("Link 3 URL (Optional)"),
          link4Text: textField("Link 4 label (Optional)"),
          link4Url: textField("Link 4 URL (Optional)"),
        },
        defaultItemProps: {
          title: "Product",
          linksList: "Features | #features\nTemplates | #templates\nShowcase | #showcase\nPricing | #pricing",
          link1Text: "Features",
          link1Url: "#features",
          link2Text: "Templates",
          link2Url: "#templates",
          link3Text: "Showcase",
          link3Url: "#showcase",
          link4Text: "Pricing",
          link4Url: "#pricing",
        },
        getItemSummary: (it) => it.title || "Column",
      },

      // Newsletter
      showNewsletter: radioField("Include newsletter capture block", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      newsletterHeadline: textField("Newsletter headline"),
      newsletterPlaceholder: textField("Newsletter email placeholder"),

      // Social Links
      showSocials: radioField("Show Social Icon Links", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      twitterUrl: textField("Twitter/X profile URL (Optional)"),
      linkedinUrl: textField("LinkedIn profile URL (Optional)"),
      githubUrl: textField("GitHub profile URL (Optional)"),
      instagramUrl: textField("Instagram profile URL (Optional)"),
      youtubeUrl: textField("YouTube channel URL (Optional)"),
      discordUrl: textField("Discord server URL (Optional)"),

      // Copyright & Legal
      copyrightText: textField("Copyright notice"),
      showLegalLinks: radioField("Show bottom legal links", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      privacyUrl: textField("Privacy Policy URL"),
      termsUrl: textField("Terms of Service URL"),

      ...spacingFields,
      responsive: responsiveField([
        {
          key: "marginTop",
          label: "Top Margin",
          type: "text",
        },
        {
          key: "paddingTop",
          label: "Top Padding",
          type: "text",
        },
      ]),
      ...animationFields,
    },
    defaultProps: {
      menuMode: "custom",
      pagesColumnTitle: "Explore Pages",
      brandName: "STUDIO NOVA",
      logoUrl: "",
      description:
        "Crafting digital experiences with architectural precision, modular component engines, and unmatched creative speed.",
      backgroundColor: "#090d16",
      textColor: "#94a3b8",
      accentColor: "#ffffff",
      linkColor: "#94a3b8",
      borderTopColor: "rgba(255,255,255,0.08)",
      navColumns: [
        {
          title: "Product",
          linksList: "Features | #features\nTemplates | #templates\nIntegrations | #integrations\nReleases | #releases\nPricing | #pricing",
          link1Text: "Features",
          link1Url: "#features",
          link2Text: "Templates",
          link2Url: "#templates",
          link3Text: "Integrations",
          link3Url: "#integrations",
          link4Text: "Releases",
          link4Url: "#releases",
        },
        {
          title: "Company",
          linksList: "About Us | #about\nCareers | #careers\nPress Kit | #press\nContact | #contact\nBlog | #blog",
          link1Text: "About Us",
          link1Url: "#about",
          link2Text: "Careers",
          link2Url: "#careers",
          link3Text: "Press Kit",
          link3Url: "#press",
          link4Text: "Contact",
          link4Url: "#contact",
        },
        {
          title: "Resources",
          linksList: "Documentation | #docs\nCommunity | #community\nHelp Center | #help\nStatus | #status",
          link1Text: "Documentation",
          link1Url: "#docs",
          link2Text: "Community",
          link2Url: "#community",
          link3Text: "Help Center",
          link3Url: "#help",
          link4Text: "Status",
          link4Url: "#status",
        },
      ],
      showNewsletter: true,
      newsletterHeadline: "Subscribe to our engineering teardowns",
      newsletterPlaceholder: "Enter your email...",
      showSocials: true,
      twitterUrl: "https://twitter.com",
      linkedinUrl: "https://linkedin.com",
      githubUrl: "https://github.com",
      instagramUrl: "",
      youtubeUrl: "",
      discordUrl: "",
      copyrightText: "© 2026 Studio Nova Inc. All rights reserved.",
      showLegalLinks: true,
      privacyUrl: "#privacy",
      termsUrl: "#terms",
      marginTop: "64px",
      marginBottom: "0px",
      responsive: {
        tablet: {
          marginTop: "48px",
        },
        mobile: {
          marginTop: "32px",
        },
      },
      ...animationDefaults,
    },
    render: function RenderFooter(props) {
      const {
        menuMode = "custom",
        pagesColumnTitle = "Explore Pages",
        footerTopSlot: FooterTopSlot,
        brandSlot: BrandSlot,
        footerBottomSlot: FooterBottomSlot,
        brandName,
        logoUrl,
        description,
        backgroundColor = "#090d16",
        textColor = "#94a3b8",
        accentColor = "#ffffff",
        linkColor = "#94a3b8",
        borderTopColor = "rgba(255,255,255,0.08)",
        navColumns = [],
        showNewsletter = true,
        newsletterHeadline,
        newsletterPlaceholder,
        showSocials = true,
        twitterUrl,
        linkedinUrl,
        githubUrl,
        instagramUrl,
        youtubeUrl,
        discordUrl,
        copyrightText,
        showLegalLinks = true,
        privacyUrl = "#privacy",
        termsUrl = "#terms",
        marginTop,
        marginBottom,
        responsive = {},
        puck = {},
        animTrigger,
        animPreset,
        animLoop,
        animDuration,
        animDelay,
        animEasing,
      } = props;

      const [subscribed, setSubscribed] = useState(false);
      const [emailVal, setEmailVal] = useState("");
      const [hoveredSocial, setHoveredSocial] = useState(null);

      // Studio dynamic pages integration
      const studio = useStudio();
      const studioPages = studio?.pages || [];
      const templateId = studio?.templateId;
      const websiteId = studio?.websiteId;

      // Build auto pages list
      const autoPages = studioPages
        .filter((p) => Boolean(p.name || p.title))
        .map((p) => {
          const title = p.title || p.name;
          const slug = p.slug === "home" || p.slug === "index" ? "" : p.slug;
          let href = "#";
          if (templateId) {
            href = slug ? `/templates/${templateId}/${slug}` : `/templates/${templateId}`;
          } else if (websiteId) {
            href = slug ? `/site/${websiteId}/${slug}` : `/site/${websiteId}`;
          } else {
            href = slug ? `/${slug}` : "/";
          }
          return { title, href };
        });

      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          marginTop: "--puck-margin-top",
          marginBottom: "--puck-margin-bottom",
        },
      });

      // Social profiles config
      const socialList = [
        { key: "twitter", url: twitterUrl, label: "Twitter / X" },
        { key: "github", url: githubUrl, label: "GitHub" },
        { key: "linkedin", url: linkedinUrl, label: "LinkedIn" },
        { key: "instagram", url: instagramUrl, label: "Instagram" },
        { key: "youtube", url: youtubeUrl, label: "YouTube" },
        { key: "discord", url: discordUrl, label: "Discord" },
      ].filter((s) => Boolean(s.url));

      return (
        <>
          {respCss && <style>{respCss}</style>}
          <AnimationWrapper
            as="footer"
            trigger={animTrigger}
            preset={animPreset}
            loop={animLoop}
            duration={animDuration}
            delay={animDelay}
            easing={animEasing}
            className={`puck-footer-root ${respClass}`}
            style={{
              backgroundColor: backgroundColor || "#090d16",
              color: textColor || "#94a3b8",
              padding: "72px 24px 36px",
              marginTop,
              marginBottom,
              borderTop: `1px solid ${borderTopColor || "rgba(255,255,255,0.08)"}`,
              position: "relative",
            }}
          >
            {/* Optional Composable Top Slot */}
            {FooterTopSlot && (
              <div
                style={{
                  maxWidth: 1240,
                  margin: "0 auto 48px",
                  paddingBottom: 32,
                  borderBottom: `1px solid ${borderTopColor || "rgba(255,255,255,0.08)"}`,
                }}
              >
                <FooterTopSlot />
              </div>
            )}

            <div
              style={{
                maxWidth: 1240,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 48,
                paddingBottom: 48,
                borderBottom: `1px solid ${borderTopColor || "rgba(255,255,255,0.08)"}`,
              }}
            >
              {/* Brand Column */}
              <div style={{ maxWidth: 320 }}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={brandName}
                    style={{ maxHeight: 38, marginBottom: 16, objectFit: "contain" }}
                  />
                ) : (
                  <h4
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: accentColor || "#ffffff",
                      letterSpacing: "-0.02em",
                      margin: "0 0 12px",
                    }}
                  >
                    {brandName}
                  </h4>
                )}
                {description && (
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.65,
                      margin: "0 0 20px",
                      color: textColor || "#94a3b8",
                    }}
                  >
                    {description}
                  </p>
                )}

                {/* Composable Brand Slot */}
                {BrandSlot && (
                  <div style={{ margin: "16px 0" }}>
                    <BrandSlot />
                  </div>
                )}

                {/* Social Icon Pills */}
                {showSocials && socialList.length > 0 && (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                    {socialList.map((s) => (
                      <a
                        key={s.key}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        title={s.label}
                        onMouseEnter={() => setHoveredSocial(s.key)}
                        onMouseLeave={() => setHoveredSocial(null)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          backgroundColor:
                            hoveredSocial === s.key
                              ? "rgba(255,255,255,0.18)"
                              : "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: hoveredSocial === s.key ? "#ffffff" : textColor || "#94a3b8",
                          transition: "all 150ms ease",
                          transform: hoveredSocial === s.key ? "translateY(-2px)" : "none",
                        }}
                      >
                        <SocialSvg name={s.key} size={17} color="currentColor" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Auto Pages Column (WordPress FSE style) */}
              {(menuMode === "auto" || menuMode === "both") && (
                <div>
                  <h5
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: accentColor || "#ffffff",
                      margin: "0 0 16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {pagesColumnTitle || "Pages"}
                  </h5>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    {autoPages.length > 0 ? (
                      autoPages.map((pg, pIdx) => (
                        <li key={`pg-${pIdx}`}>
                          <a
                            href={pg.href}
                            style={{
                              fontSize: 14,
                              color: linkColor || "#94a3b8",
                              textDecoration: "none",
                              transition: "color 150ms ease",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = accentColor || "#ffffff")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = linkColor || "#94a3b8")}
                          >
                            <span>{pg.title}</span>
                          </a>
                        </li>
                      ))
                    ) : (
                      <>
                        <li>
                          <a
                            href="/"
                            style={{ fontSize: 14, color: linkColor || "#94a3b8", textDecoration: "none" }}
                          >
                            Home
                          </a>
                        </li>
                        <li>
                          <a
                            href="/about"
                            style={{ fontSize: 14, color: linkColor || "#94a3b8", textDecoration: "none" }}
                          >
                            About
                          </a>
                        </li>
                        <li>
                          <a
                            href="/contact"
                            style={{ fontSize: 14, color: linkColor || "#94a3b8", textDecoration: "none" }}
                          >
                            Contact
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}

              {/* Manual Nav Columns - Always visible in custom or both mode, or whenever columns are configured */}
              {(menuMode !== "auto" || autoPages.length === 0 || navColumns.length > 0) &&
                navColumns.map((col, idx) => {
                  let links = [];
                  if (col.linksList && typeof col.linksList === "string" && col.linksList.trim()) {
                    links = col.linksList
                      .split("\n")
                      .map((line) => {
                        const parts = line.split("|").map((p) => p.trim());
                        if (!parts[0]) return null;
                        return { text: parts[0], url: parts[1] || "#" };
                      })
                      .filter(Boolean);
                  }

                  if (links.length === 0) {
                    links = [
                      { text: col.link1Text, url: col.link1Url },
                      { text: col.link2Text, url: col.link2Url },
                      { text: col.link3Text, url: col.link3Url },
                      { text: col.link4Text, url: col.link4Url },
                    ].filter((l) => Boolean(l.text));
                  }

                  return (
                    <div key={`col-${idx}`}>
                      <h5
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: accentColor || "#ffffff",
                          margin: "0 0 16px",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {col.title}
                      </h5>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "grid",
                          gap: 10,
                        }}
                      >
                        {links.map((link, lIdx) => (
                          <li key={`link-${lIdx}`}>
                            <a
                              href={link.url || "#"}
                              style={{
                                fontSize: 14,
                                color: linkColor || "#94a3b8",
                                textDecoration: "none",
                                transition: "color 150ms ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = accentColor || "#ffffff")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = linkColor || "#94a3b8")}
                            >
                              {link.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

              {/* Newsletter block */}
              {showNewsletter && (
                <div style={{ maxWidth: 300 }}>
                  <h5
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: accentColor || "#ffffff",
                      margin: "0 0 12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Stay Updated
                  </h5>
                  <p style={{ fontSize: 13, margin: "0 0 12px", lineHeight: 1.55 }}>
                    {newsletterHeadline || "Get architectural updates and design drops direct to your inbox."}
                  </p>
                  {subscribed ? (
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: 8,
                        backgroundColor: "rgba(16, 185, 129, 0.15)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        color: "#34d399",
                        fontSize: 13,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span>✓</span>
                      <span>You're subscribed!</span>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (emailVal) setSubscribed(true);
                      }}
                      style={{ display: "flex", gap: 6 }}
                    >
                      <input
                        required
                        type="email"
                        value={emailVal}
                        onChange={(e) => setEmailVal(e.target.value)}
                        placeholder={newsletterPlaceholder || "Enter your email..."}
                        style={{
                          flex: 1,
                          padding: "9px 12px",
                          borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.2)",
                          backgroundColor: "rgba(255,255,255,0.06)",
                          color: "#ffffff",
                          fontSize: 13,
                          outline: "none",
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: "9px 16px",
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                          color: "#ffffff",
                          fontSize: 13,
                          fontWeight: 700,
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                        }}
                      >
                        Join
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Bar & Footer Bottom Slot */}
            <div
              style={{
                maxWidth: 1240,
                margin: "32px auto 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                fontSize: 13,
              }}
            >
              <span>{copyrightText}</span>

              {/* Composable Bottom Slot */}
              {FooterBottomSlot && (
                <div>
                  <FooterBottomSlot />
                </div>
              )}

              {showLegalLinks && (
                <div style={{ display: "flex", gap: 16 }}>
                  <a
                    href={privacyUrl || "#privacy"}
                    style={{ color: textColor || "#94a3b8", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = accentColor || "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textColor || "#94a3b8")}
                  >
                    Privacy Policy
                  </a>
                  <a
                    href={termsUrl || "#terms"}
                    style={{ color: textColor || "#94a3b8", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = accentColor || "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textColor || "#94a3b8")}
                  >
                    Terms of Service
                  </a>
                </div>
              )}
            </div>
          </AnimationWrapper>
        </>
      );
    },
  },
};

// Aliases for backward compatibility with templates that might reference Header
navigationComponents.Header = navigationComponents.Navbar;
