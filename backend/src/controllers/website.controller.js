const websiteService = require("../services/website.service");
const { getAuth } = require("@clerk/express");

// Create website from template
// Create website from template
const createWebsite = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
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
    const { id } = req.params;

    const website = await websiteService.getWebsiteById(id);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
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

const updateWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const { theme, name } = req.body;

    const data = {};
    if (theme !== undefined) data.theme = theme;
    if (name !== undefined) data.name = name;

    const website = await websiteService.updateWebsite(id, data);

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
    const { sectionId } = req.params;

    const { content, config } = req.body;

    const section = await websiteService.updateWebsiteSection(
      sectionId,
      {
        ...(content !== undefined && { content }),
        ...(config !== undefined && { config }),
      }
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
    const { sectionId } = req.params;

    const result = await websiteService.deleteWebsiteSection(
      sectionId
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
      }
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

module.exports = {
  createWebsite,
  getWebsite,
  updateWebsiteSection,
  reorderSections,
  createWebsiteSection,
  deleteWebsiteSection,
  updateWebsite,
};