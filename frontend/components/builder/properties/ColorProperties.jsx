"use client";

import React from "react";
import { THEME_COLOR_OPTIONS } from "@/lib/theme";

/**
 * ============================================================
 * ColorProperties
 * ============================================================
 *
 * Provides a standard color control panel for any text element.
 * Reads from and writes to `section.config.typography[elementId].color`.
 */
export default function ColorProperties({ section, selectedElement, onChange }) {
  if (!selectedElement) return null;

  const { elementId, elementType } = selectedElement;

  // Only show color for text-based elements
  const isTextElement = [
    "heading",
    "paragraph",
    "button",
    "link",
    "stat",
    "testimonial",
    "list-item",
    "nav-item",
  ].includes(elementType);

  if (!isTextElement) return null;

  const config = section.config || {};
  const typographyConfig = config.typography || {};
  const currentTypo = typographyConfig[elementId] || {};
  const currentColor = currentTypo.color || "";

  const updateColor = (newColor) => {
    // If the new color is an empty string, we omit it from the object, or just set it to ""
    onChange(section.id, {
      config: {
        ...config,
        typography: {
          ...typographyConfig,
          [elementId]: {
            ...currentTypo,
            color: newColor,
          },
        },
      },
    });
  };

  return (
    <div className="p-5 space-y-4 border-t border-neutral-200 bg-neutral-50/50">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
        Color
      </span>

      <div>
        <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
          Text Color
        </label>
        <div className="flex flex-col gap-2">
          <select
            value={currentColor.startsWith("theme.") ? currentColor : "custom"}
            onChange={(e) => {
              if (e.target.value !== "custom") {
                updateColor(e.target.value);
              } else {
                updateColor(""); // Default to empty string for custom to trigger text input
              }
            }}
            className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
          >
            <option value="custom">Inherit / Custom Color</option>
            <optgroup label="Theme Colors">
              {THEME_COLOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          </select>

          {!currentColor.startsWith("theme.") && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentColor || "#000000"}
                onChange={(e) => updateColor(e.target.value)}
                className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
              />
              <input
                type="text"
                placeholder="Inherit / Default"
                value={currentColor}
                onChange={(e) => updateColor(e.target.value)}
                className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
              />
              {currentColor && (
                <button
                  type="button"
                  onClick={() => updateColor("")}
                  className="text-neutral-400 hover:text-neutral-700"
                  title="Clear Color"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
