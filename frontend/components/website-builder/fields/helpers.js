"use client";

import React from "react";

/**
 * Reusable Puck Field Builders with Interactive Visual Controls
 */

export const selectField = (label, options) => ({
  type: "select",
  label,
  options,
});

export const numberField = (label, min = 0, max = 2000, step = 1) => ({
  type: "number",
  label,
  min,
  max,
  step,
});

export const textField = (label) => ({
  type: "text",
  label,
});

export const textareaField = (label) => ({
  type: "textarea",
  label,
});

export const radioField = (label, options) => ({
  type: "radio",
  label,
  options,
});

export const arrayField = (label, itemFields, defaultItemProps = {}) => ({
  type: "array",
  label,
  arrayFields: itemFields,
  defaultItemProps,
});

export const objectField = (label, objectFields) => ({
  type: "object",
  label,
  objectFields,
});

/**
 * Converts any color string to a valid 6-char hex for <input type="color" />
 */
function toHexColor(val) {
  if (!val || typeof val !== "string") return "#000000";
  const clean = val.trim().toLowerCase();
  if (clean === "transparent") return "#ffffff";
  if (/^#[0-9a-f]{6}$/i.test(clean)) return clean;
  if (/^#[0-9a-f]{3}$/i.test(clean)) {
    return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
  }
  return "#0f172a";
}

const PALETTE_PRESETS = [
  { label: "Transparent", value: "transparent" },
  { label: "White", value: "#ffffff" },
  { label: "Slate Dark", value: "#0f172a" },
  { label: "Indigo", value: "#4f46e5" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Light Gray", value: "#f8fafc" },
  { label: "Muted Gray", value: "#64748b" },
];

/**
 * Interactive Color Picker Component for Puck Sidebar
 */
export function ColorPickerInput({ label, value = "", onChange }) {
  const hexVal = toHexColor(value);

  return (
    <div style={{ display: "grid", gap: 6, marginBottom: 8, width: "100%" }}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{label}</span>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>
            {value || "none"}
          </span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Visual Color Picker Button / Swatch */}
        <div
          style={{
            position: "relative",
            width: 34,
            height: 34,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #cbd5e1",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
            flexShrink: 0,
            cursor: "pointer",
            backgroundColor: value === "transparent" ? "#ffffff" : value || "#000000",
            backgroundImage:
              value === "transparent"
                ? "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)"
                : undefined,
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
          }}
          title="Click to open color picker"
        >
          <input
            type="color"
            value={hexVal}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: "absolute",
              top: -10,
              left: -10,
              width: 54,
              height: 54,
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </div>

        {/* Text Input for Exact Hex / RGBA / Named color */}
        <input
          type="text"
          value={value ?? ""}
          placeholder="#000000 or transparent"
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: "7px 10px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            fontSize: 13,
            outline: "none",
            fontFamily: "monospace",
            color: "#0f172a",
            backgroundColor: "#ffffff",
          }}
        />

        {/* Clear to transparent button */}
        <button
          type="button"
          onClick={() => onChange("transparent")}
          title="Set transparent"
          style={{
            padding: "6px 8px",
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 6,
            border: "1px solid #cbd5e1",
            backgroundColor: "#f8fafc",
            color: "#475569",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {/* Palette Swatches */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 2 }}>
        {PALETTE_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            title={`${preset.label} (${preset.value})`}
            onClick={() => onChange(preset.value)}
            style={{
              width: 17,
              height: 17,
              borderRadius: 4,
              border: preset.value === "transparent" ? "1px dashed #94a3b8" : "1px solid rgba(0,0,0,0.18)",
              backgroundColor: preset.value === "transparent" ? "#ffffff" : preset.value,
              cursor: "pointer",
              padding: 0,
              boxShadow: value === preset.value ? "0 0 0 2px #4f46e5" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Visual Color Field constructor for Puck
 */
export const colorField = (label) => ({
  type: "custom",
  label,
  render: ({ value, onChange, name }) => (
    <ColorPickerInput
      label={label}
      name={name}
      value={value}
      onChange={onChange}
    />
  ),
});
