"use client";

import React from "react";
import { ELEMENT_TYPES, findElementDef } from "@/lib/elementSchema";
import TypographyProperties from "./TypographyProperties";
import ColorProperties from "./ColorProperties";
import ImageProperties from "./ImageProperties";
import ButtonProperties from "./ButtonProperties";
import { createWebsitePageAction } from "@/app/builder/actions";
function generateUniqueId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

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
   websiteId,
  pages = [],
  onPageCreated,
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
    const uniqueId = generateUniqueId();
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

  const updateButtonConfig = (field, value) => {
    const existingButtonConfig = section.config?.button || {};
    const existingElementConfig = existingButtonConfig[elementId] || {};
    
    onChange(section.id, {
      config: {
        ...section.config,
        button: {
          ...existingButtonConfig,
          [elementId]: {
            ...existingElementConfig,
            [field]: value
          }
        }
      }
    });
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
  const isNavigationItem =
    elementType === ELEMENT_TYPES.NAV_ITEM;

  const updateItemField = (field, value) => {
    updateArrayItem(arrayPath, arrayIndex, field, value);
  };

  const updateNavigationType = (linkType) => {
    const updatedItems = [...items];

    updatedItems[arrayIndex] = {
      ...updatedItems[arrayIndex],
      linkType,
      ...(linkType === "page"
        ? {}
        : { pageId: "" }),
    };

    updateContentField(arrayPath, updatedItems);
  };

  const selectPage = (pageId) => {
    const page = pages.find(
      (p) => p.id === pageId
    );

    const updatedItems = [...items];

    updatedItems[arrayIndex] = {
      ...updatedItems[arrayIndex],
      pageId: page?.id || "",
      link: page ? `/${page.slug}` : "",
    };

    updateContentField(arrayPath, updatedItems);
  };

  const createPage = async () => {
    const name = window.prompt("Enter the new page name:");

    if (!name?.trim()) return;

    if (!websiteId) {
      window.alert("Website ID is missing.");
      return;
    }

    try {
      const result = await createWebsitePageAction(
        websiteId,
        { name: name.trim() }
      );

      if (!result?.success) {
        window.alert(
          result?.message || "Failed to create page."
        );
        return;
      }

      const page = result.data;

      if (!page?.id || !page?.slug) {
        window.alert(
          "The server did not return valid page data."
        );
        return;
      }

      const updatedItems = [...items];

      updatedItems[arrayIndex] = {
        ...updatedItems[arrayIndex],
        label:
          updatedItems[arrayIndex].label || page.name,
        linkType: "page",
        pageId: page.id,
        link: `/${page.slug}`,
      };

      updateContentField(arrayPath, updatedItems);
      onPageCreated?.(page);
    } catch (error) {
      console.error("Create page failed:", error);
      window.alert(
        "Could not create page. Check the browser console."
      );
    }
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {elementDef.label} #{arrayIndex + 1}
        </span>

        <button
          type="button"
          onClick={() =>
            removeArrayItem(arrayPath, arrayIndex)
          }
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Remove
        </button>
      </div>

      {subSchema.map((sub) => {
        if (
          isNavigationItem &&
          sub.field === "pageId"
        ) {
          return (
            <div key={sub.field}>
              <label className="block text-[11px] text-neutral-500 mb-1">
                Linked Page
              </label>

              <select
                value={item.pageId || ""}
                disabled={item.linkType !== "page"}
                onChange={(e) =>
                  selectPage(e.target.value)
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 disabled:opacity-50"
              >
                <option value="">Select a page</option>

                {pages.map((page) => (
                  <option
                    key={page.id}
                    value={page.id}
                  >
                    {page.name}
                  </option>
                ))}
              </select>

              {item.linkType === "page" && (
                <button
                  type="button"
                  onClick={createPage}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  + Create New Page
                </button>
              )}
            </div>
          );
        }

        if (
          isNavigationItem &&
          sub.field === "linkType"
        ) {
          return (
            <div key={sub.field}>
              <label className="block text-[11px] text-neutral-500 mb-1">
                Link Type
              </label>

              <select
                value={item.linkType || "anchor"}
                onChange={(e) =>
                  updateNavigationType(e.target.value)
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900"
              >
                <option value="page">Internal Page</option>
                <option value="anchor">Section Anchor</option>
                <option value="external">External URL</option>
              </select>
            </div>
          );
        }

        if (
          isNavigationItem &&
          sub.field === "link"
        ) {
          return (
            <div key={sub.field}>
              <label className="block text-[11px] text-neutral-500 mb-1">
                {sub.label}
              </label>

              <input
                type="text"
                value={item.link || ""}
                readOnly={item.linkType === "page"}
                onChange={(e) =>
                  updateItemField("link", e.target.value)
                }
                placeholder={
                  item.linkType === "page"
                    ? "Select a page above"
                    : item.linkType === "external"
                      ? "https://example.com"
                      : "#services"
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 read-only:bg-neutral-100"
              />
            </div>
          );
        }

        return (
          <div key={sub.field}>
            <label className="block text-[11px] text-neutral-500 mb-1">
              {sub.label}
            </label>

            <input
              type="text"
              value={item[sub.field] || ""}
              onChange={(e) =>
                updateItemField(
                  sub.field,
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900"
            />
          </div>
        );
      })}
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
    const textValue = getNestedValue(content, elementDef.contentPath) || "";
    const linkValue = elementDef.linkPath ? getNestedValue(content, elementDef.linkPath) || "" : "";
    const targetValue = elementDef.targetPath ? getNestedValue(content, elementDef.targetPath) || "_self" : "_self";

    return (
      <ButtonProperties
        elementDef={elementDef}
        textValue={textValue}
        linkValue={linkValue}
        targetValue={targetValue}
        buttonConfig={section.config?.button?.[elementId] || {}}
        onTextChange={(val) => updateContentField(elementDef.contentPath, val)}
        onLinkChange={(val) => elementDef.linkPath && updateContentField(elementDef.linkPath, val)}
        onTargetChange={(val) => elementDef.targetPath && updateContentField(elementDef.targetPath, val)}
        onStyleChange={updateButtonConfig}
      />
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

              <ImageProperties
                image={img}
                srcField="url"
                onChange={(updatedImg) => {
                  const arr = [...items];
                  arr[idx] = updatedImg;
                  updateContentField(elementDef.contentPath, arr);
                }}
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

            
            
{subSchema.map((sub) => {
  if (
    elementType === ELEMENT_TYPES.NAV_ITEM &&
    sub.field === "linkType"
  ) {
    return (
      <div key={sub.field}>
        <label className="block text-[11px] text-neutral-500 mb-1">
          Link Type
        </label>
        <select
          value={item.linkType || "anchor"}
          onChange={(e) =>
            updateArrayItem(
              elementDef.contentPath,
              idx,
              "linkType",
              e.target.value
            )
          }
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900"
        >
          <option value="page">Internal Page</option>
          <option value="anchor">Section Anchor</option>
          <option value="external">External URL</option>
        </select>
      </div>
    );
  }

  if (
    elementType === ELEMENT_TYPES.NAV_ITEM &&
    sub.field === "pageId"
  ) {
    return (
      <div key={sub.field}>
        <label className="block text-[11px] text-neutral-500 mb-1">
          Linked Page
        </label>
        <select
          value={item.pageId || ""}
          disabled={item.linkType !== "page"}
          onChange={(e) => {
            const page = pages.find(
              (p) => p.id === e.target.value
            );

            if (!page) return;

            const updatedItems = [...items];
            updatedItems[idx] = {
              ...updatedItems[idx],
              pageId: page.id,
              link: `/${page.slug}`,
            };

            updateContentField(
              elementDef.contentPath,
              updatedItems
            );
          }}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 disabled:opacity-50"
        >
          <option value="">Select a page</option>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>

        {item.linkType === "page" && (
          <button
            type="button"
            onClick={async () => {
              const name = window.prompt(
                "Enter the new page name:"
              );

              if (!name?.trim()) return;

              if (!websiteId) {
                window.alert("Website ID is missing.");
                return;
              }

              try {
                const result = await createWebsitePageAction(
                  websiteId,
                  { name: name.trim() }
                );

                if (!result?.success) {
                  window.alert(
                    result?.message || "Failed to create page."
                  );
                  return;
                }

                const page = result.data;

                if (!page?.id || !page?.slug) {
                  window.alert(
                    "The server did not return valid page data."
                  );
                  return;
                }

                const updatedItems = [...items];
                updatedItems[idx] = {
                  ...updatedItems[idx],
                  label:
                    updatedItems[idx].label || page.name,
                  linkType: "page",
                  pageId: page.id,
                  link: `/${page.slug}`,
                };

                updateContentField(
                  elementDef.contentPath,
                  updatedItems
                );
                onPageCreated?.(page);
              } catch (error) {
                console.error("Create page failed:", error);
                window.alert(
                  "Could not create page. Check the browser console."
                );
              }
            }}
            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            + Create New Page
          </button>
        )}
      </div>
    );
  }

  if (
    elementType === ELEMENT_TYPES.NAV_ITEM &&
    sub.field === "link"
  ) {
    return (
      <div key={sub.field}>
        <label className="block text-[11px] text-neutral-500 mb-1">
          {sub.label}
        </label>
        <input
          type="text"
          value={item.link || ""}
          readOnly={item.linkType === "page"}
          onChange={(e) =>
            updateArrayItem(
              elementDef.contentPath,
              idx,
              "link",
              e.target.value
            )
          }
          placeholder={
            item.linkType === "page"
              ? "Select a page above"
              : item.linkType === "external"
                ? "https://example.com"
                : "#services"
          }
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 read-only:bg-neutral-100"
        />
      </div>
    );
  }

  return (
    <div key={sub.field}>
      <label className="block text-[11px] text-neutral-500 mb-1">
        {sub.label}
      </label>
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
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900"
      />
    </div>
  );
})}

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
