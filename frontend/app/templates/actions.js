"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function createWebsite(formData) {
  const { getToken } = await auth();
  const token = await getToken();

console.log("Clerk diagnostic:", {
  hasToken: Boolean(token),
  tokenLength: token?.length ?? 0,
});
  
  const templateId = formData.get("templateId");
  const name = formData.get("name");

  if (!templateId || !name) {
    throw new Error("Template ID and website name are required");
  }

  const response = await fetch(
    `${process.env.API_URL}websites`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        templateId,
        name,
      }),
    }
  );

  // DEBUG: read the raw response first
  const rawResponse = await response.text();

  console.log("Create website status:", response.status);
  console.log("Create website response:", rawResponse);

  if (!response.ok) {
    throw new Error(
      `Failed to create website. Status: ${response.status}`
    );
  }

  const result = JSON.parse(rawResponse);

  const websiteId = result.data.id;

  redirect(`/builder/${websiteId}`);
}