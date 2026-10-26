"use client";

import React, { useState } from "react";
import MediaLibraryModal from "./MediaLibraryModal";

/**
 * Reusable MediaInput component for React forms (Category, Template, etc.)
 * Provides dual capability:
 * 1. Direct external image URL paste & edit
 * 2. Upload or select an asset from the centralized Media Library
 */
export default function MediaInput({
  label = "Image URL",
  value = "",
  onChange,
  placeholder = "https://... or choose from library",
  required = false,
  description = "Paste an image URL or upload/select from the centralized Media Library.",
  className = "",
}) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-semibold text-gray-400 hover:text-red-600 transition"
          >
            Clear image
          </button>
        )}
      </div>

      {/* Input Row with Preview, Text Input, and Library Button */}
      <div className="flex items-center gap-3">
        {/* Thumbnail Preview */}
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm">
          {value ? (
            <img
              src={value}
              alt="Field preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        {/* Text Input (Allows manual URL entry) */}
        <input
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
        />

        {/* Button to open Centralized Media Library */}
        <button
          type="button"
          onClick={() => setIsLibraryOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-1"
        >
          <svg
            className="h-4 w-4 text-gray-600"
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
          Upload / Choose
        </button>
      </div>

      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {/* Media Library Modal */}
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
