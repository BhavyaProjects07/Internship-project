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

  const request = useCallback(
    async (path, options = {}) => {
      const token = await getToken();

      if (!token) {
        throw new Error("Your session could not be verified. Please sign in again.");
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
      const result = await request("categories/admin?includeInactive=true");
      setCategories(Array.isArray(result.data) ? result.data : []);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
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
      throw new Error("Display order must be a whole number.");
    }

    const wasEditing = Boolean(editingId);

    const result = await request(
      wasEditing ? `categories/${editingId}` : "categories",
      {
        method: wasEditing ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      }
    );

    // Reset the form first; resetForm clears existing messages.
    resetForm();

    // Refresh the bottom category list.
    await loadCategories();

    // Display success after resetting and refreshing.
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
      const result = await request(`categories/${category.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !category.isActive }),
      });

      setNotice(result.message || "Category status updated.");
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to update category status.");
    }
  }

  async function deleteCategory(category) {
    const count = category._count?.templates ?? 0;

    const confirmed = window.confirm(
      count > 0
        ? `"${category.name}" has ${count} assigned template(s). Reassign those templates before deleting this category.`
        : `Delete "${category.name}"? This action cannot be undone.`
    );

    if (!confirmed || count > 0) return;

    setError("");
    setNotice("");

    try {
      const result = await request(`categories/${category.id}`, {
        method: "DELETE",
      });

      setNotice(result.message || "Category deleted.");
      if (editingId === category.id) resetForm();
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to delete category.");
    }
  }

  if (!isLoaded || loading) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm text-gray-600">Loading category management…</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-2xl font-bold text-gray-950">Admin sign-in required</h1>
        <p className="mt-3 text-gray-600">
          Sign in with your Clerk account to manage website categories.
        </p>
        <a
          href="/sign-in"
          className="mt-6 inline-flex rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Sign in
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            SiteBuilder administration
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Website categories
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            Manage the categories shown when users start creating a website.
            Changes are stored through the backend API.
          </p>
        </header>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        
{notice && (
  <div
    role="status"
    aria-live="polite"
    className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 shadow-sm"
  >
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
      ✓
    </span>

    <div>
      <p className="font-semibold">Success</p>
      <p className="mt-1">{notice}</p>
    </div>
  </div>
)}


        <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-950">
                {editingId ? "Edit category" : "Create category"}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                The slug is used to identify a category consistently.
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Category name *
              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Portfolio"
                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Slug
              <input
                name="slug"
                value={form.slug}
                onChange={updateField}
                placeholder="portfolio (generated if empty)"
                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={3}
                placeholder="Describe the kinds of websites in this category."
                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Icon
              <input
                name="icon"
                value={form.icon}
                onChange={updateField}
                placeholder="e.g. 🎨"
                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </label>

            <div className="sm:col-span-2">
              <MediaInput
                label="Category thumbnail"
                value={form.thumbnail}
                onChange={(url) => setForm((current) => ({ ...current, thumbnail: url }))}
                placeholder="https://... or upload/choose from library"
                description="Thumbnail image displayed when users browse categories in the site creator."
              />
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Display order
              <input
                name="sortOrder"
                type="number"
                step="1"
                value={form.sortOrder}
                onChange={updateField}
                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </label>

            <label className="flex items-center gap-3 self-end pb-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={updateField}
                className="size-4 rounded border-gray-300"
              />
              Active — visible to website creators
            </label>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Save changes" : "Create category"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-950">Existing categories</h2>
            <button
              type="button"
              onClick={loadCategories}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="font-semibold text-gray-950">No categories found</h3>
              <p className="mt-2 text-sm text-gray-600">
                Create your first category using the form above.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <article
                    key={category.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-2xl">
                        {category.thumbnail ? (
                          <img
                            src={category.thumbnail}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          category.icon || "📁"
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-950">{category.name}</h3>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            category.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="mt-1 break-all text-xs text-gray-500">
                          /{category.slug}
                        </p>
                        {category.description && (
                          <p className="mt-2 text-sm text-gray-600">
                            {category.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                          {category._count?.templates ?? 0} assigned template(s)
                          {" · "}Order {category.sortOrder}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(category)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(category)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {category.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCategory(category)}
                        disabled={(category._count?.templates ?? 0) > 0}
                        title={
                          (category._count?.templates ?? 0) > 0
                            ? "Reassign templates before deleting"
                            : "Delete category"
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}