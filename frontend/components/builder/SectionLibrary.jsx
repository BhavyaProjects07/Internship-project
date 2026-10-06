"use client";

import sectionRegistry from "@/components/sections/sectionRegistry";

export default function SectionLibrary({ onClose, onSelect }) {
  const availableSections = Object.entries(sectionRegistry).filter(
    ([, definition]) => definition.canAdd !== false
  );

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">
            Add Section
          </h3>

          <p className="text-[11px] text-neutral-500">
            Choose a reusable section to add to this page.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          title="Close"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Section List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {availableSections.map(([type, definition]) => (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-left transition hover:border-blue-300 hover:bg-blue-50/50"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                  <span className="text-xs font-bold uppercase">
                    {definition.label?.charAt(0) || "S"}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-900">
                    {definition.label}
                  </p>

                  <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500">
                    {definition.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}