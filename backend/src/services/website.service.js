const prisma = require("../lib/prisma");

const createWebsiteFromTemplate = async ({ templateId, name , userId}) => {
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
      userId,
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

const deleteWebsiteSection = async (sectionId, userId) => {
  const section = await prisma.websiteSection.findUnique({
    where: {
      id: sectionId,
    },
    include: {
      page: {
        include: {
          website: true,
        },
      },
    },
  });

  if (!section) {
    throw new Error("Website section not found");
  }

  if (section.page.website.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.websiteSection.delete({
    where: {
      id: sectionId,
    },
  });

  return {
    success: true,
    message: "Website section deleted successfully",
  };
};

const createWebsiteSection = async (pageId, data, userId) => {
  const { type, content, config } = data;

  if (!type) {
    throw new Error("Section type is required");
  }

  const page = await prisma.websitePage.findUnique({
    where: {
      id: pageId,
    },
    include: {
      website: true,
    },
  });

  if (!page) {
    throw new Error("Website page not found");
  }

  if (page.website.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const lastSection = await prisma.websiteSection.findFirst({
    where: {
      pageId,
    },
    orderBy: {
      order: "desc",
    },
    select: {
      order: true,
    },
  });

  const nextOrder = lastSection ? lastSection.order + 1 : 1;

  return await prisma.websiteSection.create({
    data: {
      type,
      order: nextOrder,
      content: content ?? {},
      config: config ?? {},
      pageId,
    },
  });
};

const updateWebsite = async (id, data, userId) => {
  const website = await prisma.website.findUnique({
    where: { id },
  });

  if (!website || website.userId !== userId) {
    throw new Error("Website not found or unauthorized");
  }

  return await prisma.website.update({
    where: {
      id,
    },
    data,
  });
};

// Get a complete website by ID
const getWebsiteById = async (id, userId) => {
  const website = await prisma.website.findUnique({
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

  if (!website || website.userId !== userId) {
    return null;
  }

  return website;
};

// Get all websites for a user (lightweight metadata)
const getUserWebsites = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [websites, total] = await Promise.all([
    prisma.website.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
        template: {
          select: {
            name: true,
            thumbnail: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.website.count({
      where: {
        userId: userId,
      },
    }),
  ]);

  return {
    data: websites,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateWebsiteSection = async (sectionId, data, userId) => {
  const section = await prisma.websiteSection.findUnique({
    where: { id: sectionId },
    include: { page: { include: { website: true } } },
  });

  if (!section) {
    throw new Error("Website section not found");
  }
  if (section.page.website.userId !== userId) {
    throw new Error("Unauthorized");
  }

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
  userId,
}) => {
  const page = await prisma.websitePage.findUnique({
    where: {
      id: pageId,
    },
    include: {
      website: true,
    },
  });

  if (!page) {
    throw new Error("Website page not found");
  }

  if (page.website.userId !== userId) {
    throw new Error("Unauthorized");
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

const saveWebsiteDraft = async (websiteId, pagesPayload, userId, theme, name) => {
  // 1. Verify Website Ownership
  const website = await prisma.website.findUnique({
    where: { id: websiteId },
    include: {
      pages: {
        include: {
          sections: true,
        },
      },
    },
  });

  if (!website || website.userId !== userId) {
    throw new Error("Website not found or unauthorized");
  }

  // 2. Validate Payload & Prepare Operations
  const dbPageIds = new Set(website.pages.map((p) => p.id));
  const dbSectionMap = new Map();
  for (const page of website.pages) {
    for (const section of page.sections) {
      dbSectionMap.set(section.id, section.pageId);
    }
  }

  const updateOperations = [
    prisma.website.update({
      where: { id: websiteId },
      data: {
        ...(theme !== undefined && { theme }),
        ...(name !== undefined && { name }),
      }
    })
  ];

  const tempIdMapIndex = [];

  for (const pagePayload of pagesPayload) {
    if (!dbPageIds.has(pagePayload.id)) {
      throw new Error("Invalid payload");
    }

    if (Array.isArray(pagePayload.sections)) {
      for (const sectionPayload of pagePayload.sections) {
        if (dbSectionMap.has(sectionPayload.id)) {
          // Existing section
          if (dbSectionMap.get(sectionPayload.id) !== pagePayload.id) {
             throw new Error("Invalid payload: Section assigned to wrong page");
          }

          updateOperations.push(
            prisma.websiteSection.update({
              where: { id: sectionPayload.id },
              data: {
                order: sectionPayload.order,
                content: sectionPayload.content ?? {},
                config: sectionPayload.config ?? {},
              },
            })
          );
          
          dbSectionMap.delete(sectionPayload.id); // Mark as seen
        } else if (String(sectionPayload.id).startsWith("temp_")) {
          // New section
          if (!sectionPayload.type) {
             throw new Error("Invalid payload: Missing type for new section");
          }
          
          updateOperations.push(
            prisma.websiteSection.create({
              data: {
                type: sectionPayload.type,
                order: sectionPayload.order,
                content: sectionPayload.content ?? {},
                config: sectionPayload.config ?? {},
                pageId: pagePayload.id,
              },
            })
          );

          tempIdMapIndex.push({
            tempId: sectionPayload.id,
            index: updateOperations.length - 1,
          });
        } else {
          throw new Error(`Invalid payload: Unrecognized section ID ${sectionPayload.id}`);
        }
      }
    }
  }

  // Sections not present in the payload must be deleted
  for (const [sectionId, pageId] of dbSectionMap.entries()) {
    updateOperations.push(
      prisma.websiteSection.delete({
        where: { id: sectionId },
      })
    );
  }

  // 3. Execute Transaction
  const results = await prisma.$transaction(updateOperations);

  // 4. Map temporary IDs to database IDs
  const idMappings = tempIdMapIndex.map((item) => ({
    clientId: item.tempId,
    databaseId: results[item.index].id,
  }));

  // Return updated website (minimal info) + idMappings
  const updatedWebsite = await prisma.website.findUnique({
    where: { id: websiteId },
    select: { id: true, updatedAt: true },
  });

  return {
    ...updatedWebsite,
    idMappings,
  };
};

const publishWebsite = async (websiteId, userId) => {
  // 1. Fetch the complete current draft using the existing function that includes auth
  const website = await getWebsiteById(websiteId, userId);
  
  if (!website) {
    throw new Error("Website not found or unauthorized");
  }

  // 2. Serialize into the publishedData snapshot
  // Using the ACTUAL Prisma field names fetched by getWebsiteById
  const publishedData = {
    id: website.id,
    name: website.name,
    slug: website.slug,
    theme: website.theme,
    pages: website.pages.map(page => ({
      id: page.id,
      name: page.name,
      slug: page.slug,
      order: page.order,
      sections: page.sections.map(section => ({
        id: section.id,
        type: section.type,
        order: section.order,
        content: section.content,
        config: section.config,
      }))
    }))
  };

  // 3. Update the Website record atomically
  return await prisma.website.update({
    where: { id: websiteId },
    data: {
      isPublished: true,
      publishedAt: new Date(),
      publishedData: publishedData
    }
  });
};

const getPublishedWebsiteBySlug = async (slug) => {
  const website = await prisma.website.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      isPublished: true,
      publishedAt: true,
      publishedData: true,
    }
  });

  if (!website) {
    return null;
  }

  if (!website.isPublished || !website.publishedData) {
    return null; // Return null if it's not published, to match 404 requirement
  }

  // Strip sensitive metadata if any, though select limits it.
  // We return exactly what the public endpoint needs.
  // Use the name and slug from publishedData to ensure total snapshot isolation
  return {
    id: website.id,
    name: website.publishedData.name || website.name,
    slug: website.publishedData.slug || website.slug,
    publishedAt: website.publishedAt,
    publishedData: website.publishedData
  };
};

module.exports = {
  createWebsiteFromTemplate,
  getWebsiteById,
  getUserWebsites,
  updateWebsiteSection,
  reorderWebsiteSections,
  createWebsiteSection,
  deleteWebsiteSection,
  updateWebsite,
  saveWebsiteDraft,
  publishWebsite,
  getPublishedWebsiteBySlug,
};


