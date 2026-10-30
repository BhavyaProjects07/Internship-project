import {
  hydrateDocumentWithResponsive,
  hasResponsiveOverrides,
} from "../layout/responsiveStyles.js";

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
 * Normalizes and validates any template JSON payload into a clean, hydrated Puck document.
 *
 * Supports multiple payload shapes:
 * 1. Direct Puck Document: { content: [...], root: { props: {...} }, zones: {} }
 * 2. Database Page Record: { id: "...", name: "Home", responsive: {...}, editorData: {...} }
 * 3. Multi-Page Template Bundle: { templateName: "...", pages: [ { name: "Home", editorData: {...} } ] }
 * 4. API Envelope: { success: true, data: { editorData: {...} } }
 *
 * @param {string | object} rawInput - JSON string or parsed object
 * @param {object} options
 * @param {number} [options.pageIndex=0] - If multi-page bundle, which page index to extract
 * @param {string[]} [options.registeredComponentTypes] - List of registered component keys in puckConfig
 * @returns {object} { success: boolean, document: object, pageResponsive: object, metadata: object }
 */
export function parseTemplateJson(rawInput, options = {}) {
  const { pageIndex = 0, registeredComponentTypes = [] } = options;
  const warnings = [];

  // 1. Parse JSON string if needed
  let parsed;
  if (typeof rawInput === "string") {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      throw new Error("JSON payload is empty.");
    }
    try {
      parsed = JSON.parse(trimmed);
    } catch (parseErr) {
      throw new Error(`Invalid JSON syntax: ${parseErr.message}`);
    }
  } else if (rawInput && typeof rawInput === "object") {
    parsed = JSON.parse(JSON.stringify(rawInput));
  } else {
    throw new Error("Invalid input: Expected a JSON string or object.");
  }

  // 2. Unwrap API envelope if present ({ success: true, data: ... })
  if (parsed && parsed.data && typeof parsed.data === "object" && !parsed.content && !parsed.editorData) {
    parsed = parsed.data;
  }

  // 3. Detect multi-page bundle
  let availablePages = [];
  let targetPageData = parsed;

  const candidatePages = Array.isArray(parsed?.pages)
    ? parsed.pages
    : Array.isArray(parsed)
    ? parsed
    : null;

  if (candidatePages && candidatePages.length > 0) {
    availablePages = candidatePages.map((p, idx) => ({
      index: idx,
      id: p.id || `page-${idx}`,
      name: p.name || `Page ${idx + 1}`,
      slug: p.slug || `page-${idx + 1}`,
    }));

    const safeIndex = Math.min(Math.max(0, pageIndex), candidatePages.length - 1);
    targetPageData = candidatePages[safeIndex];
  }

  // 4. Extract raw document and page responsive configuration
  let rawDocument = null;
  let pageResponsive = null;

  if (targetPageData?.editorData && typeof targetPageData.editorData === "object") {
    // Shape: Database page object with editorData
    rawDocument = targetPageData.editorData;
    pageResponsive = targetPageData.responsive || null;
  } else if (targetPageData?.document && typeof targetPageData.document === "object") {
    // Shape: Wrapped document
    rawDocument = targetPageData.document;
    pageResponsive = targetPageData.responsive || null;
  } else if (targetPageData && typeof targetPageData === "object") {
    // Shape: Direct Puck Document
    rawDocument = targetPageData;
    pageResponsive = targetPageData.responsive || targetPageData.root?.props?.responsive || null;
  }

  if (!rawDocument || typeof rawDocument !== "object") {
    throw new Error(
      "Could not detect valid editor document structure (expected 'content' array or 'editorData' object)."
    );
  }

  // 5. Ensure root structure
  const root = {
    props: {
      title: "Imported Page",
      fontFamily: "inherit",
      backgroundColor: "#ffffff",
      backgroundGradient: false,
      gradientFrom: "#ffffff",
      gradientTo: "#f8fafc",
      ...(rawDocument.root?.props || {}),
    },
  };

  // 6. Ensure content array
  let content = Array.isArray(rawDocument.content)
    ? rawDocument.content
    : [];

  const zones = (rawDocument.zones && typeof rawDocument.zones === "object")
    ? rawDocument.zones
    : {};

  // 7. Sanitize components & generate unique IDs
  const seenIds = new Set();
  const knownSet = registeredComponentTypes.length > 0 ? new Set(registeredComponentTypes) : null;
  let totalComponentCount = 0;

  function sanitizeNodes(nodes, zoneName = "content") {
    if (!Array.isArray(nodes)) return [];

    return nodes
      .filter((node) => node && typeof node === "object")
      .map((node) => {
        totalComponentCount += 1;
        const type = String(node.type || "Unknown");

        // Validate type against registered components
        if (knownSet && !knownSet.has(type)) {
          if (!warnings.some((w) => w.includes(`'${type}'`))) {
            warnings.push(`Component type '${type}' is not recognized in the current component library.`);
          }
        }

        const props = { ...(node.props || {}) };

        // Guarantee unique ID
        let compId = props.id || node.id;
        if (!compId || seenIds.has(compId)) {
          const suffix = Math.random().toString(36).substring(2, 7);
          compId = `${type}-${Date.now().toString(36)}-${suffix}`;
        }
        seenIds.add(compId);
        props.id = compId;

        // Process nested slots/arrays in props
        for (const [key, val] of Object.entries(props)) {
          if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && val[0].type) {
            props[key] = sanitizeNodes(val, `${zoneName}:${key}`);
          }
        }

        return {
          ...node,
          type,
          props,
        };
      });
  }

  content = sanitizeNodes(content);

  // Sanitize zones
  const cleanZones = {};
  for (const [zoneKey, zoneNodes] of Object.entries(zones)) {
    if (Array.isArray(zoneNodes)) {
      cleanZones[zoneKey] = sanitizeNodes(zoneNodes, zoneKey);
    }
  }

  // 8. Resolve and normalize responsive model
  const normalizedResponsive = {
    desktop: {
      ...DEFAULT_PAGE_RESPONSIVE.desktop,
      ...(pageResponsive?.desktop || root.props.responsive?.desktop || {}),
    },
    tablet: {
      ...DEFAULT_PAGE_RESPONSIVE.tablet,
      ...(pageResponsive?.tablet || root.props.responsive?.tablet || {}),
    },
    mobile: {
      ...DEFAULT_PAGE_RESPONSIVE.mobile,
      ...(pageResponsive?.mobile || root.props.responsive?.mobile || {}),
    },
    components: Array.isArray(pageResponsive?.components)
      ? pageResponsive.components
      : [],
  };

  root.props.responsive = {
    desktop: normalizedResponsive.desktop,
    tablet: normalizedResponsive.tablet,
    mobile: normalizedResponsive.mobile,
  };

  const documentToHydrate = {
    root,
    content,
    zones: cleanZones,
  };

  // 9. Hydrate component-level responsive overrides for active canvas
  const hydratedDoc = hydrateDocumentWithResponsive(documentToHydrate, normalizedResponsive);

  const hasOverrides =
    normalizedResponsive.components.length > 0 ||
    content.some((c) => c.props?.responsive && hasResponsiveOverrides(c.props.responsive));

  return {
    success: true,
    document: hydratedDoc,
    pageResponsive: normalizedResponsive,
    metadata: {
      title: root.props.title || "Untitled Page",
      componentCount: totalComponentCount,
      warnings,
      hasResponsiveOverrides: hasOverrides,
      availablePages,
      activePageIndex: candidatePages ? Math.min(Math.max(0, pageIndex), candidatePages.length - 1) : null,
    },
  };
}

/**
 * Serializes the current active canvas document and responsive settings into a portable JSON string or object.
 *
 * @param {object} document - Current Puck document ({ root, content, zones })
 * @param {object} [metadata] - Additional page metadata
 * @returns {object} Portable template export object
 */
export function buildTemplateExportJson(document, metadata = {}) {
  const rootProps = document?.root?.props || {};

  const cleanResponsive = metadata.responsive || {
    desktop: rootProps.responsive?.desktop || DEFAULT_PAGE_RESPONSIVE.desktop,
    tablet: rootProps.responsive?.tablet || DEFAULT_PAGE_RESPONSIVE.tablet,
    mobile: rootProps.responsive?.mobile || DEFAULT_PAGE_RESPONSIVE.mobile,
    components: metadata.componentOverrides || [],
  };

  return {
    version: "1.0.0",
    generator: "Website Builder Visual Studio",
    exportedAt: new Date().toISOString(),
    name: metadata.pageName || rootProps.title || "Website Page",
    slug: metadata.slug || "page",
    responsive: cleanResponsive,
    editorData: {
      root: {
        props: {
          title: rootProps.title || "Untitled Page",
          fontFamily: rootProps.fontFamily || "inherit",
          backgroundColor: rootProps.backgroundColor || "#ffffff",
          backgroundGradient: Boolean(rootProps.backgroundGradient),
          gradientFrom: rootProps.gradientFrom || "#ffffff",
          gradientTo: rootProps.gradientTo || "#f8fafc",
          responsive: {
            desktop: cleanResponsive.desktop,
            tablet: cleanResponsive.tablet,
            mobile: cleanResponsive.mobile,
          },
        },
      },
      content: Array.isArray(document?.content) ? document.content : [],
      zones: document?.zones || {},
    },
  };
}
