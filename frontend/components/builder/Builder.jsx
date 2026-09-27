"use client";

import { useState } from "react";
import {
  updateWebsiteSections,
  reorderWebsiteSections,
} from "@/app/builder/actions";

import SectionRenderer from "@/components/SectionRenderer";
import BuilderProperties from "./BuilderProperties";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableSection from "./SortableSection";

export default function Builder({ website }) {
  // --------------------------------
  // State
  // --------------------------------

  const [selectedPageId, setSelectedPageId] = useState(
    website.pages[0]?.id
  );

  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const [draftWebsite, setDraftWebsite] = useState(website);

  const [dirtySectionIds, setDirtySectionIds] = useState([]);

  const [dirtyPageIds, setDirtyPageIds] = useState([]);

  const [isSaving, setIsSaving] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  // --------------------------------
  // Selected page
  // --------------------------------

  const selectedPage = draftWebsite.pages.find(
    (page) => page.id === selectedPageId
  );

  // --------------------------------
  // Selected section
  // --------------------------------

  const selectedSection = selectedPage?.sections.find(
    (section) => section.id === selectedSectionId
  );

  // --------------------------------
  // Update section content/config
  // --------------------------------

  const updateSection = (sectionId, updates) => {
    setDraftWebsite((currentWebsite) => ({
      ...currentWebsite,

      pages: currentWebsite.pages.map((page) => ({
        ...page,

        sections: page.sections.map((section) => {
          if (section.id !== sectionId) {
            return section;
          }

          return {
            ...section,
            ...updates,
          };
        }),
      })),
    }));

    setDirtySectionIds((currentIds) => {
      if (currentIds.includes(sectionId)) {
        return currentIds;
      }

      return [...currentIds, sectionId];
    });

    setSaveMessage("");
  };

  // --------------------------------
  // Drag & Drop
  // --------------------------------

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) {
      return;
    }

    const page = draftWebsite.pages.find(
      (page) => page.id === selectedPageId
    );

    if (!page) {
      return;
    }

    const oldIndex = page.sections.findIndex(
      (section) => section.id === active.id
    );

    const newIndex = page.sections.findIndex(
      (section) => section.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedSections = arrayMove(
      page.sections,
      oldIndex,
      newIndex
    );

    const updatedSections = reorderedSections.map(
      (section, index) => ({
        ...section,
        order: index + 1,
      })
    );

    setDraftWebsite((currentWebsite) => ({
      ...currentWebsite,

      pages: currentWebsite.pages.map((currentPage) => {
        if (currentPage.id !== selectedPageId) {
          return currentPage;
        }

        return {
          ...currentPage,
          sections: updatedSections,
        };
      }),
    }));

    setDirtyPageIds((currentIds) => {
      if (currentIds.includes(selectedPageId)) {
        return currentIds;
      }

      return [...currentIds, selectedPageId];
    });

    setSaveMessage("");
  };

  // --------------------------------
  // Save changes
  // --------------------------------

  const saveChanges = async () => {
    if (
      dirtySectionIds.length === 0 &&
      dirtyPageIds.length === 0
    ) {
      setSaveMessage("No changes to save.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveMessage("");

      // ========================================
      // 1. Save changed section content/config
      // ========================================

      const sectionsToSave = [];

      for (const page of draftWebsite.pages) {
        for (const section of page.sections) {
          if (dirtySectionIds.includes(section.id)) {
            sectionsToSave.push(section);
          }
        }
      }

      if (sectionsToSave.length > 0) {
        const result = await updateWebsiteSections(
          sectionsToSave
        );

        if (!result.success) {
          throw new Error(result.message);
        }
      }

      // ========================================
      // 2. Save changed section ordering
      // ========================================

      for (const pageId of dirtyPageIds) {
        const page = draftWebsite.pages.find(
          (page) => page.id === pageId
        );

        if (!page) {
          continue;
        }

        const result = await reorderWebsiteSections({
          pageId: page.id,

          sections: page.sections.map((section) => ({
            id: section.id,
            order: section.order,
          })),
        });

        if (!result.success) {
          throw new Error(result.message);
        }
      }

      // ========================================
      // 3. Reset dirty state
      // ========================================

      setDirtySectionIds([]);
      setDirtyPageIds([]);

      setSaveMessage("Changes saved successfully.");
    } catch (error) {
      console.error("Save error:", error);

      setSaveMessage("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------
  // Render
  // --------------------------------

  return (
    <div className="flex h-screen flex-col bg-gray-100">

      {/* ==============================
          Top Toolbar
      ============================== */}

      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6">

        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {website.name}
          </h1>

          <p className="text-xs text-gray-500">
            Website Builder
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* Save status */}

          {saveMessage && (
            <span className="text-sm text-gray-500">
              {saveMessage}
            </span>
          )}

          {/* Preview */}

          <button
            type="button"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Preview
          </button>

          {/* Save */}

          <button
            type="button"
            onClick={saveChanges}
            disabled={isSaving}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

        </div>
      </header>

      {/* ==============================
          Builder Area
      ============================== */}

      <div className="flex min-h-0 flex-1">

        {/* ==============================
            Pages Sidebar
        ============================== */}

        <aside className="w-64 shrink-0 border-r bg-white p-5">

          <div className="mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Pages
            </h2>
          </div>

          <div className="space-y-2">

            {draftWebsite.pages.map((page) => {
              const isSelected =
                page.id === selectedPageId;

              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => {
                    setSelectedPageId(page.id);
                    setSelectedSectionId(null);
                  }}
                  className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                    isSelected
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page.name}
                </button>
              );
            })}

          </div>
        </aside>

        {/* ==============================
            Canvas
        ============================== */}

        <main className="min-w-0 flex-1 overflow-auto p-8">

          <div className="mx-auto max-w-5xl">

            <div className="mb-6">

              <p className="text-sm text-gray-500">
                Editing page
              </p>

              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedPage?.name}
              </h2>

            </div>

            {/* Website canvas */}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-lg">

              <DndContext
                id="website-builder-dnd"
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >

                <SortableContext
                  items={
                    selectedPage?.sections.map(
                      (section) => section.id
                    ) || []
                  }
                  strategy={verticalListSortingStrategy}
                >

                  {selectedPage?.sections.map(
                    (section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        isSelected={
                          section.id ===
                          selectedSectionId
                        }
                        onSelect={() =>
                          setSelectedSectionId(
                            section.id
                          )
                        }
                      />
                    )
                  )}

                </SortableContext>

              </DndContext>

            </div>

          </div>

        </main>

        {/* ==============================
            Properties Panel
        ============================== */}

        <BuilderProperties
          selectedSection={selectedSection}
          onChange={updateSection}
        />

      </div>
    </div>
  );
}