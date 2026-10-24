const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(
      `API request failed (${response.status} ${response.statusText})${message ? `: ${message}` : ""}`
    );
  }

  return response.json();
}

export async function getTemplates() {
  return apiFetch("/templates");
}

export async function getTemplateById(id) {
  return apiFetch(`/templates/${encodeURIComponent(id)}`);
}

export async function createWebsite(templateId, name) {
  return apiFetch("/websites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      templateId,
      name,
    }),
  });
}

export async function getWebsiteById(id) {
  return apiFetch(`/websites/${encodeURIComponent(id)}`);
}