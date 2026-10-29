const DEFAULT_PAGE_RESPONSIVE = {
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
 * Checks if a component's responsive object actually contains non-empty overrides.
 * Returns false for null, undefined, {}, or { mobile: {}, tablet: {}, desktop: {} }.
 */
function hasResponsiveOverrides(resp) {
  if (!resp || typeof resp !== "object") return false;
  return ["desktop", "tablet", "mobile"].some((device) => {
    const val = resp[device];
    return val && typeof val === "object" && Object.keys(val).length > 0;
  });
}

/**
 * Traverses a Puck document to find component instances that HAVE responsive overrides.
 * Filters out all components with empty or non-existent responsive objects.
 * @param {object} document - Canonical Puck document with root, content, and optional zones.
 * @returns {Array<{id: string, type: string, responsive: object}>}
 */
function extractComponentInstances(document) {
  const components = [];
  const seenIds = new Set();

  function traverse(nodes) {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const compId = node.props?.id || node.id;
      const resp = node.props?.responsive;

      if (compId && node.type && !seenIds.has(compId) && hasResponsiveOverrides(resp)) {
        seenIds.add(compId);
        components.push({
          id: compId,
          type: node.type,
          responsive: resp,
        });
      }

      // Recursively traverse slots / sub-components in props
      if (node.props && typeof node.props === "object") {
        for (const [key, val] of Object.entries(node.props)) {
          if (Array.isArray(val) && key !== "links" && key !== "navColumns" && key !== "options") {
            traverse(val);
          }
        }
      }
    }
  }

  if (document && Array.isArray(document.content)) {
    traverse(document.content);
  }
  if (document && document.zones && typeof document.zones === "object") {
    for (const zoneList of Object.values(document.zones)) {
      if (Array.isArray(zoneList)) traverse(zoneList);
    }
  }

  return components;
}

/**
 * Strips `props.responsive` from all components in a Puck document.
 * This guarantees individual components in `editorData.content` do not duplicate
 * or hold empty `{}` responsive objects in database storage.
 */
function stripComponentResponsiveness(document) {
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

/**
 * Hydrates a clean Puck document by attaching component responsive settings
 * from the unified `responsive.components` array.
 */
function hydrateDocumentWithResponsive(document, responsiveModel) {
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
 * Builds a unified responsive model that holds page-level responsiveness
 * AND component-level responsiveness for components with actual overrides.
 */
function buildUnifiedResponsiveModel(explicitResponsive, document, existingResponsive) {
  const basePageLevel =
    explicitResponsive?.pageResponsive ||
    (explicitResponsive?.desktop ? explicitResponsive : null) ||
    document?.root?.props?.responsive?.pageResponsive ||
    (document?.root?.props?.responsive?.desktop ? document.root.props.responsive : null) ||
    existingResponsive?.pageResponsive ||
    (existingResponsive?.desktop ? existingResponsive : null) ||
    DEFAULT_PAGE_RESPONSIVE;

  const desktop = basePageLevel.desktop || DEFAULT_PAGE_RESPONSIVE.desktop;
  const tablet = basePageLevel.tablet || DEFAULT_PAGE_RESPONSIVE.tablet;
  const mobile = basePageLevel.mobile || DEFAULT_PAGE_RESPONSIVE.mobile;

  const pageResponsive = {
    desktop,
    tablet,
    mobile,
  };

  // Extract only components that have active overrides
  let components = extractComponentInstances(document);

  // If explicitResponsive had component overrides provided directly, merge non-empty ones
  if (explicitResponsive && Array.isArray(explicitResponsive.components)) {
    const compMap = new Map();
    for (const c of components) {
      compMap.set(c.id, c);
    }
    for (const c of explicitResponsive.components) {
      if (c && c.id && hasResponsiveOverrides(c.responsive)) {
        compMap.set(c.id, {
          id: c.id,
          type: c.type || "Component",
          responsive: c.responsive,
        });
      }
    }
    components = Array.from(compMap.values());
  } else if (existingResponsive && Array.isArray(existingResponsive.components) && components.length === 0) {
    // Preserve existing components if document had already been stripped of props.responsive
    components = existingResponsive.components.filter(c => hasResponsiveOverrides(c.responsive));
  }

  return {
    pageResponsive,
    desktop,
    tablet,
    mobile,
    components,
  };
}

module.exports = {
  DEFAULT_PAGE_RESPONSIVE,
  hasResponsiveOverrides,
  extractComponentInstances,
  stripComponentResponsiveness,
  hydrateDocumentWithResponsive,
  buildUnifiedResponsiveModel,
};
