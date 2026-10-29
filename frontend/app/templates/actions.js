"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function createWebsite(formData) {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication required. Please sign in to create a website.");
  }

  const rawTemplateId = formData.get("templateId");
  const name = formData.get("name");

  if (!name || !name.trim()) {
    throw new Error("Website name is required");
  }

  const templateId =
    rawTemplateId && rawTemplateId !== "scratch" && rawTemplateId !== "null" && rawTemplateId !== "undefined"
      ? String(rawTemplateId).trim()
      : undefined;

  const baseUrl = (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api"
  ).replace(/\/+$/, "");

  const response = await fetch(`${baseUrl}/websites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      templateId,
      name: name.trim(),
    }),
  });

  const rawResponse = await response.text();

  if (!response.ok) {
    let errorMessage = `Failed to create website. Status: ${response.status}`;
    try {
      const parsed = JSON.parse(rawResponse);
      if (parsed.message) errorMessage = parsed.message;
    } catch {}
    throw new Error(errorMessage);
  }

  const result = JSON.parse(rawResponse);
  const websiteId = result?.data?.id;

  if (!websiteId) {
    throw new Error("Server created website but returned no website ID");
  }

  redirect(`/builder/${websiteId}`);
}
