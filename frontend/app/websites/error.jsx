"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function WebsitesError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 flex flex-col items-center justify-center">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Something went wrong
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          We encountered an error while fetching your websites.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Try again
          </button>
          <Link
            href="/templates"
            className="rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Go to Templates
          </Link>
        </div>
      </div>
    </main>
  );
}
