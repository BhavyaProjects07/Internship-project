
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export default function CreateTemplatePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    thumbnail: "",
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let cancelled = false;

    async function loadCategories() {
      setLoadingCategories(true);

      try {
        const response = await fetch(`${API_URL}/categories`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load categories.");
        }

        if (!cancelled) {
          setCategories(Array.isArray(result.data) ? result.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load categories.");
        }
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter a template name.");
      return;
    }

    setSaving(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          categoryId: form.categoryId || null,
          thumbnail: form.thumbnail.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not create template.");
      }

      const template = result.data;

      if (!template?.id) {
        throw new Error("The server did not return the new template ID.");
      }

      router.push(`/admin/templates/${template.id}/editor`);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setSaving(false);
    }
  }

  const selectedCategory = categories.find(
    (category) => category.id === form.categoryId
  );

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gray-50 p-8 text-sm text-gray-500">
        Loading…
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8">
          <h1 className="text-2xl font-bold text-gray-950">
            Admin sign-in required
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Sign in to create and manage templates.
          </p>
          <a
            href="/sign-in"
            className="mt-6 inline-flex rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Sign in
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <a
          href="/admin/templates"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950"
        >
          <span aria-hidden="true">←</span>
          Back to templates
        </a>

        <header className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Template studio
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Create a template
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
              Set up your template details first. You can build its pages and
              sections in the visual editor next.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            New template · Draft
          </span>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="border-b border-gray-100 pb-5">
                  <h2 className="text-lg font-semibold text-gray-950">
                    Template details
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Give your template a clear name and description.
                  </p>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Template name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={updateField}
                      required
                      maxLength={100}
                      placeholder="e.g. Modern Creative Agency"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={updateField}
                      rows={4}
                      maxLength={500}
                      placeholder="Describe the purpose, style, and ideal use of this template…"
                      className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                    <p className="mt-2 text-right text-xs text-gray-400">
                      {form.description.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="categoryId"
                      className="mb-2 block text-sm font-medium text-gray-800"
                    >
                      Website category
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={form.categoryId}
                      onChange={updateField}
                      disabled={loadingCategories}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:bg-gray-50"
                    >
                      <option value="">
                        {loadingCategories
                          ? "Loading categories…"
                          : "Select a category"}
                      </option>
                      {categories
                        .filter((category) => category.isActive !== false)
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                    {!loadingCategories && categories.length === 0 && (
                      <p className="mt-2 text-xs text-amber-700">
                        No categories found. You can create this draft now and
                        add categories from the admin category manager.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="border-b border-gray-100 pb-5">
                  <h2 className="text-lg font-semibold text-gray-950">
                    Preview image
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Add an image URL to identify the template in the gallery.
                  </p>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="thumbnail"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Thumbnail image URL
                  </label>
                  <input
                    id="thumbnail"
                    name="thumbnail"
                    type="url"
                    value={form.thumbnail}
                    onChange={updateField}
                    placeholder="https://example.com/template-preview.jpg"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Use a publicly accessible image URL. We can add a media
                    library and image upload workflow later.
                  </p>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-4">
                  <h2 className="font-semibold text-gray-950">
                    Template preview
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Gallery card preview
                  </p>
                </div>

                <div className="p-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                    {form.thumbnail ? (
                      <img
                        src={form.thumbnail}
                        alt="Template thumbnail preview"
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 px-6 text-center text-white">
                        <span className="text-xs font-medium uppercase tracking-[0.25em] text-gray-300">
                          Website template
                        </span>
                        <span className="mt-4 text-2xl font-bold">
                          {form.name || "Your next great website"}
                        </span>
                        <span className="mt-3 max-w-xs text-xs leading-5 text-gray-300">
                          Your thumbnail will appear here.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {selectedCategory?.name || "Uncategorized"}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-gray-950">
                      {form.name || "Template name"}
                    </h3>
                    <p className="mt-2 line-clamp-3 min-h-12 text-sm leading-5 text-gray-500">
                      {form.description || "Your template description will appear here."}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-gray-950">Publishing</h2>
                <div className="mt-4 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <span aria-hidden="true">✎</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Saved as draft
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      This template will not appear in the public gallery until
                      you publish it.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          <div className="sticky bottom-0 z-10 mt-8 border-t border-gray-200 bg-[#f7f8fa]/95 py-4 backdrop-blur">
            <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
              <a
                href="/admin/templates"
                className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </a>

              <button
                type="submit"
                disabled={saving || !form.name.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating draft…
                  </>
                ) : (
                  <>
                    Save draft and continue
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
