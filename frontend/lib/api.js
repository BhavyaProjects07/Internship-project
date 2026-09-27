const API_URL = "http://localhost:5000/api";

export async function getTemplates() {
  const response = await fetch(`${API_URL}/templates`);

  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }

  return response.json();
}

export async function getTemplateById(id) {
  const response = await fetch(`${API_URL}/templates/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch template");
  }

  return response.json();
}

export async function createWebsite(templateId, name) {
  const response = await fetch(`${API_URL}/websites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      templateId,
      name,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create website");
  }

  return response.json();
}

export async function getWebsiteById(id) {
  const response = await fetch(`${API_URL}/websites/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch website");
  }

  return response.json();
}