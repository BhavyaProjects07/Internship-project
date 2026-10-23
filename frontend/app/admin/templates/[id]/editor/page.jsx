
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

export default function TemplateEditorPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [headersHidden, setHeadersHidden] = useState(false);
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [template, setTemplate] = useState(null);
  const [activePageId, setActivePageId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  



  
const [pageActionLoading, setPageActionLoading] = useState(false);
const [pageActionError, setPageActionError] = useState("");

const requestPageAction = useCallback(
  async (path, method, body) => {
    const token = await getToken();

    if (!token) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
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
      const token = await getToken();

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/templates/admin/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

      setActivePageId((currentPageId) =>
        sortedPages.some((page) => page.id === currentPageId)
          ? currentPageId
          : sortedPages[0].id
      );
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

    if (!isSignedIn) {
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

    setActivePageId(page.id);
    await loadTemplate();
  });
}, [id, requestPageAction, runPageAction, loadTemplate]);

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

    setActivePageId(page.id);
    await loadTemplate();
  });
}, [id, activePage, requestPageAction, runPageAction, loadTemplate]);

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

    setActivePageId(remainingPages[0]?.id ?? "");
    await loadTemplate();
  });
}, [id, activePage, template, requestPageAction, runPageAction, loadTemplate]);

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
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={exitToTemplates}
          aria-label="Back to templates"
          title="Back to templates"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          <BackIcon />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white">
          S
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-950">
            {template.name}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500">
            Website Studio <span className="mx-1">/</span> Visual editor
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
          <span className="text-xs font-medium text-gray-500">Page</span>

          <select
            value={activePageId}
            onChange={(event) => setActivePageId(event.target.value)}
            disabled={pageActionLoading}
            className="max-w-[180px] bg-transparent text-sm font-semibold text-gray-800 outline-none disabled:opacity-50"
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
        </label>

        <button
          type="button"
          onClick={createPage}
          disabled={pageActionLoading}
          className="rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pageActionLoading ? "Working..." : "+ Add page"}
        </button>

        <button
          type="button"
          onClick={renamePage}
          disabled={pageActionLoading || !activePage}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Rename
        </button>

        <button
          type="button"
          onClick={duplicatePage}
          disabled={pageActionLoading || !activePage}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Duplicate
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
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ↑
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
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ↓
        </button>

        <button
          type="button"
          onClick={deletePage}
          disabled={
            pageActionLoading ||
            !activePage ||
            template.pages.length <= 1
          }
          className="rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete
        </button>

        <span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:inline-flex">
          Puck editor
        </span>

        <button
          type="button"
          onClick={exitToTemplates}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
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
            key={`${template.id}:${activePageId}`}
            templateId={id}
            pageId={activePageId}
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
