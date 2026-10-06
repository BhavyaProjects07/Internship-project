"use client";

import React from "react";
import { THEME_COLOR_OPTIONS } from "@/lib/theme";

/**
 * ============================================================
 * TypographyProperties
 * ============================================================
 *
 * Provides a standard typography control panel for any text element.
 * Reads from and writes to `section.config.typography[elementId]`.
 */
export default function TypographyProperties({ section, selectedElement, onChange }) {
  if (!selectedElement) return null;

  const { elementId, elementType } = selectedElement;

  // Only show typography for text-based elements
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

  const updateTypography = (field, value) => {
    onChange(section.id, {
      config: {
        ...config,
        typography: {
          ...typographyConfig,
          [elementId]: {
            ...currentTypo,
            [field]: value,
          },
        },
      },
    });
  };

  const FONT_FAMILIES = [
    { label: "Default", value: "" },
    { label: "Inter (Sans)", value: "Inter, sans-serif" },
    { label: "Arial (Sans)", value: "Arial, sans-serif" },
    { label: "Helvetica (Sans)", value: "Helvetica, sans-serif" },
    { label: "Georgia (Serif)", value: "Georgia, serif" },
    { label: "Times New Roman (Serif)", value: "'Times New Roman', serif" },
    { label: "System UI", value: "system-ui, -apple-system, sans-serif" },
    { label: "Monospace", value: "monospace" },
  ];

  const FONT_WEIGHTS = [
    { label: "Default", value: "" },
    { label: "Light (300)", value: "300" },
    { label: "Regular (400)", value: "400" },
    { label: "Medium (500)", value: "500" },
    { label: "Semi Bold (600)", value: "600" },
    { label: "Bold (700)", value: "700" },
    { label: "Extra Bold (800)", value: "800" },
    { label: "Black (900)", value: "900" },
  ];

  const TEXT_ALIGNMENTS = [
    { label: "Default", value: "" },
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
    { label: "Justify", value: "justify" },
  ];

  return (
    <div className="p-5 space-y-4 border-t border-neutral-200 bg-neutral-50/50">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
        Typography
      </span>

      {/* Font Family */}
      <div>
        <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
          Font Family
        </label>
        <select
          value={currentTypo.fontFamily || ""}
          onChange={(e) => updateTypography("fontFamily", e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size & Weight row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
            Size (px)
          </label>
          <input
            type="number"
            min="8"
            max="200"
            placeholder="Default"
            value={currentTypo.fontSize || ""}
            onChange={(e) => updateTypography("fontSize", e.target.value ? Number(e.target.value) : "")}
            className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
            Weight
          </label>
          <select
            value={currentTypo.fontWeight || ""}
            onChange={(e) => updateTypography("fontWeight", e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
          >
            {FONT_WEIGHTS.map((fw) => (
              <option key={fw.value} value={fw.value}>
                {fw.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Line Height & Letter Spacing */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
            Line Height
          </label>
          <input
            type="number"
            step="0.1"
            min="0.5"
            max="3"
            placeholder="Default"
            value={currentTypo.lineHeight || ""}
            onChange={(e) => updateTypography("lineHeight", e.target.value ? Number(e.target.value) : "")}
            className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
            Letter Spacing (px)
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="Default"
            value={currentTypo.letterSpacing || ""}
            onChange={(e) => updateTypography("letterSpacing", e.target.value ? Number(e.target.value) : "")}
            className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Alignment */}
      <div>
        <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
          Alignment
        </label>
        <div className="grid grid-cols-5 gap-1 p-1 bg-neutral-100 rounded-lg">
          {TEXT_ALIGNMENTS.map((align) => (
            <button
              key={align.value || "default"}
              type="button"
              onClick={() => updateTypography("textAlign", align.value)}
              className={`py-1 text-[10px] font-medium transition-all rounded ${
                (currentTypo.textAlign || "") === align.value
                  ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
              title={align.label}
            >
              {align.label === "Default" ? "-" : align.label.charAt(0)}
            </button>
          ))}
        </div>
      </div>


    </div>
  );
}
