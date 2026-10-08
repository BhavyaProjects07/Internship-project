import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import WebsiteCard from "@/components/WebsiteCard";
import { redirect } from "next/navigation";

async function getUserWebsites() {
  const { getToken, userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken();

  const response = await fetch(`${process.env.API_URL}websites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      redirect("/sign-in");
    }
    throw new Error("Failed to fetch websites");
  }

  return response.json();
}

export default async function WebsitesDashboard() {
  const result = await getUserWebsites();
  const websites = result.data || [];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Websites</h1>
            <p className="mt-3 text-gray-600">
              Manage and continue editing your website drafts.
            </p>
          </div>
          <Link
            href="/templates"
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            + Create Website
          </Link>
        </div>

        {websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <h3 className="mt-2 text-lg font-semibold text-gray-900">
              No websites yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first website from a template.
            </p>
            <div className="mt-6">
              <Link
                href="/templates"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Website
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {websites.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
