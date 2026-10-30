"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  parseTemplateJson,
  buildTemplateExportJson,
} from "../lib/templateJsonParser.js";

export default function TemplateJsonModal({
  isOpen,
  onClose,
  currentDocument,
  pageMetadata = {},
  onApplyJson,
  registeredComponentTypes = [],
}) {
  const [activeTab, setActiveTab] = useState("import"); // "import" | "export"
  const [inputMode, setInputMode] = useState("file"); // "file" | "text"
  const [rawJsonText, setRawJsonText] = useState("");
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  // Handle parsing & validation
  const validationResult = useMemo(() => {
    if (!rawJsonText.trim()) return null;

    try {
      const result = parseTemplateJson(rawJsonText, {
        pageIndex: selectedPageIndex,
        registeredComponentTypes,
      });
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Invalid JSON",
      };
    }
  }, [rawJsonText, selectedPageIndex, registeredComponentTypes]);

  // Handle Export Payload Generation
  const exportJsonString = useMemo(() => {
    if (!currentDocument) return "{}";
    try {
      const exportObj = buildTemplateExportJson(currentDocument, pageMetadata);
      return JSON.stringify(exportObj, null, 2);
    } catch (err) {
      return `// Error generating export: ${err.message}`;
    }
  }, [currentDocument, pageMetadata]);

  if (!isOpen) return null;

  // File reader helper
  const handleFileProcess = (file) => {
    if (!file) return;

    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      alert("Please upload a valid .json file.");
      return;
    }

    setSelectedFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setRawJsonText(text);
        setInputMode("text"); // Switch to preview & verify
      }
    };
    reader.onerror = () => {
      alert("Failed to read the selected file.");
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      setRawJsonText(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore if invalid syntax
    }
  };

  const handleApply = () => {
    if (!validationResult?.success || !validationResult?.data) return;

    const { document, pageResponsive } = validationResult.data;
    onApplyJson(document, pageResponsive);
    onClose();
  };

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportJsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadExport = () => {
    try {
      const blob = new Blob([exportJsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeSlug = (pageMetadata.slug || pageMetadata.pageName || "template")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");
      link.href = url;
      link.download = `${safeSlug}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to trigger download: " + err.message);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-900">Template JSON Tool</h2>
              <p className="text-xs text-gray-500">
                Import external templates or export your active canvas.
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 transition"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 px-6 pt-3 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("import")}
            className={`border-b-2 px-4 pb-2.5 text-xs font-bold transition ${
              activeTab === "import"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Import JSON into Canvas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={`border-b-2 px-4 pb-2.5 text-xs font-bold transition ${
              activeTab === "export"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Export Canvas JSON
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "import" ? (
            <div className="space-y-4">
              {/* Import Mode Sub-tabs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => setInputMode("file")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                      inputMode === "file"
                        ? "bg-white text-gray-950 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Upload .json File
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("text")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                      inputMode === "text"
                        ? "bg-white text-gray-950 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Paste / Edit Raw JSON
                  </button>
                </div>

                {inputMode === "text" && rawJsonText && (
                  <button
                    type="button"
                    onClick={handleFormatJson}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Format / Beautify
                  </button>
                )}
              </div>

              {/* File Dropzone View */}
              {inputMode === "file" && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition duration-200 ${
                    isDragging
                      ? "border-indigo-600 bg-indigo-50/60"
                      : "border-gray-200 bg-slate-50/50 hover:border-gray-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileProcess(e.target.files[0]);
                      }
                    }}
                  />
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 mb-3 shadow-2xs">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </span>
                  <p className="text-sm font-bold text-gray-900">
                    Click to browse or drag & drop template file
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Supports exported Puck documents, database page JSON, and full templates (.json up to 5MB)
                  </p>
                  {selectedFileName && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      <span>✓ Loaded: {selectedFileName}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Textarea View */}
              {inputMode === "text" && (
                <div>
                  <textarea
                    rows={10}
                    value={rawJsonText}
                    onChange={(e) => setRawJsonText(e.target.value)}
                    placeholder='Paste valid JSON here, e.g. { "content": [...], "root": { "props": {...} } }'
                    className="w-full rounded-2xl border border-gray-200 bg-gray-950 p-4 font-mono text-xs text-emerald-400 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 placeholder:text-gray-600"
                  />
                </div>
              )}

              {/* Validation Status & Preview Card */}
              {validationResult && (
                <div>
                  {validationResult.success ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                            ✓
                          </span>
                          <span className="text-xs font-bold text-emerald-950">
                            Valid Template JSON Verified
                          </span>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          {validationResult.data.metadata.componentCount} Components
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 pt-1">
                        <div>
                          <span className="text-gray-500">Title: </span>
                          <span className="font-semibold text-gray-900">
                            {validationResult.data.metadata.title}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Responsive Overrides: </span>
                          <span className="font-semibold text-gray-900">
                            {validationResult.data.metadata.hasResponsiveOverrides ? "Yes (Preserved)" : "Standard Defaults"}
                          </span>
                        </div>
                      </div>

                      {/* Multi-page template page selector if applicable */}
                      {validationResult.data.metadata.availablePages?.length > 1 && (
                        <div className="mt-2 pt-2 border-t border-emerald-200/60">
                          <label className="block text-xs font-semibold text-emerald-950 mb-1">
                            This bundle contains multiple pages. Choose which page to load:
                          </label>
                          <select
                            value={selectedPageIndex}
                            onChange={(e) => setSelectedPageIndex(Number(e.target.value))}
                            className="w-full rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 outline-none"
                          >
                            {validationResult.data.metadata.availablePages.map((p) => (
                              <option key={p.index} value={p.index}>
                                {p.name} ({p.slug})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Warnings if any unrecognized components */}
                      {validationResult.data.metadata.warnings?.length > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-800 space-y-1">
                          <div className="font-bold flex items-center gap-1">
                            <span>⚠ Notice:</span>
                          </div>
                          {validationResult.data.metadata.warnings.map((w, i) => (
                            <p key={i}>• {w}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>JSON Parsing Error</span>
                      </div>
                      <p>{validationResult.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Export Tab View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Active Canvas JSON Snapshot
                  </h3>
                  <p className="text-xs text-gray-600">
                    Ready to backup, version control, or import into any other page.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyExport}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
                  >
                    {copied ? (
                      <>
                        <span className="text-emerald-600">✓</span>
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="size-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadExport}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 transition"
                  >
                    <svg className="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download .json</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={12}
                readOnly
                value={exportJsonString}
                className="w-full rounded-2xl border border-gray-200 bg-gray-950 p-4 font-mono text-xs text-slate-300 outline-none select-all"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-slate-50/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          {activeTab === "import" && (
            <button
              type="button"
              disabled={!validationResult?.success}
              onClick={handleApply}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Load into Canvas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

