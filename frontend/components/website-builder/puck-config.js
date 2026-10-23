
import React from "react";

/*
 * Website Builder component configuration.
 *
 * Design goals:
 * - Reusable components rather than template-specific pages.
 * - Structured, serializable content and styling.
 * - Consistent styling controls across components.
 * - Nested layouts using Puck drop zones.
 * - A component library that can grow without duplicating render logic.
 */

const ALIGNMENT_OPTIONS = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
  { label: "Justify", value: "justify" },
];

const COLOR_SCHEME_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Transparent", value: "transparent" },
];

const WIDTH_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "25%", value: "25%" },
  { label: "50%", value: "50%" },
  { label: "75%", value: "75%" },
  { label: "100%", value: "100%" },
];

const FONT_WEIGHT_OPTIONS = [
  { label: "Normal (400)", value: "400" },
  { label: "Medium (500)", value: "500" },
  { label: "Semibold (600)", value: "600" },
  { label: "Bold (700)", value: "700" },
  { label: "Extra bold (800)", value: "800" },
];

const FONT_STYLE_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "Italic", value: "italic" },
];

const TEXT_DECORATION_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Underline", value: "underline" },
  { label: "Line through", value: "line-through" },
];

const DISPLAY_OPTIONS = [
  { label: "Block", value: "block" },
  { label: "Flex", value: "flex" },
  { label: "Grid", value: "grid" },
];

const FLEX_DIRECTION_OPTIONS = [
  { label: "Row", value: "row" },
  { label: "Column", value: "column" },
  { label: "Row reverse", value: "row-reverse" },
  { label: "Column reverse", value: "column-reverse" },
];

const JUSTIFY_OPTIONS = [
  { label: "Start", value: "flex-start" },
  { label: "Center", value: "center" },
  { label: "End", value: "flex-end" },
  { label: "Space between", value: "space-between" },
  { label: "Space around", value: "space-around" },
  { label: "Space evenly", value: "space-evenly" },
];

const ALIGN_ITEMS_OPTIONS = [
  { label: "Start", value: "flex-start" },
  { label: "Center", value: "center" },
  { label: "End", value: "flex-end" },
  { label: "Stretch", value: "stretch" },
];

const BORDER_STYLE_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
];

const OBJECT_FIT_OPTIONS = [
  { label: "Cover", value: "cover" },
  { label: "Contain", value: "contain" },
  { label: "Fill", value: "fill" },
];

const BACKGROUND_SIZE_OPTIONS = [
  { label: "Cover", value: "cover" },
  { label: "Contain", value: "contain" },
  { label: "Auto", value: "auto" },
];

const BACKGROUND_POSITION_OPTIONS = [
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

const SPACING_OPTIONS = [
  { label: "0", value: "0px" },
  { label: "4px", value: "4px" },
  { label: "8px", value: "8px" },
  { label: "12px", value: "12px" },
  { label: "16px", value: "16px" },
  { label: "24px", value: "24px" },
  { label: "32px", value: "32px" },
  { label: "48px", value: "48px" },
  { label: "64px", value: "64px" },
  { label: "96px", value: "96px" },
];

const selectField = (label, options) => ({
  type: "select",
  label,
  options,
});

const numberField = (label, min = 0, max = 200) => ({
  type: "number",
  label,
  min,
  max,
});

const textField = (label) => ({
  type: "text",
  label,
});

const textareaField = (label) => ({
  type: "textarea",
  label,
});


const navigationLinksField = {
  type: "custom",
  label: "Navigation links",
  render: ({ value, onChange }) => {
    const links = Array.isArray(value) ? value : [];

    const updateLink = (id, field, nextValue) => {
      onChange(
        links.map((link) =>
          link.id === id
            ? { ...link, [field]: nextValue }
            : link
        )
      );
    };

    const addLink = () => {
      onChange([
        ...links,
        {
          id: `nav-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
          label: "New link",
          href: "/",
        },
      ]);
    };

    const removeLink = (id) => {
      onChange(links.filter((link) => link.id !== id));
    };

    const moveLink = (index, direction) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= links.length) return;

      const nextLinks = [...links];
      [nextLinks[index], nextLinks[nextIndex]] = [
        nextLinks[nextIndex],
        nextLinks[index],
      ];

      onChange(nextLinks);
    };

    return (
      <div style={{ display: "grid", gap: 12 }}>
        {links.map((link, index) => (
          <div
            key={link.id || `legacy-${index}`}
            style={{
              display: "grid",
              gap: 8,
              padding: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <strong style={{ fontSize: 13 }}>
                Link {index + 1}
              </strong>

              <div style={{ display: "flex", gap: 4 }}>
                <button
                  type="button"
                  aria-label={`Move link ${index + 1} up`}
                  disabled={index === 0}
                  onClick={() => moveLink(index, -1)}
                >
                  ↑
                </button>

                <button
                  type="button"
                  aria-label={`Move link ${index + 1} down`}
                  disabled={index === links.length - 1}
                  onClick={() => moveLink(index, 1)}
                >
                  ↓
                </button>

                <button
                  type="button"
                  aria-label={`Delete link ${index + 1}`}
                  onClick={() => removeLink(link.id)}
                >
                  ×
                </button>
              </div>
            </div>

            <label style={{ display: "grid", gap: 4, fontSize: 12 }}>
              Label
              <input
                value={link.label || ""}
                onChange={(event) =>
                  updateLink(link.id, "label", event.target.value)
                }
                placeholder="About"
              />
            </label>

            <label style={{ display: "grid", gap: 4, fontSize: 12 }}>
              Destination URL
              <input
                value={link.href || ""}
                onChange={(event) =>
                  updateLink(link.id, "href", event.target.value)
                }
                placeholder="/about"
              />
            </label>
          </div>
        ))}

        <button type="button" onClick={addLink}>
          + Add navigation link
        </button>
      </div>
    );
  },
};




/*
 * Shared design controls.
 *
 * All dimensions are stored as strings where CSS units are useful.
 * This keeps the saved page structure flexible and serializable.
 */
const typographyFields = {
  fontFamily: selectField("Font family", [
    { label: "Inherit", value: "inherit" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Inter", value: "Inter, sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Times New Roman", value: '"Times New Roman", serif' },
    { label: "Monospace", value: "monospace" },
  ]),
  fontSize: numberField("Font size (px)", 8, 160),
  fontWeight: selectField("Font weight", FONT_WEIGHT_OPTIONS),
  fontStyle: selectField("Font style", FONT_STYLE_OPTIONS),
  textDecoration: selectField(
    "Text decoration",
    TEXT_DECORATION_OPTIONS
  ),
  lineHeight: numberField("Line height", 0.5, 4),
  letterSpacing: numberField("Letter spacing (px)", -10, 30),
  color: textField("Text color"),
  textAlign: selectField("Text alignment", ALIGNMENT_OPTIONS),
};

const spacingFields = {
  marginTop: selectField("Margin top", SPACING_OPTIONS),
  marginRight: selectField("Margin right", SPACING_OPTIONS),
  marginBottom: selectField("Margin bottom", SPACING_OPTIONS),
  marginLeft: selectField("Margin left", SPACING_OPTIONS),
  paddingTop: selectField("Padding top", SPACING_OPTIONS),
  paddingRight: selectField("Padding right", SPACING_OPTIONS),
  paddingBottom: selectField("Padding bottom", SPACING_OPTIONS),
  paddingLeft: selectField("Padding left", SPACING_OPTIONS),
};

const boxStyleFields = {
  backgroundColor: textField("Background color"),
  backgroundImage: textField("Background image URL"),
  backgroundSize: selectField(
    "Background image size",
    BACKGROUND_SIZE_OPTIONS
  ),
  backgroundPosition: selectField(
    "Background image position",
    BACKGROUND_POSITION_OPTIONS
  ),
  width: selectField("Width", WIDTH_OPTIONS),
  maxWidth: numberField("Maximum width (px)", 0, 3000),
  minHeight: numberField("Minimum height (px)", 0, 2000),
  borderStyle: selectField("Border style", BORDER_STYLE_OPTIONS),
  borderColor: textField("Border color"),
  borderWidth: numberField("Border width (px)", 0, 30),
  borderRadius: numberField("Corner radius (px)", 0, 200),
  boxShadow: textField(
    "Box shadow (CSS)"
  ),
};

const spacingDefaults = {
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "16px",
  marginLeft: "0px",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
};

const boxStyleDefaults = {
  backgroundColor: "transparent",
  backgroundImage: "",
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100%",
  maxWidth: 0,
  minHeight: 0,
  borderStyle: "none",
  borderColor: "#e5e7eb",
  borderWidth: 0,
  borderRadius: 0,
  boxShadow: "",
};


function buildBoxStyle(props = {}) {
  const {
    backgroundColor = "transparent",
    backgroundImage = "",
    backgroundSize = "cover",
    backgroundPosition = "center",
    width = "100%",
    maxWidth = 0,
    minHeight = 0,
    borderStyle = "none",
    borderColor = "#e5e7eb",
    borderWidth = 0,
    borderRadius = 0,
    boxShadow = "",

    marginTop = "0px",
    marginRight = "0px",
    marginBottom = "0px",
    marginLeft = "0px",

    paddingTop = "0px",
    paddingRight = "0px",
    paddingBottom = "0px",
    paddingLeft = "0px",
  } = props;

  return {
    boxSizing: "border-box",
    width,
    maxWidth: maxWidth > 0 ? `${maxWidth}px` : undefined,
    minHeight: minHeight > 0 ? `${minHeight}px` : undefined,

    marginTop,
    marginRight,
    marginBottom,
    marginLeft,

    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,

    backgroundColor,
    backgroundImage: backgroundImage
      ? `url("${backgroundImage.replace(/["\\\n\r]/g, "")}")`
      : undefined,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat: "no-repeat",
    borderStyle,
    borderColor,
    borderWidth: `${borderWidth}px`,
    borderRadius: `${borderRadius}px`,
    boxShadow: boxShadow || undefined,
  };
}


function buildTypographyStyle(props = {}) {
  const {
    fontFamily = "inherit",
    fontSize = 16,
    fontWeight = "400",
    fontStyle = "normal",
    textDecoration = "none",
    lineHeight = 1.6,
    letterSpacing = 0,
    color = "#171717",
    textAlign = "left",
  } = props;

  return {
    fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight,
    fontStyle,
    textDecoration,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    color,
    textAlign,
  };
}

function buildElementStyle(props = {}) {
  return {
    ...buildBoxStyle(props),
    ...buildTypographyStyle(props),
  };
}



function NavbarRender({
  logoText = "Your Brand",
  logoUrl = "",
  links = [],
  backgroundColor = "#ffffff",
  textColor = "#111827",
  linkColor = "#374151",
  fontSize = 15,
  paddingY = 16,
  paddingX = 24,
  gap = 24,
  alignment = "between",
  borderColor = "#e5e7eb",
  borderWidth = 1,
  sticky = false,

  // Advanced customization
  logoWidth = 160,
  logoHeight = 48,
  containerWidth = "1200px",
  menuPosition = "right",
  fontWeight = "500",
  linkPaddingX = 8,
  linkPaddingY = 6,
  linkBorderRadius = 6,
  hoverColor = "#111827",
  hoverBackgroundColor = "#f3f4f6",
  headerMode = "static",
  shadow = "none",
  showCTA = false,
  ctaLabel = "Get Started",
  ctaHref = "/contact",
  ctaBackgroundColor = "#111827",
  ctaTextColor = "#ffffff",
  ctaBorderRadius = 8,
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [hoveredLink, setHoveredLink] = React.useState(null);

  const safeLinks = (Array.isArray(links) ? links : []).filter(
    (link) =>
      link &&
      typeof link.label === "string" &&
      typeof link.href === "string" &&
      !/^\s*(javascript|data):/i.test(link.href)
  );

  // Preserve the old sticky setting for existing saved Navbar blocks.
  const mode =
    headerMode === "static" && sticky ? "sticky" : headerMode;

  const isPinned = mode === "sticky" || mode === "fixed";

  const navAlignment =
    menuPosition === "left"
      ? "flex-start"
      : menuPosition === "center"
        ? "center"
        : "flex-end";

  const justifyContent =
    alignment === "left"
      ? "flex-start"
      : alignment === "right"
        ? "flex-end"
        : "space-between";

  const safeCtaHref =
    typeof ctaHref === "string" &&
    !/^\s*(javascript|data):/i.test(ctaHref)
      ? ctaHref
      : "/contact";

  return (
    <header
      className="puck-navbar-enhanced"
      style={{
        position:
          mode === "fixed"
            ? "fixed"
            : mode === "sticky"
              ? "sticky"
              : "relative",
        top: isPinned ? 0 : undefined,
        left: mode === "fixed" ? 0 : undefined,
        right: mode === "fixed" ? 0 : undefined,
        width: mode === "fixed" ? "100%" : undefined,
        zIndex: isPinned ? 100 : undefined,
        boxSizing: "border-box",
        backgroundColor:
          mode === "transparent" ? "transparent" : backgroundColor,
        color: textColor,
        borderBottom:
          borderWidth > 0
            ? `${borderWidth}px solid ${borderColor}`
            : undefined,
        boxShadow:
          shadow === "small"
            ? "0 2px 8px rgba(0,0,0,0.08)"
            : shadow === "medium"
              ? "0 4px 16px rgba(0,0,0,0.12)"
              : shadow === "large"
                ? "0 8px 28px rgba(0,0,0,0.16)"
                : undefined,
      }}
    >
      <style>{`
        .puck-navbar-enhanced .puck-navbar-inner {
          margin-left: auto;
          margin-right: auto;
        }

        .puck-navbar-enhanced .puck-navbar-mobile-toggle {
          display: none;
        }

        .puck-navbar-enhanced .puck-navbar-links {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .puck-navbar-enhanced .puck-navbar-link:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .puck-navbar-enhanced .puck-navbar-inner {
            flex-wrap: wrap;
          }

          .puck-navbar-enhanced .puck-navbar-mobile-toggle {
            display: inline-flex !important;
          }

          .puck-navbar-enhanced .puck-navbar-links {
            display: none !important;
            flex-basis: 100%;
            flex-direction: column;
            align-items: stretch !important;
            gap: 4px !important;
            padding-top: 12px;
          }

          .puck-navbar-enhanced .puck-navbar-links.is-open {
            display: flex !important;
          }

          .puck-navbar-enhanced .puck-navbar-link {
            width: 100%;
            box-sizing: border-box;
          }

          .puck-navbar-enhanced .puck-navbar-cta {
            width: 100%;
            box-sizing: border-box;
            margin-top: 8px;
          }
        }
      `}</style>

      <div
        className="puck-navbar-inner"
        style={{
          boxSizing: "border-box",
          width: "100%",
          maxWidth: containerWidth || "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent,
          flexWrap: "wrap",
          gap,
          padding: `${paddingY}px ${paddingX}px`,
        }}
      >
        <a
          href="/"
          aria-label={logoText || "Home"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            flexShrink: 0,
            color: textColor,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={logoText || "Brand logo"}
              style={{
                display: "block",
                width: `${logoWidth}px`,
                height: `${logoHeight}px`,
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            logoText || "Your Brand"
          )}
        </a>

        <button
          type="button"
          className="puck-navbar-mobile-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            marginLeft: "auto",
            alignItems: "center",
            justifyContent: "center",
            padding: 8,
            border: `1px solid ${borderColor}`,
            borderRadius: 6,
            background: "transparent",
            color: textColor,
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          aria-label="Main navigation"
          className={
            menuOpen
              ? "puck-navbar-links is-open"
              : "puck-navbar-links"
          }
          style={{
            flex: "1 1 auto",
            justifyContent: navAlignment,
            gap,
          }}
        >
          {safeLinks.map((link, index) => (
            <a
              key={link.id || `${link.href}-${index}`}
              href={link.href}
              className="puck-navbar-link"
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => setHoveredLink(index)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                color:
                  hoveredLink === index
                    ? hoverColor
                    : linkColor || textColor,
                backgroundColor:
                  hoveredLink === index
                    ? hoverBackgroundColor
                    : "transparent",
                fontSize,
                fontWeight,
                textDecoration: "none",
                padding: `${linkPaddingY}px ${linkPaddingX}px`,
                borderRadius: `${linkBorderRadius}px`,
                transition:
                  "color 150ms ease, background-color 150ms ease",
                whiteSpace: "nowrap",
              }}
            >
              {link.label}
            </a>
          ))}

          {showCTA && ctaLabel ? (
            <a
              href={safeCtaHref}
              className="puck-navbar-cta"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: `${Math.max(8, linkPaddingY)}px ${Math.max(
                  14,
                  linkPaddingX + 12
                )}px`,
                borderRadius: `${ctaBorderRadius}px`,
                backgroundColor: ctaBackgroundColor,
                color: ctaTextColor,
                textDecoration: "none",
                fontSize,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {ctaLabel}
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}


function HeroRender({
  layout = "split",
  eyebrow = "YOUR NEXT ADVENTURE",
  title = "The Journey Beyond Your Imaginary",
  description = "Discover extraordinary experiences and create memories that last a lifetime.",
  primaryButtonText = "Explore Now",
  primaryButtonUrl = "#explore",
  secondaryButtonText = "Play the video",
  secondaryButtonUrl = "",
  showSecondaryButton = true,

  backgroundImage = "",
  backgroundPosition = "center",
  backgroundSize = "cover",
  backgroundColor = "#111827",
  overlayColor = "#000000",
  overlayOpacity = 35,

  textColor = "#ffffff",
  accentColor = "#38bdf8",
  contentAlignment = "left",
  verticalAlignment = "center",
  contentWidth = 620,

  height = 680,
  minHeight = 500,
  paddingX = 48,
  paddingY = 64,

  imageUrl = "",
  imageAlt = "Hero visual",
  imageWidth = 50,

  primaryButtonColor = "#ffffff",
  primaryButtonTextColor = "#111827",
  borderRadius = 0,

  animation = "fade-up",
  animationDuration = 800,
}) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const isSplit = layout === "split";
  const isCentered = contentAlignment === "center";
  const isRight = contentAlignment === "right";

  const safeUrl = (url) =>
    typeof url === "string" &&
    !/^\s*(javascript|data):/i.test(url)
      ? url
      : "#";

  const animationStyles = {
    none: {
      opacity: 1,
      transform: "none",
    },
    "fade-up": {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
    },
    "fade-in": {
      opacity: visible ? 1 : 0,
      transform: "none",
    },
    "slide-left": {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(32px)",
    },
    "slide-right": {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(-32px)",
    },
    zoom: {
      opacity: visible ? 1 : 0,
      transform: visible ? "scale(1)" : "scale(0.96)",
    },
  };

  const selectedAnimation =
    animationStyles[animation] || animationStyles["fade-up"];

  return (
    <section
      style={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        boxSizing: "border-box",
        width: "100%",
        minHeight: `${minHeight}px`,
        height: height > 0 ? `${height}px` : "auto",
        padding: `${paddingY}px ${paddingX}px`,
        display: "flex",
        alignItems:
          verticalAlignment === "top"
            ? "flex-start"
            : verticalAlignment === "bottom"
              ? "flex-end"
              : "center",
        justifyContent: "center",
        backgroundColor,
        backgroundImage: backgroundImage
          ? `url("${backgroundImage.replace(/["\\\n\r]/g, "")}")`
          : undefined,
        backgroundSize,
        backgroundPosition,
        backgroundRepeat: "no-repeat",
        borderRadius: `${borderRadius}px`,
        color: textColor,
      }}
    >
      {/* Background overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          backgroundColor: overlayColor,
          opacity: Math.min(100, Math.max(0, overlayOpacity)) / 100,
          pointerEvents: "none",
        }}
      />

      {/* Content layout */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1320,
          margin: "0 auto",
          display: "flex",
          flexDirection: isSplit ? "row" : "column",
          alignItems: "center",
          justifyContent: isSplit ? "space-between" : "center",
          gap: 40,
          textAlign: contentAlignment,
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            width: isSplit ? `${100 - imageWidth}%` : "100%",
            maxWidth: isSplit ? `${contentWidth}px` : `${contentWidth}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: isCentered
              ? "center"
              : isRight
                ? "flex-end"
                : "flex-start",
            textAlign: contentAlignment,
            ...selectedAnimation,
            transition:
              animation === "none"
                ? "none"
                : `opacity ${animationDuration}ms ease, transform ${animationDuration}ms ease`,
          }}
        >
          {eyebrow ? (
            <p
              style={{
                margin: "0 0 18px",
                color: accentColor,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </p>
          ) : null}

          <h1
            style={{
              margin: "0 0 20px",
              maxWidth: "100%",
              fontSize: "clamp(36px, 5vw, 68px)",
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </h1>

          {description ? (
            <p
              style={{
                margin: "0 0 28px",
                maxWidth: 560,
                fontSize: 17,
                lineHeight: 1.8,
                opacity: 0.9,
              }}
            >
              {description}
            </p>
          ) : null}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: isCentered
                ? "center"
                : isRight
                  ? "flex-end"
                  : "flex-start",
              alignItems: "center",
              gap: 12,
            }}
          >
            {primaryButtonText ? (
              <a
                href={safeUrl(primaryButtonUrl)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 46,
                  padding: "12px 24px",
                  boxSizing: "border-box",
                  borderRadius: 8,
                  backgroundColor: primaryButtonColor,
                  color: primaryButtonTextColor,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {primaryButtonText}
              </a>
            ) : null}

            {showSecondaryButton && secondaryButtonText ? (
              <a
                href={safeUrl(secondaryButtonUrl)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 46,
                  padding: "12px 20px",
                  boxSizing: "border-box",
                  border: "1px solid rgba(255,255,255,0.65)",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.08)",
                  color: textColor,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  backdropFilter: "blur(8px)",
                }}
              >
                ▶ {secondaryButtonText}
              </a>
            ) : null}
          </div>
        </div>

        {isSplit && imageUrl ? (
          <div
            style={{
              width: `${imageWidth}%`,
              flexShrink: 0,
              ...selectedAnimation,
              transition:
                animation === "none"
                  ? "none"
                  : `opacity ${animationDuration}ms ease, transform ${animationDuration}ms ease`,
            }}
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              style={{
                display: "block",
                width: "100%",
                maxHeight: height > 0 ? `${height - paddingY * 2}px` : 560,
                objectFit: "cover",
                borderRadius: 18,
              }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}


const commonDesignDefaults = {
  ...spacingDefaults,
  ...boxStyleDefaults,
};

const typographyDefaults = {
  fontFamily: "inherit",
  fontSize: 16,
  fontWeight: "400",
  fontStyle: "normal",
  textDecoration: "none",
  lineHeight: 1.6,
  letterSpacing: 0,
  color: "#171717",
  textAlign: "left",
};

/*
 * All available building blocks are registered here.
 *
 * Nested components use Puck's renderDropZone API so that
 * containers and layouts can hold other components.
 */
const puckConfig = {
  
  root: {
    fields: {
      title: textField("Page title"),
      backgroundColor: textField("Page background"),
      contentWidth: selectField("Content width", [
        { label: "Narrow", value: "760px" },
        { label: "Standard", value: "1100px" },
        { label: "Wide", value: "1320px" },
        { label: "Full width", value: "100%" },
      ]),
    },
    defaultProps: {
      title: "Untitled page",
      backgroundColor: "#ffffff",
      contentWidth: "100%",
    },
    
render: ({ children, backgroundColor, contentWidth }) => (
  <div
    style={{
      boxSizing: "border-box",
      backgroundColor: backgroundColor || "#ffffff",
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
),

  },


  categories: {
    layout: {
      title: "Layout",
      components: ["Container", "Columns", "Spacer", "Divider"],
      defaultExpanded: true,
    },
    typography: {
      title: "Typography",
      components: ["Heading", "Text", "RichText", "Label"],
      defaultExpanded: true,
    },
    media: {
      title: "Media",
      components: ["Image"],
      defaultExpanded: true,
    },
    actions: {
      title: "Actions",
      components: ["Button", "Link"],
      defaultExpanded: true,
    },
    content: {
      title: "Content",
      components: ["List", "Badge", "Card"],
      defaultExpanded: true,
    },
    navigation: {
      title: "Navigation",
      components: ["Navbar"],
      defaultExpanded: true,
    },

    hero: {
  title: "Hero Sections",
  components: ["Hero"],
  defaultExpanded: true,
},
  },


  components: {

    Hero: {
  label: "Advanced Hero",
  fields: {
    layout: selectField("Layout", [
      { label: "Full background", value: "background" },
      { label: "Split layout", value: "split" },
    ]),
    eyebrow: textField("Eyebrow text"),
    title: textField("Main heading"),
    description: textareaField("Description"),

    primaryButtonText: textField("Primary button label"),
    primaryButtonUrl: textField("Primary button URL"),
    showSecondaryButton: {
      type: "radio",
      label: "Show secondary button",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    secondaryButtonText: textField("Secondary button label"),
    secondaryButtonUrl: textField("Secondary button URL"),

    backgroundImage: textField("Background image URL"),
    backgroundPosition: selectField("Background position", [
      { label: "Center", value: "center" },
      { label: "Top", value: "top" },
      { label: "Bottom", value: "bottom" },
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ]),
    backgroundSize: selectField("Background sizing", [
      { label: "Cover", value: "cover" },
      { label: "Contain", value: "contain" },
    ]),
    backgroundColor: textField("Background color"),
    overlayColor: textField("Overlay color"),
    overlayOpacity: numberField("Overlay opacity (%)", 0, 100),

    textColor: textField("Text color"),
    accentColor: textField("Accent color"),
    contentAlignment: selectField("Content alignment", [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
    ]),
    verticalAlignment: selectField("Vertical alignment", [
      { label: "Top", value: "top" },
      { label: "Center", value: "center" },
      { label: "Bottom", value: "bottom" },
    ]),
    contentWidth: numberField("Content maximum width (px)", 280, 1200),

    height: numberField("Height (px)", 0, 1600),
    minHeight: numberField("Minimum height (px)", 200, 1200),
    paddingX: numberField("Horizontal padding (px)", 0, 200),
    paddingY: numberField("Vertical padding (px)", 0, 200),

    imageUrl: textField("Split image URL"),
    imageAlt: textField("Split image alt text"),
    imageWidth: numberField("Image width (%)", 25, 70),

    primaryButtonColor: textField("Primary button background"),
    primaryButtonTextColor: textField("Primary button text color"),
    borderRadius: numberField("Hero corner radius (px)", 0, 80),

    animation: selectField("Entrance animation", [
      { label: "None", value: "none" },
      { label: "Fade up", value: "fade-up" },
      { label: "Fade in", value: "fade-in" },
      { label: "Slide left", value: "slide-left" },
      { label: "Slide right", value: "slide-right" },
      { label: "Zoom", value: "zoom" },
    ]),
    animationDuration: numberField("Animation duration (ms)", 100, 3000),
  },

  defaultProps: {
    layout: "split",
    eyebrow: "YOUR NEXT ADVENTURE",
    title: "The Journey Beyond Your Imaginary",
    description:
      "Discover extraordinary experiences and create memories that last a lifetime.",
    primaryButtonText: "Explore Now",
    primaryButtonUrl: "#explore",
    secondaryButtonText: "Play the video",
    secondaryButtonUrl: "",
    showSecondaryButton: true,

    backgroundImage: "",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor: "#111827",
    overlayColor: "#000000",
    overlayOpacity: 35,

    textColor: "#ffffff",
    accentColor: "#38bdf8",
    contentAlignment: "left",
    verticalAlignment: "center",
    contentWidth: 620,

    height: 680,
    minHeight: 500,
    paddingX: 48,
    paddingY: 64,

    imageUrl: "",
    imageAlt: "Hero visual",
    imageWidth: 50,

    primaryButtonColor: "#ffffff",
    primaryButtonTextColor: "#111827",
    borderRadius: 0,

    animation: "fade-up",
    animationDuration: 800,
  },

  render: (props) => <HeroRender {...props} />,
},



Navbar: {
  label: "Navbar",
    fields: {
  // Logo
  logoText: textField("Brand name"),
  logoUrl: textField("Logo image URL"),
  logoWidth: numberField("Logo width (px)", 20, 400),
  logoHeight: numberField("Logo height (px)", 16, 160),

  // Navigation links
  links: navigationLinksField,
  menuPosition: selectField("Navigation position", [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ]),
  fontSize: numberField("Link font size (px)", 10, 32),
  fontWeight: selectField("Link font weight", FONT_WEIGHT_OPTIONS),
  linkColor: textField("Navigation link color"),
  hoverColor: textField("Link hover text color"),
  hoverBackgroundColor: textField("Link hover background"),
  linkPaddingX: numberField("Link horizontal padding (px)", 0, 32),
  linkPaddingY: numberField("Link vertical padding (px)", 0, 24),
  linkBorderRadius: numberField("Link corner radius (px)", 0, 40),

  // Header layout
  backgroundColor: textField("Background color"),
  textColor: textField("Brand text color"),
  containerWidth: selectField("Content max width", [
    { label: "Full width", value: "100%" },
    { label: "1100px", value: "1100px" },
    { label: "1200px", value: "1200px" },
    { label: "1320px", value: "1320px" },
    { label: "1440px", value: "1440px" },
  ]),
  paddingY: numberField("Vertical padding (px)", 0, 80),
  paddingX: numberField("Horizontal padding (px)", 0, 120),
  gap: numberField("Spacing between items (px)", 0, 80),
  alignment: selectField("Header alignment", [
    { label: "Space between", value: "between" },
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
  ]),

  // Position and appearance
  headerMode: selectField("Header position mode", [
    { label: "Static", value: "static" },
    { label: "Sticky", value: "sticky" },
    { label: "Fixed", value: "fixed" },
    { label: "Transparent", value: "transparent" },
  ]),
  shadow: selectField("Header shadow", [
    { label: "None", value: "none" },
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
  ]),
  borderColor: textField("Bottom border color"),
  borderWidth: numberField("Bottom border width (px)", 0, 10),

  // Call-to-action button
  showCTA: {
    type: "radio",
    label: "Show CTA button",
    options: [
      { label: "Enabled", value: true },
      { label: "Disabled", value: false },
    ],
  },
  ctaLabel: textField("CTA button label"),
  ctaHref: textField("CTA button URL"),
  ctaBackgroundColor: textField("CTA background color"),
  ctaTextColor: textField("CTA text color"),
  ctaBorderRadius: numberField("CTA corner radius (px)", 0, 40),

  // Keep for compatibility with existing saved Navbar blocks
  sticky: {
    type: "radio",
    label: "Legacy sticky setting",
    options: [
      { label: "Enabled", value: true },
      { label: "Disabled", value: false },
    ],
  },
},

defaultProps: {
  logoText: "Your Brand",
  logoUrl: "",
  logoWidth: 160,
  logoHeight: 48,

  links: [
    { id: "nav-home", label: "Home", href: "/" },
    { id: "nav-about", label: "About", href: "/about" },
    { id: "nav-contact", label: "Contact", href: "/contact" },
  ],

  backgroundColor: "#ffffff",
  textColor: "#111827",
  linkColor: "#374151",
  hoverColor: "#111827",
  hoverBackgroundColor: "#f3f4f6",

  fontSize: 15,
  fontWeight: "500",
  linkPaddingX: 8,
  linkPaddingY: 6,
  linkBorderRadius: 6,

  containerWidth: "1200px",
  paddingY: 16,
  paddingX: 24,
  gap: 24,
  alignment: "between",
  menuPosition: "right",

  headerMode: "static",
  shadow: "none",
  borderColor: "#e5e7eb",
  borderWidth: 1,
  sticky: false,

  showCTA: false,
  ctaLabel: "Get Started",
  ctaHref: "/contact",
  ctaBackgroundColor: "#111827",
  ctaTextColor: "#ffffff",
  ctaBorderRadius: 8,
},

  defaultProps: {
    logoText: "Your Brand",
    logoUrl: "",
    links: [
      { id: "nav-home", label: "Home", href: "/" },
      { id: "nav-about", label: "About", href: "/about" },
      { id: "nav-contact", label: "Contact", href: "/contact" },
    ],
    backgroundColor: "#ffffff",
    textColor: "#111827",
    linkColor: "#374151",
    fontSize: 15,
    paddingY: 16,
    paddingX: 24,
    gap: 24,
    alignment: "between",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    sticky: false,
  },

  render: (props) => <NavbarRender {...props} />,
},

    Heading: {
      label: "Heading",
      fields: {
        text: textField("Heading text"),
        level: selectField("Heading level", [
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
          { label: "H4", value: "h4" },
          { label: "H5", value: "h5" },
          { label: "H6", value: "h6" },
        ]),
        ...typographyFields,
        ...spacingFields,
        ...boxStyleFields,
      },
      defaultProps: {
        text: "Your heading goes here",
        level: "h2",
        ...typographyDefaults,
        fontSize: 36,
        fontWeight: "700",
        lineHeight: 1.2,
        ...commonDesignDefaults,
        marginBottom: "16px",
      },
      render: ({ text, level, ...props }) => {
        const allowedLevels = ["h1", "h2", "h3", "h4", "h5", "h6"];
        const Tag = allowedLevels.includes(level) ? level : "h2";

        return (
          <Tag style={buildElementStyle(props)}>
            {text}
          </Tag>
        );
      },
    },

    Text: {
      label: "Paragraph",
      fields: {
        text: textareaField("Paragraph text"),
        ...typographyFields,
        ...spacingFields,
        ...boxStyleFields,
      },
      defaultProps: {
        text: "Write your paragraph here. Select this element to customize its content and appearance.",
        ...typographyDefaults,
        fontSize: 16,
        color: "#525252",
        lineHeight: 1.8,
        ...commonDesignDefaults,
      },
      render: ({ text, ...props }) => (
        <p style={buildElementStyle(props)}>
          {text}
        </p>
      ),
    },

    RichText: {
      label: "Rich text",
      fields: {
        text: textareaField("Text content"),
        ...typographyFields,
        ...spacingFields,
        ...boxStyleFields,
      },
      defaultProps: {
        text: "Add a longer text block here.",
        ...typographyDefaults,
        fontSize: 16,
        color: "#404040",
        lineHeight: 1.8,
        ...commonDesignDefaults,
      },
      render: ({ text, ...props }) => (
        <div style={buildElementStyle(props)}>
          {text}
        </div>
      ),
    },

    Label: {
      label: "Small label",
      fields: {
        text: textField("Label text"),
        ...typographyFields,
        ...spacingFields,
        ...boxStyleFields,
      },
      defaultProps: {
        text: "INTRODUCTION",
        ...typographyDefaults,
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.5,
        color: "#6741ff",
        ...commonDesignDefaults,
      },
      render: ({ text, ...props }) => (
        <span
          style={{
            ...buildElementStyle(props),
            display: "inline-block",
          }}
        >
          {text}
        </span>
      ),
    },

    Button: {
      label: "Button",
      fields: {
        label: textField("Button label"),
        href: textField("Destination URL"),
        target: selectField("Open link in", [
          { label: "Same tab", value: "_self" },
          { label: "New tab", value: "_blank" },
        ]),
        backgroundColor: textField("Background color"),
        color: textField("Text color"),
        fontSize: numberField("Font size (px)", 8, 48),
        fontWeight: selectField("Font weight", FONT_WEIGHT_OPTIONS),
        paddingY: numberField("Vertical padding (px)", 0, 80),
        paddingX: numberField("Horizontal padding (px)", 0, 120),
        borderRadius: numberField("Corner radius (px)", 0, 100),
        borderStyle: selectField("Border style", BORDER_STYLE_OPTIONS),
        borderColor: textField("Border color"),
        borderWidth: numberField("Border width (px)", 0, 20),
        width: selectField("Width", WIDTH_OPTIONS),
        align: selectField("Alignment", ALIGNMENT_OPTIONS),
        marginTop: selectField("Margin top", SPACING_OPTIONS),
        marginBottom: selectField("Margin bottom", SPACING_OPTIONS),
      },
      defaultProps: {
        label: "Get started",
        href: "#contact",
        target: "_self",
        backgroundColor: "#6741ff",
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
        paddingY: 12,
        paddingX: 24,
        borderRadius: 8,
        borderStyle: "none",
        borderColor: "#6741ff",
        borderWidth: 0,
        width: "auto",
        align: "left",
        marginTop: "0px",
        marginBottom: "16px",
      },
      render: ({
        label,
        href,
        target,
        backgroundColor,
        color,
        fontSize,
        fontWeight,
        paddingY,
        paddingX,
        borderRadius,
        borderStyle,
        borderColor,
        borderWidth,
        width,
        align,
        marginTop,
        marginBottom,
      }) => (
        <div
          style={{
            width: "100%",
            textAlign: align,
            marginTop,
            marginBottom,
          }}
        >
          <a
            href={href || "#"}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            style={{
              display: width === "100%" ? "flex" : "inline-flex",
              width,
              boxSizing: "border-box",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor,
              color,
              fontSize: `${fontSize}px`,
              fontWeight,
              padding: `${paddingY}px ${paddingX}px`,
              borderRadius: `${borderRadius}px`,
              border: `${borderWidth}px ${borderStyle} ${borderColor}`,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {label}
          </a>
        </div>
      ),
    },

    Link: {
      label: "Text link",
      fields: {
        text: textField("Link text"),
        href: textField("Destination URL"),
        target: selectField("Open link in", [
          { label: "Same tab", value: "_self" },
          { label: "New tab", value: "_blank" },
        ]),
        ...typographyFields,
        ...spacingFields,
      },
      defaultProps: {
        text: "Learn more",
        href: "#",
        target: "_self",
        ...typographyDefaults,
        color: "#6741ff",
        textDecoration: "underline",
        fontWeight: "600",
        ...spacingDefaults,
      },
      render: ({ text, href, target, ...props }) => (
        <a
          href={href || "#"}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          style={{
            ...buildElementStyle(props),
            display: "inline-block",
          }}
        >
          {text}
        </a>
      ),
    },

    Image: {
      label: "Image",
      fields: {
        src: textField("Image URL"),
        alt: textField("Alternative text"),
        caption: textField("Caption"),
        width: selectField("Width", WIDTH_OPTIONS),
        height: numberField("Height (px)", 0, 2000),
        objectFit: selectField("Image fit", OBJECT_FIT_OPTIONS),
        objectPosition: selectField("Image position", [
          { label: "Center", value: "center" },
          { label: "Top", value: "top" },
          { label: "Bottom", value: "bottom" },
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ]),
        borderRadius: numberField("Corner radius (px)", 0, 200),
        opacity: numberField("Opacity (%)", 0, 100),
        ...spacingFields,
      },
      defaultProps: {
        src: "https://placehold.co/1200x700?text=Your+Image",
        alt: "Website image",
        caption: "",
        width: "100%",
        height: 0,
        objectFit: "cover",
        objectPosition: "center",
        borderRadius: 12,
        opacity: 100,
        ...spacingDefaults,
      },
      render: ({
        src,
        alt,
        caption,
        width,
        height,
        objectFit,
        objectPosition,
        borderRadius,
        opacity,
        ...spacing
      }) => (
          
            
          <figure
            style={{
              ...buildBoxStyle(spacing),
              width,
              boxSizing: "border-box",
              marginTop: spacing.marginTop ?? "0px",
              marginRight: spacing.marginRight ?? "0px",
              marginBottom: spacing.marginBottom ?? "0px",
              marginLeft: spacing.marginLeft ?? "0px",
            }}
          >


          <img
            src={src || "https://placehold.co/1200x700?text=Add+an+image"}
            alt={alt || ""}
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              height: height > 0 ? `${height}px` : "auto",
              objectFit,
              objectPosition,
              borderRadius: `${borderRadius}px`,
              opacity: opacity / 100,
            }}
          />
          {caption ? (
            <figcaption
              style={{
                marginTop: 8,
                color: "#737373",
                fontSize: 13,
              }}
            >
              {caption}
            </figcaption>
          ) : null}
        </figure>
      ),
    },

    
Container: {
  label: "Container",
  fields: {
    content: { type: "slot" },
    ...spacingFields,
    ...boxStyleFields,
    display: selectField("Display mode", DISPLAY_OPTIONS),
    flexDirection: selectField("Flex direction", FLEX_DIRECTION_OPTIONS),
    justifyContent: selectField("Justify content", JUSTIFY_OPTIONS),
    alignItems: selectField("Align items", ALIGN_ITEMS_OPTIONS),
    gap: numberField("Gap (px)", 0, 200),
    overflow: selectField("Overflow", [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
      { label: "Auto", value: "auto" },
    ]),
  },
  defaultProps: {
    content: [],
    ...commonDesignDefaults,
    backgroundColor: "#f8fafc",
    paddingTop: "24px",
    paddingRight: "24px",
    paddingBottom: "24px",
    paddingLeft: "24px",
    borderRadius: 12,
    minHeight: 80,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    gap: 16,
    overflow: "visible",
  },
  render: ({
    content: Content,
    display,
    flexDirection,
    justifyContent,
    alignItems,
    gap,
    overflow,
    ...props
  }) => (
    <div
      style={{
        ...buildBoxStyle(props),
        display,
        flexDirection: display === "flex" ? flexDirection : undefined,
        justifyContent: display === "flex" ? justifyContent : undefined,
        alignItems: display === "flex" ? alignItems : undefined,
        gap: `${gap}px`,
        overflow,
        minWidth: 0,
      }}
    >
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${gap}px`,
          minWidth: 0,
          width: "100%",
        }}
        minEmptyHeight="80px"
      />
    </div>
  ),
},


    
Columns: {
  label: "Columns",
  fields: {
    column1: { type: "slot" },
    column2: { type: "slot" },
    column3: { type: "slot" },
    column4: { type: "slot" },
    columns: selectField("Grid columns", [
      { label: "2 columns", value: "2" },
      { label: "3 columns", value: "3" },
      { label: "4 columns", value: "4" },
    ]),
    gap: numberField("Column gap (px)", 0, 200),
    alignItems: selectField("Vertical alignment", ALIGN_ITEMS_OPTIONS),
    ...spacingFields,
    ...boxStyleFields,
  },
  defaultProps: {
    column1: [],
    column2: [],
    column3: [],
    column4: [],
    columns: "2",
    gap: 24,
    alignItems: "stretch",
    ...commonDesignDefaults,
    backgroundColor: "transparent",
  },
  render: ({
    column1: Column1,
    column2: Column2,
    column3: Column3,
    column4: Column4,
    columns,
    gap,
    alignItems,
    ...props
  }) => (
    <div
      style={{
        ...buildBoxStyle(props),
        display: "grid",
        gridTemplateColumns:
          `repeat(${Math.min(4, Math.max(2, Number(columns) || 2))}, minmax(0, 1fr))`,
        alignItems,
        gap: `${gap}px`,
      }}
    >
      {[Column1, Column2, Column3, Column4].map((Column, index) => (
        <div
          key={index}
          style={{
            minWidth: 0,
            gridColumn: index < Number(columns) ? undefined : "auto",
          }}
        >
          <Column minEmptyHeight="100px" />
        </div>
      ))}
    </div>
  ),
},


    Spacer: {
      label: "Spacer",
      fields: {
        height: numberField("Height (px)", 0, 600),
      },
      defaultProps: {
        height: 32,
      },
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

    Divider: {
      label: "Divider",
      fields: {
        color: textField("Line color"),
        thickness: numberField("Thickness (px)", 1, 30),
        width: selectField("Width", WIDTH_OPTIONS),
        style: selectField("Line style", BORDER_STYLE_OPTIONS),
        marginTop: selectField("Margin top", SPACING_OPTIONS),
        marginBottom: selectField("Margin bottom", SPACING_OPTIONS),
      },
      defaultProps: {
        color: "#e5e7eb",
        thickness: 1,
        width: "100%",
        style: "solid",
        marginTop: "16px",
        marginBottom: "16px",
      },
      render: ({
        color,
        thickness,
        width,
        style,
        marginTop,
        marginBottom,
      }) => (
        <hr
          style={{
            width,
            border: 0,
            borderTop: `${thickness}px ${style} ${color}`,
            marginTop,
            marginBottom,
          }}
        />
      ),
    },

    Badge: {
      label: "Badge",
      fields: {
        text: textField("Badge text"),
        backgroundColor: textField("Background color"),
        color: textField("Text color"),
        fontSize: numberField("Font size (px)", 8, 32),
        paddingY: numberField("Vertical padding (px)", 0, 40),
        paddingX: numberField("Horizontal padding (px)", 0, 60),
        borderRadius: numberField("Corner radius (px)", 0, 100),
      },
      defaultProps: {
        text: "New",
        backgroundColor: "#ede9fe",
        color: "#5b21b6",
        fontSize: 12,
        paddingY: 6,
        paddingX: 12,
        borderRadius: 999,
      },
      render: ({
        text,
        backgroundColor,
        color,
        fontSize,
        paddingY,
        paddingX,
        borderRadius,
      }) => (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor,
            color,
            fontSize: `${fontSize}px`,
            padding: `${paddingY}px ${paddingX}px`,
            borderRadius: `${borderRadius}px`,
            fontWeight: 600,
          }}
        >
          {text}
        </span>
      ),
    },

    List: {
      label: "List",
      fields: {
        items: {
          type: "array",
          label: "List items",
          arrayFields: {
            text: textField("Item text"),
          },
          defaultItemProps: {
            text: "New list item",
          },
          getItemSummary: (item) => item.text || "List item",
        },
        listType: selectField("List style", [
          { label: "Bullets", value: "ul" },
          { label: "Numbers", value: "ol" },
        ]),
        color: textField("Text color"),
        fontSize: numberField("Font size (px)", 8, 48),
        lineHeight: numberField("Line height", 0.5, 4),
        gap: numberField("Item spacing (px)", 0, 80),
      },
      defaultProps: {
        items: [
          { text: "First item" },
          { text: "Second item" },
          { text: "Third item" },
        ],
        listType: "ul",
        color: "#404040",
        fontSize: 16,
        lineHeight: 1.7,
        gap: 8,
      },
      render: ({ items, listType, color, fontSize, lineHeight, gap }) => {
        const Tag = listType === "ol" ? "ol" : "ul";

        return (
          <Tag
            style={{
              color,
              fontSize: `${fontSize}px`,
              lineHeight,
              paddingLeft: 24,
              margin: "12px 0",
            }}
          >
            {(items || []).map((item, index) => (
              <li key={index} style={{ marginBottom: `${gap}px` }}>
                {item.text}
              </li>
            ))}
          </Tag>
        );
      },
    },

    Card: {
      label: "Card",
      fields: {
        title: textField("Card title"),
        description: textareaField("Card description"),
        backgroundColor: textField("Background color"),
        titleColor: textField("Title color"),
        descriptionColor: textField("Description color"),
        padding: numberField("Padding (px)", 0, 120),
        borderRadius: numberField("Corner radius (px)", 0, 100),
        borderColor: textField("Border color"),
        borderWidth: numberField("Border width (px)", 0, 20),
        boxShadow: textField("Box shadow (CSS)"),
      },
      defaultProps: {
        title: "Card title",
        description: "Describe a service, feature, product, or idea.",
        backgroundColor: "#ffffff",
        titleColor: "#171717",
        descriptionColor: "#525252",
        padding: 24,
        borderRadius: 16,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
      },
      render: ({
        title,
        description,
        backgroundColor,
        titleColor,
        descriptionColor,
        padding,
        borderRadius,
        borderColor,
        borderWidth,
        boxShadow,
      }) => (
        <article
          style={{
            boxSizing: "border-box",
            backgroundColor,
            padding,
            borderRadius,
            border: `${borderWidth}px solid ${borderColor}`,
            boxShadow: boxShadow || undefined,
          }}
        >
          <h3
            style={{
              color: titleColor,
              fontSize: 22,
              lineHeight: 1.3,
              margin: "0 0 12px",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              color: descriptionColor,
              fontSize: 15,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {description}
          </p>
        </article>
      ),
    },
  },
};

export default puckConfig;
