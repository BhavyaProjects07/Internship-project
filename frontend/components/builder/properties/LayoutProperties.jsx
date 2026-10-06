"use client";

import React from "react";

const WIDTH_OPTIONS = [
  { id: "full", label: "Full" },
  { id: "wide", label: "Wide" },
  { id: "boxed", label: "Boxed" },
];

const COLUMN_OPTIONS = [1, 2, 3, 4];

const ALIGNMENT_OPTIONS = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
];

const VERTICAL_ALIGNMENT_OPTIONS = [
  { id: "top", label: "Top" },
  { id: "center", label: "Center" },
  { id: "bottom", label: "Bottom" },
];

const SPACING_FIELDS = [
  { key: "top", label: "Top" },
  { key: "right", label: "Right" },
  { key: "bottom", label: "Bottom" },
  { key: "left", label: "Left" },
];

export default function LayoutProperties({ section, onChange }) {
  const config = section.config || {};

  const layout = config.layout || {};
  const spacing = config.spacing || {};

  const padding = spacing.padding || {};
  const margin = spacing.margin || {};

  const updateLayout = (field, value) => {
    onChange(section.id, {
      config: {
        ...config,
        layout: {
          ...layout,
          [field]: value,
        },
      },
    });
  };

  const updateSpacing = (type, field, value) => {
    const numericValue = Math.max(0, Number(value) || 0);

    onChange(section.id, {
      config: {
        ...config,
        spacing: {
          ...spacing,
          [type]: {
            ...(type === "padding" ? padding : margin),
            [field]: numericValue,
          },
        },
      },
    });
  };

  return (
    <div className="border-b border-neutral-200">
      {/* Header */}
      <div className="px-5 py-4 bg-neutral-50/50">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Layout
        </span>

        <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
          Control the width, columns, alignment, and spacing of this section.
        </p>
      </div>

      {/* Width */}
      <div className="p-5 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Content Width
          </label>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-lg">
            {WIDTH_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateLayout("width", option.id)}
                className={`py-1.5 rounded-md text-xs font-medium transition-all ${
                  (layout.width || "wide") === option.id
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Columns
          </label>

          <div className="grid grid-cols-4 gap-1.5 p-1 bg-neutral-100 rounded-lg">
            {COLUMN_OPTIONS.map((column) => (
              <button
                key={column}
                type="button"
                onClick={() => updateLayout("columns", column)}
                className={`py-1.5 rounded-md text-xs font-medium transition-all ${
                  (layout.columns || 1) === column
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {column}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Alignment */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Alignment
          </label>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-lg">
            {ALIGNMENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateLayout("alignment", option.id)}
                className={`py-1.5 rounded-md text-xs font-medium transition-all ${
                  (layout.alignment || "center") === option.id
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Alignment */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Vertical Alignment
          </label>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-lg">
            {VERTICAL_ALIGNMENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  updateLayout("verticalAlignment", option.id)
                }
                className={`py-1.5 rounded-md text-xs font-medium transition-all ${
                  (layout.verticalAlignment || "center") === option.id
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Padding */}
      <div className="px-5 pb-5">
        <div className="border-t border-neutral-100 pt-5">
          <label className="block text-xs font-semibold text-neutral-700 mb-3">
            Padding
          </label>

          <div className="grid grid-cols-2 gap-3">
            {SPACING_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-[11px] text-neutral-500 mb-1">
                  {field.label}
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={padding[field.key] ?? 0}
                    onChange={(e) =>
                      updateSpacing(
                        "padding",
                        field.key,
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-8 text-xs text-neutral-900 outline-none focus:border-blue-600"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400">
                    px
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Margin */}
      <div className="px-5 pb-5">
        <div className="border-t border-neutral-100 pt-5">
          <label className="block text-xs font-semibold text-neutral-700 mb-3">
            Margin
          </label>

          <div className="grid grid-cols-2 gap-3">
            {SPACING_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-[11px] text-neutral-500 mb-1">
                  {field.label}
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={margin[field.key] ?? 0}
                    onChange={(e) =>
                      updateSpacing(
                        "margin",
                        field.key,
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-8 text-xs text-neutral-900 outline-none focus:border-blue-600"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400">
                    px
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}