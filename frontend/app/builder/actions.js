"use server";

import { auth } from "@clerk/nextjs/server";

export async function saveWebsiteDraftAction(websiteId, draftWebsite) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const response = await fetch(
      `${process.env.API_URL}websites/${websiteId}/draft`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          pages: draftWebsite.pages,
          theme: draftWebsite.theme,
          name: draftWebsite.name,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save draft: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Save website draft error:", error);
    return {
      success: false,
      message: "Failed to save website draft",
    };
  }
}

export async function publishWebsiteAction(websiteId) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const response = await fetch(
      `${process.env.API_URL}websites/${websiteId}/publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to publish website: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Publish website error:", error);
    return {
      success: false,
      message: "Failed to publish website",
    };
  }
}

export async function updateWebsiteSections(sections) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const results = await Promise.all(
      sections.map(async (section) => {
        const response = await fetch(
          `${process.env.API_URL}websites/sections/${section.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              content: section.content,
              config: section.config,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();

          throw new Error(
            `Failed to save section ${section.id}: ${errorText}`
          );
        }

        return response.json();
      })
    );

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("Update website sections error:", error);

    return {
      success: false,
      message: "Failed to save website sections",
    };
  }
}

export async function createWebsiteSection({
  pageId,
  type,
  content,
  config,
}) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const response = await fetch(
      `${process.env.API_URL}websites/pages/${pageId}/sections`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          type,
          content,
          config,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Failed to create section: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Create website section error:",
      error
    );

    return {
      success: false,
      message: "Failed to create website section",
    };
  }
}

export async function deleteWebsiteSection(sectionId) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const response = await fetch(
      `${process.env.API_URL}websites/sections/${sectionId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Failed to delete section: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Delete website section error:",
      error
    );

    return {
      success: false,
      message: "Failed to delete website section",
    };
  }
}

export async function reorderWebsiteSections({
  pageId,
  sections,
}) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const response = await fetch(
      `${process.env.API_URL}websites/pages/${pageId}/sections/reorder`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          sections,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Failed to reorder sections: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Reorder website sections error:",
      error
    );

    return {
      success: false,
      message: "Failed to reorder website sections",
    };
  }
}

export async function updateWebsiteAction(websiteId, data) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const response = await fetch(
      `${process.env.API_URL}websites/${websiteId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update website: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Update website error:", error);
    return {
      success: false,
      message: "Failed to update website",
    };
  }
}




export async function createWebsitePageAction(websiteId, data) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return { success: false, message: "Authentication required" };
    }

    const response = await fetch(
      `${process.env.API_URL}websites/${websiteId}/pages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to create page",
      };
    }

    return { success: true, data: result.data ?? result };
  } catch (error) {
    console.error("Create website page error:", error);
    return { success: false, message: "Failed to create page" };
  }
}

export async function updateWebsitePageAction(pageId, data) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return { success: false, message: "Authentication required" };
    }

    const response = await fetch(
      `${process.env.API_URL}websites/pages/${pageId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update page",
      };
    }

    return { success: true, data: result.data ?? result };
  } catch (error) {
    console.error("Update website page error:", error);
    return { success: false, message: "Failed to update page" };
  }
}

export async function deleteWebsitePageAction(pageId) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return { success: false, message: "Authentication required" };
    }

    const response = await fetch(
      `${process.env.API_URL}websites/pages/${pageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete page",
      };
    }

    return { success: true, data: result.data ?? result };
  } catch (error) {
    console.error("Delete website page error:", error);
    return { success: false, message: "Failed to delete page" };
  }
}
