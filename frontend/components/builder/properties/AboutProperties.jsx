"use client";

import React from "react";

export default function AboutProperties({ section, onChange }) {
  const content = section.content || {};
  const config = section.config || {};

  const metadata = Array.isArray(content.metadata)
    ? content.metadata
    : [];

  const pillars = Array.isArray(content.pillars)
    ? content.pillars
    : [];

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

  // --------------------------------------------------
  // METADATA
  // --------------------------------------------------

  const updateMetadataItem = (index, value) => {
    const updatedMetadata = metadata.map((item, itemIndex) => {
      if (itemIndex !== index) {
        return item;
      }

      return {
        ...item,
        label: value,
      };
    });

    updateContent("metadata", updatedMetadata);
  };

  const addMetadataItem = () => {
    updateContent("metadata", [
      ...metadata,
      {
        label: "New information",
      },
    ]);
  };

  const removeMetadataItem = (index) => {
    updateContent(
      "metadata",
      metadata.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // --------------------------------------------------
  // PILLARS
  // --------------------------------------------------

  const updatePillar = (index, field, value) => {
    const updatedPillars = pillars.map((pillar, pillarIndex) => {
      if (pillarIndex !== index) {
        return pillar;
      }

      return {
        ...pillar,
        [field]: value,
      };
    });

    updateContent("pillars", updatedPillars);
  };

  const addPillar = () => {
    updateContent("pillars", [
      ...pillars,
      {
        number: String(pillars.length + 1).padStart(2, "0"),
        title: "New Pillar",
        description: "Describe this principle.",
      },
    ]);
  };

  const removePillar = (index) => {
    updateContent(
      "pillars",
      pillars.filter((_, pillarIndex) => pillarIndex !== index)
    );
  };

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-neutral-200 bg-white lg:flex lg:flex-col">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="border-b border-neutral-200 bg-neutral-50/50 p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-600">
            Block: About
          </span>

          <span className="text-xs font-mono text-neutral-400">
            #{section.id.slice(-6)}
          </span>
        </div>

        <h3 className="text-base font-bold text-neutral-900">
          About Section Settings
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          Customize the story, metadata, principles and visual presentation.
        </p>
      </div>

      {/* ================================================== */}
      {/* BASIC CONTENT */}
      {/* ================================================== */}

      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Content
        </span>

        {/* Eyebrow */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Eyebrow
          </label>

          <input
            type="text"
            value={content.eyebrow || ""}
            onChange={(e) =>
              updateContent("eyebrow", e.target.value)
            }
            placeholder="About our studio"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Heading */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Heading
          </label>

          <textarea
            rows={3}
            value={content.heading || ""}
            onChange={(e) =>
              updateContent("heading", e.target.value)
            }
            placeholder="We build digital experiences that matter."
            className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs leading-relaxed text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Description
          </label>

          <textarea
            rows={5}
            value={content.description || ""}
            onChange={(e) =>
              updateContent("description", e.target.value)
            }
            placeholder="Tell visitors about your company..."
            className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs leading-relaxed text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Highlight */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Highlight / Quote
          </label>

          <textarea
            rows={4}
            value={content.highlightText || ""}
            onChange={(e) =>
              updateContent("highlightText", e.target.value)
            }
            placeholder="Good design is good business..."
            className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs leading-relaxed text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* METADATA */}
      {/* ================================================== */}

      <div className="space-y-4 border-b border-neutral-200 p-5">
        <div className="flex items-center justify-between">
          <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
            Metadata
          </span>

          <button
            type="button"
            onClick={addMetadataItem}
            className="rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
          >
            + Add
          </button>
        </div>

        <p className="text-[11px] leading-relaxed text-neutral-500">
          Small supporting information displayed below the About heading.
        </p>

        {metadata.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center">
            <p className="text-xs text-neutral-400">
              No metadata items yet.
            </p>

            <button
              type="button"
              onClick={addMetadataItem}
              className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Add metadata
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {metadata.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                    Item {String(index + 1).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeMetadataItem(index)}
                    className="text-[10px] font-semibold text-red-500 transition hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>

                <input
                  type="text"
                  value={item.label || ""}
                  onChange={(e) =>
                    updateMetadataItem(index, e.target.value)
                  }
                  placeholder="Independent Digital Agency"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* CORE TENETS / PILLARS */}
      {/* ================================================== */}

      <div className="space-y-4 border-b border-neutral-200 p-5">
        <div className="flex items-center justify-between">
          <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
            Core Tenets
          </span>

          <button
            type="button"
            onClick={addPillar}
            className="rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
          >
            + Add
          </button>
        </div>

        <p className="text-[11px] leading-relaxed text-neutral-500">
          Add and edit the principles, values or differentiators displayed in
          the About section.
        </p>

        {pillars.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center">
            <p className="text-xs text-neutral-400">
              No core tenets yet.
            </p>

            <button
              type="button"
              onClick={addPillar}
              className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Add core tenet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"
              >
                {/* Pillar Header */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                    Tenet {String(index + 1).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    onClick={() => removePillar(index)}
                    className="text-[10px] font-semibold text-red-500 transition hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>

                {/* Number */}
                <div className="mb-3">
                  <label className="mb-1.5 block text-[11px] font-semibold text-neutral-700">
                    Number
                  </label>

                  <input
                    type="text"
                    value={pillar.number || ""}
                    onChange={(e) =>
                      updatePillar(index, "number", e.target.value)
                    }
                    placeholder="01"
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Title */}
                <div className="mb-3">
                  <label className="mb-1.5 block text-[11px] font-semibold text-neutral-700">
                    Title
                  </label>

                  <input
                    type="text"
                    value={pillar.title || ""}
                    onChange={(e) =>
                      updatePillar(index, "title", e.target.value)
                    }
                    placeholder="Commercial Rigor"
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-neutral-700">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={pillar.description || ""}
                    onChange={(e) =>
                      updatePillar(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Describe this principle..."
                    className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs leading-relaxed text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* IMAGE */}
      {/* ================================================== */}

      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Image
        </span>

        {/* Preview */}
        {content.image && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
            <img
              src={content.image}
              alt={content.imageAlt || "About section"}
              className="h-32 w-full object-cover"
            />
          </div>
        )}

        {/* Image URL */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Image URL
          </label>

          <input
            type="text"
            value={content.image || ""}
            onChange={(e) =>
              updateContent("image", e.target.value)
            }
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Alt Text */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Image Alt Text
          </label>

          <input
            type="text"
            value={content.imageAlt || ""}
            onChange={(e) =>
              updateContent("imageAlt", e.target.value)
            }
            placeholder="Our creative team"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* CTA */}
      {/* ================================================== */}

      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Call To Action
        </span>

        {/* Button Text */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Button Text
          </label>

          <input
            type="text"
            value={content.buttonText || ""}
            onChange={(e) =>
              updateContent("buttonText", e.target.value)
            }
            placeholder="Learn More"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Button Link */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Button Link
          </label>

          <input
            type="text"
            value={content.buttonLink || ""}
            onChange={(e) =>
              updateContent("buttonLink", e.target.value)
            }
            placeholder="/about"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* ABOUT-SPECIFIC LAYOUT */}
      {/* ================================================== */}

      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Layout
        </span>

        {/* Image Position */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Image Position
          </label>

          <select
            value={config.imagePosition || "right"}
            onChange={(e) =>
              updateConfig("imagePosition", e.target.value)
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600"
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {/* ================================================== */}
      {/* APPEARANCE */}
      {/* ================================================== */}

      <div className="space-y-4 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Appearance
        </span>



        {/* Text Color */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Text Color
          </label>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.textColor || "#0a0a0a"}
              onChange={(e) =>
                updateConfig("textColor", e.target.value)
              }
              className="h-8 w-10 cursor-pointer rounded-lg border border-neutral-300 bg-white p-0.5"
            />

            <input
              type="text"
              value={config.textColor || "#0a0a0a"}
              onChange={(e) =>
                updateConfig(
                  "textColor",
                  e.target.value
                )
              }
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-mono uppercase text-neutral-800 outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}