"use client";

import React, { createContext, useContext, useMemo } from "react";

const StudioContext = createContext({
  pages: [],
  activePageId: "",
  templateId: "",
  websiteId: "",
  templateName: "",
});

export function StudioProvider({
  children,
  pages = [],
  activePageId = "",
  templateId = "",
  websiteId = "",
  templateName = "",
}) {
  const value = useMemo(
    () => ({
      pages: Array.isArray(pages) ? pages : [],
      activePageId: activePageId || "",
      templateId: templateId || "",
      websiteId: websiteId || "",
      templateName: templateName || "",
    }),
    [pages, activePageId, templateId, websiteId, templateName]
  );

  return (
    <StudioContext.Provider value={value}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  return useContext(StudioContext);
}

export default StudioContext;
