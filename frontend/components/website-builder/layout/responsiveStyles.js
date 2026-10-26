

function hashString(value) {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }

  return Math.abs(hash).toString(36);
}

export const DEVICE_NAMES = ["tablet", "mobile"];

export const UNIT_LESS_PROPERTIES = new Set([
  "columns",
  "lineHeight",
  "fontWeight",
  "opacity",
  "flexGrow",
  "flexShrink",
  "order",
  "zIndex",
  "aspectRatio",
  "direction",
  "flexDirection",
  "align",
  "alignItems",
  "justify",
  "justifyContent",
  "wrap",
  "flexWrap",
  "textAlign",
  "objectFit",
  "display",
]);

export const DEFAULT_VARIABLE_MAP = {
  columns: "--puck-columns",
  gap: "--puck-gap",
  paddingY: "--puck-padding-y",
  paddingX: "--puck-padding-x",
  paddingTop: "--puck-padding-top",
  paddingBottom: "--puck-padding-bottom",
  paddingLeft: "--puck-padding-left",
  paddingRight: "--puck-padding-right",
  marginTop: "--puck-margin-top",
  marginBottom: "--puck-margin-bottom",
  marginLeft: "--puck-margin-left",
  marginRight: "--puck-margin-right",
  width: "--puck-width",
  maxWidth: "--puck-max-width",
  minHeight: "--puck-min-height",
  direction: "--puck-flex-direction",
  flexDirection: "--puck-flex-direction",
  align: "--puck-align-items",
  alignItems: "--puck-align-items",
  justify: "--puck-justify-content",
  justifyContent: "--puck-justify-content",
  wrap: "--puck-flex-wrap",
  flexWrap: "--puck-flex-wrap",
  fontSize: "--puck-font-size",
  lineHeight: "--puck-line-height",
  letterSpacing: "--puck-letter-spacing",
  textAlign: "--puck-text-align",
  height: "--puck-image-height",
  imageHeight: "--puck-image-height",
  imageWidth: "--puck-image-width",
  aspectRatio: "--puck-aspect-ratio",
  objectFit: "--puck-object-fit",
  minItemWidth: "--puck-min-item-width",
  display: "--puck-display",
};

export function toCssValue(key, value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return UNIT_LESS_PROPERTIES.has(key)
      ? String(value)
      : `${value}px`;
  }

  const str = String(value).trim();
  if (/^-?\d+(\.\d+)?$/.test(str) && !UNIT_LESS_PROPERTIES.has(key)) {
    return `${str}px`;
  }

  return str;
}

/**
 * Resolves a responsive property value with fallback hierarchy:
 * mobile -> tablet -> desktop (fallback)
 */
export function resolveResponsiveValue(responsive, key, device, fallback) {
  if (!responsive || typeof responsive !== "object") return fallback;

  if (device === "mobile") {
    const mobileVal = responsive?.mobile?.[key];
    if (mobileVal !== undefined && mobileVal !== null && mobileVal !== "") {
      return mobileVal;
    }
    const tabletVal = responsive?.tablet?.[key];
    if (tabletVal !== undefined && tabletVal !== null && tabletVal !== "") {
      return tabletVal;
    }
    return fallback;
  }

  if (device === "tablet") {
    const tabletVal = responsive?.tablet?.[key];
    if (tabletVal !== undefined && tabletVal !== null && tabletVal !== "") {
      return tabletVal;
    }
    return fallback;
  }

  return fallback;
}

/**
 * Builds responsive CSS rules and custom properties for a component.
 * Supports:
 * 1. Viewport media queries for published pages
 * 2. Container queries for the visual editor preview canvas
 * 3. Direct preview class targeting (.studio-preview-mobile, .studio-preview-tablet)
 * 4. Value inheritance: tablet inherits desktop; mobile inherits tablet if not set.
 */
export function buildResponsiveStyles({
  responsive = {},
  variableMap = DEFAULT_VARIABLE_MAP,
}) {
  const mergedMap = { ...DEFAULT_VARIABLE_MAP, ...variableMap };
  const rawTablet = responsive?.tablet;
  const rawMobile = responsive?.mobile;

  const validTabletEntries =
    rawTablet && typeof rawTablet === "object" && !Array.isArray(rawTablet)
      ? Object.entries(rawTablet).filter(
          ([k, v]) =>
            Object.prototype.hasOwnProperty.call(mergedMap, k) &&
            v !== undefined &&
            v !== null &&
            v !== ""
        )
      : [];

  const validMobileEntries =
    rawMobile && typeof rawMobile === "object" && !Array.isArray(rawMobile)
      ? Object.entries(rawMobile).filter(
          ([k, v]) =>
            Object.prototype.hasOwnProperty.call(mergedMap, k) &&
            v !== undefined &&
            v !== null &&
            v !== ""
        )
      : [];

  // If there are no overrides at all, return empty
  if (validTabletEntries.length === 0 && validMobileEntries.length === 0) {
    return {
      className: "",
      css: "",
    };
  }

  const normalizedTablet = Object.fromEntries(validTabletEntries);
  const normalizedMobile = Object.fromEntries(validMobileEntries);

  // Mobile inherits tablet values when mobile does not explicitly override them
  const effectiveMobile = {
    ...normalizedTablet,
    ...normalizedMobile,
  };

  const signature = JSON.stringify({
    normalizedTablet,
    effectiveMobile,
    mergedMap,
  });

  const className = `puck-resp-${hashString(signature)}`;
  const rules = [];

  const buildDeclarations = (valuesMap) => {
    const decls = [];
    for (const [key, rawVal] of Object.entries(valuesMap)) {
      const cssVal = toCssValue(key, rawVal);
      if (cssVal === null) continue;

      const varName = mergedMap[key];
      if (varName) {
        decls.push(`${varName}: ${cssVal};`);
      }

      // Also set standard properties where beneficial for direct styling
      if (key === "fontSize") {
        decls.push(`font-size: ${cssVal};`);
      } else if (key === "lineHeight") {
        decls.push(`line-height: ${cssVal};`);
      } else if (key === "letterSpacing") {
        decls.push(`letter-spacing: ${cssVal};`);
      } else if (key === "textAlign") {
        decls.push(`text-align: ${cssVal};`);
      } else if (key === "direction" || key === "flexDirection") {
        decls.push(`flex-direction: ${cssVal};`);
      } else if (key === "align" || key === "alignItems") {
        decls.push(`align-items: ${cssVal};`);
      } else if (key === "justify" || key === "justifyContent") {
        decls.push(`justify-content: ${cssVal};`);
      } else if (key === "wrap" || key === "flexWrap") {
        decls.push(`flex-wrap: ${cssVal};`);
      } else if (key === "gap") {
        decls.push(`gap: ${cssVal};`);
      } else if (key === "columns") {
        decls.push(`grid-template-columns: repeat(${cssVal}, minmax(0, 1fr));`);
      } else if (key === "display") {
        decls.push(`display: ${cssVal};`);
      }
    }
    return decls.join("\n        ");
  };

  // TABLET RULES (768px - 1023px)
  if (Object.keys(normalizedTablet).length > 0) {
    const tabletDecls = buildDeclarations(normalizedTablet);

    // Published page viewport media query
    rules.push(`
      @media (min-width: 768px) and (max-width: 1023px) {
        .${className},
        .puck-public-responsive-container .${className} {
          ${tabletDecls}
        }
      }
    `);

    // Editor container query
    rules.push(`
      @container studio-preview (min-width: 768px) and (max-width: 1023px) {
        .${className} {
          ${tabletDecls}
        }
      }
    `);

    // Direct editor device class fallback
    rules.push(`
      .studio-preview-tablet .${className} {
        ${tabletDecls}
      }
    `);
  }

  // MOBILE RULES (< 768px)
  if (Object.keys(effectiveMobile).length > 0) {
    const mobileDecls = buildDeclarations(effectiveMobile);

    // Published page viewport media query
    rules.push(`
      @media (max-width: 767px) {
        .${className},
        .puck-public-responsive-container .${className} {
          ${mobileDecls}
        }
      }
    `);

    // Editor container query
    rules.push(`
      @container studio-preview (max-width: 767px) {
        .${className} {
          ${mobileDecls}
        }
      }
    `);

    // Direct editor device class fallback
    rules.push(`
      .studio-preview-mobile .${className} {
        ${mobileDecls}
      }
    `);
  }

  return {
    className,
    css: rules.join("\n"),
  };
}
