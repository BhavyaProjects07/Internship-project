const prisma = require("../lib/prisma");

const createWebsiteFromTemplate = async ({ templateId, name }) => {
  const template = await prisma.template.findUnique({
    where: {
      id: templateId,
    },
    include: {
      pages: {
        orderBy: {
          order: "asc",
        },
        include: {
          sections: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  if (!template) {
    throw new Error("Template not found");
  }

  const slug = `${name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now()}`;

  const website = await prisma.website.create({
    data: {
      name,
      slug,
      templateId: template.id,

      pages: {
        create: template.pages.map((page) => ({
          name: page.name,
          slug: page.slug,
          order: page.order,

          sections: {
            create: page.sections.map((section) => ({
              type: section.type,
              order: section.order,
              content: section.content,
              config: section.config,
            })),
          },
        })),
      },
    },

    include: {
      pages: {
        orderBy: {
          order: "asc",
        },
        include: {
          sections: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  return website;
};



// Get a complete website by ID
const getWebsiteById = async (id) => {
  return await prisma.website.findUnique({
    where: {
      id,
    },
    include: {
      pages: {
        orderBy: {
          order: "asc",
        },
        include: {
          sections: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });
};

const updateWebsiteSection = async (sectionId, data) => {
  return await prisma.websiteSection.update({
    where: {
      id: sectionId,
    },
    data,
  });
};

const reorderWebsiteSections = async ({
  pageId,
  sections,
}) => {
  const page = await prisma.websitePage.findUnique({
    where: {
      id: pageId,
    },
  });

  if (!page) {
    throw new Error("Website page not found");
  }

  await prisma.$transaction(
    sections.map((section) =>
      prisma.websiteSection.update({
        where: {
          id: section.id,
        },
        data: {
          order: section.order,
        },
      })
    )
  );

  return await prisma.websitePage.findUnique({
    where: {
      id: pageId,
    },
    include: {
      sections: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
};

module.exports = {
  createWebsiteFromTemplate,
  getWebsiteById,
  updateWebsiteSection,
  reorderWebsiteSections,
};


