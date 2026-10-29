"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export default function AdminDashboardPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  // Admin permission verification
  const userEmails = (user?.emailAddresses || []).map((e) =>
    (e.emailAddress || "").toLowerCase().trim()
  );
  const primaryEmail = (user?.primaryEmailAddress?.emailAddress || "").toLowerCase().trim();
  const isAdmin =
    user?.publicMetadata?.role === "admin" ||
    primaryEmail === "laptopuse01824x@gmail.com" ||
    userEmails.includes("laptopuse01824x@gmail.com");

  const loadDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token unavailable. Please sign in.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [templatesRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/templates/admin`, { headers, cache: "no-store" }),
        fetch(`${API_URL}/categories?includeInactive=true`, {
          headers,
          cache: "no-store",
})
      ]);

      if (!templatesRes.ok) {
        throw new Error(
          templatesRes.status === 403
            ? "Admin privileges required to load templates."
            : "Failed to fetch template inventory."
        );
      }

      if (!categoriesRes.ok) {
        throw new Error(
          categoriesRes.status === 403
            ? "Admin privileges required to load categories."
            : "Failed to fetch categories inventory."
        );
      }

      const [templatesResult, categoriesResult] = await Promise.all([
        templatesRes.json().catch(() => ({})),
        categoriesRes.json().catch(() => ({})),
      ]);

      const templateList = Array.isArray(templatesResult.data)
        ? templatesResult.data
        : [];
      const categoryList = Array.isArray(categoriesResult.data)
        ? categoriesResult.data
        : [];

      setTemplates(templateList);
      setCategories(categoryList);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isLoaded && isSignedIn && isAdmin) {
      loadDashboardData();
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, isAdmin, loadDashboardData]);

  // Quick status toggle directly from the dashboard
  const handleToggleStatus = async (template) => {
    const nextStatus = template.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setTogglingId(template.id);
    setError("");

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/templates/${template.id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.message || "Failed to update status.");
      }

      setTemplates((current) =>
        current.map((t) =>
          t.id === template.id ? { ...t, status: nextStatus } : t
        )
      );

      setNotice(
        `"${template.name}" is now ${nextStatus === "PUBLISHED" ? "Live" : "Draft"}.`
      );
      setTimeout(() => setNotice(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to toggle status.");
    } finally {
      setTogglingId(null);
    }
  };

  // 1. Loading State
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm font-medium text-slate-300">
            Initializing Admin Hub…
          </span>
        </div>
      </div>
    );
  }

  // 2. Authentication Required
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-800/80 p-8 shadow-xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Admin Authentication Required</h2>
          <p className="mt-2 text-sm text-slate-400">
            Please sign in with your administrative account to access the SiteBuilder control panel.
          </p>
          <div className="mt-6">
            <Link
              href="/sign-in?redirect_url=/admin"
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Sign In to Continue →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized User
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-900/50 bg-slate-800/80 p-8 shadow-xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="mt-2 text-sm text-slate-400">
            Your account ({primaryEmail || "authenticated user"}) does not have administrative privileges.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Return Home
            </Link>
            <Link
              href="/templates"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Computed Metrics
  const publishedCount = templates.filter((t) => t.status === "PUBLISHED").length;
  const draftCount = templates.filter((t) => t.status === "DRAFT").length;
  const activeCategoriesCount = categories.filter((c) => c.isActive !== false).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/25 transition-transform group-hover:scale-105">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49L5.347 11.23a7.842 7.842 0 011.666-.184c.85 0 1.25.13 1.25.13l2.84 8.283c.307.094.63.141.96.141.252 0 .497-.03.738-.088l2.91-8.336s.44.053 1.13.053c.123 0 .256-.002.396-.007L13.82 21.05C18.17 19.82 22 16.14 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white">SiteBuilder</span>
                <span className="-mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-400">Admin Hub</span>
              </div>
            </Link>

            <span className="hidden h-5 w-px bg-slate-800 md:block" />

            <nav className="hidden items-center gap-1.5 md:flex">
              <span className="rounded-lg bg-blue-900/40 px-3 py-1.5 text-xs font-semibold text-blue-300 ring-1 ring-blue-500/30">
                Dashboard Overview
              </span>
              <Link
                href="/admin/templates"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Templates
              </Link>
              <Link
                href="/admin/categories"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Categories
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadDashboardData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 shadow-sm transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
            >
              <svg
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? "Refreshing…" : "Sync"}</span>
            </button>

            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white sm:inline-flex"
            >
              <span>View Site</span>
              <span className="text-[10px]">↗</span>
            </Link>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/90 px-3 py-1.5">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "Admin"}
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-blue-500"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  A
                </div>
              )}
              <span className="hidden max-w-[140px] truncate text-xs font-medium text-slate-200 sm:inline">
                {primaryEmail}
              </span>
              <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-400">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Flash Notifications */}
        {notice && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-300 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">✓</span>
              <span>{notice}</span>
            </div>
            <button
              onClick={() => setNotice("")}
              className="text-xs text-emerald-400/80 hover:text-emerald-200"
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm font-medium text-rose-300 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-xs">!</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="text-xs text-rose-400/80 hover:text-rose-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dashboard Title & Overview */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Control Panel & System Hub
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Welcome back, <span className="font-semibold text-slate-200">{user?.firstName || "Admin"}</span>. Manage your platform categories, website templates, and visual Gutenberg block canvas.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/templates/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Template</span>
            </Link>
          </div>
        </div>

        {/* Quick KPI Metrics */}
        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Metric 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Templates</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                📑
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{templates.length}</span>
              <span className="text-xs text-slate-400">total items</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                {publishedCount} Published
              </span>
              <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
                {draftCount} Drafts
              </span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                📁
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{categories.length}</span>
              <span className="text-xs text-slate-400">configured</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-400">
                {activeCategoriesCount} Active in Explorer
              </span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Editor Engine</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                ⚡
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg font-bold text-white">Puck 2.0</span>
              <span className="text-xs text-emerald-400">FSE Ready</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 truncate">
              Dynamic Navbar, Footer, FlexColumns & FreeBox
            </p>
          </div>

          {/* Metric 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security & Auth</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                🛡️
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg font-bold text-white">Clerk RBAC</span>
              <span className="text-xs text-emerald-400">Protected</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 truncate">
              Admin: {primaryEmail}
            </p>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CORE CONNECTED SECTIONS: CATEGORIES & TEMPLATES           */}
        {/* ======================================================== */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          {/* Card A: Templates Directory Connect */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/30 p-7 shadow-lg transition hover:border-blue-500/40 group">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
                {templates.length} Templates
              </span>
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                Templates Management
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Browse, search, and assign categories to templates. Publish live to the website builder or move to draft status with one click.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
              <Link
                href="/admin/templates"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500"
              >
                <span>Manage Templates</span>
                <span>→</span>
              </Link>
              <Link
                href="/admin/templates/new"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                <span>+ New Canvas</span>
              </Link>
            </div>
          </div>

          {/* Card B: Categories Manager Connect */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/30 p-7 shadow-lg transition hover:border-purple-500/40 group">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400 ring-1 ring-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 ring-1 ring-purple-500/20">
                {categories.length} Categories
              </span>
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                Categories Architecture
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Organize template taxonomy (SaaS, Agency, E-commerce, Portfolio, Blog). Configure icons, thumbnails, slugs, and display sorting.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
              <Link
                href="/admin/categories"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-purple-500"
              >
                <span>Manage Categories</span>
                <span>→</span>
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                <span>Preview Public Filter</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* RECENT TEMPLATES WITH QUICK PUCK EDITOR ACCESS            */}
        {/* ======================================================== */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm mb-10">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Active Template Catalog</h3>
              <p className="text-xs text-slate-400">
                Quickly open templates in the Puck Studio editor or toggle publish state.
              </p>
            </div>

            <Link
              href="/admin/templates"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              View all {templates.length} templates →
            </Link>
          </div>

          {templates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
              <p className="text-sm font-medium text-slate-400">No templates found in system.</p>
              <Link
                href="/admin/templates/new"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                + Create First Template
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                    <th scope="col" className="pb-3 font-semibold">Template</th>
                    <th scope="col" className="pb-3 font-semibold">Category</th>
                    <th scope="col" className="pb-3 font-semibold">Status</th>
                    <th scope="col" className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {templates.slice(0, 6).map((template) => {
                    const isPublished = template.status === "PUBLISHED";
                    const isToggling = togglingId === template.id;

                    return (
                      <tr key={template.id} className="group transition hover:bg-slate-850/50">
                        {/* Name & Thumbnail */}
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800 border border-slate-700/60">
                              {template.thumbnail ? (
                                <img
                                  src={template.thumbnail}
                                  alt={template.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xs text-slate-500">🎨</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-white group-hover:text-blue-300 transition-colors">
                                {template.name}
                              </p>
                              <p className="truncate text-xs text-slate-400 max-w-[280px]">
                                {template.description || "No description provided."}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-700/50">
                            {template.websiteCategory?.name || template.category || "Unassigned"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(template)}
                            disabled={isToggling}
                            title="Click to toggle status"
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition active:scale-95 ${
                              isPublished
                                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 hover:bg-amber-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isPublished ? "bg-emerald-400" : "bg-amber-400"
                              }`}
                            />
                            <span>{isToggling ? "Updating…" : isPublished ? "Published" : "Draft"}</span>
                          </button>
                        </td>

                        {/* Quick Actions */}
                        <td className="py-3.5 pl-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/admin/templates/${template.id}/editor`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Visual Editor</span>
                            </Link>

                            <Link
                              href="/admin/templates"
                              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
                              title="More template settings"
                            >
                              ⚙
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* QUICK CATEGORIES OVERVIEW GRID                           */}
        {/* ======================================================== */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-white">Configured Categories</h3>
              <p className="text-xs text-slate-400">
                Explore template categories currently active in the user website builder.
              </p>
            </div>
            <Link
              href="/admin/categories"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              Manage all categories →
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-850/60 p-3.5 transition hover:border-slate-700 hover:bg-slate-800"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-lg border border-slate-700/60">
                  {category.icon || "📁"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">{category.name}</p>
                  <p className="truncate text-[11px] text-slate-400">/{category.slug}</p>
                </div>
                <span
                  className={`h-2 w-2 rounded-full ${
                    category.isActive !== false ? "bg-emerald-400" : "bg-slate-600"
                  }`}
                  title={category.isActive !== false ? "Active" : "Inactive"}
                />
              </div>
            ))}

            <Link
              href="/admin/categories"
              className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-800 p-3.5 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:text-white"
            >
              <span>+ Add / Edit Category</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

