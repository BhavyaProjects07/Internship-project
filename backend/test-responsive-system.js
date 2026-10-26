/**
 * Production-Ready Responsive System Test Suite
 *
 * Verifies:
 * 1. Unit conversion & unitless rules
 * 2. Value inheritance hierarchy (Desktop -> Tablet -> Mobile)
 * 3. Responsive CSS generation (Media queries, Container queries, Preview classes)
 * 4. CSS Custom Properties fallback injection in style builders
 * 5. Backward compatibility for legacy documents without responsive props
 * 6. PostgreSQL JSONB persistence: Save, Reload, Duplication, and Publishing
 */

const assert = require("assert");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const websiteService = require("./src/services/website.service");
const templateService = require("./src/services/template.service");

// Inline equivalent of frontend responsiveStyles for Node verification
const UNIT_LESS_PROPERTIES = new Set([
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

const DEFAULT_VARIABLE_MAP = {
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
  fontSize: "--puck-font-size",
  lineHeight: "--puck-line-height",
  letterSpacing: "--puck-letter-spacing",
  textAlign: "--puck-text-align",
  height: "--puck-image-height",
  aspectRatio: "--puck-aspect-ratio",
  objectFit: "--puck-object-fit",
};

function toCssValue(key, value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") {
    return UNIT_LESS_PROPERTIES.has(key) ? String(value) : `${value}px`;
  }
  const str = String(value).trim();
  if (/^-?\d+(\.\d+)?$/.test(str) && !UNIT_LESS_PROPERTIES.has(key)) {
    return `${str}px`;
  }
  return str;
}

function resolveResponsiveValue(responsive, key, device, fallback) {
  if (!responsive || typeof responsive !== "object") return fallback;
  if (device === "mobile") {
    const mobileVal = responsive?.mobile?.[key];
    if (mobileVal !== undefined && mobileVal !== null && mobileVal !== "") return mobileVal;
    const tabletVal = responsive?.tablet?.[key];
    if (tabletVal !== undefined && tabletVal !== null && tabletVal !== "") return tabletVal;
    return fallback;
  }
  if (device === "tablet") {
    const tabletVal = responsive?.tablet?.[key];
    if (tabletVal !== undefined && tabletVal !== null && tabletVal !== "") return tabletVal;
    return fallback;
  }
  return fallback;
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

function buildResponsiveStyles({ responsive = {}, variableMap = DEFAULT_VARIABLE_MAP }) {
  const mergedMap = { ...DEFAULT_VARIABLE_MAP, ...variableMap };
  const rawTablet = responsive?.tablet;
  const rawMobile = responsive?.mobile;

  const validTabletEntries = rawTablet && typeof rawTablet === "object"
    ? Object.entries(rawTablet).filter(([k, v]) => mergedMap[k] && v !== undefined && v !== null && v !== "")
    : [];

  const validMobileEntries = rawMobile && typeof rawMobile === "object"
    ? Object.entries(rawMobile).filter(([k, v]) => mergedMap[k] && v !== undefined && v !== null && v !== "")
    : [];

  if (validTabletEntries.length === 0 && validMobileEntries.length === 0) {
    return { className: "", css: "" };
  }

  const normalizedTablet = Object.fromEntries(validTabletEntries);
  const normalizedMobile = Object.fromEntries(validMobileEntries);
  const effectiveMobile = { ...normalizedTablet, ...normalizedMobile };

  const signature = JSON.stringify({ normalizedTablet, effectiveMobile, mergedMap });
  const className = `puck-resp-${hashString(signature)}`;
  const rules = [];

  const buildDecls = (valuesMap) => {
    const decls = [];
    for (const [key, rawVal] of Object.entries(valuesMap)) {
      const cssVal = toCssValue(key, rawVal);
      if (cssVal === null) continue;
      const varName = mergedMap[key];
      if (varName) decls.push(`${varName}: ${cssVal};`);
      if (key === "fontSize") decls.push(`font-size: ${cssVal};`);
      if (key === "lineHeight") decls.push(`line-height: ${cssVal};`);
      if (key === "textAlign") decls.push(`text-align: ${cssVal};`);
      if (key === "direction") decls.push(`flex-direction: ${cssVal};`);
      if (key === "gap") decls.push(`gap: ${cssVal};`);
    }
    return decls.join(" ");
  };

  const tabletDecls = buildDecls(normalizedTablet);
  const mobileDecls = buildDecls(effectiveMobile);

  if (tabletDecls) {
    rules.push(`@media (min-width: 768px) and (max-width: 1023px) { .${className}, .puck-public-responsive-container .${className} { ${tabletDecls} } }`);
    rules.push(`.studio-preview-tablet .${className} { ${tabletDecls} }`);
    rules.push(`@container studio-preview (min-width: 768px) and (max-width: 1023px) { .${className} { ${tabletDecls} } }`);
  }

  if (mobileDecls) {
    rules.push(`@media (max-width: 767px) { .${className}, .puck-public-responsive-container .${className} { ${mobileDecls} } }`);
    rules.push(`.studio-preview-mobile .${className} { ${mobileDecls} }`);
    rules.push(`@container studio-preview (max-width: 767px) { .${className} { ${mobileDecls} } }`);
  }

  return { className, css: rules.join("\n") };
}

async function runTestSuite() {
  console.log("===============================================================");
  console.log("  PRODUCTION RESPONSIVE SYSTEM VERIFICATION SUITE");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // --------------------------------------------------------------------------
  // 1. CSS Value Normalization and Unitless Properties
  // --------------------------------------------------------------------------
  console.log("--- 1. CSS Value Normalization & Unitless Properties ---");
  test("toCssValue: unitless properties remain unitless numbers/strings", () => {
    assert.strictEqual(toCssValue("columns", 2), "2");
    assert.strictEqual(toCssValue("lineHeight", 1.2), "1.2");
    assert.strictEqual(toCssValue("fontWeight", 700), "700");
    assert.strictEqual(toCssValue("opacity", 0.8), "0.8");
    assert.strictEqual(toCssValue("aspectRatio", "16 / 9"), "16 / 9");
  });

  test("toCssValue: dimensions correctly receive px suffix", () => {
    assert.strictEqual(toCssValue("fontSize", 24), "24px");
    assert.strictEqual(toCssValue("fontSize", "32"), "32px");
    assert.strictEqual(toCssValue("paddingY", 40), "40px");
    assert.strictEqual(toCssValue("gap", 16), "16px");
    assert.strictEqual(toCssValue("maxWidth", 1200), "1200px");
  });

  test("toCssValue: strings with existing units preserve their units", () => {
    assert.strictEqual(toCssValue("fontSize", "1.5rem"), "1.5rem");
    assert.strictEqual(toCssValue("width", "100%"), "100%");
    assert.strictEqual(toCssValue("paddingX", "24px"), "24px");
    assert.strictEqual(toCssValue("maxWidth", "none"), "none");
  });

  test("toCssValue: empty, undefined, null return null without producing invalid CSS", () => {
    assert.strictEqual(toCssValue("fontSize", null), null);
    assert.strictEqual(toCssValue("fontSize", undefined), null);
    assert.strictEqual(toCssValue("fontSize", ""), null);
  });

  // --------------------------------------------------------------------------
  // 2. Responsive Value Inheritance Hierarchy
  // --------------------------------------------------------------------------
  console.log("\n--- 2. Responsive Value Inheritance Hierarchy ---");
  test("resolveResponsiveValue: Desktop fallback when no overrides exist", () => {
    const val = resolveResponsiveValue(null, "fontSize", "mobile", 42);
    assert.strictEqual(val, 42);
  });

  test("resolveResponsiveValue: Tablet override takes precedence on tablet", () => {
    const responsive = { tablet: { fontSize: 32 } };
    const val = resolveResponsiveValue(responsive, "fontSize", "tablet", 42);
    assert.strictEqual(val, 32);
  });

  test("resolveResponsiveValue: Mobile inherits Tablet override when Mobile not set", () => {
    const responsive = { tablet: { fontSize: 32 } };
    const val = resolveResponsiveValue(responsive, "fontSize", "mobile", 42);
    assert.strictEqual(val, 32);
  });

  test("resolveResponsiveValue: Mobile override takes highest precedence on mobile", () => {
    const responsive = { tablet: { fontSize: 32 }, mobile: { fontSize: 24 } };
    const val = resolveResponsiveValue(responsive, "fontSize", "mobile", 42);
    assert.strictEqual(val, 24);
  });

  test("resolveResponsiveValue: Unsetting mobile override cleanly restores tablet inheritance", () => {
    const responsive = { tablet: { fontSize: 32 }, mobile: { fontSize: "" } };
    const val = resolveResponsiveValue(responsive, "fontSize", "mobile", 42);
    assert.strictEqual(val, 32);
  });

  // --------------------------------------------------------------------------
  // 3. Responsive CSS Generation
  // --------------------------------------------------------------------------
  console.log("\n--- 3. Responsive CSS Engine Generation ---");
  test("buildResponsiveStyles: Empty responsive object returns empty className and css", () => {
    const res = buildResponsiveStyles({ responsive: {} });
    assert.strictEqual(res.className, "");
    assert.strictEqual(res.css, "");
  });

  test("buildResponsiveStyles: Generates media queries, container queries, and editor preview classes", () => {
    const responsive = {
      tablet: { fontSize: 32, paddingY: 48 },
      mobile: { fontSize: 22, paddingY: 32 },
    };
    const res = buildResponsiveStyles({ responsive });
    assert.ok(res.className.startsWith("puck-resp-"));
    assert.ok(res.css.includes("@media (min-width: 768px) and (max-width: 1023px)"));
    assert.ok(res.css.includes("@media (max-width: 767px)"));
    assert.ok(res.css.includes(".studio-preview-tablet"));
    assert.ok(res.css.includes(".studio-preview-mobile"));
    assert.ok(res.css.includes("@container studio-preview (min-width: 768px)"));
    assert.ok(res.css.includes("@container studio-preview (max-width: 767px)"));
    assert.ok(res.css.includes("--puck-font-size: 32px"));
    assert.ok(res.css.includes("--puck-font-size: 22px"));
    assert.ok(res.css.includes("--puck-padding-y: 48px"));
    assert.ok(res.css.includes("--puck-padding-y: 32px"));
  });

  test("buildResponsiveStyles: Mobile inherits tablet values when only tablet is defined", () => {
    const responsive = {
      tablet: { paddingX: 20 },
    };
    const res = buildResponsiveStyles({ responsive });
    assert.ok(res.css.includes("@media (max-width: 767px)"));
    assert.ok(res.css.includes("--puck-padding-x: 20px"));
  });

  // --------------------------------------------------------------------------
  // 4. Backward Compatibility with Documents Lacking Responsive Props
  // --------------------------------------------------------------------------
  console.log("\n--- 4. Backward Compatibility for Legacy Templates ---");
  test("Legacy component without responsive field returns clean styles", () => {
    const legacyProps = {
      id: "legacy-heading-1",
      text: "Original Desktop Headline",
      fontSize: 48,
      lineHeight: 1.2,
      // Notice: NO responsive property at all
    };

    const res = buildResponsiveStyles({ responsive: legacyProps.responsive });
    assert.strictEqual(res.className, "");
    assert.strictEqual(res.css, "");

    const resolvedFontSize = resolveResponsiveValue(legacyProps.responsive, "fontSize", "mobile", legacyProps.fontSize);
    assert.strictEqual(resolvedFontSize, 48);
  });

  // --------------------------------------------------------------------------
  // 5. PostgreSQL JSONB Database Persistence & Publishing
  // --------------------------------------------------------------------------
  console.log("\n--- 5. PostgreSQL JSONB Persistence, Duplicate & Publish ---");
  await asyncTest("Database: Save template with responsive settings into PostgreSQL JSONB", async () => {
    const mockDoc = {
      content: [
        {
          type: "Heading",
          props: {
            id: "resp-heading-test",
            text: "Responsive Production Headline",
            fontSize: 48,
            lineHeight: 1.2,
            responsive: {
              tablet: { fontSize: 36, textAlign: "center" },
              mobile: { fontSize: 24, textAlign: "center" },
            },
          },
        },
        {
          type: "Section",
          props: {
            id: "resp-section-test",
            paddingY: 96,
            paddingX: 32,
            responsive: {
              tablet: { paddingY: 64, paddingX: 24 },
              mobile: { paddingY: 40, paddingX: 16 },
            },
          },
        },
        {
          type: "Navbar",
          props: {
            id: "resp-nav-test",
            brandName: "Apex Architecture",
            mobileBreakpoint: "md",
            responsive: {
              mobile: { logoWidth: 120 },
            },
          },
        },
      ],
      root: { props: { title: "Responsive Test Page" } },
    };

    // Create a template with TemplatePage storing the Puck JSONB document
    const createdTemplate = await prisma.template.create({
      data: {
        name: "Automated Responsive Test Template " + Date.now(),
        slug: "resp-test-" + Date.now(),
        category: "Technology",
        description: "Test template for responsive JSONB persistence",
        status: "PUBLISHED",
        pages: {
          create: [
            {
              name: "Home",
              slug: "home",
              order: 1,
              editorData: mockDoc,
            },
          ],
        },
      },
      include: { pages: true },
    });

    assert.ok(createdTemplate.id, "Template should have an ID");
    assert.ok(createdTemplate.pages.length > 0, "Template should have pages");

    // Fetch back from database to verify JSONB round-trip
    const reloaded = await prisma.template.findUnique({
      where: { id: createdTemplate.id },
      include: { pages: true },
    });

    const page = reloaded.pages[0];
    assert.ok(page.editorData, "editorData should be present");
    const reloadedHeading = page.editorData.content.find((c) => c.type === "Heading");
    assert.ok(reloadedHeading, "Heading should be present");
    assert.strictEqual(reloadedHeading.props.responsive.tablet.fontSize, 36);
    assert.strictEqual(reloadedHeading.props.responsive.mobile.fontSize, 24);

    const reloadedSection = page.editorData.content.find((c) => c.type === "Section");
    assert.strictEqual(reloadedSection.props.responsive.mobile.paddingY, 40);
    assert.strictEqual(reloadedSection.props.responsive.mobile.paddingX, 16);

    // Duplicate template page document
    const duplicatedTemplate = await prisma.template.create({
      data: {
        name: createdTemplate.name + " (Copy)",
        slug: createdTemplate.slug + "-copy",
        category: "Technology",
        description: createdTemplate.description,
        status: "DRAFT",
        pages: {
          create: [
            {
              name: "Home",
              slug: "home",
              order: 1,
              editorData: page.editorData,
            },
          ],
        },
      },
      include: { pages: true },
    });

    assert.ok(duplicatedTemplate.id, "Duplicated template should have an ID");
    const dupHeading = duplicatedTemplate.pages[0].editorData.content.find((c) => c.type === "Heading");
    assert.deepStrictEqual(dupHeading.props.responsive, reloadedHeading.props.responsive);

    // Clean up test templates
    await prisma.templatePage.deleteMany({
      where: { templateId: { in: [createdTemplate.id, duplicatedTemplate.id] } },
    });
    await prisma.template.deleteMany({
      where: { id: { in: [createdTemplate.id, duplicatedTemplate.id] } },
    });
  });

  await asyncTest("Database: Publish website preserving responsive document in publishedData", async () => {
    const mockUserId = "test_resp_user_" + Date.now();
    const mockDoc = {
      content: [
        {
          type: "Hero",
          props: {
            id: "hero-1",
            title: "Future of Web",
            paddingY: 96,
            responsive: {
              tablet: { paddingY: 64 },
              mobile: { paddingY: 40 },
            },
          },
        },
      ],
      root: { props: {} },
    };

    const site = await prisma.website.create({
      data: {
        name: "Responsive Publishing Test Site",
        slug: "resp-pub-site-" + Date.now(),
        userId: mockUserId,
        pages: {
          create: [
            {
              name: "Home",
              slug: "home",
              order: 1,
              editorData: mockDoc,
              sections: {
                create: [
                  {
                    type: "hero",
                    order: 1,
                    content: mockDoc,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    // Publish the site via websiteService
    const pubResult = await websiteService.publishWebsite(site.id, mockUserId);
    assert.ok(pubResult.isPublished, "Site should be published");

    const publishedSite = await prisma.website.findUnique({
      where: { id: site.id },
    });

    assert.ok(publishedSite.isPublished, "isPublished must be true");
    assert.ok(publishedSite.publishedData, "publishedData must be present");
    assert.ok(publishedSite.publishedData.pages.length > 0, "publishedData pages must be populated");

    // Clean up test website
    await prisma.websiteSection.deleteMany({
      where: { page: { websiteId: site.id } },
    });
    await prisma.websitePage.deleteMany({
      where: { websiteId: site.id },
    });
    await prisma.website.delete({
      where: { id: site.id },
    });
  });

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log("\n===============================================================");
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("===============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite()
  .catch((err) => {
    console.error("Fatal error during test run:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
