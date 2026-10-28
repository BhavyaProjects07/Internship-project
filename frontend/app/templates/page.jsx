"use client";

import { useEffect, useMemo, useState } from "react";
import TemplateCard from "@/components/TemplateCard";
import HomeHeader from "@/components/home/Header";

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
  // Prefer the database relationship for newly assigned templates.
  if (template.categoryId) {
    return template.categoryId === category.id;
  }

  // Backward compatibility for templates created before categoryId existed.
  const legacyCategory = normalizeCategory(template.category);
  return [
    category.slug,
    category.name,
  ].some((value) => normalizeCategory(value) === legacyCategory);
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const filteredTemplates = useMemo(() => {
    if (!selectedCategory) return [];

    return templates.filter((template) =>
      matchesCategory(template, selectedCategory)
    );
  }, [templates, selectedCategory]);

  if (loading) {
    return (
      <>
      <HomeHeader />
      <main className="min-h-screen bg-gray-50 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-600">Loading website categories…</p>
        </div>
      </main>
    </>
    );
  }

  if (error) {
    return (
      <>
      <HomeHeader />
      <main className="min-h-screen bg-gray-50 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
          <h1 className="font-semibold">Unable to load website options</h1>
          <p className="mt-2 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      </main>
    </>
    );
  }

  return (
    <>
      <HomeHeader />
      <main className="min-h-screen bg-gray-50 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {!selectedCategory ? (
          <>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Create your website
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                What kind of website do you want to create?
              </h1>

              <p className="mt-4 text-base leading-7 text-gray-600">
                Choose a category to find a suitable starting design.
              </p>
            </div>

            {categories.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                <h2 className="text-lg font-semibold text-gray-950">
                  No website categories are available
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please check again later.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className="group rounded-2xl border border-gray-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    <span className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-2xl">
                      {category.thumbnail ? (
                        <img
                          src={category.thumbnail}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        category.icon || "✨"
                      )}
                    </span>

                    <h2 className="mt-5 text-lg font-semibold text-gray-950">
                      {category.name}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {category.description || "Explore website templates in this category."}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                      Explore templates <span aria-hidden="true">→</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="mb-8 text-sm font-medium text-gray-600 hover:text-gray-950"
            >
              ← All website categories
            </button>

            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Selected category
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                {selectedCategory.name} templates
              </h1>
              <p className="mt-3 text-gray-600">
                {selectedCategory.description}
              </p>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                <h2 className="text-lg font-semibold text-gray-950">
                  No templates in this category yet
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  An administrator can assign templates to this category.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="mt-5 rounded-xl bg-gray-950 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Browse other categories
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
    </>
  );
}