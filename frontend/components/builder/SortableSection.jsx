"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SectionRenderer from "@/components/SectionRenderer";

export default function SortableSection({
  section,
  isSelected,
  onSelect,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white transition-shadow ${
  isDragging
    ? "z-50 scale-[1.01] opacity-70 shadow-2xl"
    : "shadow-sm"
}`}
    >
      {/* Editor toolbar */}
      <div
        className={`flex h-9 items-center justify-between border-b px-3 transition ${
          isSelected
            ? "border-blue-200 bg-blue-50"
            : "border-gray-200 bg-gray-50 group-hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Drag ${section.type} section`}
            title="Drag section"
            className="flex h-6 w-7 cursor-grab items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 shadow-sm transition hover:border-gray-300 hover:text-gray-700 active:cursor-grabbing"
          >
            <span className="grid grid-cols-2 gap-[2px]">
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
            </span>
          </button>

          {/* Section type */}
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isSelected
                ? "text-blue-700"
                : "text-gray-500"
            }`}
          >
            {section.type}
          </span>
        </div>

        {/* Selected indicator */}
        {isSelected && (
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Selected
          </span>
        )}
      </div>

      {/* Actual website section */}
      <div
        onClick={onSelect}
        className={`relative cursor-pointer transition ${
          isSelected
            ? "ring-2 ring-inset ring-blue-500"
            : "hover:ring-2 hover:ring-inset hover:ring-blue-200"
        }`}
      >
        <SectionRenderer section={section} />
      </div>
    </div>
  );
}