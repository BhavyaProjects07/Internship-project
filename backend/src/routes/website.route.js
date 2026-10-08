const express = require("express");

const {
  createWebsite,
  getWebsite,
  createWebsiteSection,
  updateWebsiteSection,
  reorderSections,
  deleteWebsiteSection,
  updateWebsite,
  saveWebsiteDraft,
  getUserWebsites,
  publishWebsite,
  getPublicWebsite,
} = require("../controllers/website.controller");

const router = express.Router();

// Public route must come before /:id to avoid treating "public" as an ID
router.get("/public/:slug", getPublicWebsite);

router.get("/", getUserWebsites);
router.post("/", createWebsite);

router.patch("/:id/draft", saveWebsiteDraft);
router.post("/:id/publish", publishWebsite);

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