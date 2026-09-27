"use server";

export async function updateWebsiteSections(sections) {
  try {
    const results = await Promise.all(
      sections.map(async (section) => {
        const response = await fetch(
          `${process.env.API_URL}websites/sections/${section.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
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

export async function reorderWebsiteSections({
  pageId,
  sections,
}) {
  try {
    const response = await fetch(
      `${process.env.API_URL}websites/pages/${pageId}/sections/reorder`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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