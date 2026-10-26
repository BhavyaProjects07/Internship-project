"use client";

import React from "react";
import MediaLibraryModal from "@/components/media/MediaLibraryModal";

/**
 * Backward compatibility wrapper for MediaLibrary.
 * Delegates to the production-ready centralized MediaLibraryModal.
 */
export default function MediaLibrary({ onSelect, onClose, initialUrl = "" }) {
  return (
    <MediaLibraryModal
      onSelect={onSelect}
      onClose={onClose}
      initialUrl={initialUrl}
    />
  );
}
