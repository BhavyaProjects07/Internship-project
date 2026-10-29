function hashString(value) {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }

  return Math.abs(hash).toString(36);
}

export const DEVICE_NAMES = ["desktop", "tablet", "mobile"];

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
  logoWidth: "--puck-logo-width",
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
 * mobile -> tablet -> desktop override -> fallback
 */
export function resolveResponsiveValue(responsive, key, device, fallback) {
  if (!responsive || typeof responsive !== "object") return fallback;

  const hasVal = (val) => val !== undefined && val !== null && val !== "";
  const desktopOverride = responsive?.desktop?.[key];
  const effectiveDesktop = hasVal(desktopOverride) ? desktopOverride : fallback;

  if (device === "mobile") {
    const mobileVal = responsive?.mobile?.[key];
    if (hasVal(mobileVal)) {
      return mobileVal;
    }
    const tabletVal = responsive?.tablet?.[key];
    if (hasVal(tabletVal)) {
      return tabletVal;
    }
    return effectiveDesktop;
  }

  if (device === "tablet") {
    const tabletVal = responsive?.tablet?.[key];
    if (hasVal(tabletVal)) {
      return tabletVal;
    }
    return effectiveDesktop;
  }

  return effectiveDesktop;
}

/**
 * Builds responsive CSS rules and custom properties for a component.
 * Supports:
 * 1. Viewport media queries for published pages (Desktop >= 1024px, Tablet 768-1023px, Mobile < 768px)
 * 2. Container queries for the visual editor preview canvas
 * 3. Direct preview class targeting (.studio-preview-desktop, .studio-preview-tablet, .studio-preview-mobile)
 * 4. Value inheritance: tablet inherits desktop; mobile inherits tablet if not set.
 */
export function buildResponsiveStyles({
  responsive = {},
  variableMap = DEFAULT_VARIABLE_MAP,
}) {
  const mergedMap = { ...DEFAULT_VARIABLE_MAP, ...variableMap };
  const rawDesktop = responsive?.desktop;
  const rawTablet = responsive?.tablet;
  const rawMobile = responsive?.mobile;

  const filterValid = (raw) =>
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? Object.entries(raw).filter(
          ([k, v]) =>
            Object.prototype.hasOwnProperty.call(mergedMap, k) &&
            v !== undefined &&
            v !== null &&
            v !== ""
        )
      : [];

  const validDesktopEntries = filterValid(rawDesktop);
  const validTabletEntries = filterValid(rawTablet);
  const validMobileEntries = filterValid(rawMobile);

  // If there are no overrides at all, return empty
  if (
    validDesktopEntries.length === 0 &&
    validTabletEntries.length === 0 &&
    validMobileEntries.length === 0
  ) {
    return {
      className: "",
      css: "",
    };
  }

  const normalizedDesktop = Object.fromEntries(validDesktopEntries);
  const normalizedTablet = Object.fromEntries(validTabletEntries);
  const normalizedMobile = Object.fromEntries(validMobileEntries);

  // Value inheritance:
  // Tablet inherits Desktop overrides when tablet does not explicitly set them
  const effectiveTablet = {
    ...normalizedDesktop,
    ...normalizedTablet,
  };

  // Mobile inherits Tablet (and Desktop) overrides when mobile does not explicitly set them
  const effectiveMobile = {
    ...effectiveTablet,
    ...normalizedMobile,
  };

  const signature = JSON.stringify({
    normalizedDesktop,
    effectiveTablet,
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
      } else if (key === "width") {
        decls.push(`width: ${cssVal};`);
      } else if (key === "maxWidth") {
        decls.push(`max-width: ${cssVal};`);
      } else if (key === "height") {
        decls.push(`height: ${cssVal};`);
      } else if (key === "aspectRatio") {
        decls.push(`aspect-ratio: ${cssVal};`);
      } else if (key === "objectFit") {
        decls.push(`object-fit: ${cssVal};`);
      } else if (key === "marginTop") {
        decls.push(`margin-top: ${cssVal};`);
      } else if (key === "marginBottom") {
        decls.push(`margin-bottom: ${cssVal};`);
      } else if (key === "marginLeft") {
        decls.push(`margin-left: ${cssVal};`);
      } else if (key === "marginRight") {
        decls.push(`margin-right: ${cssVal};`);
      } else if (key === "paddingTop") {
        decls.push(`padding-top: ${cssVal};`);
      } else if (key === "paddingBottom") {
        decls.push(`padding-bottom: ${cssVal};`);
      } else if (key === "paddingLeft") {
        decls.push(`padding-left: ${cssVal};`);
      } else if (key === "paddingRight") {
        decls.push(`padding-right: ${cssVal};`);
      } else if (key === "paddingX") {
        decls.push(`padding-left: ${cssVal};`);
        decls.push(`padding-right: ${cssVal};`);
      } else if (key === "paddingY") {
        decls.push(`padding-top: ${cssVal};`);
        decls.push(`padding-bottom: ${cssVal};`);
      }
    }
    return decls.join("\n        ");
  };

  // DESKTOP RULES (>= 1024px)
  if (Object.keys(normalizedDesktop).length > 0) {
    const desktopDecls = buildDeclarations(normalizedDesktop);

    rules.push(`
      .${className} {
        ${desktopDecls}
      }
    `);

    // Published page viewport media query
    rules.push(`
      @media (min-width: 1024px) {
        .${className},
        .puck-public-responsive-container .${className} {
          ${desktopDecls}
        }
      }
    `);

    // Editor container query
    rules.push(`
      @container studio-preview (min-width: 1024px) {
        .${className} {
          ${desktopDecls}
        }
      }
    `);

    // Direct editor device class fallback
    rules.push(`
      .studio-preview-desktop .${className} {
        ${desktopDecls}
      }
    `);
  }

  // TABLET RULES (768px - 1023px)
  if (Object.keys(effectiveTablet).length > 0) {
    const tabletDecls = buildDeclarations(effectiveTablet);

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


/**
 * Checks if a component's responsive object actually contains non-empty overrides.
 */
export function hasResponsiveOverrides(resp) {
  if (!resp || typeof resp !== "object") return false;
  return ["desktop", "tablet", "mobile"].some((device) => {
    const val = resp[device];
    return val && typeof val === "object" && Object.keys(val).length > 0;
  });
}

/**
 * Hydrates a clean Puck document by attaching component responsive settings
 * from the unified `responsive.components` array.
 */
export function hydrateDocumentWithResponsive(document, responsiveModel) {
  if (!document || typeof document !== "object") return document;
  const hydratedDoc = JSON.parse(JSON.stringify(document));
  const compMap = new Map();

  if (responsiveModel && Array.isArray(responsiveModel.components)) {
    for (const c of responsiveModel.components) {
      if (c && c.id && c.responsive && hasResponsiveOverrides(c.responsive)) {
        compMap.set(c.id, c.responsive);
      }
    }
  }

  function hydrate(nodes) {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const compId = node.props?.id || node.id;
      if (compId && compMap.has(compId)) {
        node.props = node.props || {};
        node.props.responsive = compMap.get(compId);
      } else if (node.props && node.props.responsive) {
        if (!hasResponsiveOverrides(node.props.responsive)) {
          delete node.props.responsive;
        }
      }

      if (node.props) {
        for (const val of Object.values(node.props)) {
          if (Array.isArray(val)) hydrate(val);
        }
      }
    }
  }

  if (Array.isArray(hydratedDoc.content)) hydrate(hydratedDoc.content);
  if (hydratedDoc.zones && typeof hydratedDoc.zones === "object") {
    for (const zoneList of Object.values(hydratedDoc.zones)) {
      if (Array.isArray(zoneList)) hydrate(zoneList);
    }
  }

  return hydratedDoc;
}

/**
 * Strips `props.responsive` from all components in a Puck document.
 */
export function stripComponentResponsiveness(document) {
  if (!document || typeof document !== "object") return document;
  const cleanDoc = JSON.parse(JSON.stringify(document));

  function cleanNodes(nodes) {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      if (node.props) {
        delete node.props.responsive;
        for (const val of Object.values(node.props)) {
          if (Array.isArray(val)) cleanNodes(val);
        }
      }
    }
  }

  if (Array.isArray(cleanDoc.content)) cleanNodes(cleanDoc.content);
  if (cleanDoc.zones && typeof cleanDoc.zones === "object") {
    for (const zoneList of Object.values(cleanDoc.zones)) {
      if (Array.isArray(zoneList)) cleanNodes(zoneList);
    }
  }

  return cleanDoc;
}
