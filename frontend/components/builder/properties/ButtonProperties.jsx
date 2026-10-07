"use client";

import React from "react";
import { THEME_COLOR_OPTIONS } from "@/lib/theme";

const ColorControl = ({ label, value, onChange }) => {
  const currentValue = value || "";
  return (
    <div>
      <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
        {label}
      </label>
      <div className="flex flex-col gap-2">
        <select
          value={currentValue.startsWith("theme.") ? currentValue : "custom"}
          onChange={(e) => {
            if (e.target.value !== "custom") {
              onChange(e.target.value);
            } else {
              onChange("");
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

        {!currentValue.startsWith("theme.") && (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentValue || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
            />
            <input
              type="text"
              placeholder="Inherit / Default"
              value={currentValue}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
            />
            {currentValue && (
              <button
                type="button"
                onClick={() => onChange("")}
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
  );
};

/**
 * ButtonProperties
 * Foundation for Button customization (Phase 6C).
 * Supports content and visual styling mapping cleanly to the existing ElementProperties flow.
 */
export default function ButtonProperties({
  elementDef,
  textValue,
  linkValue,
  targetValue, // Reserved for future use
  buttonConfig = {},
  onTextChange,
  onLinkChange,
  onTargetChange, // Reserved for future use
  onStyleChange,
}) {
  return (
    <div className="space-y-6 pb-4">
      {/* CONTENT */}
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
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
        />
      </div>

      {elementDef.linkPath && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Link URL
            </label>
            <input
              type="text"
              value={linkValue}
              onChange={(e) => onLinkChange(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Open In
            </label>
            <select
              value={targetValue}
              onChange={(e) => onTargetChange(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
            >
              <option value="_self">Same Tab</option>
              <option value="_blank">New Tab</option>
            </select>
          </div>
        </div>
      )}
      </div>

      {/* APPEARANCE */}
      <div className="px-5 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block border-t border-neutral-200 pt-5">
          Appearance
        </span>

        <ColorControl
          label="Background Color"
          value={buttonConfig.backgroundColor}
          onChange={(val) => onStyleChange("backgroundColor", val)}
        />

        <ColorControl
          label="Text Color"
          value={buttonConfig.textColor}
          onChange={(val) => onStyleChange("textColor", val)}
        />

        <div className="grid grid-cols-2 gap-4">
          <ColorControl
            label="Border Color"
            value={buttonConfig.borderColor}
            onChange={(val) => onStyleChange("borderColor", val)}
          />

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
              Border Width (px)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={buttonConfig.borderWidth !== undefined ? buttonConfig.borderWidth : ""}
              onChange={(e) => onStyleChange("borderWidth", e.target.value)}
              placeholder="Default"
              className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
            Border Radius (px)
          </label>
          <select
            value={buttonConfig.borderRadius !== undefined ? buttonConfig.borderRadius : ""}
            onChange={(e) => onStyleChange("borderRadius", e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-600"
          >
            <option value="">Inherit / Default</option>
            <option value="0">0 (Square)</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="12">12</option>
            <option value="16">16</option>
            <option value="24">24</option>
            <option value="9999">9999 (Pill)</option>
          </select>
        </div>
      </div>

      {/* HOVER STATE */}
      <div className="px-5 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block border-t border-neutral-200 pt-5">
          Hover State
        </span>

        <ColorControl
          label="Hover Background Color"
          value={buttonConfig.hover?.backgroundColor}
          onChange={(val) =>
            onStyleChange("hover", {
              ...(buttonConfig.hover || {}),
              backgroundColor: val,
            })
          }
        />

        <ColorControl
          label="Hover Text Color"
          value={buttonConfig.hover?.textColor}
          onChange={(val) =>
            onStyleChange("hover", {
              ...(buttonConfig.hover || {}),
              textColor: val,
            })
          }
        />

        <ColorControl
          label="Hover Border Color"
          value={buttonConfig.hover?.borderColor}
          onChange={(val) =>
            onStyleChange("hover", {
              ...(buttonConfig.hover || {}),
              borderColor: val,
            })
          }
        />
      </div>

      {/* SPACING */}
      <div className="px-5 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block border-t border-neutral-200 pt-5">
          Spacing
        </span>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">Padding Top (px)</label>
            <input type="number" min="0" max="64" placeholder="Default" value={buttonConfig.paddingTop !== undefined ? buttonConfig.paddingTop : ""} onChange={(e) => onStyleChange("paddingTop", e.target.value)} className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs outline-none focus:border-blue-600" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">Padding Right (px)</label>
            <input type="number" min="0" max="64" placeholder="Default" value={buttonConfig.paddingRight !== undefined ? buttonConfig.paddingRight : ""} onChange={(e) => onStyleChange("paddingRight", e.target.value)} className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs outline-none focus:border-blue-600" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">Padding Bottom (px)</label>
            <input type="number" min="0" max="64" placeholder="Default" value={buttonConfig.paddingBottom !== undefined ? buttonConfig.paddingBottom : ""} onChange={(e) => onStyleChange("paddingBottom", e.target.value)} className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs outline-none focus:border-blue-600" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">Padding Left (px)</label>
            <input type="number" min="0" max="64" placeholder="Default" value={buttonConfig.paddingLeft !== undefined ? buttonConfig.paddingLeft : ""} onChange={(e) => onStyleChange("paddingLeft", e.target.value)} className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs outline-none focus:border-blue-600" />
          </div>
        </div>
      </div>

      {/* SIZE */}
      <div className="px-5 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block border-t border-neutral-200 pt-5">
          Size
        </span>
        <div>
          <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">Width</label>
          <select value={buttonConfig.width || "auto"} onChange={(e) => onStyleChange("width", e.target.value)} className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs outline-none focus:border-blue-600">
            <option value="auto">Auto / Default</option>
            <option value="full">Full Width</option>
          </select>
        </div>
      </div>
    </div>
  );
}
