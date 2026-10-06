/**
 * ============================================================
 * elementSchema.js — Content Element Schema Definitions
 * ============================================================
 *
 * Defines which content elements are selectable/editable for
 * each section type. This drives the element selection system
 * and element-specific property panels.
 *
 * Each schema entry maps a section type to its editable elements.
 * Elements can be:
 * - Top-level fields (heading, description, etc.)
 * - Array items (services[0], testimonials[1], etc.)
 * - Nested fields within array items (services[0].title)
 */

// ============================================================
// ELEMENT TYPES
// ============================================================

export const ELEMENT_TYPES = {
  HEADING: "heading",
  PARAGRAPH: "paragraph",
  BUTTON: "button",
  IMAGE: "image",
  CARD: "card",
  LINK: "link",
  STAT: "stat",
  TESTIMONIAL: "testimonial",
  NAV_ITEM: "nav-item",
  LIST_ITEM: "list-item",
};

// ============================================================
// ELEMENT SCHEMAS PER SECTION TYPE
// ============================================================

/**
 * For each section type, define the selectable elements.
 *
 * Structure:
 * {
 *   elementId: string,      // Stable unique ID within the section
 *   elementType: string,    // One of ELEMENT_TYPES
 *   label: string,          // Human-readable label
 *   contentPath: string,    // Dot-separated path into content JSON
 *   isArray?: boolean,      // Whether this is a repeating array
 *   arrayItemSchema?: [],   // Sub-elements within each array item
 * }
 */
const elementSchemas = {
  header: [
    {
      elementId: "logo",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Logo / Brand",
      contentPath: "logo",
    },
    {
      elementId: "navigation",
      elementType: ELEMENT_TYPES.NAV_ITEM,
      label: "Navigation",
      contentPath: "navigation",
      isArray: true,
      arrayItemSchema: [
        { field: "label", type: ELEMENT_TYPES.LINK, label: "Label" },
        { field: "link", type: ELEMENT_TYPES.LINK, label: "Link URL" },
      ],
    },
    {
      elementId: "cta-button",
      elementType: ELEMENT_TYPES.BUTTON,
      label: "CTA Button",
      contentPath: "buttonText",
      linkPath: "buttonLink",
    },
  ],

  hero: [
    {
      elementId: "eyebrow",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Eyebrow",
      contentPath: "eyebrow",
    },
    {
      elementId: "heading",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Heading",
      contentPath: "heading",
    },
    {
      elementId: "description",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Description",
      contentPath: "description",
    },
    {
      elementId: "primary-button",
      elementType: ELEMENT_TYPES.BUTTON,
      label: "Primary Button",
      contentPath: "primaryButtonText",
      linkPath: "primaryButtonLink",
    },
    {
      elementId: "secondary-button",
      elementType: ELEMENT_TYPES.BUTTON,
      label: "Secondary Button",
      contentPath: "secondaryButtonText",
      linkPath: "secondaryButtonLink",
    },
  ],

  logocloud: [
    {
      elementId: "heading",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Heading",
      contentPath: "heading",
    },
    {
      elementId: "logos",
      elementType: ELEMENT_TYPES.CARD,
      label: "Logos",
      contentPath: "logos",
      isArray: true,
      arrayItemSchema: [
        { field: "name", type: ELEMENT_TYPES.HEADING, label: "Name" },
        { field: "imageUrl", type: ELEMENT_TYPES.IMAGE, label: "Logo Image" },
      ],
    },
  ],

  about: [
    {
      elementId: "eyebrow",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Eyebrow",
      contentPath: "eyebrow",
    },
    {
      elementId: "heading",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Heading",
      contentPath: "heading",
    },
    {
      elementId: "description",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Description",
      contentPath: "description",
    },
    {
      elementId: "highlight",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Highlight Quote",
      contentPath: "highlightText",
    },
    {
      elementId: "metadata",
      elementType: ELEMENT_TYPES.LIST_ITEM,
      label: "Metadata Tags",
      contentPath: "metadata",
      isArray: true,
      arrayItemSchema: [
        { field: "label", type: ELEMENT_TYPES.PARAGRAPH, label: "Label" },
      ],
    },
    {
      elementId: "pillars",
      elementType: ELEMENT_TYPES.CARD,
      label: "Pillars",
      contentPath: "pillars",
      isArray: true,
      arrayItemSchema: [
        { field: "number", type: ELEMENT_TYPES.PARAGRAPH, label: "Number" },
        { field: "title", type: ELEMENT_TYPES.HEADING, label: "Title" },
        {
          field: "description",
          type: ELEMENT_TYPES.PARAGRAPH,
          label: "Description",
        },
      ],
    },
  ],

  services: [
    {
      elementId: "eyebrow",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Eyebrow",
      contentPath: "eyebrow",
    },
    {
      elementId: "heading",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Heading",
      contentPath: "heading",
    },
    {
      elementId: "services",
      elementType: ELEMENT_TYPES.CARD,
      label: "Service Cards",
      contentPath: "services",
      isArray: true,
      arrayItemSchema: [
        { field: "title", type: ELEMENT_TYPES.HEADING, label: "Title" },
        {
          field: "description",
          type: ELEMENT_TYPES.PARAGRAPH,
          label: "Description",
        },
        { field: "link", type: ELEMENT_TYPES.LINK, label: "Link" },
      ],
    },
  ],

  portfolio: [
    {
      elementId: "eyebrow",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Eyebrow",
      contentPath: "eyebrow",
    },
    {
      elementId: "heading",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Heading",
      contentPath: "heading",
    },
    {
      elementId: "projects",
      elementType: ELEMENT_TYPES.CARD,
      label: "Projects",
      contentPath: "projects",
      isArray: true,
      arrayItemSchema: [
        { field: "title", type: ELEMENT_TYPES.HEADING, label: "Title" },
        {
          field: "category",
          type: ELEMENT_TYPES.PARAGRAPH,
          label: "Category",
        },
        {
          field: "description",
          type: ELEMENT_TYPES.PARAGRAPH,
          label: "Description",
        },
        { field: "link", type: ELEMENT_TYPES.LINK, label: "Link" },
      ],
    },
  ],

  gallery: [
    {
      elementId: "eyebrow",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Eyebrow",
      contentPath: "eyebrow",
    },
    {
      elementId: "heading",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Heading",
      contentPath: "heading",
    },
    {
      elementId: "description",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Description",
      contentPath: "description",
    },
    {
      elementId: "images",
      elementType: ELEMENT_TYPES.IMAGE,
      label: "Gallery Images",
      contentPath: "images",
      isArray: true,
      arrayItemSchema: [
        { field: "url", type: ELEMENT_TYPES.IMAGE, label: "Image URL" },
        { field: "alt", type: ELEMENT_TYPES.PARAGRAPH, label: "Alt Text" },
      ],
    },
  ],

  stats: [
    {
      elementId: "stats",
      elementType: ELEMENT_TYPES.STAT,
      label: "Statistics",
      contentPath: "stats",
      isArray: true,
      arrayItemSchema: [
        { field: "value", type: ELEMENT_TYPES.HEADING, label: "Value" },
        { field: "label", type: ELEMENT_TYPES.PARAGRAPH, label: "Label" },
        { field: "sub", type: ELEMENT_TYPES.PARAGRAPH, label: "Sub Text" },
      ],
    },
  ],

  process: [
    {
      elementId: "eyebrow",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Eyebrow",
      contentPath: "eyebrow",
    },
    {
      elementId: "heading",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Heading",
      contentPath: "heading",
    },
    {
      elementId: "steps",
      elementType: ELEMENT_TYPES.CARD,
      label: "Process Steps",
      contentPath: "steps",
      isArray: true,
      arrayItemSchema: [
        { field: "title", type: ELEMENT_TYPES.HEADING, label: "Title" },
        {
          field: "description",
          type: ELEMENT_TYPES.PARAGRAPH,
          label: "Description",
        },
      ],
    },
  ],

  testimonials: [
    {
      elementId: "heading",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Heading",
      contentPath: "heading",
    },
    {
      elementId: "testimonials",
      elementType: ELEMENT_TYPES.TESTIMONIAL,
      label: "Testimonials",
      contentPath: "testimonials",
      isArray: true,
      arrayItemSchema: [
        { field: "name", type: ELEMENT_TYPES.HEADING, label: "Name" },
        { field: "role", type: ELEMENT_TYPES.PARAGRAPH, label: "Role" },
        { field: "company", type: ELEMENT_TYPES.PARAGRAPH, label: "Company" },
        { field: "quote", type: ELEMENT_TYPES.PARAGRAPH, label: "Quote" },
      ],
    },
  ],

  cta: [
    {
      elementId: "heading",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Heading",
      contentPath: "heading",
    },
    {
      elementId: "description",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Description",
      contentPath: "description",
    },
    {
      elementId: "button",
      elementType: ELEMENT_TYPES.BUTTON,
      label: "CTA Button",
      contentPath: "buttonText",
      linkPath: "buttonLink",
    },
  ],

  contact: [
    {
      elementId: "eyebrow",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Eyebrow",
      contentPath: "eyebrow",
    },
    {
      elementId: "heading",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Heading",
      contentPath: "heading",
    },
    {
      elementId: "description",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Description",
      contentPath: "description",
    },
    {
      elementId: "email",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Email",
      contentPath: "email",
    },
    {
      elementId: "phone",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Phone",
      contentPath: "phone",
    },
    {
      elementId: "address",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Address",
      contentPath: "address",
    },
    {
      elementId: "button",
      elementType: ELEMENT_TYPES.BUTTON,
      label: "CTA Button",
      contentPath: "buttonText",
      linkPath: "buttonLink",
    },
  ],

  footer: [
    {
      elementId: "logo",
      elementType: ELEMENT_TYPES.HEADING,
      label: "Logo / Brand",
      contentPath: "logo",
    },
    {
      elementId: "description",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Description",
      contentPath: "description",
    },
    {
      elementId: "copyright",
      elementType: ELEMENT_TYPES.PARAGRAPH,
      label: "Copyright",
      contentPath: "copyright",
    },
    {
      elementId: "columns",
      elementType: ELEMENT_TYPES.CARD,
      label: "Link Columns",
      contentPath: "columns",
      isArray: true,
      arrayItemSchema: [
        { field: "title", type: ELEMENT_TYPES.HEADING, label: "Column Title" },
      ],
    },
  ],
};

/**
 * Get the element schema for a given section type.
 * Returns an empty array if the section type is unknown.
 */
export function getElementSchema(sectionType) {
  return elementSchemas[sectionType] || [];
}

/**
 * Find a specific element definition by elementId within a section type's schema.
 */
export function findElementDef(sectionType, elementId) {
  const schema = getElementSchema(sectionType);

  // Direct top-level match
  const direct = schema.find((el) => el.elementId === elementId);
  if (direct) return direct;

  // Check for array item match: "services.0", "pillars.1", etc.
  const parts = elementId.split(".");
  if (parts.length >= 2) {
    const parentId = parts[0];
    const parent = schema.find((el) => el.elementId === parentId);
    if (parent && parent.isArray) {
      return {
        ...parent,
        _arrayIndex: Number(parts[1]),
        _isArrayItem: true,
      };
    }
  }

  return null;
}

export default elementSchemas;
