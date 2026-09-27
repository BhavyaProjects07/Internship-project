"use client";

import { useState } from "react";
import Link from "next/link";
import { createWebsite } from "@/app/templates/actions";

export default function TemplateCard({ template }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {template.thumbnail ? (
            <img
              src={template.thumbnail}
              alt={template.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 text-sm text-white">
              Template Preview
            </div>
          )}

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-800 backdrop-blur">
            {template.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            {template.name}
          </h2>

          <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-600">
            {template.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href={`/templates/${template.id}`}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
            >
              Preview
            </Link>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>

      {/* Create Website Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500">
                Create website from
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-gray-950">
                {template.name}
              </h2>
            </div>

            <form action={createWebsite} className="space-y-5">
              <input
                type="hidden"
                name="templateId"
                value={template.id}
              />

              <div>
                <label
                  htmlFor={`website-name-${template.id}`}
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Website name
                </label>

                <input
                  id={`website-name-${template.id}`}
                  name="name"
                  type="text"
                  placeholder="My Business Website"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Create Website
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}