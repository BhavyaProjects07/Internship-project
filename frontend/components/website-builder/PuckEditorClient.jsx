
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Puck, useGetPuck } from "@puckeditor/core";
import puckConfig from "./puck-config";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const createEmptyDocument = () => ({
  content: [],
  root: { props: {} },
});

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),
    blocks: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </>
    ),
    save: (
      <>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
        <path d="M17 21v-8H7v8M7 3v5h8" />
      </>
    ),
    alert: (
      <>
        <path d="M12 9v4m0 4h.01" />
        <path d="M10.3 3.9 2 18.1A2 2 0 0 0 3.7 21h16.6a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      </>
    ),
    panel: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.blocks}</svg>;
}

function StatusIndicator({ status, savedAt }) {
  const statusMap = {
    idle: {
      label: "Ready to edit",
      className: "studio-status-neutral",
    },
    dirty: {
      label: "Unsaved changes",
      className: "studio-status-warning",
    },
    saving: {
      label: "Saving changes…",
      className: "studio-status-neutral",
    },
    saved: {
      label: savedAt ? `Saved at ${savedAt}` : "All changes saved",
      className: "studio-status-success",
    },
    error: {
      label: "Save failed",
      className: "studio-status-error",
    },
  };

  const current = statusMap[status] || statusMap.idle;

  return (
    <span className={`studio-status ${current.className}`} role="status">
      <span className="studio-status-dot" />
      {current.label}
    </span>
  );
}

/*
 * This bridge is rendered inside <Puck>, so useGetPuck has
 * the required Puck context. It exposes current editor data
 * to the external Studio Save button without DOM selectors.
 */
function PuckSaveBridge({ onRegister }) {
  const getPuck = useGetPuck();

  useEffect(() => {
    onRegister(() => {
      const { appState } = getPuck();
      return appState.data;
    });

    return () => onRegister(null);
  }, [getPuck, onRegister]);

  return null;
}

export default function PuckEditorClient({
  templateId,
  pageId,
  getToken,
  onHeaderVisibilityChange,
  
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [savedAt, setSavedAt] = useState(null);
  const [retryDocument, setRetryDocument] = useState(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState("elements");


  
const lastCanvasScrollRef = useRef(0);
  const saveLockRef = useRef(false);
  const dirtyRef = useRef(false);
  const mountedRef = useRef(true);
  const loadSequenceRef = useRef(0);

  const lastSavedSerializedRef = useRef("");
  const latestEditorSerializedRef = useRef("");
  const latestEditorDataRef = useRef(null);

  const pendingDocumentRef = useRef(null);
  const getCurrentPuckDataRef = useRef(null);

  const saveDocumentRef = useRef(null);

  const registerCurrentDataGetter = useCallback((getter) => {
    getCurrentPuckDataRef.current = getter;
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      loadSequenceRef.current += 1;
    };
  }, []);



  
const DEFAULT_GLOBAL_LAYOUT = {
  header: {
    enabled: true,
    logoText: "Your Brand",
    logoUrl: "",
    backgroundColor: "#ffffff",
    textColor: "#111827",
    alignment: "between",
    links: [],
  },
  footer: {
    enabled: true,
    backgroundColor: "#111827",
    textColor: "#ffffff",
    copyrightText: "© Your Brand. All rights reserved.",
    links: [],
  },
};

const [globalLayout, setGlobalLayout] = useState(DEFAULT_GLOBAL_LAYOUT);
const [globalLayoutLoading, setGlobalLayoutLoading] = useState(true);
const [globalLayoutSaving, setGlobalLayoutSaving] = useState(false);
const [globalLayoutError, setGlobalLayoutError] = useState("");
const [globalLayoutSaved, setGlobalLayoutSaved] = useState(false);
const [globalLayoutSection, setGlobalLayoutSection] = useState("header");

const updateGlobalLayout = useCallback((section, field, value) => {
  setGlobalLayout((current) => ({
    ...current,
    [section]: {
      ...current[section],
      [field]: value,
    },
  }));
  setGlobalLayoutSaved(false);
}, []);

const linksToText = (links = []) =>
  links.map((link) => `${link.label || ""} | ${link.href || ""}`).join("\n");

const textToLinks = (text) =>
  text
    .split("\n")
    .map((line) => {
      const separator = line.indexOf("|");
      if (separator < 0) return null;

      const label = line.slice(0, separator).trim();
      const href = line.slice(separator + 1).trim();

      if (!label || !href) return null;
      return { label, href };
    })
    .filter(Boolean);



    
useEffect(() => {
  let cancelled = false;

  async function loadGlobalLayout() {
    setGlobalLayoutLoading(true);
    setGlobalLayoutError("");

    try {
      let token = null;
      try {
        token = typeof getToken === "function" ? await getToken() : null;
      } catch {
        token = null;
      }

      if (!token && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        throw new Error("Authentication token unavailable.");
      }

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_URL}/templates/admin/${encodeURIComponent(
          templateId
        )}/global-layout`,
        {
          headers,
          cache: "no-store",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Unable to load global layout."
        );
      }

      const saved = result.data?.globalLayout;

      if (!cancelled && saved) {
        setGlobalLayout({
          header: {
            ...DEFAULT_GLOBAL_LAYOUT.header,
            ...(saved.header || {}),
          },
          footer: {
            ...DEFAULT_GLOBAL_LAYOUT.footer,
            ...(saved.footer || {}),
          },
        });
      }
    } catch (err) {
      if (!cancelled) {
        setGlobalLayoutError(
          err instanceof Error
            ? err.message
            : "Unable to load global layout."
        );
      }
    } finally {
      if (!cancelled) setGlobalLayoutLoading(false);
    }
  }

  if (templateId && getToken) {
    void loadGlobalLayout();
  }

  return () => {
    cancelled = true;
  };
}, [templateId, getToken]);




 const handleCanvasScroll = useCallback(
  (event) => {
    const currentScroll = event.currentTarget.scrollTop;
    const previousScroll = lastCanvasScrollRef.current;
    const delta = currentScroll - previousScroll;

    if (currentScroll <= 40 || delta < -5) {
      onHeaderVisibilityChange(false);
    } else if (delta > 5) {
      onHeaderVisibilityChange(true);
    }

    lastCanvasScrollRef.current = currentScroll;
  },
  [onHeaderVisibilityChange]
);


  useEffect(() => {
    let cancelled = false;
    const sequence = ++loadSequenceRef.current;

    async function loadDocument() {
      setData(null);
      setError("");
      setSaveStatus("idle");
      setSavedAt(null);
      setRetryDocument(null);

      dirtyRef.current = false;
      pendingDocumentRef.current = null;
      latestEditorDataRef.current = null;
      lastSavedSerializedRef.current = "";
      latestEditorSerializedRef.current = "";

      try {
        let token = null;
        try {
          token = typeof getToken === "function" ? await getToken() : null;
        } catch {
          token = null;
        }

        if (!token && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
          throw new Error("Authentication token unavailable.");
        }

        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `${API_URL}/templates/admin/${encodeURIComponent(
            templateId
          )}/pages/${encodeURIComponent(pageId)}/editor-data`,
          {
            headers,
            cache: "no-store",
          }
        );

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
          throw new Error(
            result?.message ||
              `Unable to load page document (HTTP ${response.status}).`
          );
        }

        const document =
          result.data?.editorData ?? createEmptyDocument();

        const serialized = JSON.stringify(document);

        if (
          cancelled ||
          sequence !== loadSequenceRef.current
        ) {
          return;
        }

        lastSavedSerializedRef.current = serialized;
        latestEditorSerializedRef.current = serialized;
        latestEditorDataRef.current = document;

        setData(document);
      } catch (err) {
        if (
          !cancelled &&
          sequence === loadSequenceRef.current
        ) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load the page editor."
          );
        }
      }
    }

    if (templateId && pageId && getToken) {
      void loadDocument();
    } else {
      const timer = setTimeout(() => {
        if (!cancelled) {
          setData(null);
          setError("Template ID, page ID, or authentication is missing.");
        }
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [templateId, pageId, getToken]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!dirtyRef.current && !saveLockRef.current) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleEditorChange = useCallback((document) => {
    if (!document) return;

    const serialized = JSON.stringify(document);

    latestEditorSerializedRef.current = serialized;
    latestEditorDataRef.current = document;

    const isDirty =
      serialized !== lastSavedSerializedRef.current;

    dirtyRef.current = isDirty;

    setSaveStatus((current) => {
      if (current === "saving") return current;
      if (current === "error" && isDirty) return "error";

      return isDirty ? "dirty" : "saved";
    });

    if (!isDirty) {
      setError("");
      setRetryDocument(null);
    }
  }, []);

  const saveDocument = useCallback(
    async (document) => {
      if (!document) {
        setError("There is no editor document to save.");
        return;
      }

      /*
       * Keep the newest save request rather than silently dropping it.
       * The queued document is saved after the active request finishes.
       */
      if (saveLockRef.current) {
        pendingDocumentRef.current = document;
        return;
      }

      saveLockRef.current = true;

      const serializedAttempt = JSON.stringify(document);

      setSaveStatus("saving");
      setError("");
      setRetryDocument(null);

      try {
        let token = null;
        try {
          token = typeof getToken === "function" ? await getToken() : null;
        } catch {
          token = null;
        }

        if (!token && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
          throw new Error("Authentication token unavailable.");
        }

        const headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `${API_URL}/templates/admin/${encodeURIComponent(
            templateId
          )}/pages/${encodeURIComponent(pageId)}/editor-data`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({
              editorData: document,
            }),
          }
        );

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
          throw new Error(
            result?.message ||
              `Unable to save page document (HTTP ${response.status}).`
          );
        }

        lastSavedSerializedRef.current = serializedAttempt;

        const newerEditsExist =
          latestEditorSerializedRef.current !== serializedAttempt;

        dirtyRef.current = newerEditsExist;

        if (mountedRef.current) {
          setSavedAt(new Date().toLocaleTimeString());
          setSaveStatus(newerEditsExist ? "dirty" : "saved");
          setError("");

          if (!newerEditsExist) {
            setRetryDocument(null);
          }
        }
      } catch (err) {
        const latestDocument =
          latestEditorDataRef.current || document;

        dirtyRef.current = true;

        if (mountedRef.current) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to save the page."
          );

          setRetryDocument(latestDocument);
          setSaveStatus("error");
        }
      } finally {
        saveLockRef.current = false;

        const pendingDocument = pendingDocumentRef.current;
        pendingDocumentRef.current = null;

        if (
          pendingDocument &&
          mountedRef.current &&
          saveDocumentRef.current
        ) {
          void saveDocumentRef.current(pendingDocument);
        }
      }
    },
    [templateId, pageId, getToken]
  );

  useEffect(() => {
    saveDocumentRef.current = saveDocument;

    return () => {
      if (saveDocumentRef.current === saveDocument) {
        saveDocumentRef.current = null;
      }
    };
  }, [saveDocument]);

  const saveCurrentDocument = useCallback(() => {
    try {
      const getter = getCurrentPuckDataRef.current;

      if (!getter) {
        setError(
          "The editor is still initializing. Try saving again in a moment."
        );
        return;
      }

      const currentDocument = getter();

      if (!currentDocument) {
        setError("Unable to read the current editor document.");
        return;
      }

      void saveDocument(currentDocument);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to read the current editor document."
      );
    }
  }, [saveDocument]);

  const retrySave = useCallback(() => {
    if (saveLockRef.current) return;

    const documentToRetry =
      latestEditorDataRef.current || retryDocument;

    if (documentToRetry) {
      void saveDocument(documentToRetry);
    }
  }, [retryDocument, saveDocument]);



  
const saveGlobalLayout = useCallback(async () => {
  setGlobalLayoutSaving(true);
  setGlobalLayoutError("");
  setGlobalLayoutSaved(false);

  try {
    let token = null;
    try {
      token = typeof getToken === "function" ? await getToken() : null;
    } catch {
      token = null;
    }

    if (!token && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      throw new Error("Authentication token unavailable.");
    }

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_URL}/templates/admin/${encodeURIComponent(
        templateId
      )}/global-layout`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ globalLayout }),
      }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      throw new Error(
        result?.message || "Unable to save global layout."
      );
    }

    const saved = result.data?.globalLayout;

    if (saved) {
      setGlobalLayout({
        header: {
          ...DEFAULT_GLOBAL_LAYOUT.header,
          ...(saved.header || {}),
        },
        footer: {
          ...DEFAULT_GLOBAL_LAYOUT.footer,
          ...(saved.footer || {}),
        },
      });
    }

    setGlobalLayoutSaved(true);
  } catch (err) {
    setGlobalLayoutError(
      err instanceof Error
        ? err.message
        : "Unable to save global layout."
    );
  } finally {
    setGlobalLayoutSaving(false);
  }
}, [templateId, getToken, globalLayout]);


  if (error && !data) {
    return (
      <div className="studio-load-error" role="alert">
        <div className="studio-error-icon">
          <Icon name="alert" size={22} />
        </div>

        <h2>Unable to load the editor</h2>
        <p>{error}</p>

        <button
          type="button"
          className="studio-save-button"
          onClick={() => window.location.reload()}
        >
          Try loading again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="studio-loading" role="status">
        <span className="studio-spinner" />
        <span>Preparing your editor…</span>
      </div>
    );
  }

  return (
  <div className="studio-workspace">
    <div className="studio-toolbar">
      <div className="studio-toolbar-heading">
        <div className="studio-toolbar-mark">
          <Icon name="panel" size={18} />
        </div>

        <div>
          <p className="studio-eyebrow">DESIGN WORKSPACE</p>
          <h2>Visual editor</h2>
        </div>
      </div>

      <div className="studio-toolbar-actions">
        <StatusIndicator status={saveStatus} savedAt={savedAt} />

        {saveStatus === "error" && retryDocument ? (
          <button
            type="button"
            className="studio-save-button"
            onClick={retrySave}
            disabled={saveStatus === "saving"}
          >
            Retry save
          </button>
        ) : (
          <button
            type="button"
            className="studio-save-button"
            onClick={saveCurrentDocument}
            disabled={saveStatus === "saving"}
          >
            <Icon name="save" size={16} />
            <span>Save changes</span>
          </button>
        )}
      </div>
    </div>

    {error && data && (
      <div className="studio-error-banner" role="alert">
        <Icon name="alert" size={17} />
        <span>{error}</span>

        {retryDocument && (
          <button
            type="button"
            onClick={retrySave}
            disabled={saveStatus === "saving"}
          >
            Retry
          </button>
        )}
      </div>
    )}

    <div className="studio-editor-grid">
      <Puck
  config={puckConfig}
  data={data}
  onChange={handleEditorChange}
  onPublish={saveDocument}
  height="100%"
  iframe={{ enabled: false }}
>
        <PuckSaveBridge onRegister={registerCurrentDataGetter} />

        <div className="studio-composition">
          <aside className="studio-sidebar">
            <div className="studio-sidebar-tabs">
              <button
                type="button"
                className={
                  activeSidebarTab === "elements"
                    ? "studio-sidebar-tab is-active"
                    : "studio-sidebar-tab"
                }
                aria-pressed={activeSidebarTab === "elements"}
                onClick={() => setActiveSidebarTab("elements")}
              >
                <Icon name="blocks" size={16} />
                Elements
              </button>

              <button
                type="button"
                className={
                  activeSidebarTab === "layers"
                    ? "studio-sidebar-tab is-active"
                    : "studio-sidebar-tab"
                }
                aria-pressed={activeSidebarTab === "layers"}
                onClick={() => setActiveSidebarTab("layers")}
              >
                <Icon name="layers" size={16} />
                Layers
              </button>

              

              


            </div>

            <div className="studio-sidebar-content">
              
              {activeSidebarTab === "elements" ? (
                <>
                  <div className="studio-panel-heading">
                    <h3>Add elements</h3>
                    <p>Drag components onto your page.</p>
                  </div>
                  <Puck.Components />
                </>
              ) : activeSidebarTab === "layers" ? (
                <>
                  <div className="studio-panel-heading">
                    <h3>Page structure</h3>
                    <p>Select and organize page elements.</p>
                  </div>
                  <Puck.Outline />
                </>
              ) : (
                <div style={{ padding: 16, display: "grid", gap: 16 }}>
                  <div className="studio-panel-heading">
                    <h3>Global Header & Footer</h3>
                    <p>These settings are shared across the template&apos;s pages.</p>
                  </div>

                  {globalLayoutLoading ? (
                    <p>Loading global layout…</p>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          className="studio-sidebar-tab"
                          aria-pressed={globalLayoutSection === "header"}
                          onClick={() => setGlobalLayoutSection("header")}
                        >
                          Header
                        </button>
                        <button
                          type="button"
                          className="studio-sidebar-tab"
                          aria-pressed={globalLayoutSection === "footer"}
                          onClick={() => setGlobalLayoutSection("footer")}
                        >
                          Footer
                        </button>
                      </div>

                      {globalLayoutSection === "header" ? (
                        <div style={{ display: "grid", gap: 12 }}>
                          <label>
                            <input
                              type="checkbox"
                              checked={globalLayout.header.enabled}
                              onChange={(e) =>
                                updateGlobalLayout("header", "enabled", e.target.checked)
                              }
                            />{" "}
                            Show header
                          </label>

                          <label>
                            Logo / brand text
                            <input
                              style={{ display: "block", width: "100%" }}
                              value={globalLayout.header.logoText}
                              onChange={(e) =>
                                updateGlobalLayout("header", "logoText", e.target.value)
                              }
                            />
                          </label>

                          <label>
                            Logo image URL (optional)
                            <input
                              style={{ display: "block", width: "100%" }}
                              value={globalLayout.header.logoUrl}
                              onChange={(e) =>
                                updateGlobalLayout("header", "logoUrl", e.target.value)
                              }
                              placeholder="https://example.com/logo.png"
                            />
                          </label>

                          <label>
                            Background color
                            <input
                              type="color"
                              value={globalLayout.header.backgroundColor}
                              onChange={(e) =>
                                updateGlobalLayout(
                                  "header",
                                  "backgroundColor",
                                  e.target.value
                                )
                              }
                            />
                          </label>

                          <label>
                            Text color
                            <input
                              type="color"
                              value={globalLayout.header.textColor}
                              onChange={(e) =>
                                updateGlobalLayout("header", "textColor", e.target.value)
                              }
                            />
                          </label>

                          <label>
                            Navigation links (one per line: Label | /path)
                            <textarea
                              rows={5}
                              style={{ display: "block", width: "100%" }}
                              value={linksToText(globalLayout.header.links)}
                              onChange={(e) =>
                                updateGlobalLayout(
                                  "header",
                                  "links",
                                  textToLinks(e.target.value)
                                )
                              }
                              placeholder={"Home | /\nAbout | /about\nContact | /contact"}
                            />
                          </label>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: 12 }}>
                          <label>
                            <input
                              type="checkbox"
                              checked={globalLayout.footer.enabled}
                              onChange={(e) =>
                                updateGlobalLayout("footer", "enabled", e.target.checked)
                              }
                            />{" "}
                            Show footer
                          </label>

                          <label>
                            Background color
                            <input
                              type="color"
                              value={globalLayout.footer.backgroundColor}
                              onChange={(e) =>
                                updateGlobalLayout(
                                  "footer",
                                  "backgroundColor",
                                  e.target.value
                                )
                              }
                            />
                          </label>

                          <label>
                            Text color
                            <input
                              type="color"
                              value={globalLayout.footer.textColor}
                              onChange={(e) =>
                                updateGlobalLayout("footer", "textColor", e.target.value)
                              }
                            />
                          </label>

                          <label>
                            Copyright text
                            <textarea
                              rows={3}
                              style={{ display: "block", width: "100%" }}
                              value={globalLayout.footer.copyrightText}
                              onChange={(e) =>
                                updateGlobalLayout(
                                  "footer",
                                  "copyrightText",
                                  e.target.value
                                )
                              }
                            />
                          </label>

                          <label>
                            Footer links (one per line: Label | /path)
                            <textarea
                              rows={5}
                              style={{ display: "block", width: "100%" }}
                              value={linksToText(globalLayout.footer.links)}
                              onChange={(e) =>
                                updateGlobalLayout(
                                  "footer",
                                  "links",
                                  textToLinks(e.target.value)
                                )
                              }
                              placeholder={"Privacy | /privacy\nTerms | /terms"}
                            />
                          </label>
                        </div>
                      )}

                      <button
                        type="button"
                        className="studio-save-button"
                        onClick={saveGlobalLayout}
                        disabled={globalLayoutSaving}
                      >
                        {globalLayoutSaving ? "Saving layout…" : "Save global layout"}
                      </button>

                      {globalLayoutSaved && (
                        <p role="status">Global layout saved.</p>
                      )}

                      {globalLayoutError && (
                        <p role="alert" style={{ color: "#dc2626" }}>
                          {globalLayoutError}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

            </div>
          </aside>

          <section className="studio-canvas-panel">
           

            
          <div
            className="studio-canvas"
            onScroll={handleCanvasScroll}
          >
            
<div
  className="studio-canvas-page"
  style={{ backgroundColor: "#ffffff", color: "#111827" }}
>
  {globalLayout.header.enabled && (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        padding: "16px 24px",
        backgroundColor: globalLayout.header.backgroundColor,
        color: globalLayout.header.textColor,
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {globalLayout.header.logoUrl ? (
        <img
          src={globalLayout.header.logoUrl}
          alt={globalLayout.header.logoText || "Brand logo"}
          style={{ maxWidth: 160, maxHeight: 48, objectFit: "contain" }}
        />
      ) : (
        <strong>{globalLayout.header.logoText || "Your Brand"}</strong>
      )}

      <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {globalLayout.header.links.map((link, index) => (
          <a
            key={`${link.href}-${index}`}
            href={link.href}
            style={{
              color: globalLayout.header.textColor,
              textDecoration: "none",
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )}

  <Puck.Preview id="website-studio-preview" />

  {globalLayout.footer.enabled && (
    <footer
      style={{
        padding: "24px",
        backgroundColor: globalLayout.footer.backgroundColor,
        color: globalLayout.footer.textColor,
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        {globalLayout.footer.links.map((link, index) => (
          <a
            key={`${link.href}-${index}`}
            href={link.href}
            style={{
              color: globalLayout.footer.textColor,
              textDecoration: "none",
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <p style={{ margin: 0 }}>
        {globalLayout.footer.copyrightText}
      </p>
    </footer>
  )}
</div>

          </div>

          </section>

          <aside className="studio-inspector">
            <div className="studio-inspector-heading">
              <span className="studio-inspector-icon">
                <Icon name="panel" size={17} />
              </span>

              <div>
                <h3>Inspector</h3>
                <p>Content and component settings</p>
              </div>
            </div>

            <div className="studio-inspector-content">
              <Puck.Fields />
            </div>
          </aside>
        </div>
      </Puck>
    </div>
  </div>
);
}