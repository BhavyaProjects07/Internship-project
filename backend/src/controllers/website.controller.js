const websiteService = require("../services/website.service");


// Create website from template
const createWebsite = async (req, res) => {
  try {
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

};