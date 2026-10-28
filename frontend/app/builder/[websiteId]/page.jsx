import Builder from "@/components/builder/Builder";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function getWebsite(id) {
  const { getToken, userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken();
  const baseUrl = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/").replace(/\/+$/, "");

  const response = await fetch(
    `${baseUrl}/websites/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      redirect("/websites");
    }
    throw new Error(`Failed to fetch website (HTTP ${response.status})`);
  }

  return response.json();
}

export default async function BuilderPage({ params }) {
  const { websiteId } = await params;

  const result = await getWebsite(websiteId);

  const website = result?.data;

  if (!website) {
    redirect("/websites");
  }

  return <Builder website={website} />;
}
