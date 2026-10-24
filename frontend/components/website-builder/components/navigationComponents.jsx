"use client";

import React, { useState } from "react";
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
} from "../fields/helpers.js";
import { RenderIcon } from "./icons.jsx";

export const navigationComponents = {
  // ------------------------------------------------------------------------
  // NAVBAR (ADVANCED HEADER - HIGHLY CUSTOMIZABLE)
  // ------------------------------------------------------------------------
  Navbar: {
    label: "Navbar (Header Menu)",
    fields: {
      bannerText: textField("Announcement Top Banner (Optional)"),
      bannerBg: colorField("Banner background color"),
      bannerTextColor: colorField("Banner text color"),
      logoText: textField("Brand Name"),
      logoUrl: textField("Logo Image URL (Optional)"),
      logoWidth: numberField("Logo width (px)", 20, 300),
      links: {
        type: "array",
        label: "Navigation links",
        arrayFields: {
          label: textField("Link label"),
          href: textField("Destination URL"),
          badge: textField("Small badge (e.g. NEW, HOT)"),
        },
        defaultItemProps: { label: "Features", href: "#features", badge: "" },
        getItemSummary: (it) => it.label || "Link",
      },
      headerMode: selectField("Position Mode", [
        { label: "Sticky (Sticks to top)", value: "sticky" },
        { label: "Floating Island Pill", value: "floating" },
        { label: "Glassmorphism (Frosted glass)", value: "glass" },
        { label: "Static (Scrolls with page)", value: "static" },
      ]),
      backgroundColor: colorField("Header background color"),
      textColor: colorField("Brand / text color"),
      linkColor: colorField("Link text color"),
      hoverColor: colorField("Link hover color"),
      showSearch: radioField("Show search input bar", [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ]),
      showCTA: radioField("Show Action Button", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      ctaLabel: textField("CTA Button text"),
      ctaHref: textField("CTA link URL"),
      ctaBg: colorField("CTA button background"),
      ctaColor: colorField("CTA button text color"),
      borderBottom: radioField("Bottom separator line", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      borderColor: colorField("Border line color"),
      ...animationFields,
    },
    defaultProps: {
      bannerText: "🚀 Discover our newly engineered agency templates →",
      bannerBg: "#4f46e5",
      bannerTextColor: "#ffffff",
      logoText: "STUDIO NOVA",
      logoUrl: "",
      logoWidth: 140,
      links: [
        { label: "Home", href: "/", badge: "" },
        { label: "Services", href: "#services", badge: "" },
        { label: "Showcase", href: "#work", badge: "HOT" },
        { label: "Pricing", href: "#pricing", badge: "" },
        { label: "Contact", href: "#contact", badge: "" },
      ],
      headerMode: "sticky",
      backgroundColor: "#ffffff",
      textColor: "#0f172a",
      linkColor: "#334155",
      hoverColor: "#4f46e5",
      showSearch: false,
      showCTA: true,
      ctaLabel: "Get Started",
      ctaHref: "#signup",
      ctaBg: "#0f172a",
      ctaColor: "#ffffff",
      borderBottom: true,
      borderColor: "#e2e8f0",
      ...animationDefaults,
    },
    render: function RenderNavbar({
      bannerText,
      bannerBg = "#4f46e5",
      bannerTextColor = "#ffffff",
      logoText,
      logoUrl,
      logoWidth = 140,
      links = [],
      headerMode = "sticky",
      backgroundColor = "#ffffff",
      textColor = "#0f172a",
      linkColor = "#334155",
      hoverColor = "#4f46e5",
      showSearch = false,
      showCTA = true,
      ctaLabel = "Get Started",
      ctaHref = "#",
      ctaBg = "#0f172a",
      ctaColor = "#ffffff",
      borderBottom = true,
      borderColor = "#e2e8f0",
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) {
      const [mobileOpen, setMobileOpen] = useState(false);
      const [hoveredIdx, setHoveredIdx] = useState(null);

      const isSticky = headerMode === "sticky" || headerMode === "glass";
      const isFloating = headerMode === "floating";
      const isGlass = headerMode === "glass" || isFloating;

      return (
        <AnimationWrapper
          as="header"
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            position: isSticky || isFloating ? "sticky" : "relative",
            top: isFloating ? 16 : 0,
            zIndex: 100,
            width: isFloating ? "calc(100% - 32px)" : "100%",
            maxWidth: isFloating ? 1240 : "100%",
            margin: isFloating ? "0 auto" : 0,
            borderRadius: isFloating ? 18 : 0,
            boxShadow: isFloating ? "0 10px 30px -5px rgba(0,0,0,0.12)" : undefined,
            backgroundColor: isGlass
              ? "rgba(255, 255, 255, 0.88)"
              : backgroundColor || "#ffffff",
            backdropFilter: isGlass ? "blur(14px)" : undefined,
            WebkitBackdropFilter: isGlass ? "blur(14px)" : undefined,
            borderBottom: borderBottom && !isFloating ? `1px solid ${borderColor}` : undefined,
            border: isFloating ? `1px solid ${borderColor}` : undefined,
            transition: "all 200ms ease",
          }}
        >
          {bannerText && !isFloating && (
            <div
              style={{
                backgroundColor: bannerBg,
                color: bannerTextColor,
                fontSize: 13,
                fontWeight: 600,
                textAlign: "center",
                padding: "8px 16px",
              }}
            >
              {bannerText}
            </div>
          )}

          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: isFloating ? "12px 24px" : "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 20,
                fontWeight: 800,
                color: textColor,
                textDecoration: "none",
                letterSpacing: -0.5,
                flexShrink: 0,
              }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={logoText || "Brand"}
                  style={{ width: `${logoWidth}px`, maxHeight: 44, objectFit: "contain" }}
                />
              ) : (
                logoText || "Brand"
              )}
            </Link>

            {/* Optional integrated search input */}
            {showSearch && (
              <div
                style={{
                  display: "none",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  maxWidth: 240,
                  width: "100%",
                }}
                className="lg:flex"
              >
                <RenderIcon name="search" size={14} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search..."
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

            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
              className="hidden md:flex"
            >
              {links.map((link, idx) => (
                <a
                  key={`nav-link-${idx}`}
                  href={link.href}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 15,
                    fontWeight: 600,
                    color: hoveredIdx === idx ? hoverColor || "#4f46e5" : linkColor,
                    textDecoration: "none",
                    transition: "color 150ms ease",
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
                        letterSpacing: 0.5,
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {showCTA && ctaLabel && (
                <a
                  href={ctaHref || "#"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 20px",
                    borderRadius: 10,
                    backgroundColor: ctaBg || "#0f172a",
                    color: ctaColor || "#ffffff",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {ctaLabel}
                </a>
              )}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden"
                style={{
                  padding: 8,
                  backgroundColor: "transparent",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 18,
                  color: textColor,
                }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? "\u2715" : "\u2630"}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div
              style={{
                padding: "16px 24px 24px",
                borderTop: "1px solid #e2e8f0",
                backgroundColor: backgroundColor || "#ffffff",
                display: "grid",
                gap: 12,
              }}
            >
              {links.map((link, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: linkColor,
                    textDecoration: "none",
                    padding: "8px 0",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </AnimationWrapper>
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
      icon: selectField("Icon", ["sparkles", "zap", "star", "flame", "bell", "none"]),
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
      brandName: textField("Brand / Company name"),
      logoUrl: textField("Logo image URL (Optional)"),
      description: textareaField("Brand summary description"),
      backgroundColor: colorField("Footer background color"),
      textColor: colorField("Text description color"),
      accentColor: colorField("Headings & brand color"),
      linkColor: colorField("Link color"),
      borderTopColor: colorField("Top border line color"),
      navColumns: {
        type: "array",
        label: "Footer Navigation Columns",
        arrayFields: {
          title: textField("Column header title"),
          link1Text: textField("Link 1 label"),
          link1Url: textField("Link 1 URL"),
          link2Text: textField("Link 2 label"),
          link2Url: textField("Link 2 URL"),
          link3Text: textField("Link 3 label"),
          link3Url: textField("Link 3 URL"),
          link4Text: textField("Link 4 label"),
          link4Url: textField("Link 4 URL"),
        },
        defaultItemProps: {
          title: "Product",
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
      showNewsletter: radioField("Include newsletter capture block", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      newsletterHeadline: textField("Newsletter headline"),
      newsletterPlaceholder: textField("Newsletter email placeholder"),
      twitterUrl: textField("Twitter/X profile URL (Optional)"),
      linkedinUrl: textField("LinkedIn profile URL (Optional)"),
      githubUrl: textField("GitHub profile URL (Optional)"),
      copyrightText: textField("Copyright notice"),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
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
          link1Text: "Documentation",
          link1Url: "#docs",
          link2Text: "Community",
          link2Url: "#community",
          link3Text: "Tutorials",
          link3Url: "#tutorials",
          link4Text: "Support",
          link4Url: "#support",
        },
      ],
      showNewsletter: true,
      newsletterHeadline: "Subscribe to architectural teardowns",
      newsletterPlaceholder: "Enter your email...",
      twitterUrl: "https://twitter.com",
      linkedinUrl: "https://linkedin.com",
      githubUrl: "https://github.com",
      copyrightText: "© 2026 Studio Nova Inc. All rights reserved.",
      marginTop: "64px",
      marginBottom: "0px",
      ...animationDefaults,
    },
    render: function RenderFooter({
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
      twitterUrl,
      linkedinUrl,
      githubUrl,
      copyrightText,
      marginTop,
      marginBottom,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) {
      const [subscribed, setSubscribed] = useState(false);

      return (
        <AnimationWrapper
          as="footer"
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            backgroundColor: backgroundColor || "#090d16",
            color: textColor || "#94a3b8",
            padding: "80px 24px 40px",
            marginTop,
            marginBottom,
            borderTop: `1px solid ${borderTopColor || "rgba(255,255,255,0.08)"}`,
          }}
        >
          <div
            style={{
              maxWidth: 1240,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`,
              gap: 48,
              paddingBottom: 48,
              borderBottom: `1px solid ${borderTopColor || "rgba(255,255,255,0.08)"}`,
            }}
          >
            {/* Brand column */}
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
                    fontSize: 20,
                    fontWeight: 800,
                    color: accentColor || "#ffffff",
                    margin: "0 0 12px",
                  }}
                >
                  {brandName}
                </h4>
              )}
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>{description}</p>
              {/* Social links */}
              <div style={{ display: "flex", gap: 12 }}>
                {twitterUrl && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: accentColor || "#ffffff", textDecoration: "none" }}
                    title="Twitter"
                  >
                    Twitter
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: accentColor || "#ffffff", textDecoration: "none" }}
                    title="LinkedIn"
                  >
                    LinkedIn
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: accentColor || "#ffffff", textDecoration: "none" }}
                    title="GitHub"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Configurable navigation columns */}
            {navColumns.map((col, idx) => {
              const links = [
                { text: col.link1Text, url: col.link1Url },
                { text: col.link2Text, url: col.link2Url },
                { text: col.link3Text, url: col.link3Url },
                { text: col.link4Text, url: col.link4Url },
              ].filter((l) => Boolean(l.text));

              return (
                <div key={`col-${idx}`}>
                  <h5
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: accentColor || "#ffffff",
                      margin: "0 0 16px",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
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
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Newsletter block in footer */}
            {showNewsletter && (
              <div style={{ maxWidth: 300 }}>
                <h5
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: accentColor || "#ffffff",
                    margin: "0 0 12px",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Stay Connected
                </h5>
                <p style={{ fontSize: 13, margin: "0 0 12px", lineHeight: 1.5 }}>
                  {newsletterHeadline || "Get design updates delivered straight to your inbox."}
                </p>
                {subscribed ? (
                  <span style={{ fontSize: 13, color: "#10b981", fontWeight: 700 }}>
                    ✓ Subscribed!
                  </span>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubscribed(true);
                    }}
                    style={{ display: "flex", gap: 6 }}
                  >
                    <input
                      required
                      type="email"
                      placeholder={newsletterPlaceholder || "Your email..."}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
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
                        padding: "8px 14px",
                        borderRadius: 8,
                        backgroundColor: "#4f46e5",
                        color: "#ffffff",
                        fontSize: 13,
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Join
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

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
            <div style={{ display: "flex", gap: 16 }}>
              <a href="#" style={{ color: textColor, textDecoration: "none" }}>
                Privacy
              </a>
              <a href="#" style={{ color: textColor, textDecoration: "none" }}>
                Terms
              </a>
              <a href="#" style={{ color: textColor, textDecoration: "none" }}>
                Security
              </a>
            </div>
          </div>
        </AnimationWrapper>
      );
    },
  },
};

// Aliases for backward compatibility with templates that might reference Header
navigationComponents.Header = navigationComponents.Navbar;
