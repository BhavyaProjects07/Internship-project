
const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getTemplates,
  getTemplate,
  getAdminTemplates,
  getAdminTemplate,
  createTemplate,
  updateTemplate,
  assignTemplateCategory,
  updateTemplateStatus,
  deleteTemplate,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  getPageEditorData,
  savePageEditorData,
  createPage,
renamePage,
duplicatePage,
deletePage,
reorderPages,
getAdminGlobalLayout,
updateAdminGlobalLayout,
} = require("../controllers/template.controller");

const router = express.Router();

// Public template gallery: published templates only.
router.get("/", getTemplates);

router.get(
  "/admin/:id/pages/:pageId/editor-data",
  requireAdmin,
  getPageEditorData
);

router.put(
  "/admin/:id/pages/:pageId/editor-data",
  requireAdmin,
  savePageEditorData
);


router.post("/:id/pages/:pageId/sections", requireAdmin, createSection);

router.patch(
  "/:id/pages/:pageId/sections/reorder",
  requireAdmin,
  reorderSections
);


/* Admin-only page management */
router.post(
  "/admin/:id/pages",
  requireAdmin,
  createPage
);

router.patch(
  "/admin/:id/pages/reorder",
  requireAdmin,
  reorderPages
);

router.patch(
  "/admin/:id/pages/:pageId",
  requireAdmin,
  renamePage
);


router.post(
  "/admin/:id/pages/:pageId/duplicate",
  requireAdmin,
  duplicatePage
);

router.delete(
  "/admin/:id/pages/:pageId",
  requireAdmin,
  deletePage
);

router.patch(
  "/admin/:id/pages/reorder",
  requireAdmin,
  reorderPages
);


router.get(
  "/admin/:id/global-layout",
  requireAdmin,
  getAdminGlobalLayout
);

router.put(
  "/admin/:id/global-layout",
  requireAdmin,
  updateAdminGlobalLayout
);


router.patch("/sections/:sectionId", requireAdmin, updateSection);

router.delete("/sections/:sectionId", requireAdmin, deleteSection);


// Admin-only template management.
router.get("/admin", requireAdmin, getAdminTemplates);
router.post("/", requireAdmin, createTemplate);
router.get("/admin/:id", requireAdmin, getAdminTemplate);
router.patch("/:id/category", requireAdmin, assignTemplateCategory);
router.patch("/:id", requireAdmin, updateTemplate);
router.patch("/:id/status", requireAdmin, updateTemplateStatus);
router.delete("/:id", requireAdmin, deleteTemplate);

// Public detail: published templates only.
router.get("/:id", getTemplate);

module.exports = router;
