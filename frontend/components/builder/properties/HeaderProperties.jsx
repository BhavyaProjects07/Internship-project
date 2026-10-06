"use client";

import React from "react";

export default function HeaderProperties({ section, onChange }) {
  const content = section.content || {};
  const config = section.config || {};

  const navigation = Array.isArray(content.navigation)
    ? content.navigation
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

  const updateNavigationItem = (index, field, value) => {
    const updatedNavigation = navigation.map((item, itemIndex) => {
      if (itemIndex !== index) {
        return item;
      }

      return {
        ...item,
        [field]: value,
      };
    });

    updateContent("navigation", updatedNavigation);
  };

  const addNavigationItem = () => {
    const updatedNavigation = [
      ...navigation,
      {
        label: "New Page",
        link: "/new-page",
      },
    ];

    updateContent("navigation", updatedNavigation);
  };

  const removeNavigationItem = (index) => {
    const updatedNavigation = navigation.filter(
      (_, itemIndex) => itemIndex !== index
    );

    updateContent("navigation", updatedNavigation);
  };

  const moveNavigationItem = (index, direction) => {
    const targetIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= navigation.length
    ) {
      return;
    }

    const updatedNavigation = [...navigation];

    const currentItem = updatedNavigation[index];

    updatedNavigation[index] =
      updatedNavigation[targetIndex];

    updatedNavigation[targetIndex] = currentItem;

    updateContent("navigation", updatedNavigation);
  };

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-neutral-200 bg-white lg:flex lg:flex-col">

      {/* Header */}
      <div className="border-b border-neutral-200 bg-neutral-50/50 p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-600">
            Block: Header
          </span>

          <span className="text-xs font-mono text-neutral-400">
            #{section.id.slice(-6)}
          </span>
        </div>

        <h3 className="text-base font-bold text-neutral-900">
          Header Settings
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          Customize your brand, navigation and header appearance.
        </p>
      </div>

      {/* Brand */}
      <div className="space-y-4 border-b border-neutral-200 p-5">

        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Brand
        </span>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Logo / Brand Name
          </label>

          <input
            type="text"
            value={content.logo || ""}
            onChange={(e) =>
              updateContent("logo", e.target.value)
            }
            placeholder="Your Company"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-4 border-b border-neutral-200 p-5">

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Navigation
          </span>

          <span className="rounded-md bg-neutral-100 px-2 py-1 text-[10px] font-mono text-neutral-500">
            {navigation.length} items
          </span>
        </div>

        <div className="space-y-3">

          {navigation.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"
            >

              {/* Item header */}
              <div className="mb-3 flex items-center justify-between">

                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[10px] font-bold text-neutral-500 shadow-sm">
                    {index + 1}
                  </span>

                  <span className="text-xs font-semibold text-neutral-700">
                    Navigation Item
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeNavigationItem(index)
                  }
                  className="rounded-md p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                  title="Delete navigation item"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 6l12 12M6 18L18 6"
                    />
                  </svg>
                </button>

              </div>

              {/* Label */}
              <div className="mb-3">
                <label className="mb-1.5 block text-[11px] font-semibold text-neutral-600">
                  Label
                </label>

                <input
                  type="text"
                  value={item.label || ""}
                  onChange={(e) =>
                    updateNavigationItem(
                      index,
                      "label",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Link */}
              <div className="mb-3">
                <label className="mb-1.5 block text-[11px] font-semibold text-neutral-600">
                  Link
                </label>

                <input
                  type="text"
                  value={item.link || ""}
                  onChange={(e) =>
                    updateNavigationItem(
                      index,
                      "link",
                      e.target.value
                    )
                  }
                  placeholder="/about"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Reorder */}
              <div className="flex items-center gap-1 border-t border-neutral-200 pt-2">

                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() =>
                    moveNavigationItem(index, "up")
                  }
                  className="flex h-7 flex-1 items-center justify-center rounded-md border border-neutral-200 bg-white text-xs text-neutral-500 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ↑ Move Up
                </button>

                <button
                  type="button"
                  disabled={
                    index === navigation.length - 1
                  }
                  onClick={() =>
                    moveNavigationItem(index, "down")
                  }
                  className="flex h-7 flex-1 items-center justify-center rounded-md border border-neutral-200 bg-white text-xs text-neutral-500 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ↓ Move Down
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* Add navigation item */}
        <button
          type="button"
          onClick={addNavigationItem}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-white px-3 py-2.5 text-xs font-semibold text-neutral-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
        >
          <span className="text-base leading-none">+</span>
          Add Navigation Item
        </button>

      </div>

      {/* Appearance */}
      <div className="space-y-4 p-5">

        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Appearance
        </span>



        {/* Text color */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Text Color
          </label>

          <div className="flex items-center gap-2">

            <input
              type="color"
              value={
                config.textColor || "#0a0a0a"
              }
              onChange={(e) =>
                updateConfig(
                  "textColor",
                  e.target.value
                )
              }
              className="h-8 w-10 cursor-pointer rounded-lg border border-neutral-300 bg-white p-0.5"
            />

            <input
              type="text"
              value={
                config.textColor || "#0a0a0a"
              }
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

        {/* Sticky */}
        <div className="flex items-center justify-between border-t border-neutral-100 pt-3">

          <div>
            <p className="text-xs font-semibold text-neutral-700">
              Sticky Header
            </p>

            <p className="mt-0.5 text-[10px] text-neutral-400">
              Keep header visible while scrolling
            </p>
          </div>

          <input
            type="checkbox"
            checked={config.sticky ?? true}
            onChange={(e) =>
              updateConfig(
                "sticky",
                e.target.checked
              )
            }
            className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
          />

        </div>

      </div>
    </aside>
  );
}