/**
 * ============================================================
 * sectionLayout.js — Common Section Layout Utility
 * ============================================================
 *
 * Provides a single reusable function that every section component
 * calls to compute inline styles from the standardized config
 * structure (config.layout + config.spacing).
 *
 * This avoids duplicating layout/spacing logic across every section,
 * keeps runtime Tailwind class generation safe (uses inline styles),
 * and handles backward-compatible normalization of legacy config.
 */

// ============================================================
// DEFAULTS
// ============================================================

const DEFAULT_LAYOUT = {
  width: "wide",
  columns: 1,
  alignment: "center",
  verticalAlignment: "center",
};

const DEFAULT_SPACING = {
  padding: { top: 80, right: 24, bottom: 80, left: 24 },
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
};

// ============================================================
// NORMALIZE CONFIG
// ============================================================

/**
 * Normalize a raw section config into the standardized structure.
 *
 * - Merges config.layout and config.spacing with safe defaults
 * - Supports legacy fields like config.alignment, config.paddingTop, etc.
 * - Preserves any section-specific fields (backgroundColor, textColor, etc.)
 */
export function normalizeConfig(rawConfig, overrideDefaults = {}) {
  const config = rawConfig || {};

  const defaultLayout = {
    ...DEFAULT_LAYOUT,
    ...overrideDefaults.layout,
  };

  const defaultSpacing = {
    padding: {
      ...DEFAULT_SPACING.padding,
      ...(overrideDefaults.spacing?.padding || {}),
    },
    margin: {
      ...DEFAULT_SPACING.margin,
      ...(overrideDefaults.spacing?.margin || {}),
    },
  };

  // Layout normalization with legacy fallback
  const layout = {
    width: config.layout?.width || defaultLayout.width,
    columns: Number(config.layout?.columns) || defaultLayout.columns,
    alignment:
      config.layout?.alignment || config.alignment || defaultLayout.alignment,
    verticalAlignment:
      config.layout?.verticalAlignment || defaultLayout.verticalAlignment,
  };

  // Spacing normalization with legacy fallback
  const padding = {
    top: Number(config.spacing?.padding?.top ?? defaultSpacing.padding.top),
    right: Number(
      config.spacing?.padding?.right ?? defaultSpacing.padding.right
    ),
    bottom: Number(
      config.spacing?.padding?.bottom ?? defaultSpacing.padding.bottom
    ),
    left: Number(
      config.spacing?.padding?.left ?? defaultSpacing.padding.left
    ),
  };

  const margin = {
    top: Number(config.spacing?.margin?.top ?? defaultSpacing.margin.top),
    right: Number(
      config.spacing?.margin?.right ?? defaultSpacing.margin.right
    ),
    bottom: Number(
      config.spacing?.margin?.bottom ?? defaultSpacing.margin.bottom
    ),
    left: Number(
      config.spacing?.margin?.left ?? defaultSpacing.margin.left
    ),
  };

  return {
    layout,
    spacing: { padding, margin },
  };
}

// ============================================================
// SECTION WRAPPER STYLE
// ============================================================

function resolveColorVar(colorValue) {
  if (!colorValue) return undefined;
  if (colorValue.startsWith("theme.")) {
    const token = colorValue.split(".")[1];
    // Convert camelCase token like mutedText to kebab-case muted-text
    const kebabToken = token.replace(/([A-Z])/g, "-$1").toLowerCase();
    return `var(--color-${kebabToken})`;
  }
  return colorValue;
}

/**
 * Compute inline style object for the outermost <section> wrapper.
 *
 * Applies:
 * - padding (all 4 sides)
 * - margin (all 4 sides)
 * - backgroundColor & textColor from config
 * - vertical alignment as justifyContent on flex column
 */
export function getSectionStyle(config, overrideDefaults) {
  const { layout, spacing } = normalizeConfig(config, overrideDefaults);

  const verticalJustify =
    layout.verticalAlignment === "top"
      ? "flex-start"
      : layout.verticalAlignment === "bottom"
      ? "flex-end"
      : "center";

  let bgColor = config?.backgroundColor;
  let bgImage = undefined;
  let bgPosition = undefined;
  let bgSize = undefined;
  let bgRepeat = undefined;

  if (config?.backgroundType === "none") {
    bgColor = "transparent";
  } else if (config?.backgroundType === "gradient") {
    bgColor = "transparent"; // override solid color if gradient is selected
    const grad = config?.backgroundGradient;
    if (grad) {
      if (typeof grad === "string") {
        // legacy compatibility
        bgImage = grad;
      } else if (grad.type === "linear") {
        const angle = grad.angle ?? 135;
        const fromColor = resolveColorVar(grad.from) || "transparent";
        const toColor = resolveColorVar(grad.to) || "transparent";
        bgImage = `linear-gradient(${angle}deg, ${fromColor}, ${toColor})`;
      }
    }
  } else if (config?.backgroundType === "image" || config?.backgroundType === "image-overlay") {
    const imgConfig = config?.backgroundImage;
    if (imgConfig) {
      let imageUrl = "";
      if (typeof imgConfig === "string") {
        imageUrl = imgConfig;
        bgPosition = "center";
        bgSize = "cover";
        bgRepeat = "no-repeat";
      } else if (imgConfig.url) {
        imageUrl = imgConfig.url;
        bgPosition = imgConfig.position || "center";
        bgSize = imgConfig.size || "cover";
        bgRepeat = imgConfig.repeat || "no-repeat";
      }

      if (imageUrl) {
        if (config.backgroundType === "image-overlay") {
          let overlayColor = "#000000";
          let overlayOpacity = 50;
          
          if (config.backgroundOverlay && typeof config.backgroundOverlay === "object") {
            overlayColor = resolveColorVar(config.backgroundOverlay.color) || "#000000";
            overlayOpacity = config.backgroundOverlay.opacity ?? 50;
          } else if (typeof config.backgroundOverlay === "string") {
            // legacy compatibility for raw rgba strings
            overlayColor = config.backgroundOverlay;
            overlayOpacity = 100;
          }
          
          const mix = `color-mix(in srgb, ${overlayColor} ${overlayOpacity}%, transparent)`;
          bgImage = `linear-gradient(${mix}, ${mix}), url(${imageUrl})`;
        } else {
          bgImage = `url(${imageUrl})`;
        }
      }
    }
  }

  return {
    paddingTop: `${spacing.padding.top}px`,
    paddingRight: `${spacing.padding.right}px`,
    paddingBottom: `${spacing.padding.bottom}px`,
    paddingLeft: `${spacing.padding.left}px`,
    marginTop: `${spacing.margin.top}px`,
    marginRight: `${spacing.margin.right}px`,
    marginBottom: `${spacing.margin.bottom}px`,
    marginLeft: `${spacing.margin.left}px`,
    backgroundColor: resolveColorVar(bgColor),
    ...(bgImage ? { backgroundImage: bgImage } : {}),
    ...(bgPosition ? { backgroundPosition: bgPosition } : {}),
    ...(bgSize ? { backgroundSize: bgSize } : {}),
    ...(bgRepeat ? { backgroundRepeat: bgRepeat } : {}),
    color: resolveColorVar(config?.textColor),
    justifyContent: verticalJustify,
  };
}

// ============================================================
// CONTENT MAX-WIDTH
// ============================================================

/**
 * Return the maxWidth value for the inner content container.
 */
export function getContentMaxWidth(config, overrideDefaults) {
  const { layout } = normalizeConfig(config, overrideDefaults);

  switch (layout.width) {
    case "full":
      return "100%";
    case "boxed":
      return "960px";
    case "wide":
    default:
      return "1200px";
  }
}

// ============================================================
// ALIGNMENT CLASSES
// ============================================================

/**
 * Return Tailwind text/items alignment classes based on config.
 * These are static class names (not dynamic), so Tailwind compiles them safely.
 */
export function getAlignmentClasses(config, overrideDefaults) {
  const { layout } = normalizeConfig(config, overrideDefaults);

  const textClass =
    layout.alignment === "right"
      ? "text-right"
      : layout.alignment === "center"
      ? "text-center"
      : "text-left";

  const itemsClass =
    layout.alignment === "right"
      ? "items-end"
      : layout.alignment === "center"
      ? "items-center"
      : "items-start";

  const justifyClass =
    layout.alignment === "right"
      ? "justify-end"
      : layout.alignment === "center"
      ? "justify-center"
      : "justify-start";

  return { textClass, itemsClass, justifyClass };
}

// ============================================================
// RESPONSIVE GRID COLUMNS CLASS
// ============================================================

/**
 * Return responsive Tailwind grid column classes.
 * On mobile, always collapses to 1 column.
 */
export function getGridColumnsClass(config, overrideDefaults) {
  const { layout } = normalizeConfig(config, overrideDefaults);

  switch (layout.columns) {
    case 4:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    case 3:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    case 2:
      return "grid-cols-1 md:grid-cols-2";
    case 1:
    default:
      return "grid-cols-1";
  }
}

// ============================================================
// TYPOGRAPHY STYLE
// ============================================================

export function getTypographyStyle(config, elementId, index, field) {
  const typography = config?.typography || {};

  let specificPath = elementId;
  let globalPath = elementId;

  if (index !== undefined && field !== undefined) {
    specificPath = `${elementId}.${index}.${field}`;
    globalPath = `${elementId}.${field}`;
  } else if (typeof elementId === "string") {
    const parts = elementId.split(".");
    if (parts.length === 3 && !isNaN(Number(parts[1]))) {
      globalPath = `${parts[0]}.${parts[2]}`;
    }
  }

  const typoSpecific = typography[specificPath] || {};
  const typoGlobal = typography[globalPath] || {};
  
  const typo = { ...typoGlobal, ...typoSpecific };

  let resolvedColor = undefined;

  if (typoSpecific.color && typoSpecific.color !== "") {
    resolvedColor = typoSpecific.color;
  } else if (typoGlobal.color && typoGlobal.color !== "") {
    resolvedColor = typoGlobal.color;
  } else if (config?.textColor && config.textColor !== "") {
    resolvedColor = config.textColor;
  }

  return {
    ...(typo.fontFamily ? { fontFamily: typo.fontFamily } : {}),
    ...(typo.fontSize ? { fontSize: `${typo.fontSize}px` } : {}),
    ...(typo.fontWeight ? { fontWeight: typo.fontWeight } : {}),
    ...(typo.lineHeight ? { lineHeight: typo.lineHeight } : {}),
    ...(typo.letterSpacing ? { letterSpacing: `${typo.letterSpacing}px` } : {}),
    ...(typo.textAlign ? { textAlign: typo.textAlign } : {}),
    ...(resolvedColor ? { color: resolveColorVar(resolvedColor) } : {}),
  };
}

// ============================================================
// BUTTON STYLE
// ============================================================

export function getButtonStyle(config, elementId) {
  const btnConfig = config?.button?.[elementId] || {};
  
  const style = {};
  const classes = [];
  
  if (btnConfig.backgroundColor) {
    style.backgroundColor = resolveColorVar(btnConfig.backgroundColor);
  }
  
  if (btnConfig.textColor) {
    style.color = resolveColorVar(btnConfig.textColor);
  }
  
  if (btnConfig.borderColor) {
    style.borderColor = resolveColorVar(btnConfig.borderColor);
    style.borderStyle = "solid";
  }
  
  if (btnConfig.borderWidth !== undefined && btnConfig.borderWidth !== "") {
    style.borderWidth = `${btnConfig.borderWidth}px`;
  }
  
  if (btnConfig.borderRadius !== undefined && btnConfig.borderRadius !== "") {
    style.borderRadius = `${btnConfig.borderRadius}px`;
  }
  
  if (btnConfig.paddingTop !== undefined && btnConfig.paddingTop !== "") {
    style.paddingTop = `${btnConfig.paddingTop}px`;
  }
  
  if (btnConfig.paddingRight !== undefined && btnConfig.paddingRight !== "") {
    style.paddingRight = `${btnConfig.paddingRight}px`;
  }
  
  if (btnConfig.paddingBottom !== undefined && btnConfig.paddingBottom !== "") {
    style.paddingBottom = `${btnConfig.paddingBottom}px`;
  }
  
  if (btnConfig.paddingLeft !== undefined && btnConfig.paddingLeft !== "") {
    style.paddingLeft = `${btnConfig.paddingLeft}px`;
  }
  
  if (btnConfig.width === "full") {
    style.width = "100%";
  }

  // Hover States (Phase 6D)
  const hoverConfig = btnConfig.hover || {};
  
  if (hoverConfig.backgroundColor) {
    style["--btn-hover-bg"] = resolveColorVar(hoverConfig.backgroundColor);
    classes.push("hover-bg-override");
  }

  if (hoverConfig.textColor) {
    style["--btn-hover-text"] = resolveColorVar(hoverConfig.textColor);
    classes.push("hover-text-override");
  }

  if (hoverConfig.borderColor) {
    style["--btn-hover-border"] = resolveColorVar(hoverConfig.borderColor);
    classes.push("hover-border-override");
  }
  
  return {
    style,
    className: classes.join(" ")
  };
}
