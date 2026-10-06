"use client";

import { useState } from "react";

export default function GalleryProperties({ section, onChange }) {
  const content = section.content || {};
  const config = section.config || {};

  const [newImageUrl, setNewImageUrl] = useState("");

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

  const images = content.images || [];

  const updateImage = (index, field, value) => {
    const updatedImages = images.map((image, imageIndex) =>
      imageIndex === index
        ? {
            ...image,
            [field]: value,
          }
        : image
    );

    updateContent("images", updatedImages);
  };

  const addImage = () => {
    const url = newImageUrl.trim();

    if (!url) return;

    updateContent("images", [
      ...images,
      {
        id: crypto.randomUUID(),
        url,
        alt: "",
      },
    ]);

    setNewImageUrl("");
  };

  const removeImage = (index) => {
    updateContent(
      "images",
      images.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-neutral-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-neutral-200 p-5">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-600">
          Block: Gallery
        </span>

        <h3 className="mt-1 text-base font-bold text-neutral-900">
          Gallery Settings
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          Manage gallery content, images, layout, and appearance.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Content
        </span>

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
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Heading
          </label>

          <input
            type="text"
            value={content.heading || ""}
            onChange={(e) =>
              updateContent("heading", e.target.value)
            }
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Description
          </label>

          <textarea
            rows={3}
            value={content.description || ""}
            onChange={(e) =>
              updateContent("description", e.target.value)
            }
            className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4 border-b border-neutral-200 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Images
          </span>

          <span className="text-[11px] font-medium text-neutral-400">
            {images.length} image{images.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="space-y-3">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700">
                  Image {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-xs font-medium text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              {image.url && (
                <img
                  src={image.url}
                  alt={image.alt || ""}
                  className="mb-3 aspect-[4/3] w-full rounded-lg object-cover"
                />
              )}

              <div className="space-y-2">
                <input
                  type="text"
                  value={image.url || ""}
                  onChange={(e) =>
                    updateImage(index, "url", e.target.value)
                  }
                  placeholder="Image URL"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-600"
                />

                <input
                  type="text"
                  value={image.alt || ""}
                  onChange={(e) =>
                    updateImage(index, "alt", e.target.value)
                  }
                  placeholder="Alt text"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-600"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 pt-4">
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Add Image
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://..."
              className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
            />

            <button
              type="button"
              onClick={addImage}
              className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Layout
        </span>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Columns
          </label>

          <select
            value={config.columns || 3}
            onChange={(e) =>
              updateConfig("columns", Number(e.target.value))
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-600"
          >
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Text Alignment
          </label>

          <select
            value={config.alignment || "left"}
            onChange={(e) =>
              updateConfig("alignment", e.target.value)
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-600"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-4 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Appearance
        </span>



        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Text Color
          </label>

          <div className="flex gap-2">
            <input
              type="color"
              value={config.textColor || "#111827"}
              onChange={(e) =>
                updateConfig("textColor", e.target.value)
              }
              className="h-8 w-10 cursor-pointer rounded border border-neutral-300"
            />

            <input
              type="text"
              value={config.textColor || "#111827"}
              onChange={(e) =>
                updateConfig("textColor", e.target.value)
              }
              className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-mono uppercase outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}