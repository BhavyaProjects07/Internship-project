
"use client";

import React, { useEffect, useId, useState } from "react";
import Link from "next/link";
import {
  getContentMaxWidth,
  getTypographyStyle,
  getButtonStyle,
} from "@/lib/sectionLayout";

/**
 * Resolve navigation destinations for a multi-website platform.
 *
 * Internal page: /website-slug/about
 * Homepage:      /website-slug
 * Anchor:        #services
 * External:      https://example.com
 */
function resolveHref(link, websiteSlug, linkType) {
  const value = (link || "").trim();

  if (!value) return "#";

  // Anchors remain on the current page.
  if (value.startsWith("#")) return value;

  // External and non-web destinations remain unchanged.
  if (
    /^(https?:\/\/|mailto:|tel:)/i.test(value) ||
    value.startsWith("//")
  ) {
    return value;
  }

  // Preserve backward compatibility with existing navigation data.
  if (linkType === "anchor") return value;
  if (linkType === "external") return value;

  const normalizedPath = value.startsWith("/")
    ? value
    : `/${value}`;

  // Without the website slug, leave the URL unchanged.
  // Public renderers must pass websiteSlug.
  if (!websiteSlug) return normalizedPath;

  const basePath = `/${websiteSlug}`;

  // Do not add the website slug twice.
  if (
    normalizedPath === basePath ||
    normalizedPath.startsWith(`${basePath}/`)
  ) {
    return normalizedPath;
  }

  // "/" means the current website's homepage.
  if (normalizedPath === "/") return basePath;

  // "/about" becomes "/website-slug/about".
  return `${basePath}${normalizedPath}`;
}

function isExternalHref(href) {
  return /^(https?:\/\/|\/\/|mailto:|tel:)/i.test(href);
}

function NavigationLink({
  item,
  index,
  config,
  websiteSlug,
  onNavigate,
  className,
}) {
  const href = resolveHref(
    item.link,
    websiteSlug,
    item.linkType
  );

  const style = getTypographyStyle(
    config,
    "navigation",
    index,
    "label"
  );

  const external = isExternalHref(href);

  if (external) {
    return (
      <a
        href={href}
        target={item.target || "_self"}
        rel={
          (item.target || "_self") === "_blank"
            ? "noopener noreferrer"
            : undefined
        }
        className={className}
        style={style}
        onClick={onNavigate}
      >
        {item.label || "Untitled link"}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={onNavigate}
    >
      {item.label || "Untitled link"}
    </Link>
  );
}

export default function Header({
  content = {},
  config = {},
  websiteSlug,
}) {
  const {
    logo,
    navigation = [],
    buttonText,
    buttonLink,
    buttonTarget = "_self",
  } = content;

  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    sticky = true,
  } = config;

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const menuId = useId();
  const contentMaxWidth = getContentMaxWidth(config);
  const btnStyleProps = getButtonStyle(
    config,
    "cta-button"
  );

  // Keep defaults for old templates, but prefer stored navigation.
  const defaultNav = [
    { id: "services", label: "Services", link: "#services", linkType: "anchor" },
    { id: "about", label: "About", link: "#about", linkType: "anchor" },
    { id: "work", label: "Work", link: "#portfolio", linkType: "anchor" },
    { id: "process", label: "Process", link: "#process", linkType: "anchor" },
    { id: "testimonials", label: "Testimonials", link: "#testimonials", linkType: "anchor" },
  ];

  const navItems =
    Array.isArray(navigation) && navigation.length > 0
      ? navigation
      : defaultNav;

  const homepageHref = websiteSlug
    ? `/${websiteSlug}`
    : "/";

  const ctaText = buttonText || "Let's Talk";
  const ctaHref = resolveHref(
    buttonLink || "#contact",
    websiteSlug
  );

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const ctaStyle = {
    ...getTypographyStyle(config, "cta-button"),
    ...btnStyleProps.style,
  };

  const ctaClassName = `inline-flex items-center justify-center rounded-lg bg-theme-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 ${
    btnStyleProps.className || ""
  }`;

  return (
    <header
      className={`@container z-50 w-full transition-colors duration-300 ${
        sticky
          ? "sticky top-0 border-b border-neutral-100 shadow-sm backdrop-blur-md"
          : "relative"
      }`}
      style={{
        backgroundColor: sticky
          ? `${backgroundColor}E6`
          : backgroundColor,
        color: textColor,
      }}
    >
      <div
        className="mx-auto flex min-h-16 w-full items-center justify-between px-4 @md:px-6 @lg:px-8"
        style={{ maxWidth: contentMaxWidth }}
      >
        {/* Brand */}
        <Link
          href={homepageHref}
          onClick={closeMobileMenu}
          className="flex-shrink-0 text-lg font-bold tracking-tight transition-opacity hover:opacity-80 @md:text-xl"
          style={getTypographyStyle(config, "logo")}
          aria-label={`${logo || "Website"} homepage`}
        >
          {logo || "Modern Agency"}
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 @md:flex @lg:gap-8"
        >
          {navItems.map((item, index) => (
            <NavigationLink
              key={item.id || `${item.label}-${index}`}
              item={item}
              index={index}
              config={config}
              websiteSlug={websiteSlug}
              className="whitespace-nowrap text-sm font-medium transition-opacity hover:opacity-70"
            />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <div className="hidden @md:block">
            {isExternalHref(ctaHref) ? (
              <a
                href={ctaHref}
                target={buttonTarget}
                rel={
                  buttonTarget === "_blank"
                    ? "noopener noreferrer"
                    : undefined
                }
                className={ctaClassName}
                style={ctaStyle}
              >
                {ctaText}
              </a>
            ) : (
              <Link
                href={ctaHref}
                className={ctaClassName}
                style={ctaStyle}
              >
                {ctaText}
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((open) => !open)
            }
            aria-expanded={mobileMenuOpen}
            aria-controls={menuId}
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 @md:hidden"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          id={menuId}
          className="absolute left-0 top-full w-full border-b border-neutral-100 bg-white shadow-lg @md:hidden"
          style={{ color: textColor }}
        >
          <nav
            aria-label="Mobile navigation"
            className="space-y-1 px-4 pb-6 pt-2"
          >
            {navItems.map((item, index) => (
              <NavigationLink
                key={item.id || `${item.label}-${index}`}
                item={item}
                index={index}
                config={config}
                websiteSlug={websiteSlug}
                onNavigate={closeMobileMenu}
                className="block rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-neutral-50"
              />
            ))}

            <div className="pb-2 pt-4">
              {isExternalHref(ctaHref) ? (
                <a
                  href={ctaHref}
                  target={buttonTarget}
                  rel={
                    buttonTarget === "_blank"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  onClick={closeMobileMenu}
                  className="block w-full rounded-lg bg-theme-primary px-5 py-3 text-center text-base font-semibold text-white transition-opacity hover:opacity-90"
                  style={ctaStyle}
                >
                  {ctaText}
                </a>
              ) : (
                <Link
                  href={ctaHref}
                  onClick={closeMobileMenu}
                  className="block w-full rounded-lg bg-theme-primary px-5 py-3 text-center text-base font-semibold text-white transition-opacity hover:opacity-90"
                  style={ctaStyle}
                >
                  {ctaText}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
