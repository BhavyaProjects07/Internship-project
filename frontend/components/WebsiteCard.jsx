import Link from "next/link";
import Image from "next/image";

export default function WebsiteCard({ website }) {
  const lastSavedDate = new Date(website.updatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-video w-full bg-gray-100 flex items-center justify-center">
        {website.template?.thumbnail ? (
          <Image
            src={website.template.thumbnail}
            alt={`${website.name} thumbnail`}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-gray-400">No Preview</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{website.name}</h2>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
            DRAFT
          </span>
        </div>

        {website.template?.name && (
          <p className="mb-4 text-sm text-gray-500">
            Based on: {website.template.name}
          </p>
        )}

        <div className="mt-auto pt-4 text-sm text-gray-500 border-t border-gray-100">
          Last saved: {lastSavedDate}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Link
            href={`/builder/${website.id}`}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Continue Editing
          </Link>
          <Link
            href={`/builder/${website.id}?preview=true`}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
