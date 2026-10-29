"use client";

import { useState } from "react";
import Link from "next/link";
import { createWebsite } from "@/app/templates/actions";

export default function TemplateCard({ template }) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    setError("");
    // Server action will redirect if successful, or throw error if not
  };

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
        {/* Thumbnail Preview */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          {template.thumbnail ? (
            <img
              src={template.thumbnail}
              alt={template.name}
              className="size-full object-cover object-top transition duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white">
              <svg
                className="mb-2 size-8 text-indigo-300/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm0 8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-6Z"
                />
              </svg>
              <span className="text-xs font-medium tracking-wide uppercase text-slate-300">
                Puck Template
              </span>
            </div>
          )}

          {/* Category Badge */}
          {template.category && (
            <div className="absolute left-3.5 top-3.5 rounded-full border border-white/20 bg-gray-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              {template.category}
            </div>
          )}

          {/* Quick Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-gray-950/40 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
            <Link
              href={`/templates/${template.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-gray-900 shadow-md transition hover:bg-gray-100"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
              </svg>
              Preview
            </Link>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-indigo-700"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Use This
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
                {template.name}
              </h3>
              <div className="flex items-center gap-1 text-gray-400" title="Responsive across Desktop, Tablet & Mobile">
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2">
              {template.description || "Fully customizable website template equipped with responsive layout and interactive components."}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 pt-2">
            <Link
              href={`/templates/${template.id}`}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-center text-xs font-semibold text-gray-800 transition hover:bg-gray-50 hover:border-gray-300"
            >
              Preview
            </Link>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex-1 rounded-xl bg-gray-950 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>

      {/* Create Website Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-gray-100 bg-slate-50/70 p-6">
              <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600">
                Start with template
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950">
                {template.name}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Give your new website a name to load this design in the visual editor.
              </p>
            </div>

            {/* Modal Form */}
            <form action={createWebsite} onSubmit={handleSubmit} className="p-6 space-y-5">
              <input type="hidden" name="templateId" value={template.id} />

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor={`website-name-${template.id}`}
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  Website Name
                </label>
                <input
                  id={`website-name-${template.id}`}
                  name="name"
                  type="text"
                  placeholder="e.g. Acme Studio, My Agency"
                  defaultValue={template.name}
                  required
                  autoFocus
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 disabled:bg-gray-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="size-3.5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Canvas...
                    </>
                  ) : (
                    <>
                      Create Website
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
