"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

/**
 * Production-Ready Centralized Media Library Modal
 * Powered by ImageKit backend integration.
 * Supports:
 * - Local file drag-and-drop & browse upload to ImageKit
 * - Direct external image URL addition
 * - Real-time asset search & filtering
 * - Responsive gallery grid with image previews, dimensions, and metadata
 * - Single-click selection into calling form or Puck property
 * - Asset deletion with safety confirmation
 * - Resilient error handling and loading indicators
 */
export default function MediaLibraryModal({ onSelect, onClose, initialUrl = "" }) {
  const { getToken } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssetUrl, setSelectedAssetUrl] = useState(initialUrl);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Direct URL addition state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [isAddingUrl, setIsAddingUrl] = useState(false);

  // Deletion state
  const [deletingId, setDeletingId] = useState(null);

  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  ).replace(/\/+$/, "");

  // Load media assets
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        setError("You must be signed in to access your media assets.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Failed to fetch assets (${res.status})`);
      }

      if (data.success && Array.isArray(data.data)) {
        setAssets(data.data);
      } else {
        setAssets([]);
      }
    } catch (err) {
      console.error("[MediaLibraryModal] Fetch error:", err);
      setError(err.message || "Unable to load media assets from server.");
    } finally {
      setLoading(false);
    }
  }, [getToken, API_URL]);

  useEffect(() => {
    void fetchAssets();
  }, [fetchAssets]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // File Upload Handler (ImageKit via authenticated backend)
  const handleUploadFile = async (file) => {
    if (!file) return;

    setUploadError(null);

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File is too large. Maximum allowed size is 10MB.");
      return;
    }

    // Validate MIME type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadError(
        "Invalid file format. Please upload a JPEG, PNG, WebP, GIF, or SVG image."
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(`Uploading ${file.name} to ImageKit...`);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to upload image to ImageKit");
      }

      // Prepend newly uploaded asset
      const newAsset = result.data;
      setAssets((prev) => [newAsset, ...prev]);
      setSelectedAssetUrl(newAsset.url);

      // Instantly notify or prompt user
      setUploadProgress("Upload successful!");
      setTimeout(() => setUploadProgress(""), 2000);
    } catch (err) {
      console.error("[MediaLibraryModal] Upload failed:", err);
      setUploadError(err.message || "Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  // Direct External URL Addition
  const handleAddExternalUrl = async (e) => {
    e.preventDefault();
    if (!externalUrl.trim()) return;

    setUploadError(null);
    setIsAddingUrl(true);

    try {
      const token = await getToken();
      const filename =
        externalUrl.split("/").pop()?.split("?")[0] || "External Image";

      const res = await fetch(`${API_URL}/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: externalUrl.trim(),
          filename,
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to save external image URL");
      }

      setAssets((prev) => [result.data, ...prev]);
      setSelectedAssetUrl(result.data.url);
      setExternalUrl("");
      setShowUrlInput(false);
    } catch (err) {
      setUploadError(err.message || "Failed to add external URL.");
    } finally {
      setIsAddingUrl(false);
    }
  };

  // Delete Asset Handler
  const handleDeleteAsset = async (e, asset) => {
    e.stopPropagation();
    if (
      !window.confirm(
        `Are you sure you want to delete "${asset.filename}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(asset.id);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/media/${asset.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.message || "Failed to delete asset");
      }

      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      if (selectedAssetUrl === asset.url) {
        setSelectedAssetUrl("");
      }
    } catch (err) {
      alert(err.message || "Failed to delete asset.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter assets by search query
  const filteredAssets = assets.filter((asset) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = (asset.filename || "").toLowerCase().includes(q);
    const altMatch = (asset.alt || "").toLowerCase().includes(q);
    return nameMatch || altMatch;
  });

  const handleConfirmSelect = (url) => {
    if (!url) return;
    onSelect?.(url);
    onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-library-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-md transition-all sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl">
        {/* MODAL HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/95 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2
                id="media-library-title"
                className="text-base font-bold text-white tracking-tight"
              >
                Centralized Media Library
              </h2>
              <p className="text-xs text-slate-400">
                Upload to ImageKit, paste an image URL, or pick an existing asset.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-48 sm:w-64">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 pl-8 text-xs text-slate-200 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <svg
                className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={fetchAssets}
              disabled={loading}
              title="Refresh asset list"
              className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition"
            >
              <svg
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
              aria-label="Close dialog"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* UPLOAD & ACTION BAR */}
        <div className="border-b border-slate-800 bg-slate-900/60 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Drag & Drop / File Selector Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-1 items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-2.5 transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                  : "border-slate-700/80 bg-slate-800/40 text-slate-300 hover:border-slate-600"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileInputChange}
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
                id="media-library-file-input"
              />

              <div className="flex items-center gap-2.5">
                <svg
                  className="h-5 w-5 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div>
                  <span className="text-xs font-semibold text-slate-200">
                    {isDragging ? "Drop your image here!" : "Drag image here or"}
                  </span>
                  <span className="ml-1 text-[11px] text-slate-400">
                    (JPG, PNG, WebP, GIF, SVG • Max 10MB)
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition"
              >
                {isUploading ? "Uploading..." : "Browse Local File"}
              </button>
            </div>

            {/* Toggle External URL Input */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                  showUrlInput
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {showUrlInput ? "Hide URL Option" : "Paste URL"}
              </button>
            </div>
          </div>

          {/* Conditional URL Input Box */}
          {showUrlInput && (
            <form onSubmit={handleAddExternalUrl} className="mt-3 flex gap-2">
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or any hosted image link"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isAddingUrl || !externalUrl.trim()}
                className="rounded-xl bg-slate-700 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-600 disabled:opacity-50 transition"
              >
                {isAddingUrl ? "Adding..." : "Add to Assets"}
              </button>
            </form>
          )}

          {/* Progress / Status banner */}
          {uploadProgress && (
            <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-indigo-950/80 px-3 py-1.5 text-xs font-medium text-indigo-300 border border-indigo-800/50">
              <span className="h-2 w-2 animate-ping rounded-full bg-indigo-400" />
              {uploadProgress}
            </div>
          )}

          {/* Error Banner */}
          {(uploadError || error) && (
            <div className="mt-2.5 flex items-center justify-between rounded-lg bg-rose-950/70 border border-rose-800/50 px-3 py-2 text-xs text-rose-300">
              <span>{uploadError || error}</span>
              <button
                type="button"
                onClick={() => {
                  setUploadError(null);
                  setError(null);
                }}
                className="ml-3 font-bold hover:text-white"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* ASSET GALLERY AREA */}
        <div className="flex-1 overflow-y-auto bg-slate-950/60 p-4 sm:p-6">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              <p className="text-xs">Loading media assets...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 p-8 text-center text-slate-400">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-200">
                {searchQuery ? "No matching assets found" : "No media assets yet"}
              </p>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                {searchQuery
                  ? "Try searching for a different keyword or clear your search."
                  : "Upload a local image using the button above or paste an image URL to populate your centralized library."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAssetUrl === asset.url;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAssetUrl(asset.url)}
                    onDoubleClick={() => handleConfirmSelect(asset.url)}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border bg-slate-900 transition-all cursor-pointer ${
                      isSelected
                        ? "border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-950/50"
                        : "border-slate-800 hover:border-slate-700 hover:shadow-md"
                    }`}
                  >
                    {/* Thumbnail Preview Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-950/90 flex items-center justify-center p-1.5">
                      <img
                        src={asset.url}
                        alt={asset.alt || asset.filename}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                      />

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Hover Overlay with Select Button */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2 p-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmSelect(asset.url);
                          }}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg hover:bg-indigo-500 transition"
                        >
                          Use Image
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteAsset(e, asset)}
                        disabled={deletingId === asset.id}
                        title="Delete asset"
                        className="absolute top-2 right-2 rounded-lg bg-slate-950/80 p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-rose-900/80 hover:text-rose-200 group-hover:opacity-100 shadow-sm disabled:opacity-50"
                      >
                        {deletingId === asset.id ? (
                          <span className="block h-3.5 w-3.5 animate-spin rounded-full border border-rose-400 border-t-transparent" />
                        ) : (
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Meta info footer */}
                    <div className="border-t border-slate-800/80 p-2 text-[11px]">
                      <p className="truncate font-medium text-slate-300" title={asset.filename}>
                        {asset.filename || "Untitled asset"}
                      </p>
                      <div className="mt-0.5 flex items-center justify-between text-[10px] text-slate-500">
                        <span>
                          {asset.width && asset.height
                            ? `${asset.width}×${asset.height}`
                            : asset.provider || "ImageKit"}
                        </span>
                        <span className="uppercase text-[9px] font-semibold text-slate-400">
                          {asset.provider === "imagekit" ? "ImageKit" : "URL"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900 px-6 py-3.5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {selectedAssetUrl ? (
              <span className="truncate max-w-md font-mono text-[11px] text-slate-300">
                Selected: {selectedAssetUrl}
              </span>
            ) : (
              <span>Select an asset from the gallery or upload one above.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedAssetUrl}
              onClick={() => handleConfirmSelect(selectedAssetUrl)}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
