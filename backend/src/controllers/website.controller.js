const websiteService = require("../services/website.service");
const { getAuth } = require("@clerk/express");

// Create website from template
// Create website from template
const createWebsite = async (req, res) => {
  try {
    const { getAuth } = require("@clerk/express");

const authState = getAuth(req);

console.log("Backend Clerk diagnostic:", {
  hasUserId: Boolean(authState.userId),
  hasAuthorizationHeader: Boolean(req.headers.authorization),
  authorizationScheme: req.headers.authorization
    ? req.headers.authorization.split(" ")[0]
    : null,
});

if (!authState.userId) {
  return res.status(401).json({
    success: false,
    message: "Authentication required",
  });
}

    const { templateId, name } = req.body;

    if (!templateId || !name) {
      return res.status(400).json({
        success: false,
        message: "templateId and name are required",
      });
    }

    const website = await websiteService.createWebsiteFromTemplate({
      templateId,
      name,
      userId,
    });

    res.status(201).json({
      success: true,
      data: website,
    });

  } catch (error) {
    console.error("Create website error:", error);

    if (error.message === "Template not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create website",
    });
  }
};

// Get website by ID
const getWebsite = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const website = await websiteService.getWebsiteById(id, userId);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found or unauthorized",
      });
    }

    res.json({
      success: true,
      data: website,
    });

  } catch (error) {
    console.error("Get website error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch website",
    });
  }
};

// Get all websites for the authenticated user
const getUserWebsites = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const websites = await websiteService.getUserWebsites(userId, page, limit);

    res.json({
      success: true,
      data: websites.data,
      pagination: websites.pagination,
    });
  } catch (error) {
    console.error("Get user websites error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch websites",
    });
  }
};

const updateWebsite = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { id } = req.params;
    const { theme, name } = req.body;

    const data = {};
    if (theme !== undefined) data.theme = theme;
    if (name !== undefined) data.name = name;

    const website = await websiteService.updateWebsite(id, data, userId);

    res.json({
      success: true,
      data: website,
    });
  } catch (error) {
    console.error("Update website error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update website",
    });
  }
};

const updateWebsiteSection = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { sectionId } = req.params;

    const { content, config } = req.body;

    const section = await websiteService.updateWebsiteSection(
      sectionId,
      {
        ...(content !== undefined && { content }),
        ...(config !== undefined && { config }),
      },
      userId
    );

    res.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("Update website section error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update website section",
    });
  }
};

const deleteWebsiteSection = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { sectionId } = req.params;

    const result = await websiteService.deleteWebsiteSection(
      sectionId,
      userId
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Delete website section error:",
      error
    );

    if (error.message === "Website section not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete website section",
    });
  }
};

const createWebsiteSection = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { pageId } = req.params;
    const { type, content, config } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Section type is required",
      });
    }

    const section = await websiteService.createWebsiteSection(
      pageId,
      {
        type,
        content,
        config,
      },
      userId
    );

    res.status(201).json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("Create website section error:", error);

    if (error.message === "Website page not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create website section",
    });
  }
};


const reorderSections = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { pageId } = req.params;
    const { sections } = req.body;

    if (!Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({
        success: false,
        message: "sections must be a non-empty array",
      });
    }

    const websitePage =
      await websiteService.reorderWebsiteSections({
        pageId,
        sections,
        userId,
      });

    res.json({
      success: true,
      data: websitePage,
    });
  } catch (error) {
    console.error("Reorder sections error:", error);

    if (error.message === "Website page not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to reorder sections",
    });
  }
};

const saveWebsiteDraft = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { id } = req.params;
    const { pages, theme, name } = req.body;

    if (!Array.isArray(pages)) {
      return res.status(400).json({ success: false, message: "pages must be an array" });
    }

    const website = await websiteService.saveWebsiteDraft(id, pages, userId, theme, name);

    res.json({
      success: true,
      websiteId: website.id,
      updatedAt: website.updatedAt,
      idMappings: website.idMappings,
    });
  } catch (error) {
    console.error("Save draft error:", error);
    
    if (error.message === "Website not found or unauthorized") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === "Invalid payload") {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: "Failed to save draft" });
  }
};

const publishWebsite = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { id } = req.params;

    const website = await websiteService.publishWebsite(id, userId);

    res.json({
      success: true,
      websiteId: website.id,
      slug: website.slug,
      isPublished: website.isPublished,
      publishedAt: website.publishedAt,
      publicUrl: `/${website.slug}`, // Safe placeholder as requested
    });
  } catch (error) {
    console.error("Publish website error:", error);
    
    if (error.message === "Website not found or unauthorized") {
      return res.status(404).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: "Failed to publish website" });
  }
};

const getPublicWebsite = async (req, res) => {
  try {
    const { slug } = req.params;

    const publishedWebsite = await websiteService.getPublishedWebsiteBySlug(slug);

    if (!publishedWebsite) {
      return res.status(404).json({ success: false, message: "Website not found" });
    }

    res.json({
      success: true,
      ...publishedWebsite
    });
  } catch (error) {
    console.error("Get public website error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch public website" });
  }
};

module.exports = {
  createWebsite,
  getWebsite,
  getUserWebsites,
  updateWebsiteSection,
  reorderSections,
  createWebsiteSection,
  deleteWebsiteSection,
  updateWebsite,
  saveWebsiteDraft,
  publishWebsite,
  getPublicWebsite,
};