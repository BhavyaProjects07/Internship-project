
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import PuckEditorClient from "@/components/website-builder/PuckEditorClient";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

function LoadingScreen() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f5f6fa] px-6 text-sm text-gray-600">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"
          aria-hidden="true"
        />
        Loading your template studio…
      </div>
    </main>
  );
}

function ErrorScreen({ message, onRetry, onExit }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f5f6fa] p-6">
      <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-7 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M10.3 3.9 1.9 18.1A1.8 1.8 0 0 0 3.4 21h17.2a1.8 1.8 0 0 0 1.5-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z"
            />
          </svg>
        </div>

        <h1 className="mt-4 text-xl font-bold text-gray-950">
          Unable to open template
        </h1>

        <p role="alert" className="mt-2 text-sm leading-6 text-red-700">
          {message}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Try again
          </button>

          <button
            type="button"
            onClick={onExit}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back to templates
          </button>
        </div>
      </div>
    </main>
  );
}

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m15 18-6-6 6-6M9 12h12" />
    </svg>
  );
}

function EditIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function TrashIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function CopyIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export default function TemplateEditorPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [headersHidden, setHeadersHidden] = useState(false);
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [template, setTemplate] = useState(null);
  const [activePageId, setActivePageId] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const urlParam = new URLSearchParams(window.location.search).get("pageId");
        if (urlParam) return urlParam;
        if (id) {
          const stored = sessionStorage.getItem(`active_page_${id}`);
          if (stored) return stored;
        }
      } catch {
        return "";
      }
    }
    return "";
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const switchActivePage = useCallback(
    (nextPageId) => {
      setActivePageId(nextPageId);
      if (typeof window !== "undefined") {
        try {
          if (nextPageId) {
            if (id) {
              sessionStorage.setItem(`active_page_${id}`, nextPageId);
            }
            const url = new URL(window.location.href);
            if (url.searchParams.get("pageId") !== nextPageId) {
              url.searchParams.set("pageId", nextPageId);
              window.history.replaceState(null, "", url.toString());
            }
          } else {
            if (id) {
              sessionStorage.removeItem(`active_page_${id}`);
            }
            const url = new URL(window.location.href);
            if (url.searchParams.has("pageId")) {
              url.searchParams.delete("pageId");
              window.history.replaceState(null, "", url.toString());
            }
          }
        } catch {
          // ignore storage/history errors
        }
      }
    },
    [id]
  );

  useEffect(() => {
    if (!activePageId || typeof window === "undefined") return;

    try {
      if (id) {
        sessionStorage.setItem(`active_page_${id}`, activePageId);
      }
      const url = new URL(window.location.href);
      if (url.searchParams.get("pageId") !== activePageId) {
        url.searchParams.set("pageId", activePageId);
        window.history.replaceState(null, "", url.toString());
      }
    } catch {
      // ignore storage/history errors
    }
  }, [id, activePageId]);

  useEffect(() => {
    const handlePopState = () => {
      try {
        const urlParam = new URLSearchParams(window.location.search).get("pageId");
        if (urlParam) {
          setActivePageId(urlParam);
        }
      } catch {}
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  



  
const [pageActionLoading, setPageActionLoading] = useState(false);
const [pageActionError, setPageActionError] = useState("");

const requestPageAction = useCallback(
  async (path, method, body) => {
    let token = null;
    try {
      token = await getToken();
    } catch {
      token = null;
    }

    if (!token && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    const headers = {
      ...(body ? { "Content-Type": "application/json" } : {}),
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      throw new Error(
        result?.message || `Page action failed (HTTP ${response.status}).`
      );
    }

    return result.data;
  },
  [getToken]
);

const runPageAction = useCallback(
  async (action) => {
    if (pageActionLoading) return;

    setPageActionLoading(true);
    setPageActionError("");

    try {
      await action();
    } catch (actionError) {
      setPageActionError(
        actionError instanceof Error
          ? actionError.message
          : "Page action failed."
      );
    } finally {
      setPageActionLoading(false);
    }
  },
  [pageActionLoading]
);


  const loadTemplate = useCallback(async () => {
    if (!id) {
      setError("A template ID is required.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let token = null;
      try {
        token = await getToken();
      } catch {
        token = null;
      }

      if (!token && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_URL}/templates/admin/${encodeURIComponent(id)}`,
        {
          headers,
          cache: "no-store",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success || !result?.data) {
        throw new Error(
          result?.message ||
            `Unable to load this template (HTTP ${response.status}).`
        );
      }

      const loadedTemplate = result.data;

      const sortedPages = [...(loadedTemplate.pages || [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );

      if (sortedPages.length === 0) {
        throw new Error(
          "This template has no pages yet. Add a page before opening the editor."
        );
      }

      setTemplate({
        ...loadedTemplate,
        pages: sortedPages,
      });

      setActivePageId((currentPageId) => {
        if (
          currentPageId &&
          sortedPages.some((page) => page.id === currentPageId)
        ) {
          return currentPageId;
        }

        if (typeof window !== "undefined") {
          try {
            const urlPageId = new URLSearchParams(window.location.search).get(
              "pageId"
            );
            if (
              urlPageId &&
              sortedPages.some((page) => page.id === urlPageId)
            ) {
              return urlPageId;
            }

            if (id) {
              const storedPageId = sessionStorage.getItem(`active_page_${id}`);
              if (
                storedPageId &&
                sortedPages.some((page) => page.id === storedPageId)
              ) {
                return storedPageId;
              }
            }
          } catch {
            // ignore
          }
        }

        return sortedPages[0].id;
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load this template."
      );
    } finally {
      setLoading(false);
    }
  }, [id, getToken]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      setTemplate(null);
      setError("Please sign in to edit templates.");
      setLoading(false);
      return;
    }

    void loadTemplate();
  }, [isLoaded, isSignedIn, loadTemplate, refreshKey]);

  const activePage = useMemo(
    () =>
      template?.pages?.find((page) => page.id === activePageId) ?? null,
    [template, activePageId]
  );

  
const createPage = useCallback(() => {
  const name = window.prompt("Enter the new page name:", "New Page");
  if (name === null || !name.trim()) return;

  void runPageAction(async () => {
    const page = await requestPageAction(
      `/templates/admin/${encodeURIComponent(id)}/pages`,
      "POST",
      { name: name.trim() }
    );

    switchActivePage(page.id);
    await loadTemplate();
  });
}, [id, requestPageAction, runPageAction, loadTemplate, switchActivePage]);

const renamePage = useCallback(() => {
  if (!activePage) return;

  const name = window.prompt("Enter the new page name:", activePage.name);
  if (name === null || !name.trim()) return;

  void runPageAction(async () => {
    await requestPageAction(
      `/templates/admin/${encodeURIComponent(id)}/pages/${encodeURIComponent(activePage.id)}`,
      "PATCH",
      { name: name.trim() }
    );

    await loadTemplate();
  });
}, [id, activePage, requestPageAction, runPageAction, loadTemplate]);

const duplicatePage = useCallback(() => {
  if (!activePage) return;

  void runPageAction(async () => {
    const page = await requestPageAction(
      `/templates/admin/${encodeURIComponent(id)}/pages/${encodeURIComponent(activePage.id)}/duplicate`,
      "POST"
    );

    switchActivePage(page.id);
    await loadTemplate();
  });
}, [id, activePage, requestPageAction, runPageAction, loadTemplate, switchActivePage]);

const deletePage = useCallback(() => {
  if (!activePage || !template) return;

  if (template.pages.length <= 1) {
    setPageActionError("You cannot delete the last page.");
    return;
  }

  const confirmed = window.confirm(
    `Delete "${activePage.name}"? This permanently deletes its saved page data.`
  );

  if (!confirmed) return;

  void runPageAction(async () => {
    await requestPageAction(
      `/templates/admin/${encodeURIComponent(id)}/pages/${encodeURIComponent(activePage.id)}`,
      "DELETE"
    );

    const remainingPages = template.pages.filter(
      (page) => page.id !== activePage.id
    );

    switchActivePage(remainingPages[0]?.id ?? "");
    await loadTemplate();
  });
}, [id, activePage, template, requestPageAction, runPageAction, loadTemplate, switchActivePage]);

const movePage = useCallback(
  (direction) => {
    if (!template || !activePage) return;

    const pages = [...template.pages].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    const currentIndex = pages.findIndex(
      (page) => page.id === activePage.id
    );
    const targetIndex = currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= pages.length) return;

    [pages[currentIndex], pages[targetIndex]] = [
      pages[targetIndex],
      pages[currentIndex],
    ];

    void runPageAction(async () => {
      await requestPageAction(
        `/templates/admin/${encodeURIComponent(id)}/pages/reorder`,
        "PATCH",
        { pageIds: pages.map((page) => page.id) }
      );

      await loadTemplate();
    });
  },
  [id, template, activePage, requestPageAction, runPageAction, loadTemplate]
);



  const hasLegacySections = (activePage?.sections?.length ?? 0) > 0;
  const hasPuckDocument = Boolean(activePage?.editorData);

  const exitToTemplates = useCallback(() => {
    router.push("/admin/templates");
  }, [router]);

  if (!isLoaded || loading) {
    return <LoadingScreen />;
  }

  if (error || !template) {
    return (
      <ErrorScreen
        message={error || "Template not found."}
        onRetry={() => setRefreshKey((key) => key + 1)}
        onExit={exitToTemplates}
      />
    );
  }

  
return (
  <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#f5f6fa] text-gray-950">
    <header
      className={`template-editor-header ${
        headersHidden ? "is-hidden" : ""
      }`}
    >
      {/* Left: Back + Template Title */}
      <div className="flex min-w-0 items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={exitToTemplates}
          aria-label="Back to templates"
          title="Back to templates"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200/90 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-indigo-600"
        >
          <BackIcon />
        </button>

        <div className="h-4 w-px bg-gray-200 shrink-0" />

        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-xs font-bold text-gray-900 max-w-[140px] sm:max-w-[200px]" title={template.name}>
            {template.name}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 border border-violet-200 shrink-0">
            Template
          </span>
        </div>
      </div>

      {/* Center: Integrated Page Switcher & Manager */}
      <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-2xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Page</span>
          <select
            value={activePageId}
            onChange={(event) => switchActivePage(event.target.value)}
            disabled={pageActionLoading}
            className="bg-transparent text-xs font-semibold text-gray-800 outline-none cursor-pointer max-w-[100px] sm:max-w-[140px] truncate"
            aria-label="Select page to edit"
          >
            {template.pages
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
          </select>
        </div>

        <div className="h-3.5 w-px bg-gray-200" />

        <button
          type="button"
          onClick={createPage}
          disabled={pageActionLoading}
          title="Add a new page"
          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-40"
        >
          <span className="text-sm leading-none font-bold">+</span>
          <span className="hidden sm:inline">Page</span>
        </button>

        <button
          type="button"
          onClick={renamePage}
          disabled={pageActionLoading || !activePage}
          title="Rename page"
          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition disabled:opacity-40"
        >
          <EditIcon className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={duplicatePage}
          disabled={pageActionLoading || !activePage}
          title="Duplicate page"
          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition disabled:opacity-40"
        >
          <CopyIcon className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => movePage(-1)}
          disabled={
            pageActionLoading ||
            !activePage ||
            template.pages
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]?.id ===
              activePage.id
          }
          title="Move page up"
          aria-label="Move page up"
          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition disabled:opacity-20"
        >
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => movePage(1)}
          disabled={
            pageActionLoading ||
            !activePage ||
            template.pages
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .at(-1)?.id === activePage.id
          }
          title="Move page down"
          aria-label="Move page down"
          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition disabled:opacity-20"
        >
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={deletePage}
          disabled={
            pageActionLoading ||
            !activePage ||
            template.pages.length <= 1
          }
          title="Delete page"
          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-20"
        >
          <TrashIcon className="size-3.5" />
        </button>
      </div>

      {/* Right: Exit Action */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:inline-flex border border-emerald-200">
          Admin Puck Studio
        </span>

        <button
          type="button"
          onClick={exitToTemplates}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
        >
          Exit
        </button>
      </div>
    </header>

    {pageActionError && (
      <div
        role="alert"
        className="mx-4 mt-3 flex shrink-0 items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <span>{pageActionError}</span>
        <button
          type="button"
          onClick={() => setPageActionError("")}
          className="shrink-0 font-semibold hover:underline"
          aria-label="Dismiss error"
        >
          Dismiss
        </button>
      </div>
    )}

    <section
      className="min-h-0 min-w-0 flex-1 overflow-hidden"
      aria-label="Template page editor"
    >
      {!activePageId ? (
        <div className="flex h-full items-center justify-center p-6">
          <p className="text-sm text-gray-500">
            Select a page to start editing.
          </p>
        </div>
      ) : hasLegacySections && !hasPuckDocument ? (
        <div
          role="alert"
          className="mx-4 mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 sm:mx-6"
        >
          <p className="font-semibold">
            This page contains legacy sections that have not been confirmed
            as migrated to Puck.
          </p>

          <p className="mt-1 leading-6">
            Puck editing is paused for this page to protect the existing
            content. Convert the legacy sections to the Puck document format
            and verify the result before opening this page in Puck.
          </p>
        </div>
      ) : (
        <div className="h-full min-h-0 min-w-0 overflow-hidden">
          <PuckEditorClient
            key={`puck-${template?.id || id || "tmpl"}-${activePageId || "page"}`}
            templateId={id}
            pageId={activePageId}
            pages={template.pages}
            templateName={template.name}
            getToken={getToken}
            headersHidden={headersHidden}
            onHeaderVisibilityChange={setHeadersHidden}
          />
        </div>
      )}
    </section>
  </main>
);

}
