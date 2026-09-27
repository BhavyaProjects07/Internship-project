import SectionRenderer from "@/components/SectionRenderer";

const API_URL = "http://localhost:5000/api";

async function getTemplate(id) {
  const response = await fetch(`${API_URL}/templates/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch template");
  }

  return response.json();
}

export default async function TemplatePage({ params }) {
  const { id } = await params;

  const result = await getTemplate(id);

  const template = result.data;

  const homePage = template.pages.find(
    (page) => page.slug === "home"
  );

  return (
    <main>
      {homePage.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
        />
      ))}
    </main>
  );
}