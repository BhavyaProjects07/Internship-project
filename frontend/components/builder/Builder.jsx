"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import PuckEditorClient from "@/components/website-builder/PuckEditorClient";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

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

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

export default function Builder({ website: initialWebsite }) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [website, setWebsite] = useState(initialWebsite);
  const [headersHidden, setHeadersHidden] = useState(false);
  const [pageActionLoading, setPageActionLoading] = useState(false);
  const [pageActionError, setPageActionError] = useState("");
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const websiteId = website?.id;

  const sortedPages = useMemo(() => {
    return [...(website?.pages || [])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
  }, [website?.pages]);

  const [activePageId, setActivePageId] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const urlParam = new URLSearchParams(window.location.search).get("pageId");
        if (urlParam) return urlParam;
        if (websiteId) {
          const stored = sessionStorage.getItem(`active_page_${websiteId}`);
          if (stored) return stored;
        }
      } catch {
        return "";
      }
    }
    return sortedPages[0]?.id || "";
  });

  // Keep activePageId valid if pages change
  useEffect(() => {
    if (sortedPages.length === 0) return;
    if (!activePageId || !sortedPages.some((p) => p.id === activePageId)) {
      setActivePageId(sortedPages[0].id);
    }
  }, [sortedPages, activePageId]);

  const switchActivePage = useCallback(
    (nextPageId) => {
      setActivePageId(nextPageId);
      if (typeof window !== "undefined") {
        try {
          if (nextPageId) {
            if (websiteId) {
              sessionStorage.setItem(`active_page_${websiteId}`, nextPageId);
            }
            const url = new URL(window.location.href);
            if (url.searchParams.get("pageId") !== nextPageId) {
              url.searchParams.set("pageId", nextPageId);
              window.history.replaceState(null, "", url.toString());
            }
          } else {
            if (websiteId) {
              sessionStorage.removeItem(`active_page_${websiteId}`);
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
    [websiteId]
  );

  useEffect(() => {
    if (!activePageId || typeof window === "undefined") return;

    try {
      if (websiteId) {
        sessionStorage.setItem(`active_page_${websiteId}`, activePageId);
      }
      const url = new URL(window.location.href);
      if (url.searchParams.get("pageId") !== activePageId) {
        url.searchParams.set("pageId", activePageId);
        window.history.replaceState(null, "", url.toString());
      }
    } catch {
      // ignore storage/history errors
    }
  }, [websiteId, activePageId]);

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

  const refreshWebsite = useCallback(async () => {
    if (!websiteId) return;

    try {
      let token = null;
      try {
        token = await getToken();
      } catch {
        token = null;
      }

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/websites/${encodeURIComponent(websiteId)}`, {
        headers,
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success && result?.data) {
        setWebsite(result.data);
      }
    } catch (err) {
      console.error("Failed to refresh website:", err);
    }
  }, [websiteId, getToken]);

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

  const activePage = useMemo(
    () => sortedPages.find((page) => page.id === activePageId) ?? null,
    [sortedPages, activePageId]
  );

  const createPage = useCallback(() => {
    const name = window.prompt("Enter the new page name:", "New Page");
    if (name === null || !name.trim()) return;

    void runPageAction(async () => {
      const page = await requestPageAction(
        `/websites/${encodeURIComponent(websiteId)}/pages`,
        "POST",
        { name: name.trim() }
      );

      switchActivePage(page.id);
      await refreshWebsite();
    });
  }, [websiteId, requestPageAction, runPageAction, refreshWebsite, switchActivePage]);

  const renamePage = useCallback(() => {
    if (!activePage) return;

    const name = window.prompt("Enter the new page name:", activePage.name);
    if (name === null || !name.trim()) return;

    void runPageAction(async () => {
      await requestPageAction(
        `/websites/pages/${encodeURIComponent(activePage.id)}`,
        "PATCH",
        { name: name.trim() }
      );

      await refreshWebsite();
    });
  }, [activePage, requestPageAction, runPageAction, refreshWebsite]);

  const duplicatePage = useCallback(() => {
    if (!activePage) return;

    void runPageAction(async () => {
      const page = await requestPageAction(
        `/websites/${encodeURIComponent(websiteId)}/pages/${encodeURIComponent(activePage.id)}/duplicate`,
        "POST"
      );

      switchActivePage(page.id);
      await refreshWebsite();
    });
  }, [websiteId, activePage, requestPageAction, runPageAction, refreshWebsite, switchActivePage]);

  const deletePage = useCallback(() => {
    if (!activePage || !website) return;

    if (sortedPages.length <= 1) {
      setPageActionError("You cannot delete the last page.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${activePage.name}"? This permanently deletes its saved page data.`
    );

    if (!confirmed) return;

    void runPageAction(async () => {
      await requestPageAction(
        `/websites/pages/${encodeURIComponent(activePage.id)}`,
        "DELETE"
      );

      const remainingPages = sortedPages.filter(
        (page) => page.id !== activePage.id
      );

      switchActivePage(remainingPages[0]?.id ?? "");
      await refreshWebsite();
    });
  }, [activePage, website, sortedPages, requestPageAction, runPageAction, refreshWebsite, switchActivePage]);

  const movePage = useCallback(
    (direction) => {
      if (!website || !activePage) return;

      const pages = [...sortedPages];
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
          `/websites/${encodeURIComponent(websiteId)}/pages/reorder`,
          "PATCH",
          { pageIds: pages.map((page) => page.id) }
        );

        await refreshWebsite();
      });
    },
    [website, activePage, sortedPages, websiteId, requestPageAction, runPageAction, refreshWebsite]
  );

  const handlePublish = useCallback(async () => {
    if (publishLoading || !websiteId) return;

    setPublishLoading(true);
    setPageActionError("");
    setPublishSuccess(false);

    try {
      let token = null;
      try {
        token = await getToken();
      } catch {
        token = null;
      }

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/websites/${encodeURIComponent(websiteId)}/publish`, {
        method: "POST",
        headers,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || `Failed to publish website (HTTP ${response.status}).`
        );
      }

      setPublishSuccess(true);
      await refreshWebsite();
      setTimeout(() => setPublishSuccess(false), 6000);
    } catch (err) {
      setPageActionError(
        err instanceof Error ? err.message : "Failed to publish website."
      );
    } finally {
      setPublishLoading(false);
    }
  }, [publishLoading, websiteId, getToken, refreshWebsite]);

  const exitToWebsites = useCallback(() => {
    router.push("/websites");
  }, [router]);

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
            onClick={exitToWebsites}
            aria-label="Back to websites"
            title="Back to websites"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <BackIcon />
          </button>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
            W
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-gray-950">
                {website.name}
              </p>
              {website.isPublished ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Draft
                </span>
              )}
            </div>
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
              onChange={(event) => switchActivePage(event.target.value)}
              disabled={pageActionLoading}
              className="max-w-[180px] bg-transparent text-sm font-semibold text-gray-800 outline-none disabled:opacity-50"
              aria-label="Select page to edit"
            >
              {sortedPages.map((page) => (
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
              sortedPages[0]?.id === activePage.id
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
              sortedPages.at(-1)?.id === activePage.id
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
              sortedPages.length <= 1
            }
            className="rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>

          <div className="mx-1 h-5 w-px bg-gray-200" />

          {/* View Live / Preview */}
          <a
            href={
              activePage?.slug && activePage.slug !== "home"
                ? `/${website.slug}/${activePage.slug}`
                : `/${website.slug}`
            }
            target="_blank"
            rel="noopener noreferrer"
            title="Preview published website in a new tab"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <span>Preview</span>
            <ExternalIcon />
          </a>

          {/* Publish Website Button */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishLoading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RocketIcon />
            <span>{publishLoading ? "Publishing…" : "Publish Website"}</span>
          </button>

          <button
            type="button"
            onClick={exitToWebsites}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Exit
          </button>
        </div>
      </header>

      {publishSuccess && (
        <div
          role="status"
          className="mx-4 mt-3 flex shrink-0 items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">🎉 Website published successfully!</span>
            <span>Your website is live at</span>
            <a
              href={`/${website.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline hover:text-emerald-950"
            >
              /{website.slug}
            </a>
          </div>
          <button
            type="button"
            onClick={() => setPublishSuccess(false)}
            className="shrink-0 font-semibold hover:underline"
            aria-label="Dismiss message"
          >
            Dismiss
          </button>
        </div>
      )}

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
        aria-label="Website page editor"
      >
        {!activePageId ? (
          <div className="flex h-full items-center justify-center p-6">
            <p className="text-sm text-gray-500">
              Select a page to start editing.
            </p>
          </div>
        ) : (
          <div className="h-full min-h-0 min-w-0 overflow-hidden">
            <PuckEditorClient
              key={`puck-web-${website.id}-${activePageId}`}
              websiteId={website.id}
              pageId={activePageId}
              pages={sortedPages}
              templateName={website.name}
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
