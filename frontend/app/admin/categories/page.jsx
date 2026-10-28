"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import MediaInput from "@/components/media/MediaInput";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/"
).replace(/\/?$/, "/");

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  thumbnail: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminCategoriesPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const request = useCallback(
    async (path, options = {}) => {
      const token = await getToken();

      if (!token) {
        throw new Error(
          "Your session could not be verified. Please sign in again."
        );
      }

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        cache: "no-store",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to continue.");
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

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Correct endpoint: /categories, not /categories/admin
      const result = await request(
        "categories?includeInactive=true"
      );

      setCategories(
        Array.isArray(result.data) ? result.data : []
      );
    } catch (err) {
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadCategories();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, loadCategories]);

  const filteredCategories = categories.filter((category) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      [category.name, category.slug, category.description]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(query)
        );

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && category.isActive) ||
      (statusFilter === "inactive" && !category.isActive);

    return matchesSearch && matchesStatus;
  });

  const activeCount = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCount = categories.length - activeCount;

  const templateCount = categories.reduce(
    (total, category) =>
      total + (category._count?.templates ?? 0),
    0
  );

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "sortOrder"
            ? value === ""
              ? 0
              : Number(value)
            : value,
    }));
  }

  function startEditing(category) {
    setEditingId(category.id);

    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      icon: category.icon || "",
      thumbnail: category.thumbnail || "",
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive ?? true,
    });

    setError("");
    setNotice("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError("");
    setNotice("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        icon: form.icon.trim() || null,
        thumbnail: form.thumbnail.trim() || null,
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive,
      };

      if (!payload.name) {
        throw new Error("Category name is required.");
      }

      if (!Number.isInteger(payload.sortOrder)) {
        throw new Error(
          "Display order must be a whole number."
        );
      }

      const wasEditing = Boolean(editingId);

      const result = await request(
        wasEditing
          ? `categories/${editingId}`
          : "categories",
        {
          method: wasEditing ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        }
      );

      resetForm();

      await loadCategories();

      setNotice(
        result.message ||
          (wasEditing
            ? "Category updated successfully."
            : "Category created successfully.")
      );
    } catch (err) {
      setError(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(category) {
    setError("");
    setNotice("");

    try {
      const result = await request(
        `categories/${category.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive: !category.isActive,
          }),
        }
      );

      await loadCategories();

      setNotice(
        result.message || "Category status updated."
      );
    } catch (err) {
      setError(
        err.message || "Failed to update category status."
      );
    }
  }

  async function deleteCategory(category) {
    const count = category._count?.templates ?? 0;

    if (count > 0) {
      window.alert(
        `"${category.name}" has ${count} assigned template(s). Reassign those templates before deleting this category.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const result = await request(
        `categories/${category.id}`,
        {
          method: "DELETE",
        }
      );

      if (editingId === category.id) {
        resetForm();
      }

      await loadCategories();

      setNotice(
        result.message || "Category deleted successfully."
      );
    } catch (err) {
      setError(err.message || "Failed to delete category.");
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  const secondaryButtonClass =
    "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

  if (!isLoaded || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <div className="mx-auto size-9 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          <p className="mt-4 text-sm text-slate-600">
            Loading category management...
          </p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Admin sign-in required
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Sign in with your account to manage website categories.
          </p>

          <a
            href="/sign-in"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Sign in
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 text-slate-900 sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <a
              href="/admin"
              className="transition hover:text-indigo-600"
            >
              ← Admin Dashboard
            </a>

            <span>/</span>

            <span className="font-semibold text-slate-900">
              Categories
            </span>
          </nav>

          <a
            href="/admin/templates"
            className={secondaryButtonClass}
          >
            Templates Directory
            <span className="ml-2">→</span>
          </a>
        </div>

        {/* Page heading */}
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">
            SiteBuilder administration
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Website categories
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Manage the categories users see when creating a website.
                Organize your categories, control visibility, and manage
                template assignments.
              </p>
            </div>

            <button
              type="button"
              onClick={loadCategories}
              disabled={loading}
              className={secondaryButtonClass}
            >
              ↻ Refresh data
            </button>
          </div>
        </header>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <span className="font-bold">!</span>
            <p>{error}</p>
          </div>
        )}

        {/* Success message */}
        {notice && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
              ✓
            </span>

            <div>
              <p className="font-semibold">Success</p>
              <p className="mt-1">{notice}</p>
            </div>
          </div>
        )}

        {/* Overview cards */}
        <section
          aria-label="Category overview"
          className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {[
            {
              label: "Total categories",
              value: categories.length,
              detail: "All configured categories",
              icon: "▦",
            },
            {
              label: "Active",
              value: activeCount,
              detail: "Visible to website creators",
              icon: "✓",
            },
            {
              label: "Inactive",
              value: inactiveCount,
              detail: "Hidden from creators",
              icon: "◷",
            },
            {
              label: "Template assignments",
              value: templateCount,
              detail: "Across all categories",
              icon: "▤",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>

                <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                  {item.icon}
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {item.value}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {item.detail}
              </p>
            </div>
          ))}
        </section>

        {/* Create / edit form */}
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Category management
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                {editingId ? "Edit category" : "Create a category"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Give each category a clear name and a unique URL slug.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className={secondaryButtonClass}
              >
                Cancel editing
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-x-6 gap-y-5 sm:grid-cols-2"
          >
            <label className="block text-sm font-semibold text-slate-700">
              Category name <span className="text-red-500">*</span>

              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Portfolio"
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              URL slug

              <input
                name="slug"
                value={form.slug}
                onChange={updateField}
                placeholder="portfolio (generated if empty)"
                className={inputClass}
              />

              <span className="mt-1.5 block text-xs font-normal text-slate-500">
                Used to identify the category consistently.
              </span>
            </label>

            <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
              Description

              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={3}
                placeholder="Describe the types of websites in this category."
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Icon or emoji

              <input
                name="icon"
                value={form.icon}
                onChange={updateField}
                placeholder="e.g. 🎨"
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Display order

              <input
                name="sortOrder"
                type="number"
                step="1"
                value={form.sortOrder}
                onChange={updateField}
                className={inputClass}
              />

              <span className="mt-1.5 block text-xs font-normal text-slate-500">
                Lower numbers appear first.
              </span>
            </label>

            <div className="sm:col-span-2">
              <MediaInput
                label="Category thumbnail"
                value={form.thumbnail}
                onChange={(url) =>
                  setForm((current) => ({
                    ...current,
                    thumbnail: url,
                  }))
                }
                placeholder="https://... or upload/choose from library"
                description="Image displayed when users browse categories in the website creator."
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 sm:col-span-2">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={updateField}
                className="size-4 accent-indigo-600"
              />

              <span>
                <span className="block font-semibold text-slate-900">
                  Active category
                </span>

                <span className="mt-1 block text-xs font-normal text-slate-500">
                  Active categories are visible to website creators.
                </span>
              </span>
            </label>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "＋ Create category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className={secondaryButtonClass}
                >
                  Reset form
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Category directory */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Manage existing records
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Category directory
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Search, edit, activate, deactivate, or remove categories.
            </p>
          </div>

          {/* Search and filter */}
          <div className="mb-5 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_220px]">
            <label className="block text-sm font-semibold text-slate-700">
              Search categories

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, slug, or description..."
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Filter by status

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className={inputClass}
              >
                <option value="all">All categories</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
              </select>
            </label>

            <p className="text-xs text-slate-500 sm:col-span-2">
              Showing {filteredCategories.length} of {categories.length} categories
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                ▦
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-950">
                No categories found
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                The API returned no category records. If categories already
                exist in your database, check the request URL and backend
                response in your browser's Network tab.
              </p>

              <button
                type="button"
                onClick={loadCategories}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Retry loading
              </button>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <h3 className="text-lg font-bold text-slate-950">
                No matching categories
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another search term or change the status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredCategories.map((category) => (
                <article
                  key={category.id}
                  className="flex min-w-0 flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-start"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-2xl ring-1 ring-slate-200">
                      {category.thumbnail ? (
                        <img
                          src={category.thumbnail}
                          alt={`${category.name} thumbnail`}
                          className="size-full object-cover"
                        />
                      ) : (
                        category.icon || "📁"
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words font-bold text-slate-950">
                          {category.name}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            category.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-1 break-all text-xs text-slate-500">
                        /{category.slug}
                      </p>

                      {category.description && (
                        <p className="mt-3 text-sm leading-5 text-slate-600">
                          {category.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                        <span>
                          <strong className="text-slate-700">
                            {category._count?.templates ?? 0}
                          </strong>{" "}
                          assigned templates
                        </span>

                        <span>
                          Display order:{" "}
                          <strong className="text-slate-700">
                            {category.sortOrder}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => startEditing(category)}
                      className={secondaryButtonClass}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleStatus(category)}
                      className={secondaryButtonClass}
                    >
                      {category.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCategory(category)}
                      disabled={
                        (category._count?.templates ?? 0) > 0
                      }
                      title={
                        (category._count?.templates ?? 0) > 0
                          ? "Reassign templates before deleting"
                          : "Delete category"
                      }
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}