import Builder from "@/components/builder/Builder";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function getWebsite(id) {
  const { getToken, userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken();

  const response = await fetch(
    `${process.env.API_URL}websites/${id}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      redirect("/websites");
    }
    throw new Error("Failed to fetch website");
  }

  return response.json();
}

export default async function BuilderPage({ params }) {
  const { websiteId } = await params;

  const result = await getWebsite(websiteId);

  const website = result.data;

  return <Builder website={website} />;
}