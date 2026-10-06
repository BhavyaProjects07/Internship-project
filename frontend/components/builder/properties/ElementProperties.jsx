"use client";

import React from "react";
import { ELEMENT_TYPES, findElementDef } from "@/lib/elementSchema";
import TypographyProperties from "./TypographyProperties";
import ColorProperties from "./ColorProperties";

/**
 * ============================================================
 * ElementProperties — Element-Specific Property Panel
 * ============================================================
 *
 * Rendered inside BuilderProperties when an individual element
 * is selected (rather than the whole section). Shows controls
 * appropriate for the element type:
 *
 * - Heading: text, fontSize, fontWeight, textAlignment, color
 * - Paragraph: text, textAlignment, color
 * - Button: label, link, alignment
 * - Image: url, alt text
 * - Card: title, description, button, image within the card
 * - Stat: value, label
 * - Testimonial: name, role, company, quote
 */
function ElementPropertiesInner({
  section,
  selectedElement,
  onChange,
}) {
  const content = section.content || {};
  const sectionType = section.type;
  const { elementId, elementType } = selectedElement;

  const elementDef = findElementDef(sectionType, elementId);
  if (!elementDef) return null;

  // ============================================================
  // UPDATE HELPERS
  // ============================================================

  const updateContentField = (field, value) => {
    onChange(section.id, {
      content: {
        ...content,
        [field]: value,
      },
    });
  };

  const updateArrayItem = (arrayPath, index, field, value) => {
    const arr = Array.isArray(content[arrayPath])
      ? [...content[arrayPath]]
      : [];
    if (index >= 0 && index < arr.length) {
      arr[index] = { ...arr[index], [field]: value };
      updateContentField(arrayPath, arr);
    }
  };

  const addArrayItem = (arrayPath, defaultItem) => {
    const arr = Array.isArray(content[arrayPath])
      ? [...content[arrayPath]]
      : [];
    const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7);
    arr.push({ ...defaultItem, id: `item-${uniqueId}` });
    updateContentField(arrayPath, arr);
  };

  const removeArrayItem = (arrayPath, index) => {
    const arr = Array.isArray(content[arrayPath])
      ? [...content[arrayPath]]
      : [];
    arr.splice(index, 1);
    updateContentField(arrayPath, arr);
  };

  // ============================================================
  // ELEMENT-TYPE SPECIFIC RENDERING
  // ============================================================

  // Check for array item selection: "services.0", "pillars.1"
  const parts = elementId.split(".");
  const isArrayItem = parts.length >= 2 && elementDef._isArrayItem;

  if (isArrayItem) {
    const arrayPath = parts[0];
    const arrayIndex = Number(parts[1]);
    const items = Array.isArray(content[arrayPath])
      ? content[arrayPath]
      : [];
    const item = items[arrayIndex];

    if (!item) {
      return (
        <div className="p-5 text-xs text-neutral-400 text-center">
          Item not found at index {arrayIndex}
        </div>
      );
    }

    const subSchema = elementDef.arrayItemSchema || [];

    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            {elementDef.label} #{arrayIndex + 1}
          </span>
          <button
            type="button"
            onClick={() => removeArrayItem(arrayPath, arrayIndex)}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Remove
          </button>
        </div>

        {/* If array item supports typography, we can pass it down as well. Wait, TypographyProperties handles current element ID natively (e.g., 'services.0.title'). But ElementProperties for arrays loops over sub-fields. 
            Actually, the user selects 'services', not 'services.0.title'. Let's rethink. */}
        {subSchema.map((sub) => (
          <div key={sub.field}>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {sub.label}
            </label>
            {sub.type === ELEMENT_TYPES.IMAGE ? (
              <input
                type="text"
                value={item[sub.field] || ""}
                onChange={(e) =>
                  updateArrayItem(
                    arrayPath,
                    arrayIndex,
                    sub.field,
                    e.target.value
                  )
                }
                placeholder="https://..."
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
              />
            ) : sub.type === ELEMENT_TYPES.PARAGRAPH ? (
              <textarea
                rows={2}
                value={item[sub.field] || ""}
                onChange={(e) =>
                  updateArrayItem(
                    arrayPath,
                    arrayIndex,
                    sub.field,
                    e.target.value
                  )
                }
                className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
              />
            ) : (
              <input
                type="text"
                value={item[sub.field] || ""}
                onChange={(e) =>
                  updateArrayItem(
                    arrayPath,
                    arrayIndex,
                    sub.field,
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // ============================================================
  // NON-ARRAY ELEMENTS
  // ============================================================

  // HEADING element
  if (elementType === ELEMENT_TYPES.HEADING) {
    const value = getNestedValue(content, elementDef.contentPath) || "";
    return (
      <div className="p-5 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
          {elementDef.label}
        </span>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Text
          </label>
          <textarea
            rows={2}
            value={value}
            onChange={(e) =>
              updateContentField(elementDef.contentPath, e.target.value)
            }
            className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
          />
        </div>
      </div>
    );
  }

  // PARAGRAPH element
  if (elementType === ELEMENT_TYPES.PARAGRAPH) {
    const value = getNestedValue(content, elementDef.contentPath) || "";
    return (
      <div className="p-5 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
          {elementDef.label}
        </span>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Text
          </label>
          <textarea
            rows={3}
            value={value}
            onChange={(e) =>
              updateContentField(elementDef.contentPath, e.target.value)
            }
            className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
          />
        </div>
      </div>
    );
  }

  // BUTTON element
  if (elementType === ELEMENT_TYPES.BUTTON) {
    const textValue =
      getNestedValue(content, elementDef.contentPath) || "";
    const linkValue = elementDef.linkPath
      ? getNestedValue(content, elementDef.linkPath) || ""
      : "";

    return (
      <div className="p-5 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
          {elementDef.label}
        </span>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Button Label
          </label>
          <input
            type="text"
            value={textValue}
            onChange={(e) =>
              updateContentField(elementDef.contentPath, e.target.value)
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
          />
        </div>

        {elementDef.linkPath && (
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Link URL
            </label>
            <input
              type="text"
              value={linkValue}
              onChange={(e) =>
                updateContentField(elementDef.linkPath, e.target.value)
              }
              placeholder="#contact"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
            />
          </div>
        )}
      </div>
    );
  }

  // IMAGE element
  if (elementType === ELEMENT_TYPES.IMAGE) {
    // Array of images
    if (elementDef.isArray) {
      const items = Array.isArray(content[elementDef.contentPath])
        ? content[elementDef.contentPath]
        : [];

      return (
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {elementDef.label}
            </span>
            <button
              type="button"
              onClick={() =>
                addArrayItem(elementDef.contentPath, {
                  url: "",
                  alt: "",
                })
              }
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              + Add Image
            </button>
          </div>

          {items.map((img, idx) => (
            <div
              key={img.id || idx}
              className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-neutral-600">
                  Image {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    removeArrayItem(elementDef.contentPath, idx)
                  }
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              <input
                type="text"
                value={img.url || ""}
                onChange={(e) =>
                  updateArrayItem(
                    elementDef.contentPath,
                    idx,
                    "url",
                    e.target.value
                  )
                }
                placeholder="Image URL"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
              />

              <input
                type="text"
                value={img.alt || ""}
                onChange={(e) =>
                  updateArrayItem(
                    elementDef.contentPath,
                    idx,
                    "alt",
                    e.target.value
                  )
                }
                placeholder="Alt text"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
              />
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  // CARD / STAT / TESTIMONIAL / LIST_ITEM / NAV_ITEM — Array collections
  if (
    elementDef.isArray &&
    [
      ELEMENT_TYPES.CARD,
      ELEMENT_TYPES.STAT,
      ELEMENT_TYPES.TESTIMONIAL,
      ELEMENT_TYPES.LIST_ITEM,
      ELEMENT_TYPES.NAV_ITEM,
    ].includes(elementType)
  ) {
    const items = Array.isArray(content[elementDef.contentPath])
      ? content[elementDef.contentPath]
      : [];
    const subSchema = elementDef.arrayItemSchema || [];

    // Build a default item from the sub-schema
    const defaultItem = {};
    subSchema.forEach((sub) => {
      defaultItem[sub.field] = "";
    });

    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            {elementDef.label} ({items.length})
          </span>
          <button
            type="button"
            onClick={() =>
              addArrayItem(elementDef.contentPath, defaultItem)
            }
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            + Add
          </button>
        </div>

        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-neutral-600">
                {elementDef.label} #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() =>
                  removeArrayItem(elementDef.contentPath, idx)
                }
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            {subSchema.map((sub) => (
              <div key={sub.field}>
                <label className="block text-[11px] text-neutral-500 mb-1">
                  {sub.label}
                </label>
                {sub.type === ELEMENT_TYPES.PARAGRAPH ? (
                  <textarea
                    rows={2}
                    value={item[sub.field] || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        elementDef.contentPath,
                        idx,
                        sub.field,
                        e.target.value
                      )
                    }
                    className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
                  />
                ) : (
                  <input
                    type="text"
                    value={item[sub.field] || ""}
                    onChange={(e) =>
                      updateArrayItem(
                        elementDef.contentPath,
                        idx,
                        sub.field,
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Fallback: generic text field
  const fallbackValue =
    getNestedValue(content, elementDef.contentPath) || "";
  return (
    <div className="p-5 space-y-4">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
        {elementDef.label}
      </span>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
          Text
        </label>
        <input
          type="text"
          value={typeof fallbackValue === "string" ? fallbackValue : ""}
          onChange={(e) =>
            updateContentField(elementDef.contentPath, e.target.value)
          }
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
        />
      </div>
    </div>
  );
}

export default function ElementProperties(props) {
  return (
    <div className="flex flex-col">
      <ElementPropertiesInner {...props} />
      <TypographyProperties {...props} />
      <ColorProperties {...props} />
    </div>
  );
}

// ============================================================
// HELPER: Get nested value by dot-path
// ============================================================

function getNestedValue(obj, path) {
  if (!path) return undefined;
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
