import Builder from "@/components/builder/Builder";

async function getWebsite(id) {
  const response = await fetch(
    `${process.env.API_URL}websites/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
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