const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  setCategoryStatus,
  deleteCategory,
} = require("../controllers/category.controller");

const router = express.Router();

// Public: active categories only
router.get("/", getCategories);
router.get("/:id", getCategory);

// Admin-only management
router.post("/", requireAdmin, createCategory);
router.patch("/:id", requireAdmin, updateCategory);
router.patch("/:id/status", requireAdmin, setCategoryStatus);
router.delete("/:id", requireAdmin, deleteCategory);

module.exports = router;