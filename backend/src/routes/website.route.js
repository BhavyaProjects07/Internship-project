const express = require("express");

const {
  createWebsite,
  getWebsite,
  updateWebsiteSection,
  reorderSections,
} = require("../controllers/website.controller");

const router = express.Router();

router.post("/", createWebsite);
router.get("/:id", getWebsite);
router.patch(
  "/sections/:sectionId",
  updateWebsiteSection
);

router.patch(
  "/pages/:pageId/sections/reorder",
  reorderSections
);
module.exports = router;