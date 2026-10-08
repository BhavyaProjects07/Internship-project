"use client";
import SectionLibrary from "./SectionLibrary";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  createWebsiteSection,
  deleteWebsiteSection,
  saveWebsiteDraftAction,
  publishWebsiteAction,
} from "@/app/builder/actions";
import SectionRenderer from "@/components/sections/SectionRenderer";
import BuilderProperties from "./BuilderProperties";
import { DEFAULT_THEME } from "@/lib/theme";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import sectionRegistry from "@/components/sections/sectionRegistry";
import SortableSection from "./SortableSection";

// --------------------------------
// Deterministic Fingerprint Generation (Step 7F-2)
// --------------------------------
function canonicalize(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(canonicalize); // Preserve array order natively
  }
  const keys = Object.keys(obj).sort(); // Sort object keys deterministically
  const result = {};
  for (const key of keys) {
    result[key] = canonicalize(obj[key]);
  }
  return result;
}

function generateFingerprint(draft) {
  // Extract strictly what is persisted by the backend endpoint
  const payload = {
    name: draft.name,
    theme: draft.theme,
    pages: (draft.pages || []).map(page => ({
      id: page.id,
      sections: (page.sections || []).map(section => ({
        id: section.id,
        type: section.type,
        order: section.order,
        content: section.content || {},
        config: section.config || {},
      }))
    }))
  };

  return JSON.stringify(canonicalize(payload));
}

export default function Builder({ website }) {
  // --------------------------------
  // State
  // --------------------------------
  const lastSavedFingerprint = React.useRef(generateFingerprint(website));

  const [selectedPageId, setSelectedPageId] = useState(
    website.pages[0]?.id
  );
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  
  const [draftWebsite, setDraftWebsite] = useState(website);

  // Track the most recent draftWebsite state for async comparisons
  const latestDraftWebsiteRef = React.useRef(website);
  React.useEffect(() => {
    latestDraftWebsiteRef.current = draftWebsite;
  }, [draftWebsite]);

  const [dirtySectionIds, setDirtySectionIds] = useState([]);
  const [dirtyPageIds, setDirtyPageIds] = useState([]);
  const [isWebsiteDirty, setIsWebsiteDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishInfo, setPublishInfo] = useState({
    isPublished: website.isPublished,
    publishedAt: website.publishedAt,
    publicUrl: website.isPublished ? `/${website.slug}` : null, // placeholder format
  });

  // UI Panels & Viewport Mode
  const [leftTab, setLeftTab] = useState("layers"); // 'layers' | 'pages'
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [viewportMode, setViewportMode] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // --------------------------------
  // Element Selection (Part D/G)
  // --------------------------------
  // selectedElement: null | { elementId, elementType, sectionId }
  const [selectedElement, setSelectedElement] = useState(null);

  // --------------------------------
  // Selected page & section
  // --------------------------------
  const selectedPage = draftWebsite.pages.find(
    (page) => page.id === selectedPageId
  );

  const selectedSection = selectedPage?.sections.find(
    (section) => section.id === selectedSectionId
  );

  // --------------------------------
  // --------------------------------
  // Element Selection Handler
  // --------------------------------
  const handleElementSelect = useCallback((sectionId, elementId, elementType) => {
    setSelectedSectionId(sectionId);
    setSelectedElement({
      elementId,
      elementType,
      sectionId,
    });
  }, []);

  const handleSectionSelect = useCallback((sectionId) => {
    if (isPreviewMode) return;
    setSelectedSectionId(sectionId);
    setSelectedElement(null); // Clear element selection when selecting a section
  }, [isPreviewMode]);



  // --------------------------------
  // Update section content/config
  // --------------------------------
  const updateSection = useCallback((sectionId, updates) => {
    setDraftWebsite((currentWebsite) => ({
      ...currentWebsite,
      pages: currentWebsite.pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            ...updates,
          };
        }),
      })),
    }));

    setDirtySectionIds((currentIds) => {
      if (currentIds.includes(sectionId)) return currentIds;
      return [...currentIds, sectionId];
    });

    setSaveMessage("");
  }, []);

  const handleThemeChange = useCallback((themeUpdates) => {
    setDraftWebsite((current) => ({
      ...current,
      ...themeUpdates,
    }));
    setIsWebsiteDirty(true);
    setSaveMessage("");
  }, []);

  const handleDeleteSection = (sectionId) => {
    if (!sectionId) {
      return;
    }

    const section = selectedPage?.sections?.find(
      (item) => item.id === sectionId
    );

    if (!section) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the ${section.type} section?`
    );

    if (!confirmed) {
      return;
    }

    /*
     * Remove the section from the local builder state.
     */
    setDraftWebsite((currentWebsite) => ({
      ...currentWebsite,
      pages: currentWebsite.pages.map((page) =>
        page.id === selectedPageId
          ? {
              ...page,
              sections: page.sections
                .filter((section) => section.id !== sectionId)
                .map((section, index) => ({
                  ...section,
                  order: index + 1,
                })),
            }
          : page
      ),
    }));

    /*
     * Clear the selected section because it no longer exists.
     */
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
      setSelectedElement(null);
    }

    /*
     * The page's section ordering has changed after deletion.
     */
    setDirtyPageIds((currentIds) => {
      if (currentIds.includes(selectedPageId)) {
        return currentIds;
      }
      return [...currentIds, selectedPageId];
    });

    setSaveMessage("");
  };

  // --------------------------------
  // Drag & Drop
  // --------------------------------
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const page = draftWebsite.pages.find((p) => p.id === selectedPageId);
    if (!page) return;

    const oldIndex = page.sections.findIndex((s) => s.id === active.id);
    const newIndex = page.sections.findIndex((s) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedSections = arrayMove(page.sections, oldIndex, newIndex);
    const updatedSections = reorderedSections.map((section, index) => ({
      ...section,
      order: index + 1,
    }));

    setDraftWebsite((currentWebsite) => ({
      ...currentWebsite,
      pages: currentWebsite.pages.map((currentPage) => {
        if (currentPage.id !== selectedPageId) return currentPage;
        return {
          ...currentPage,
          sections: updatedSections,
        };
      }),
    }));

    setDirtyPageIds((currentIds) => {
      if (currentIds.includes(selectedPageId)) return currentIds;
      return [...currentIds, selectedPageId];
    });

    setSaveMessage("");
  };


  const handleAddSection = (type) => {
    const definition = sectionRegistry[type];

    if (!definition) {
      console.error(`Unknown section type: ${type}`);
      return;
    }

    if (definition.canAdd === false) {
      console.warn(`Section "${type}" cannot be added.`);
      return;
    }

    if (!selectedPage) {
      console.warn("No page selected.");
      return;
    }

    const content = structuredClone(
      definition.defaultContent || {}
    );

    const config = structuredClone(
      definition.defaultConfig || {}
    );

    // Generate a temporary local ID
    const tempSectionId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const nextOrder = selectedPage.sections ? selectedPage.sections.length + 1 : 1;

    const newSection = {
      id: tempSectionId,
      type,
      content,
      config,
      order: nextOrder,
      pageId: selectedPage.id,
    };

    /*
     * Add the local section to the builder state.
     */
    setDraftWebsite((currentWebsite) => ({
      ...currentWebsite,
      pages: currentWebsite.pages.map((page) =>
        page.id === selectedPage.id
          ? {
              ...page,
              sections: [
                ...(page.sections || []),
                newSection,
              ],
            }
          : page
      ),
    }));

    /*
     * Select the newly created section so its properties appear in the inspector.
     */
    setSelectedSectionId(newSection.id);
    setSelectedElement(null);

    setShowSectionLibrary(false);

    setDirtyPageIds((currentIds) => {
      if (currentIds.includes(selectedPage.id)) return currentIds;
      return [...currentIds, selectedPage.id];
    });

    setSaveMessage("");
  };


  // --------------------------------
  // Move Section Up / Down
  // --------------------------------
  const moveSection = (sectionId, direction) => {
    const page = draftWebsite.pages.find((p) => p.id === selectedPageId);
    if (!page) return;

    const index = page.sections.findIndex((s) => s.id === sectionId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= page.sections.length) return;

    const reorderedSections = arrayMove(page.sections, index, targetIndex);
    const updatedSections = reorderedSections.map((section, idx) => ({
      ...section,
      order: idx + 1,
    }));

    setDraftWebsite((currentWebsite) => ({
      ...currentWebsite,
      pages: currentWebsite.pages.map((currentPage) => {
        if (currentPage.id !== selectedPageId) return currentPage;
        return {
          ...currentPage,
          sections: updatedSections,
        };
      }),
    }));

    setDirtyPageIds((currentIds) => {
      if (currentIds.includes(selectedPageId)) return currentIds;
      return [...currentIds, selectedPageId];
    });

    setSaveMessage("");
  };

  // --------------------------------
  // Save changes
  // --------------------------------
  const saveChanges = async () => {
    if (isSaving) return;

    // Capture the exact snapshot being sent
    const saveSnapshot = draftWebsite;
    const saveFingerprint = generateFingerprint(saveSnapshot);

    if (saveFingerprint === lastSavedFingerprint.current) {
      setSaveMessage("All changes saved");
      setDirtySectionIds([]);
      setDirtyPageIds([]);
      setIsWebsiteDirty(false);
      return true;
    }

    if (
      dirtySectionIds.length === 0 &&
      dirtyPageIds.length === 0 &&
      !isWebsiteDirty
    ) {
      setSaveMessage("All changes saved");
      return true;
    }

    try {
      setIsSaving(true);
      setSaveMessage("Saving...");

      const result = await saveWebsiteDraftAction(
        saveSnapshot.id,
        saveSnapshot
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      let finalPersistedState = saveSnapshot;

      // Apply temporary ID mappings if there are new sections
      if (result.idMappings && result.idMappings.length > 0) {
        const mappingDict = {};
        result.idMappings.forEach((mapping) => {
          mappingDict[mapping.clientId] = mapping.databaseId;
        });

        // Construct the explicitly saved payload with permanent IDs
        finalPersistedState = {
          ...saveSnapshot,
          pages: saveSnapshot.pages.map((page) => ({
            ...page,
            sections: page.sections.map((section) => {
              if (mappingDict[section.id]) {
                return {
                  ...section,
                  id: mappingDict[section.id],
                };
              }
              return section;
            }),
          })),
        };

        // Apply these mappings to the live React state without overwriting concurrent edits
        setDraftWebsite((currentLiveState) => ({
          ...currentLiveState,
          pages: currentLiveState.pages.map((page) => ({
            ...page,
            sections: page.sections.map((section) => {
              if (mappingDict[section.id]) {
                return {
                  ...section,
                  id: mappingDict[section.id],
                };
              }
              return section;
            }),
          })),
        }));
        
        if (mappingDict[selectedSectionId]) {
          setSelectedSectionId(mappingDict[selectedSectionId]);
        }
      }

      // The invariant: this represents exactly what the backend just persisted
      lastSavedFingerprint.current = generateFingerprint(finalPersistedState);

      // Determine if the user made changes while the request was in flight
      const currentLiveFingerprint = generateFingerprint(latestDraftWebsiteRef.current);
      const hasInFlightEdits = currentLiveFingerprint !== saveFingerprint;

      if (!hasInFlightEdits) {
        // No changes occurred during the request
        setDirtySectionIds([]);
        setDirtyPageIds([]);
        setIsWebsiteDirty(false);
        setSaveMessage("Changes saved");
      } else {
        // User edited while saving. Do NOT clear dirty state.
        setSaveMessage("Unsaved changes");
      }
      return true;
    } catch (error) {
      console.error("Save error:", error);
      setSaveMessage("Failed to save");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------
  // Publish changes
  // --------------------------------
  const publishChanges = async () => {
    if (isPublishing) return;

    try {
      setIsPublishing(true);
      
      const currentLiveFingerprint = generateFingerprint(draftWebsite);
      const hasUnsavedChanges = currentLiveFingerprint !== lastSavedFingerprint.current;
      
      if (hasUnsavedChanges || isWebsiteDirty || dirtyPageIds.length > 0 || dirtySectionIds.length > 0) {
        setSaveMessage("Saving before publish...");
        const saveSuccess = await saveChanges();
        
        if (!saveSuccess) {
          throw new Error("Failed to save draft before publishing");
        }
        
        // Correctness Fix: Re-check fingerprint after save to ensure no in-flight edits occurred.
        // If the live state changed while the save request was in flight, the persisted draft
        // is now stale relative to the screen. Do NOT publish stale data.
        const postSaveFingerprint = generateFingerprint(latestDraftWebsiteRef.current);
        if (postSaveFingerprint !== lastSavedFingerprint.current) {
          throw new Error("Publish cancelled: draft was modified during save. Please publish again.");
        }
      }

      setSaveMessage("Publishing...");
      
      const result = await publishWebsiteAction(draftWebsite.id);
      
      if (!result.success) {
        throw new Error(result.message || "Failed to publish");
      }
      
      setPublishInfo({
        isPublished: result.isPublished,
        publishedAt: result.publishedAt,
        publicUrl: result.publicUrl,
      });
      
      setSaveMessage("Published successfully!");
      
      // Clear the success message after a bit
      setTimeout(() => setSaveMessage(""), 3000);
      
    } catch (error) {
      console.error("Publish error:", error);
      setSaveMessage(error.message || "Failed to publish");
      // Clear the error message after a bit so they know it's not permanently stuck
      setTimeout(() => setSaveMessage(""), 4000);
    } finally {
      setIsPublishing(false);
    }
  };

  // --------------------------------
  // Keyboard Shortcuts (Cmd+S, Esc)
  // --------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveChanges();
      }
      if (e.key === "Escape") {
        if (isPreviewMode) {
          setIsPreviewMode(false);
        } else if (selectedElement) {
          // Clear element selection first, keep section selected
          setSelectedElement(null);
        } else {
          setSelectedSectionId(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirtySectionIds, dirtyPageIds, isWebsiteDirty, isPreviewMode, selectedElement, saveChanges]);

  const hasUnsavedChanges = dirtySectionIds.length > 0 || dirtyPageIds.length > 0 || isWebsiteDirty;

  // --------------------------------
  // Unsaved Navigation Protection
  // --------------------------------
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Viewport Container Widths
  const getViewportWidth = () => {
    switch (viewportMode) {
      case "mobile":
        return "max-w-[390px] shadow-2xl rounded-[32px] border-[8px] border-neutral-800 my-8 overflow-hidden";
      case "tablet":
        return "max-w-[768px] shadow-2xl rounded-2xl border-4 border-neutral-800 my-8 overflow-hidden";
      case "desktop":
      default:
        return "w-full max-w-7xl shadow-sm rounded-none border border-neutral-200";
    }
  };

  const themeVars = React.useMemo(() => {
    const colors = draftWebsite.theme?.colors || DEFAULT_THEME.colors;
    return {
      "--color-primary": colors.primary,
      "--color-secondary": colors.secondary,
      "--color-accent": colors.accent,
      "--color-background": colors.background,
      "--color-surface": colors.surface,
      "--color-text": colors.text,
      "--color-muted-text": colors.mutedText,
      "--color-border": colors.border,
      "--color-success": colors.success,
      "--color-warning": colors.warning,
      "--color-error": colors.error,
    };
  }, [draftWebsite.theme]);

  return (
    <div className="flex h-screen flex-col bg-neutral-100 font-sans antialiased text-neutral-900 overflow-hidden select-none">
      {/* =========================================================
          WordPress Gutenberg / Webflow Top App Bar
      ========================================================= */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200/90 bg-neutral-900 px-4 text-white z-50">
        {/* Left Section: Back, Wordmark, Page Selector */}
        <div className="flex items-center gap-3">
          {/* WordPress / Home Logo Button */}
          <Link
            href="/templates"
            title="Back to Templates"
            onClick={(e) => {
              if (hasUnsavedChanges) {
                if (!window.confirm("You have unsaved changes. Leave without saving?")) {
                  e.preventDefault();
                }
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>

          <div className="h-5 w-[1px] bg-neutral-800" />

          {/* Website Name & Badge */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-tight truncate max-w-[140px] sm:max-w-xs">
                {website.name}
              </span>
              <span className={`hidden sm:inline-block rounded px-1.5 py-0.5 text-[10px] font-mono uppercase ${publishInfo.isPublished ? "bg-emerald-900/50 text-emerald-400" : "bg-neutral-800 text-neutral-400"}`}>
                {publishInfo.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            {publishInfo.isPublished && (
              <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                <span>{new Date(publishInfo.publishedAt).toLocaleString()}</span>
                {publishInfo.publicUrl && (
                  <a href={publishInfo.publicUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                    View Live ↗
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="h-5 w-[1px] bg-neutral-800 hidden sm:block" />

          {/* Page Selector Dropdown */}
          <div className="relative hidden sm:flex items-center">
            <select
              value={selectedPageId}
              onChange={(e) => {
                setSelectedPageId(e.target.value);
                setSelectedSectionId(null);
                setSelectedElement(null);
              }}
              className="appearance-none rounded-lg bg-neutral-800 px-3 py-1.5 pr-8 text-xs font-medium text-neutral-200 hover:bg-neutral-750 focus:outline-none cursor-pointer"
            >
              {draftWebsite.pages.map((page) => (
                <option key={page.id} value={page.id}>
                  Page: {page.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 text-neutral-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Center Section: Responsive Device Switcher */}
        <div className="flex items-center gap-1 bg-neutral-800/80 p-1 rounded-lg border border-neutral-750">
          <button
            type="button"
            onClick={() => setViewportMode("desktop")}
            title="Desktop View (100%)"
            className={`flex h-7 px-2.5 items-center gap-1.5 rounded-md text-xs font-medium transition-all ${viewportMode === "desktop"
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-400 hover:text-white"
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setViewportMode("tablet")}
            title="Tablet View (768px)"
            className={`flex h-7 px-2.5 items-center gap-1.5 rounded-md text-xs font-medium transition-all ${viewportMode === "tablet"
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-400 hover:text-white"
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setViewportMode("mobile")}
            title="Mobile View (390px)"
            className={`flex h-7 px-2.5 items-center gap-1.5 rounded-md text-xs font-medium transition-all ${viewportMode === "mobile"
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-400 hover:text-white"
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right Section: Status, Preview, Save / Publish */}
        <div className="flex items-center gap-2.5">
          {/* Unsaved / Saved Status */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs">
            {isSaving ? (
              <span className="text-neutral-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                Saving...
              </span>
            ) : hasUnsavedChanges ? (
              <span className="text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Unsaved changes
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {saveMessage || "All changes saved"}
              </span>
            )}
          </div>

          <div className="h-5 w-[1px] bg-neutral-800 hidden lg:block" />

          {/* Sidebar toggles */}
          <button
            type="button"
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            title="Toggle Layers Sidebar"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${showLeftSidebar ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            title="Toggle Inspector Sidebar"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${showRightSidebar ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>

          {/* Preview Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsPreviewMode(!isPreviewMode);
              if (!isPreviewMode) {
                setSelectedElement(null);
                setSelectedSectionId(null);
              }
            }}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">Preview</span>
          </button>

          {/* WordPress Blue Save Action */}
          <button
            type="button"
            onClick={saveChanges}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-neutral-200 shadow-xs transition hover:bg-neutral-700 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed border border-neutral-700"
          >
            {isSaving ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>
          
          {/* Publish Action */}
          <button
            type="button"
            onClick={publishChanges}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
            <span>{isPublishing ? "Publishing..." : "Publish"}</span>
          </button>
        </div>
      </header>

      {/* =========================================================
          Builder Workspace Body
      ========================================================= */}
      <div className="flex min-h-0 flex-1 relative">
        {/* ==============================
            Left Sidebar: Navigator / Layers & Pages
        ============================== */}
        {!isPreviewMode && showLeftSidebar && (
          <aside className="relative w-72 shrink-0 border-r border-neutral-200 bg-white flex flex-col shadow-xs z-30">
            {/* Sidebar Tab Switcher */}
            <div className="flex border-b border-neutral-200 bg-neutral-50/50 p-2 gap-1">
              <button
                type="button"
                onClick={() => setLeftTab("layers")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${leftTab === "layers"
                    ? "bg-white text-neutral-900 shadow-xs border border-neutral-200"
                    : "text-neutral-500 hover:text-neutral-900"
                  }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Outline</span>
              </button>

              <button
                type="button"
                onClick={() => setLeftTab("pages")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${leftTab === "pages"
                    ? "bg-white text-neutral-900 shadow-xs border border-neutral-200"
                    : "text-neutral-500 hover:text-neutral-900"
                  }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Pages ({draftWebsite.pages.length})</span>
              </button>
            </div>

            {/* Tab 1: Section Layers (WordPress Document Outline) */}
            {leftTab === "layers" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                  <span>Sections on Canvas</span>
                  <span className="font-mono text-neutral-500">{selectedPage?.sections?.length || 0}</span>
                </div>

                <button
  type="button"
  onClick={() => setShowSectionLibrary(true)}
  className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2.5 text-xs font-semibold text-neutral-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
      d="M12 5v14M5 12h14"
    />
  </svg>

  Add Section
</button>

                {selectedPage?.sections?.map((section, idx) => {
                  const isSelected = section.id === selectedSectionId;
                  return (
                    <div
                      key={section.id}
                      onClick={() => handleSectionSelect(section.id)}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${isSelected
                          ? "bg-blue-50 border border-blue-200 text-blue-900 shadow-xs"
                          : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-mono text-neutral-400 w-4">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="capitalize font-semibold">{section.type}</span>
                        {section.content?.heading && (
                          <span className="text-neutral-400 truncate max-w-[90px] text-[11px]">
                            · {section.content.heading}
                          </span>
                        )}
                      </div>

                      {/* Move controls in outline */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(section.id, "up");
                          }}
                          className="p-1 rounded hover:bg-neutral-200 text-neutral-600 disabled:opacity-20"
                          title="Move Up"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          disabled={idx === (selectedPage?.sections?.length || 0) - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(section.id, "down");
                          }}
                          className="p-1 rounded hover:bg-neutral-200 text-neutral-600 disabled:opacity-20"
                          title="Move Down"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    handleDeleteSection(section.id);
  }}
  className="p-1 rounded hover:bg-red-100 text-red-500"
  title="Delete Section"
>
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 7h12M9 7V5h6v2m2 0v12a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z"
    />
  </svg>
</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Pages List */}
            {leftTab === "pages" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Site Hierarchy
                </div>
                {draftWebsite.pages.map((page) => {
                  const isSelected = page.id === selectedPageId;
                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => {
                        setSelectedPageId(page.id);
                        setSelectedSectionId(null);
                        setSelectedElement(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-semibold transition-all ${isSelected
                          ? "bg-neutral-900 text-white shadow-xs"
                          : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>{page.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                        /{page.slug || 'home'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {showSectionLibrary && (
              <SectionLibrary
                onClose={() => setShowSectionLibrary(false)}
                onSelect={handleAddSection}
              />
            )}
          </aside>
        )}

        {/* ==============================
            Center Canvas
        ============================== */}
        <main className="min-w-0 flex-1 overflow-auto bg-neutral-100/90 flex flex-col items-center relative select-text">
          {/* Viewport Info Bar in Canvas */}
          <div className="w-full flex items-center justify-between px-6 py-2 border-b border-neutral-200/60 bg-white/50 text-[11px] font-mono text-neutral-500 shrink-0">
            <div>
              <span>Editing: </span>
              <strong className="text-neutral-900 font-semibold">{selectedPage?.name}</strong>
              <span className="mx-2 text-neutral-300">·</span>
              <span>Route: /{selectedPage?.slug || 'home'}</span>
            </div>
            <div>
              <span>Device Canvas: </span>
              <strong className="text-neutral-900 capitalize font-semibold">{viewportMode}</strong>
            </div>
          </div>

          {/* Actual Canvas Container */}
          <div className="w-full flex-1 p-4 md:p-8 flex justify-center items-start">
            <div 
              className={`transition-all duration-300 bg-white shadow-xl ${getViewportWidth()}`}
              style={themeVars}
            >
              <DndContext
                id="website-builder-dnd"
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedPage?.sections.map((section) => section.id) || []}
                  strategy={verticalListSortingStrategy}
                >
                  {selectedPage?.sections.map((section, idx) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      isSelected={section.id === selectedSectionId && !isPreviewMode}
                      isPreviewMode={isPreviewMode}
                      onSelect={() => handleSectionSelect(section.id)}
                      onElementSelect={handleElementSelect}
                      selectedElement={
                        selectedElement?.sectionId === section.id
                          ? selectedElement
                          : null
                      }
                      onMoveUp={() => moveSection(section.id, "up")}
                      onMoveDown={() => moveSection(section.id, "down")}
                      isFirst={idx === 0}
                      isLast={idx === (selectedPage?.sections.length || 0) - 1}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* Floating Exit Preview Pill if in Preview Mode */}
          {isPreviewMode && (
            <div className="fixed bottom-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="flex items-center gap-2 rounded-full bg-neutral-900/95 text-white px-5 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md border border-neutral-700 hover:bg-neutral-800 transition-all hover:scale-105 cursor-pointer"
              >
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Exit Preview Mode (Esc)</span>
              </button>
            </div>
          )}
        </main>

        {/* ==============================
            Right Inspector: Block & Page Properties
        ============================== */}
        {!isPreviewMode && showRightSidebar && (
          <BuilderProperties
            website={draftWebsite}
            onThemeChange={handleThemeChange}
            selectedSection={selectedSection}
            selectedElement={selectedElement}
            onChange={updateSection}
            selectedPage={selectedPage}
            onClose={() => {
              setSelectedSectionId(null);
              setSelectedElement(null);
            }}
            onClearElement={() => setSelectedElement(null)}
            onElementSelect={handleElementSelect}
          />
        )}
      </div>
    </div>
  );
}
