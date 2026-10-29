"use client";

import { useEffect, useMemo, useState } from "react";
import TemplateCard from "@/components/TemplateCard";
import HomeHeader from "@/components/home/Header";
import { createWebsite } from "@/app/templates/actions";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/"
).replace(/\/?$/, "/");

function normalizeCategory(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function matchesCategory(template, category) {
  if (!category) return true;

  if (template.categoryId && category.id) {
    return template.categoryId === category.id;
  }

  const legacyCategory = normalizeCategory(template.category);
  return [category.slug, category.name].some(
    (value) => normalizeCategory(value) === legacyCategory
  );
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Scratch Canvas Modal state
  const [scratchModalOpen, setScratchModalOpen] = useState(false);
  const [isCreatingScratch, setIsCreatingScratch] = useState(false);
  const [scratchError, setScratchError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [categoriesResponse, templatesResponse] = await Promise.all([
          fetch(`${API_URL}categories`, { cache: "no-store" }),
          fetch(`${API_URL}templates`, { cache: "no-store" }),
        ]);

        if (!categoriesResponse.ok) {
          throw new Error("Failed to load website categories.");
        }

        if (!templatesResponse.ok) {
          throw new Error("Failed to load templates.");
        }

        const [categoriesResult, templatesResult] = await Promise.all([
          categoriesResponse.json(),
          templatesResponse.json(),
        ]);

        const categoryData = Array.isArray(categoriesResult)
          ? categoriesResult
          : categoriesResult.data;

        const templateData = Array.isArray(templatesResult)
          ? templatesResult
          : templatesResult.data;

        if (!Array.isArray(categoryData) || !Array.isArray(templateData)) {
          throw new Error("The API returned an unexpected response.");
        }

        if (!cancelled) {
          setCategories(categoryData);
          setTemplates(templateData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load website options.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCategory = useMemo(() => {
    if (selectedCategoryId === "all") return null;
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Category filter
      if (selectedCategoryId !== "all" && selectedCategory) {
        if (!matchesCategory(template, selectedCategory)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = (template.name || "").toLowerCase().includes(query);
        const descMatch = (template.description || "")
          .toLowerCase()
          .includes(query);
        const catMatch = (template.category || "").toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }

      return true;
    });
  }, [templates, selectedCategoryId, selectedCategory, searchQuery]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts = { all: templates.length };
    for (const cat of categories) {
      counts[cat.id] = templates.filter((t) => matchesCategory(t, cat)).length;
    }
    return counts;
  }, [categories, templates]);

  const handleScratchSubmit = () => {
    setIsCreatingScratch(true);
    setScratchError("");
  };

  return (
    <>
      <HomeHeader />

      <main className="min-h-screen bg-slate-50/60 pb-24 selection:bg-indigo-500 selection:text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-gray-200/60 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 pt-16 pb-14 px-5 sm:px-8">
          {/* Subtle grid background accent */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-sm">
                <span className="flex size-2 rounded-full bg-indigo-600 animate-pulse" />
                Visual Website Builder
              </div>

              {/* Main Headline */}
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-950 sm:text-6xl">
                Build your website{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
                  your way
                </span>
              </h1>

              {/* Description */}
              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                Choose from our pre-built responsive templates to get started in seconds,
                or create a blank canvas to design completely from scratch.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setScratchModalOpen(true)}
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-950/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
                >
                  <span className="flex size-5 items-center justify-center rounded-lg bg-white/20 text-white transition group-hover:rotate-90">
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                  Create Website from Scratch
                </button>

                <a
                  href="#templates-grid"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 hover:border-gray-400 focus:outline-none"
                >
                  Browse Templates
                  <svg className="size-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>

              {/* Value Props Bar */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5">
                  <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Responsive by default</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Drag & Drop Puck Engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Instant Custom Domain Publishing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Explorer Container */}
        <div id="templates-grid" className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
          {/* Controls Bar: Search & Category Tabs */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategoryId("all")}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  selectedCategoryId === "all"
                    ? "bg-gray-950 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span>All Templates</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    selectedCategoryId === "all"
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {categoryCounts.all || 0}
                </span>
              </button>

              {categories.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-gray-950 text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span>{cat.icon || "📁"}</span>
                    <span>{cat.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-9 pr-8 text-xs text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Error Banner if any */}
          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
              <h3 className="font-semibold text-sm">Failed to connect to template inventory</h3>
              <p className="mt-1 text-xs">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-lg bg-gray-950 px-3.5 py-1.5 text-xs font-semibold text-white"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="aspect-[16/10] w-full rounded-xl bg-gray-200" />
                  <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-full rounded bg-gray-100" />
                  <div className="mt-6 flex gap-3">
                    <div className="h-9 flex-1 rounded-xl bg-gray-200" />
                    <div className="h-9 flex-1 rounded-xl bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Template Grid */}
          {!loading && !error && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card #1: Permanent "Start from Scratch" Canvas Card */}
              <div
                onClick={() => setScratchModalOpen(true)}
                className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border-2 border-dashed border-indigo-300/80 bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/30 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 transition duration-300 group-hover:scale-110">
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                      Blank Canvas
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold tracking-tight text-gray-950">
                    Start from Scratch
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
                    Open an empty editor canvas with full responsive breakpoints.
                    Drag & drop sections, blocks, headers, and media with zero constraints.
                  </p>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between rounded-xl bg-indigo-600/10 px-4 py-3 text-xs font-semibold text-indigo-900 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <span>Create Blank Website</span>
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </div>
                </div>
              </div>

              {/* Render Existing Templates */}
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}

          {/* Empty Search/Filter State */}
          {!loading && !error && filteredTemplates.length === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gray-100 text-xl">
                🔍
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-950">
                No templates matched your criteria
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {searchQuery
                  ? `No templates matching "${searchQuery}". Try a different keyword.`
                  : "There are no templates in this category right now."}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Clear Search
                  </button>
                )}
                {selectedCategoryId !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryId("all")}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    View All Templates
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setScratchModalOpen(true)}
                  className="rounded-xl bg-gray-950 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                >
                  Create from Scratch Instead
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* "Create Website from Scratch" Modal */}
      {scratchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-gray-100 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-950">
                    Create from Scratch
                  </h2>
                  <p className="text-xs text-gray-500">
                    Launch a clean canvas with visual drag-and-drop components.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Form */}
            <form action={createWebsite} onSubmit={handleScratchSubmit} className="p-6 space-y-5">
              <input type="hidden" name="templateId" value="scratch" />

              {scratchError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {scratchError}
                </div>
              )}

              <div>
                <label
                  htmlFor="scratch-website-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  Website Name
                </label>
                <input
                  id="scratch-website-name"
                  name="name"
                  type="text"
                  placeholder="e.g. My Portfolio, Quantum Studio"
                  required
                  autoFocus
                  disabled={isCreatingScratch}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 disabled:bg-gray-100"
                />
                <p className="mt-1.5 text-[11px] text-gray-500">
                  You can change the name, slug, and responsive settings anytime inside the editor.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setScratchModalOpen(false)}
                  disabled={isCreatingScratch}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreatingScratch}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {isCreatingScratch ? (
                    <>
                      <svg className="size-3.5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Opening Canvas...
                    </>
                  ) : (
                    <>
                      Open Canvas
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
