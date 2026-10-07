"use client";

import React, { useState } from "react";
import MediaLibrary from "./MediaLibrary";

/**
 * ImageProperties
 * 
 * Manages standard image configuration (src, alt, objectFit, objectPosition, width, height).
 * Preserves backward compatibility by accepting the existing source field name (e.g. 'url', 'imageUrl').
 */
export default function ImageProperties({ image = {}, srcField = "src", onChange }) {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const src = image[srcField] || "";
  const alt = image.alt || "";
  const objectFit = image.objectFit || "cover";
  const objectPosition = image.objectPosition || "center";
  const width = image.width || "";
  const height = image.height || "";

  const handleChange = (field, value) => {
    onChange({ ...image, [field]: value });
  };

  return (
    <div className="space-y-4 pt-2">
      {showMediaLibrary && (
        <MediaLibrary 
          onClose={() => setShowMediaLibrary(false)}
          onSelect={(url) => {
            handleChange(srcField, url);
            setShowMediaLibrary(false);
          }}
        />
      )}

      <div>
        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Image Source (URL)</label>
        <button
          type="button"
          onClick={() => setShowMediaLibrary(true)}
          className="w-full mb-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 font-medium text-[11px] py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Select from Media Library
        </button>
        <input
          type="text"
          value={src}
          onChange={(e) => handleChange(srcField, e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Alt Text</label>
        <input
          type="text"
          value={alt}
          onChange={(e) => handleChange("alt", e.target.value)}
          placeholder="Description for accessibility"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Object Fit</label>
          <select
            value={objectFit}
            onChange={(e) => handleChange("objectFit", e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
            <option value="none">None</option>
            <option value="scale-down">Scale Down</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Position</label>
          <select
            value={objectPosition}
            onChange={(e) => handleChange("objectPosition", e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
          >
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Width</label>
          <input
            type="text"
            value={width}
            onChange={(e) => handleChange("width", e.target.value)}
            placeholder="e.g. 100%, 300px"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Height</label>
          <input
            type="text"
            value={height}
            onChange={(e) => handleChange("height", e.target.value)}
            placeholder="e.g. auto, 400px"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
          />
        </div>
      </div>
    </div>
  );
}
