"use client";

import React, { useState } from "react";
import MediaLibraryModal from "@/components/media/MediaLibraryModal";

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
            backgroundSize: value === "transparent" ? "8px 8px" : undefined,
            backgroundPosition: value === "transparent" ? "0 0, 0 4px, 4px -4px, -4px 0px" : undefined,
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

/**
 * Interactive Image Input Control with Centralized ImageKit Media Library Modal
 */
export function ImageFieldInput({ label, value = "", onChange, name }) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <div style={{ display: "grid", gap: 8, marginBottom: 12, width: "100%", boxSizing: "border-box" }}>
      {/* Label and Clear action */}
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{label}</span>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#64748b",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 4px",
                borderRadius: 4,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Row 1: Image thumbnail preview + direct URL input */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", minWidth: 0 }}>
        <button
          type="button"
          onClick={() => setIsLibraryOpen(true)}
          title="Click to select or upload image"
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            backgroundColor: "#f8fafc",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
            position: "relative",
            transition: "border-color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4f46e5")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
        >
          {value ? (
            <img
              src={value}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <svg
              style={{ width: 18, height: 18, color: "#94a3b8" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>

        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL..."
          style={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            padding: "8px 10px",
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            outline: "none",
            color: "#0f172a",
            backgroundColor: "#ffffff",
            boxSizing: "border-box",
            transition: "border-color 0.15s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#4f46e5")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
        />
      </div>

      {/* Row 2: Prominent, full-width button to open Centralized Media Library */}
      <button
        type="button"
        onClick={() => setIsLibraryOpen(true)}
        style={{
          width: "100%",
          padding: "8px 12px",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 8,
          border: "1px solid #4f46e5",
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          boxShadow: "0 1px 2px rgba(79, 70, 229, 0.15)",
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
      >
        <svg
          style={{ width: 14, height: 14 }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        Upload / Choose from Assets
      </button>

      {isLibraryOpen && (
        <MediaLibraryModal
          initialUrl={value}
          onSelect={(url) => {
            onChange(url);
            setIsLibraryOpen(false);
          }}
          onClose={() => setIsLibraryOpen(false)}
        />
      )}
    </div>
  );
}

/**
 * Visual Image Field constructor for Puck
 * Allows pasting direct URLs as well as uploading/selecting from the Centralized Media Library
 */
export const imageField = (label) => ({
  type: "custom",
  label,
  render: ({ value, onChange, name }) => (
    <ImageFieldInput
      label={label}
      name={name}
      value={value}
      onChange={onChange}
    />
  ),
});



/**
 * Reusable responsive settings field for Puck Inspector.
 * Stores values as:
 * {
 *   tablet: { ... },
 *   mobile: { ... }
 * }
 *
 * Desktop continues to use the component's existing base properties.
 */
/**
 * Reusable responsive settings field for Puck Inspector.
 * Stores values as:
 * {
 *   tablet: { ... },
 *   mobile: { ... }
 * }
 *
 * Desktop continues to use the component's existing base properties.
 */
export const responsiveField = (settings = [], label = "Responsive overrides") => ({
  type: "custom",
  label,
  render: ({ value, onChange }) => (
    <ResponsiveSettingsInput
      settings={settings}
      value={value || {}}
      onChange={onChange}
    />
  ),
});

function ResponsiveSettingsInput({ settings = [], value = {}, onChange }) {
  const [device, setDevice] = useState("mobile");

  const tabletOverridesCount = Object.keys(value?.tablet || {}).filter(
    (k) => value.tablet[k] !== undefined && value.tablet[k] !== null && value.tablet[k] !== ""
  ).length;

  const mobileOverridesCount = Object.keys(value?.mobile || {}).filter(
    (k) => value.mobile[k] !== undefined && value.mobile[k] !== null && value.mobile[k] !== ""
  ).length;

  const deviceOptions = [
    { id: "desktop", label: "Desktop", count: 0 },
    { id: "tablet", label: "Tablet", count: tabletOverridesCount },
    { id: "mobile", label: "Mobile", count: mobileOverridesCount },
  ];

  const updateValue = (key, nextValue) => {
    if (device === "desktop") {
      return;
    }

    const currentDeviceValues = { ...(value?.[device] || {}) };

    if (nextValue === "" || nextValue === null || nextValue === undefined) {
      delete currentDeviceValues[key];
    } else {
      currentDeviceValues[key] = nextValue;
    }

    const nextValueObj = {
      ...value,
      [device]: currentDeviceValues,
    };

    if (Object.keys(currentDeviceValues).length === 0) {
      delete nextValueObj[device];
    }

    onChange(nextValueObj);
  };

  const clearDeviceOverrides = () => {
    const nextValue = { ...value };
    delete nextValue[device];
    onChange(nextValue);
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    padding: "8px 9px",
    border: "1px solid #cbd5e1",
    borderRadius: 7,
    background: "#fff",
    color: "#0f172a",
    fontSize: 12,
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "grid", gap: 12, paddingBottom: 8 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 4,
        }}
      >
        {deviceOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setDevice(option.id)}
            style={{
              padding: "7px 3px",
              borderRadius: 6,
              border: "1px solid",
              borderColor:
                device === option.id ? "#4f46e5" : "#e2e8f0",
              background:
                device === option.id ? "#eef2ff" : "#fff",
              color:
                device === option.id ? "#4338ca" : "#475569",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <span>{option.label}</span>
            {option.count > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  backgroundColor: device === option.id ? "#4f46e5" : "#94a3b8",
                  color: "#ffffff",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {device === "desktop" && (
        <div
          style={{
            padding: 10,
            borderRadius: 7,
            background: "#f8fafc",
            color: "#475569",
            fontSize: 12,
            lineHeight: 1.5,
            border: "1px solid #e2e8f0",
          }}
        >
          Desktop uses the component&apos;s base settings in the Inspector. Switch to <strong>Tablet</strong> or <strong>Mobile</strong> above to customize overrides for smaller screens.
        </div>
      )}

      {device !== "desktop" &&
        settings.map((setting) => {
          const currentValue = value?.[device]?.[setting.key] ?? "";
          const isOverridden = currentValue !== "";

          return (
            <label
              key={setting.key}
              style={{
                display: "grid",
                gap: 5,
                color: "#334155",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{setting.label}</span>
                {isOverridden && (
                  <span style={{ fontSize: 10, color: "#4f46e5", fontWeight: 700 }}>
                    Customized
                  </span>
                )}
              </div>

              {setting.type === "select" ? (
                <select
                  value={String(currentValue)}
                  onChange={(event) =>
                    updateValue(setting.key, event.target.value)
                  }
                  style={{
                    ...inputStyle,
                    borderColor: isOverridden ? "#818cf8" : "#cbd5e1",
                    backgroundColor: isOverridden ? "#fbfbfe" : "#ffffff",
                  }}
                >
                  <option value="">
                    {device === "mobile" && value?.tablet?.[setting.key] !== undefined
                      ? `Inherit tablet (${value.tablet[setting.key]})`
                      : "Inherit desktop setting"}
                  </option>
                  {setting.options.map((option) => (
                    <option
                      key={String(option.value)}
                      value={String(option.value)}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : setting.type === "text" ? (
                <input
                  type="text"
                  value={currentValue}
                  placeholder={
                    device === "mobile" && value?.tablet?.[setting.key] !== undefined
                      ? `Inherit tablet (${value.tablet[setting.key]})`
                      : "Inherit desktop setting"
                  }
                  onChange={(event) =>
                    updateValue(setting.key, event.target.value)
                  }
                  style={{
                    ...inputStyle,
                    borderColor: isOverridden ? "#818cf8" : "#cbd5e1",
                  }}
                />
              ) : (
                <input
                  type="number"
                  min={setting.min}
                  max={setting.max}
                  step={setting.step ?? 1}
                  value={currentValue}
                  placeholder={
                    device === "mobile" && value?.tablet?.[setting.key] !== undefined
                      ? `Inherit tablet (${value.tablet[setting.key]})`
                      : "Inherit desktop setting"
                  }
                  onChange={(event) => {
                    const raw = event.target.value;
                    updateValue(
                      setting.key,
                      raw === "" ? "" : Number(raw)
                    );
                  }}
                  style={{
                    ...inputStyle,
                    borderColor: isOverridden ? "#818cf8" : "#cbd5e1",
                  }}
                />
              )}
            </label>
          );
        })}

      {device !== "desktop" && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
          <button
            type="button"
            onClick={clearDeviceOverrides}
            style={{
              padding: "6px 10px",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              color: "#64748b",
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reset {device} overrides
          </button>
          <span style={{ color: "#94a3b8", fontSize: 10 }}>
            Inherits automatically
          </span>
        </div>
      )}
    </div>
  );
}

