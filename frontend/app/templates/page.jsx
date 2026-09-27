import TemplateCard from "@/components/TemplateCard";

async function getTemplates() {
  const response = await fetch(
    `${process.env.API_URL}templates`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }

  return response.json();
}

export default async function TemplatesPage() {
  const result = await getTemplates();

  const templates = result.data;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Choose a Template
          </h1>

          <p className="mt-3 text-gray-600">
            Select a website template to start building your website.
          </p>
        </div>

        {templates.length === 0 ? (
          <p className="text-gray-500">
            No templates available.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}