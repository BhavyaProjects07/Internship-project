const express = require("express");

const {
  createWebsite,
  getWebsite,
  createWebsiteSection,
  updateWebsiteSection,
  reorderSections,
  deleteWebsiteSection,
  updateWebsite,
} = require("../controllers/website.controller");

const router = express.Router();

router.post("/", createWebsite);

router.get("/:id", getWebsite);
router.patch("/:id", updateWebsite);
router.delete(
  "/sections/:sectionId",
  deleteWebsiteSection
);

// Create a new section inside a website page
router.post(
  "/pages/:pageId/sections",
  createWebsiteSection
);

router.patch(
  "/sections/:sectionId",
  updateWebsiteSection
);

router.patch(
  "/pages/:pageId/sections/reorder",
  reorderSections
);

module.exports = router;