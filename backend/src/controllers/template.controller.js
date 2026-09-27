const templateService = require("../services/template.service");

const getTemplates = async (req, res) => {
  try {
    const templates = await templateService.getAllTemplates();

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error("Get templates error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
    });
  }
};

const getTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await templateService.getTemplateById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Get template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch template",
    });
  }
};

module.exports = {
  getTemplates,
  getTemplate,
};