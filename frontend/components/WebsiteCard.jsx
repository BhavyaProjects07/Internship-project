import Link from "next/link";
import Image from "next/image";

export default function WebsiteCard({ website }) {
  const lastSavedDate = new Date(website.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-video w-full bg-gray-100 flex items-center justify-center border-b border-gray-100">
        {website.template?.thumbnail ? (
          <Image
            src={website.template.thumbnail}
            alt={`${website.name} thumbnail`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <svg aria-hidden="true" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">No Preview</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="truncate text-lg font-bold text-gray-900" title={website.name}>
            {website.name}
          </h2>
          {website.isPublished ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
              DRAFT
            </span>
          )}
        </div>

        {website.isPublished && website.slug ? (
          <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
            <span className="text-gray-400">URL:</span>
            <a
              href={`/${website.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-medium text-indigo-600 hover:underline"
              title={`Visit /${website.slug}`}
            >
              /{website.slug}
            </a>
          </div>
        ) : website.template?.name ? (
          <p className="mb-3 text-xs text-gray-500">
            Template: {website.template.name}
          </p>
        ) : null}

        <div className="mt-auto pt-3 text-xs text-gray-400 border-t border-gray-100 flex items-center justify-between">
          <span>Saved: {lastSavedDate}</span>
          {website.slug && (
            <span className="font-mono text-[11px] text-gray-400">
              id: {website.slug.slice(-6)}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/builder/${website.id}`}
            className="flex-1 rounded-xl bg-indigo-600 px-3.5 py-2 text-center text-xs font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
          >
            Edit Site
          </Link>

          {website.isPublished && website.slug ? (
            <a
              href={`/${website.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-950"
            >
              <span>Visit</span>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          ) : (
            <Link
              href={`/builder/${website.id}`}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Preview
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
