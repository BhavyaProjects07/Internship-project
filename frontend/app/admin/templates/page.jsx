
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export default function AdminTemplatesPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const request = useCallback(
    async (path, options = {}) => {
      const headers = { ...options.headers };

      if (options.body) {
        headers["Content-Type"] = "application/json";
      }

      if (options.protected) {
        const token = await getToken();

        if (!token) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        headers.Authorization = `Bearer ${token}`;
      }

      const normalizedPath = path.replace(/^\/+/, "");

const response = await fetch(`${API_URL}/${normalizedPath}`, {
        ...options,
        headers,
        cache: "no-store",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in again to continue.");
        }

        if (response.status === 403) {
          throw new Error("Admin access is required for this action.");
        }

        throw new Error(result.message || "The request failed.");
      }

      return result;
    },
    [getToken]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [templateResult, categoryResult] = await Promise.all([
        request("templates/admin" ,{ protected: true}),
        request("categories"),
      ]);

      const templateData = templateResult.data;
      const categoryData = categoryResult.data;

      if (!Array.isArray(templateData) || !Array.isArray(categoryData)) {
        throw new Error("The API returned an unexpected response.");
      }

      setTemplates(templateData);
      setCategories(categoryData);

      const initialAssignments = {};

      for (const template of templateData) {
        initialAssignments[template.id] =
          template.categoryId ||
          template.websiteCategory?.id ||
          "";
      }

      setAssignments(initialAssignments);
    } catch (err) {
      setError(err.message || "Failed to load templates.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadData();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, loadData]);

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesSearch =
        !query ||
        template.name?.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query);

      const selectedId = assignments[template.id] || "";

      const matchesCategory =
        categoryFilter === "all" ||
        (categoryFilter === "unassigned" && !selectedId) ||
        selectedId === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [templates, assignments, search, categoryFilter]);

  async function saveAssignment(template) {
    const categoryId = assignments[template.id] || null;

    setSavingId(template.id);
    setError("");
    setNotice("");

    try {
      const result = await request(
        `templates/${template.id}/category`,
        {
          method: "PATCH",
          protected: true,
          body: JSON.stringify({ categoryId }),
        }
      );

      const updatedTemplate = result.data;

      setTemplates((current) =>
        current.map((item) =>
          item.id === template.id
            ? {
                ...item,
                categoryId: updatedTemplate.categoryId,
                websiteCategory: updatedTemplate.websiteCategory,
              }
            : item
        )
      );

      setAssignments((current) => ({
        ...current,
        [template.id]: updatedTemplate.categoryId || "",
      }));

      setNotice(
        result.message ||
          `Category assignment saved for ${template.name}.`
      );
    } catch (err) {
      setError(err.message || "Failed to save category assignment.");

      // Restore the selection to the last saved value.
      setAssignments((current) => ({
        ...current,
        [template.id]:
          template.categoryId ||
          template.websiteCategory?.id ||
          "",
      }));
    } finally {
      setSavingId(null);
    }
  }


  async function toggleTemplateStatus(template) {
  const isPublished = template.status === "PUBLISHED";
  const nextStatus = isPublished ? "DRAFT" : "PUBLISHED";

  setSavingId(template.id);
  setError("");
  setNotice("");

  try {
    const result = await request(`templates/${template.id}/status`, {
      method: "PATCH",
      protected: true,
      body: JSON.stringify({ status: nextStatus }),
    });

    const updatedTemplate = result.data;

    setTemplates((current) =>
      current.map((item) =>
        item.id === template.id
          ? { ...item, ...updatedTemplate }
          : item
      )
    );

    setNotice(
      result.message ||
        `${template.name} ${
          nextStatus === "PUBLISHED" ? "published" : "moved to drafts"
        } successfully.`
    );
  } catch (err) {
    setError(err.message || "Failed to update template status.");
  } finally {
    setSavingId(null);
  }
}

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl text-sm text-gray-600">
          Loading template management…
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-2xl font-bold text-gray-950">
          Admin sign-in required
        </h1>
        <p className="mt-3 text-gray-600">
          Sign in to manage template categories.
        </p>
        <a
          href="/sign-in"
          className="mt-6 inline-flex rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Sign in
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            SiteBuilder administration
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Template management
          </h1>

          <a
  href="/admin/templates/new"
  className="inline-flex items-center rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
>
  + Create template
</a>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            Assign each template to a category. These assignments control
            which templates users see when choosing a website category.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {notice}
          </div>
        )}

        <section className="mb-7 grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Total templates</p>
            <p className="mt-1 text-2xl font-bold text-gray-950">
              {templates.length}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Assigned templates</p>
            <p className="mt-1 text-2xl font-bold text-gray-950">
              {
                templates.filter(
                  (template) =>
                    template.categoryId ||
                    template.websiteCategory?.id
                ).length
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Unassigned templates</p>
            <p className="mt-1 text-2xl font-bold text-gray-950">
              {
                templates.filter(
                  (template) =>
                    !template.categoryId &&
                    !template.websiteCategory?.id
                ).length
              }
            </p>
          </div>
        </section>

        <section className="mb-7 grid gap-4 sm:grid-cols-[1fr_260px]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search templates by name or description…"
            aria-label="Search templates"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filter templates by category"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
          >
            <option value="all">All templates</option>
            <option value="unassigned">Unassigned templates</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </section>

        {templates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <h2 className="font-semibold text-gray-950">
              No templates found
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create or seed a template before assigning its category.
            </p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="font-semibold text-gray-950">
              No matching templates
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Try changing your search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => {
              const savedCategoryId =
                template.categoryId ||
                template.websiteCategory?.id ||
                "";

              const selectedCategoryId =
                assignments[template.id] ?? savedCategoryId;

              const changed = selectedCategoryId !== savedCategoryId;
              const selectedCategory = categories.find(
                (category) => category.id === selectedCategoryId
              );

              return (
                <article
                  key={template.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    {template.thumbnail ? (
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 text-sm text-white">
                        Template Preview
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-800 backdrop-blur">
                      {selectedCategory?.name ||
                        template.websiteCategory?.name ||
                        template.category ||
                        "Unassigned"}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
  <div>
    <h2 className="text-lg font-semibold text-gray-950">
      {template.name}
    </h2>

    <span
      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        template.status === "PUBLISHED"
          ? "bg-green-100 text-green-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {template.status === "PUBLISHED" ? "Published" : "Draft"}
    </span>
  </div>

  {changed && (
    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
      Unsaved
    </span>
  )}
                    </div>

                    <p className="mt-2 min-h-10 text-sm leading-5 text-gray-600">
                      {template.description || "No description provided."}
                    </p>

                    <label className="mt-5 block text-sm font-medium text-gray-800">
                      Assign category
                      <select
                        value={selectedCategoryId}
                        onChange={(event) =>
                          setAssignments((current) => ({
                            ...current,
                            [template.id]: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                      >
                        <option value="">Unassigned</option>
                        {categories.map((category) => (
                          <option
                            key={category.id}
                            value={category.id}
                            disabled={!category.isActive}
                          >
                            {category.name}
                            {!category.isActive ? " (Inactive)" : ""}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <a
                        href={`/templates/${template.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-gray-950"
                      >
                        Preview template
                      </a>

                      
                      <a
                        href={`/admin/templates/${template.id}/editor`}
                        className="inline-flex items-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                      >
                        Edit template
                      </a>


                      <button
                        type="button"
                        disabled={savingId === template.id}
                        onClick={() => toggleTemplateStatus(template)}
                        className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          template.status === "PUBLISHED"
                            ? "bg-amber-600 hover:bg-amber-700"
                            : "bg-green-700 hover:bg-green-800"
                        }`}
                      >
                        {savingId === template.id
                          ? "Updating…"
                          : template.status === "PUBLISHED"
                            ? "Unpublish template"
                            : "Publish template"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          !changed || savingId === template.id
                        }
                        onClick={() => saveAssignment(template)}
                        className="rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {savingId === template.id
                          ? "Saving…"
                          : "Save assignment"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={loading || savingId !== null}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Refresh templates
          </button>

          <a
            href="/admin/categories"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Manage categories
          </a>

          <a
            href="/templates"
            className="rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            View template selection
          </a>
        </div>
      </div>
    </main>
  );
}
