"use client";

import LayoutProperties from "./properties/LayoutProperties";
import ElementProperties from "./properties/ElementProperties";
import ThemeProperties from "./properties/ThemeProperties";
import BackgroundProperties from "./properties/BackgroundProperties";

import React, { useState } from "react";
import sectionRegistry from "../sections/sectionRegistry";
import { getElementSchema } from "@/lib/elementSchema";
import { THEME_COLOR_OPTIONS } from "@/lib/theme";

export default function BuilderProperties({
  selectedSection,
  selectedElement,
  onChange,
  onThemeChange,
  website,
  selectedPage,
  onClose,
  onClearElement,
  onElementSelect,
}) {
  const colorPresets = [
    { label: "White", value: "#ffffff" },
    { label: "Light Gray", value: "#f9fafb" },
    { label: "Stone", value: "#f5f5f4" },
    { label: "Obsidian", value: "#0a0a0a" },
    { label: "Navy", value: "#0f172a" },
  ];

  /*
   * ============================================================
   * EMPTY STATE
   * ============================================================
   */

  if (!selectedSection) {
    return (
      <aside className="hidden w-80 shrink-0 border-l border-neutral-200 bg-white lg:flex lg:flex-col shadow-xs">
        {/* Top Header */}
        <div className="flex h-12 items-center justify-between border-b border-neutral-200 px-4">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Inspector
            </span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Empty State / Page Overview */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.5"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>

            <h4 className="text-sm font-bold text-neutral-900 mb-1">
              No Block Selected
            </h4>

            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
              Click any section on the canvas or select from the Layers
              outline on the left to customize its contents and appearance.
            </p>
          </div>

          {selectedPage && (
            <div className="pt-6 border-t border-neutral-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                Active Page Summary
              </span>

              <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Page Name</span>

                  <span className="font-semibold text-neutral-900">
                    {selectedPage.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">URL Route</span>

                  <span className="font-mono text-neutral-700">
                    /{selectedPage.slug || "home"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Sections</span>

                  <span className="font-mono font-bold text-blue-600">
                    {selectedPage.sections?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Theme Properties when no section selected */}
        <ThemeProperties website={website} onChange={onThemeChange} />
      </aside>
    );
  }

  /*
   * ============================================================
   * SECTION REGISTRY
   * ============================================================
   */

  const definition = sectionRegistry[selectedSection.type];

  const PropertyComponent = definition?.properties;

  /*
   * ============================================================
   * CURRENT SECTION DATA
   * ============================================================
   */

  const content = selectedSection.content || {};
  const config = selectedSection.config || {};

  /*
   * ============================================================
   * CONTENT UPDATE HELPERS
   * ============================================================
   */

  const updateContentField = (field, value) => {
    onChange(selectedSection.id, {
      content: {
        ...content,
        [field]: value,
      },
    });
  };

  /*
   * ============================================================
   * CONFIG UPDATE HELPERS
   * ============================================================
   */

  const updateConfigField = (field, value) => {
    onChange(selectedSection.id, {
      config: {
        ...config,
        [field]: value,
      },
    });
  };

  /*
   * ============================================================
   * ELEMENT SCHEMA FOR CURRENT SECTION
   * ============================================================
   */
  const elementSchema = getElementSchema(selectedSection.type);

  /*
   * ============================================================
   * ELEMENT SELECTED — Show element-specific properties
   * ============================================================
   */
  if (selectedElement && selectedElement.sectionId === selectedSection.id) {
    return (
      <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-neutral-200 bg-white lg:flex lg:flex-col shadow-xs divide-y divide-neutral-200">
        {/* Element Header */}
        <div className="p-5 bg-neutral-50/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Element: {selectedElement.elementType}
            </span>

            <button
              type="button"
              onClick={onClearElement}
              className="text-xs text-neutral-500 hover:text-neutral-800 font-medium"
            >
              ← Back to Section
            </button>
          </div>

          <h3 className="text-base font-bold text-neutral-900 capitalize">
            {selectedElement.elementId.replace(/[.-]/g, " ")} Settings
          </h3>

          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            Editing an individual element inside the{" "}
            <span className="capitalize font-medium">{selectedSection.type}</span>{" "}
            section.
          </p>
        </div>

        {/* Element-specific properties */}
        <ElementProperties
          section={selectedSection}
          selectedElement={selectedElement}
          onChange={onChange}
        />
      </aside>
    );
  }

  /*
   * ============================================================
   * MAIN SECTION INSPECTOR
   * ============================================================
   */

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-neutral-200 bg-white lg:flex lg:flex-col shadow-xs divide-y divide-neutral-200">
      {/* ======================================================
          BLOCK HEADER
      ====================================================== */}

      <div className="p-5 bg-neutral-50/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Block: {selectedSection.type}
          </span>

          <span className="text-xs text-neutral-400 font-mono">
            #{selectedSection.id.slice(-6)}
          </span>
        </div>

        <h3 className="text-base font-bold text-neutral-900 capitalize">
          {selectedSection.type} Settings
        </h3>

        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
          Customize content attributes, colors, and layout for this block.
        </p>
      </div>

      {/* ======================================================
          ELEMENT OUTLINE — Quick-select editable elements
      ====================================================== */}
      {elementSchema.length > 0 && (
        <div className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-3">
            Editable Elements
          </span>
          <div className="space-y-1">
            {elementSchema.map((el) => (
              <button
                key={el.elementId}
                type="button"
                onClick={() => {
                  if (onElementSelect) {
                    onElementSelect(selectedSection.id, el.elementId, el.elementType);
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors text-left"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                <span>{el.label}</span>
                {el.isArray && (
                  <span className="text-[10px] text-neutral-400 font-mono ml-auto">
                    {(content[el.contentPath] || []).length} items
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
            Click elements directly on the canvas to select and edit them.
          </p>
        </div>
      )}

      {/* ======================================================
          UNIVERSAL LAYOUT PROPERTIES
          Available for EVERY section
      ====================================================== */}

      <LayoutProperties
        section={selectedSection}
        onChange={onChange}
      />

      {/* ======================================================
          BACKGROUND PROPERTIES
      ====================================================== */}
      <BackgroundProperties
        section={selectedSection}
        onChange={onChange}
      />

      {/* ======================================================
          SECTION-SPECIFIC PROPERTIES
      ====================================================== */}

      {PropertyComponent && (
        <PropertyComponent
          section={selectedSection}
          onChange={onChange}
        />
      )}

      {/* ======================================================
          GENERIC CONTENT PROPERTIES
          
          Only show these when there is NO dedicated property
          component for the selected section.
      ====================================================== */}

      {!PropertyComponent && (
        <div className="p-5 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
            Content Properties
          </span>

          {/* Heading or Title */}
          {("heading" in content || "title" in content) && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Heading / Title
              </label>

              <input
                type="text"
                value={content.heading ?? content.title ?? ""}
                onChange={(e) => {
                  if ("heading" in content) {
                    updateContentField("heading", e.target.value);
                  } else {
                    updateContentField("title", e.target.value);
                  }
                }}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
              />
            </div>
          )}

          {/* Eyebrow */}
          {"eyebrow" in content && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Eyebrow Kicker
              </label>

              <input
                type="text"
                value={content.eyebrow || ""}
                onChange={(e) =>
                  updateContentField("eyebrow", e.target.value)
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
              />
            </div>
          )}

          {/* Description */}
          {"description" in content && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Description
              </label>

              <textarea
                rows={3}
                value={content.description || ""}
                onChange={(e) =>
                  updateContentField("description", e.target.value)
                }
                className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
              />
            </div>
          )}

          {/* Highlight Text */}
          {"highlightText" in content && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Highlight Quote
              </label>

              <textarea
                rows={2}
                value={content.highlightText || ""}
                onChange={(e) =>
                  updateContentField("highlightText", e.target.value)
                }
                className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
              />
            </div>
          )}

          {/* Logo / Brand */}
          {"logo" in content && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Brand / Logo Text
              </label>

              <input
                type="text"
                value={content.logo || ""}
                onChange={(e) =>
                  updateContentField("logo", e.target.value)
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
              />
            </div>
          )}

          {/* CTA Button */}
          {"buttonText" in content && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Button Text
                </label>

                <input
                  type="text"
                  value={content.buttonText || ""}
                  onChange={(e) =>
                    updateContentField("buttonText", e.target.value)
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Button Link
                </label>

                <input
                  type="text"
                  value={content.buttonLink || ""}
                  onChange={(e) =>
                    updateContentField("buttonLink", e.target.value)
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {/* Copyright */}
          {"copyright" in content && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Copyright Notice
              </label>

              <input
                type="text"
                value={content.copyright || ""}
                onChange={(e) =>
                  updateContentField("copyright", e.target.value)
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
              />
            </div>
          )}
        </div>
      )}
~
      {/* ======================================================
          GENERIC APPEARANCE & COLORS
          
          Keep this for sections without dedicated property
          components.
      ====================================================== */}

      {!PropertyComponent && (
        <div className="p-5 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
            Appearance & Colors
          </span>



          {/* Text Color */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
              Text Color
            </label>
            <div className="flex flex-col gap-2">
              <select
                value={config.textColor?.startsWith("theme.") ? config.textColor : "custom"}
                onChange={(e) => {
                  if (e.target.value !== "custom") {
                    updateConfigField("textColor", e.target.value);
                  }
                }}
                className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
              >
                <option value="custom">Custom Color</option>
                <optgroup label="Theme Colors">
                  {THEME_COLOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </optgroup>
              </select>

              {!config.textColor?.startsWith("theme.") && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.textColor || "#0a0a0a"}
                    onChange={(e) =>
                      updateConfigField("textColor", e.target.value)
                    }
                    className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
                  />
                  <input
                    type="text"
                    value={config.textColor || "#0a0a0a"}
                    onChange={(e) =>
                      updateConfigField("textColor", e.target.value)
                    }
                    className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sticky Header */}
          {selectedSection.type === "header" && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-neutral-700">
                Sticky on Scroll
              </span>

              <input
                type="checkbox"
                checked={config.sticky ?? true}
                onChange={(e) =>
                  updateConfigField("sticky", e.target.checked)
                }
                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      )}
    </aside>
  );
}