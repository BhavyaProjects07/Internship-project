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

function ExternalIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
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

function CopyIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function GlobeIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

  // Production Publish Dialog state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [customSlugInput, setCustomSlugInput] = useState(website?.slug || "");
  const [slugUpdating, setSlugUpdating] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [slugSuccess, setSlugSuccess] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPageKey, setCopiedPageKey] = useState("");

  const websiteId = website?.id;

  // Keep customSlugInput in sync with website.slug
  useEffect(() => {
    if (website?.slug) {
      setCustomSlugInput(website.slug);
    }
  }, [website?.slug]);

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

  const activePage = useMemo(() => {
    return (
      sortedPages.find((page) => page.id === activePageId) ||
      sortedPages[0] ||
      null
    );
  }, [sortedPages, activePageId]);

  const switchActivePage = useCallback(
    (pageId) => {
      setActivePageId(pageId);
      if (typeof window !== "undefined" && websiteId) {
        try {
          sessionStorage.setItem(`active_page_${websiteId}`, pageId);
          const url = new URL(window.location.href);
          url.searchParams.set("pageId", pageId);
          window.history.replaceState({}, "", url.toString());
        } catch {
          // ignore session storage errors
        }
      }
    },
    [websiteId]
  );

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
      });

      if (!response.ok) return;

      const result = await response.json();
      if (result?.data) {
        setWebsite(result.data);
      }
    } catch {
      // refresh is best-effort
    }
  }, [websiteId, getToken]);

  const runPageAction = useCallback(async (action) => {
    setPageActionError("");
    setPageActionLoading(true);

    try {
      await action();
    } catch (err) {
      setPageActionError(
        err instanceof Error ? err.message : "Failed to update pages"
      );
    } finally {
      setPageActionLoading(false);
    }
  }, []);

  const requestPageAction = useCallback(
    async (endpoint, method = "GET", body = null) => {
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

      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || `Page action failed (HTTP ${response.status}).`
        );
      }

      return result;
    },
    [getToken]
  );

  const createPage = useCallback(async () => {
    if (!websiteId) return;

    const name = window.prompt("Enter new page title:");
    if (!name || !name.trim()) return;

    void runPageAction(async () => {
      const result = await requestPageAction(
        `/websites/${encodeURIComponent(websiteId)}/pages`,
        "POST",
        { name: name.trim() }
      );

      await refreshWebsite();

      if (result?.data?.id) {
        switchActivePage(result.data.id);
      }
    });
  }, [websiteId, runPageAction, requestPageAction, refreshWebsite, switchActivePage]);

  const renamePage = useCallback(async () => {
    if (!activePage?.id) return;

    const nextName = window.prompt("Enter new page title:", activePage.name || "");
    if (!nextName || !nextName.trim() || nextName.trim() === activePage.name) {
      return;
    }

    void runPageAction(async () => {
      await requestPageAction(
        `/websites/pages/${encodeURIComponent(activePage.id)}`,
        "PATCH",
        { name: nextName.trim() }
      );

      await refreshWebsite();
    });
  }, [activePage, runPageAction, requestPageAction, refreshWebsite]);

  const duplicatePage = useCallback(async () => {
    if (!activePage?.id) return;

    void runPageAction(async () => {
      const result = await requestPageAction(
        `/websites/pages/${encodeURIComponent(activePage.id)}/duplicate`,
        "POST"
      );

      await refreshWebsite();

      if (result?.data?.id) {
        switchActivePage(result.data.id);
      }
    });
  }, [activePage, runPageAction, requestPageAction, refreshWebsite, switchActivePage]);

  const deletePage = useCallback(async () => {
    if (!activePage?.id) return;

    if (sortedPages.length <= 1) {
      setPageActionError("A website must have at least one page.");
      return;
    }

    const confirmed = window.confirm(
      `Delete page "${activePage.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    void runPageAction(async () => {
      await requestPageAction(
        `/websites/pages/${encodeURIComponent(activePage.id)}`,
        "DELETE"
      );

      const remainingPages = sortedPages.filter((p) => p.id !== activePage.id);
      if (remainingPages.length > 0) {
        switchActivePage(remainingPages[0].id);
      }

      await refreshWebsite();
    });
  }, [activePage, sortedPages, runPageAction, requestPageAction, refreshWebsite, switchActivePage]);

  const movePage = useCallback(
    async (direction) => {
      if (!activePage?.id || sortedPages.length <= 1) return;

      const currentIndex = sortedPages.findIndex((p) => p.id === activePage.id);
      if (currentIndex === -1) return;

      const targetIndex = currentIndex + direction;
      if (targetIndex < 0 || targetIndex >= sortedPages.length) return;

      const pages = [...sortedPages];
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
    [activePage, sortedPages, websiteId, requestPageAction, runPageAction, refreshWebsite]
  );

  // Scalable, production-ready publish handler
  const handlePublish = useCallback(async () => {
    if (publishLoading || !websiteId) return;

    setPublishLoading(true);
    setPageActionError("");
    setSlugError("");
    setSlugSuccess("");

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
        body: JSON.stringify({}),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || `Failed to publish website (HTTP ${response.status}).`
        );
      }

      // Update local state with latest slug & published status
      setWebsite((prev) => ({
        ...prev,
        slug: result.slug,
        isPublished: true,
        publishedAt: result.publishedAt,
      }));
      setCustomSlugInput(result.slug);

      // Open the production publish modal
      setIsPublishModalOpen(true);
      await refreshWebsite();
    } catch (err) {
      setPageActionError(
        err instanceof Error ? err.message : "Failed to publish website."
      );
    } finally {
      setPublishLoading(false);
    }
  }, [publishLoading, websiteId, getToken, refreshWebsite]);

  // Scalable slug update handler
  const handleUpdateSlug = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (slugUpdating || !websiteId) return;

      const cleanInput = (customSlugInput || "").trim().toLowerCase();
      if (!cleanInput) {
        setSlugError("Website slug cannot be empty.");
        return;
      }

      const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugPattern.test(cleanInput)) {
        setSlugError(
          "Slug can only contain lowercase letters, numbers, and single hyphens without consecutive hyphens."
        );
        return;
      }

      setSlugUpdating(true);
      setSlugError("");
      setSlugSuccess("");

      try {
        let token = null;
        try {
          token = await getToken();
        } catch {
          token = null;
        }

        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/websites/${encodeURIComponent(websiteId)}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ slug: cleanInput }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
          throw new Error(result?.message || "Failed to update slug");
        }

        const updatedSlug = result.data?.slug || cleanInput;
        setWebsite((prev) => ({ ...prev, slug: updatedSlug }));
        setCustomSlugInput(updatedSlug);
        setSlugSuccess(`URL slug updated successfully to "/${updatedSlug}"!`);
        await refreshWebsite();
      } catch (err) {
        setSlugError(
          err instanceof Error ? err.message : "Failed to update website slug."
        );
      } finally {
        setSlugUpdating(false);
      }
    },
    [slugUpdating, websiteId, customSlugInput, getToken, refreshWebsite]
  );

  // Copy link helper
  const handleCopyUrl = useCallback(async (urlToCopy, key = "main") => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      if (key === "main") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      } else {
        setCopiedPageKey(key);
        setTimeout(() => setCopiedPageKey(""), 2200);
      }
    } catch {
      // Fallback copy
      const input = document.createElement("input");
      input.value = urlToCopy;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      if (key === "main") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      } else {
        setCopiedPageKey(key);
        setTimeout(() => setCopiedPageKey(""), 2200);
      }
    }
  }, []);

  const exitToWebsites = useCallback(() => {
    router.push("/websites");
  }, [router]);

  // Public live domain calculation
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const mainPublicUrl = website?.slug ? `${origin}/${website.slug}` : "";
  const currentPreviewUrl =
    website?.slug
      ? activePage?.slug && activePage.slug !== "home"
        ? `/${website.slug}/${activePage.slug}`
        : `/${website.slug}`
      : "#";

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
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(true)}
                  title="Click to view live site details"
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 transition hover:bg-emerald-100 cursor-pointer"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
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
            className="rounded-xl border border-gray-200 bg-white px-2.5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ↑
          </button>

          <button
            type="button"
            onClick={() => movePage(1)}
            disabled={
              pageActionLoading ||
              !activePage ||
              sortedPages[sortedPages.length - 1]?.id === activePage.id
            }
            title="Move page down"
            className="rounded-xl border border-gray-200 bg-white px-2.5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          {website.isPublished ? (
            <a
              href={currentPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open public website in a new tab"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <span>Visit Live</span>
              <ExternalIcon />
            </a>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              title="Publish website to generate live URL"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <span>Preview</span>
              <ExternalIcon />
            </button>
          )}

          {/* Publish Website Button */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishLoading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <RocketIcon />
            <span>
              {publishLoading
                ? "Publishing…"
                : website.isPublished
                ? "Update / Publish"
                : "Publish Website"}
            </span>
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

      {/* Puck Visual Canvas */}
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
              websiteSlug={website.slug}
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

      {/* Production-Grade Publish Success & Slug Manager Modal */}
      {isPublishModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-6 text-white relative">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition"
                aria-label="Close publish dialog"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-300 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Published & Live
                </span>
              </div>

              <h2 className="mt-2 text-2xl font-black text-white">
                🎉 Your Website is Live!
              </h2>
              <p className="mt-1 text-sm text-emerald-100">
                Your changes have been compiled and published under your unique production slug.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Primary URL card */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-2">
                  <span className="flex items-center gap-1.5">
                    <GlobeIcon className="h-4 w-4 text-emerald-600" />
                    Live Website URL
                  </span>
                  <span className="font-mono text-[11px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    Slug ID: {website.slug}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3.5 py-2.5 text-sm font-mono text-gray-900 shadow-inner">
                  <span className="truncate select-all">{mainPublicUrl}</span>
                </div>

                <div className="mt-3 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(mainPublicUrl, "main")}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50 active:scale-[0.98]"
                  >
                    {copiedLink ? (
                      <>
                        <CheckIcon className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-700">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4 text-emerald-600" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={mainPublicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98]"
                  >
                    <span>Visit Live Site</span>
                    <ExternalIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Slug Customization Section */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="custom-slug-input" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Customize URL Slug
                  </label>
                  <span className="text-[11px] text-gray-500">
                    Production Route
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Customize the public URL for your site. Use lowercase alphanumeric characters and hyphens.
                </p>

                <form onSubmit={handleUpdateSlug} className="space-y-2">
                  <div className="flex rounded-xl border border-gray-300 bg-white overflow-hidden focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 shadow-sm">
                    <span className="flex items-center bg-gray-100 px-3 text-xs text-gray-500 font-mono select-none border-r border-gray-200">
                      {origin}/
                    </span>
                    <input
                      id="custom-slug-input"
                      type="text"
                      value={customSlugInput}
                      onChange={(e) => {
                        setCustomSlugInput(e.target.value);
                        setSlugError("");
                        setSlugSuccess("");
                      }}
                      placeholder="my-portfolio-site"
                      className="flex-1 px-3 py-2 font-mono text-sm text-gray-900 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={slugUpdating || customSlugInput.trim() === website.slug}
                      className="bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {slugUpdating ? "Saving..." : "Save Slug"}
                    </button>
                  </div>

                  {slugError && (
                    <p className="text-xs font-medium text-red-600 mt-1">
                      ⚠️ {slugError}
                    </p>
                  )}
                  {slugSuccess && (
                    <p className="text-xs font-medium text-emerald-600 mt-1">
                      ✓ {slugSuccess}
                    </p>
                  )}
                </form>
              </div>

              {/* Page breakdown links */}
              {sortedPages.length > 1 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Published Pages ({sortedPages.length})
                  </h3>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 rounded-xl border border-gray-200 bg-white p-2">
                    {sortedPages.map((page) => {
                      const isHome = page.slug === "home" || page.order === 0;
                      const pagePath = isHome
                        ? `/${website.slug}`
                        : `/${website.slug}/${page.slug || page.id}`;
                      const pageFullUrl = `${origin}${pagePath}`;
                      const isCopied = copiedPageKey === page.id;

                      return (
                        <div
                          key={page.id}
                          className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-50 transition"
                        >
                          <div className="min-w-0 flex items-center gap-2">
                            <span className="font-medium text-gray-900 truncate">
                              {page.name}
                            </span>
                            <span className="font-mono text-gray-400 truncate text-[11px]">
                              {pagePath}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(pageFullUrl, page.id)}
                              title="Copy page link"
                              className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition"
                            >
                              {isCopied ? (
                                <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <CopyIcon className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <a
                              href={pagePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View page in new tab"
                              className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition"
                            >
                              <ExternalIcon className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
              >
                Done & Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
