"use client";

import React from 'react';

export default function HeroProperties({ section, onChange }) {
  const content = section.content || {};
  const config = section.config || {};

  const updateContent = (field, value) => {
    onChange(section.id, {
      content: {
        ...content,
        [field]: value,
      },
    });
  };

  const updateConfig = (field, value) => {
    onChange(section.id, {
      config: {
        ...config,
        [field]: value,
      },
    });
  };

  const colorPresets = [
    { label: "White", value: "#ffffff" },
    { label: "Light Gray", value: "#f9fafb" },
    { label: "Warm Stone", value: "#f5f5f4" },
    { label: "Obsidian", value: "#0a0a0a" },
    { label: "Slate Navy", value: "#0f172a" },
    { label: "Charcoal", value: "#171717" },
  ];

  return (
    <div className="divide-y divide-neutral-200 text-neutral-800">
      {/* Header Info */}
      <div className="p-5 bg-neutral-50/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Block: Hero
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            #{section.id.slice(-6)}
          </span>
        </div>
        <h3 className="text-base font-bold text-neutral-900">
          Hero Section Settings
        </h3>
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
          Configure headline, narrative copy, CTAs, and ambient styling.
        </p>
      </div>

      {/* Content Form Group */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Content Elements
          </span>
        </div>

        {/* Eyebrow / Kicker */}
        <div>
          <label htmlFor="hero-eyebrow" className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Eyebrow / Sub-kicker
          </label>
          <input
            id="hero-eyebrow"
            type="text"
            value={content.eyebrow || ""}
            onChange={(e) => updateContent("eyebrow", e.target.value)}
            placeholder="Digital Studio · Global Practice"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Heading */}
        <div>
          <label htmlFor="hero-heading" className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Primary Heading
          </label>
          <textarea
            id="hero-heading"
            rows={3}
            value={content.heading || ""}
            onChange={(e) => updateContent("heading", e.target.value)}
            placeholder="Digital experiences built for ambitious brands."
            className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 leading-relaxed"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="hero-description" className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Narrative Description
          </label>
          <textarea
            id="hero-description"
            rows={3}
            value={content.description || ""}
            onChange={(e) => updateContent("description", e.target.value)}
            placeholder="We design and build high-performance digital products..."
            className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 leading-relaxed"
          />
        </div>

        {/* Primary Button */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
          <div>
            <label htmlFor="hero-btn1-text" className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Primary Button Text
            </label>
            <input
              id="hero-btn1-text"
              type="text"
              value={content.primaryButtonText || content.buttonText || ""}
              onChange={(e) => {
                updateContent("primaryButtonText", e.target.value);
                updateContent("buttonText", e.target.value);
              }}
              placeholder="Start a Project"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
            />
          </div>
          <div>
            <label htmlFor="hero-btn1-link" className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Primary Button Link
            </label>
            <input
              id="hero-btn1-link"
              type="text"
              value={content.primaryButtonLink || content.buttonLink || ""}
              onChange={(e) => {
                updateContent("primaryButtonLink", e.target.value);
                updateContent("buttonLink", e.target.value);
              }}
              placeholder="#contact"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
            />
          </div>
        </div>

        {/* Secondary Button */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="hero-btn2-text" className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Secondary Button Text
            </label>
            <input
              id="hero-btn2-text"
              type="text"
              value={content.secondaryButtonText || ""}
              onChange={(e) => updateContent("secondaryButtonText", e.target.value)}
              placeholder="View Selected Work"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
            />
          </div>
          <div>
            <label htmlFor="hero-btn2-link" className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Secondary Button Link
            </label>
            <input
              id="hero-btn2-link"
              type="text"
              value={content.secondaryButtonLink || ""}
              onChange={(e) => updateContent("secondaryButtonLink", e.target.value)}
              placeholder="#portfolio"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Style & Appearance */}
      <div className="p-5 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
          Layout & Styling
        </span>

        {/* Alignment */}
        {/* Alignment */}
<div>
  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
    Content Alignment
  </label>

  <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-lg">
    {[
      { id: "left", label: "Left" },
      { id: "center", label: "Center" },
      { id: "right", label: "Right" },
    ].map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => updateConfig("alignment", item.id)}
        className={`flex items-center justify-center py-1.5 text-xs font-medium rounded-md transition-all ${
          (config.alignment || "center") === item.id
            ? "bg-white text-neutral-950 shadow-sm"
            : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        {item.label}
      </button>
    ))}
  </div>
</div>



        {/* Text Color */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Text Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.textColor || "#0a0a0a"}
              onChange={(e) => updateConfig("textColor", e.target.value)}
              className="h-8 w-10 cursor-pointer rounded-lg border border-neutral-300 bg-white p-0.5"
            />
            <input
              type="text"
              value={config.textColor || "#0a0a0a"}
              onChange={(e) => updateConfig("textColor", e.target.value)}
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-mono uppercase text-neutral-800 outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
