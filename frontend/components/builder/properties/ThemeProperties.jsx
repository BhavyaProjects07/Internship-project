"use client";

import React from "react";
import { DEFAULT_THEME, THEME_COLOR_OPTIONS } from "@/lib/theme";

export default function ThemeProperties({ website, onChange, onClose }) {
  const theme = website.theme || DEFAULT_THEME;
  const colors = theme.colors || DEFAULT_THEME.colors;

  const updateColor = (token, value) => {
    onChange({
      theme: {
        ...theme,
        colors: {
          ...colors,
          [token]: value
        }
      }
    });
  };

  return (
    <div className="border-t border-neutral-200">
      <div className="flex h-10 items-center justify-between border-b border-neutral-200 px-4 shrink-0 bg-neutral-50/50">
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Global Theme
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-5 space-y-6">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block border-b border-neutral-100 pb-2">
            Brand Colors
          </span>
          {["primary", "secondary", "accent"].map((token) => (
            <div key={token}>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5 capitalize">
                {token}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors[token] || "#000000"}
                  onChange={(e) => updateColor(token, e.target.value)}
                  className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
                />
                <input
                  type="text"
                  value={colors[token] || ""}
                  onChange={(e) => updateColor(token, e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block border-b border-neutral-100 pb-2">
            Surface Colors
          </span>
          {["background", "surface", "border"].map((token) => (
            <div key={token}>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5 capitalize">
                {token}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors[token] || "#ffffff"}
                  onChange={(e) => updateColor(token, e.target.value)}
                  className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
                />
                <input
                  type="text"
                  value={colors[token] || ""}
                  onChange={(e) => updateColor(token, e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block border-b border-neutral-100 pb-2">
            Text Colors
          </span>
          {["text", "mutedText"].map((token) => (
            <div key={token}>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5 capitalize">
                {token.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors[token] || "#000000"}
                  onChange={(e) => updateColor(token, e.target.value)}
                  className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
                />
                <input
                  type="text"
                  value={colors[token] || ""}
                  onChange={(e) => updateColor(token, e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block border-b border-neutral-100 pb-2">
            Status Colors
          </span>
          {["success", "warning", "error"].map((token) => (
            <div key={token}>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5 capitalize">
                {token}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors[token] || "#000000"}
                  onChange={(e) => updateColor(token, e.target.value)}
                  className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
                />
                <input
                  type="text"
                  value={colors[token] || ""}
                  onChange={(e) => updateColor(token, e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
