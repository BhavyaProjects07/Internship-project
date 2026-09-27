const express = require("express");

const {
  getTemplates,
  getTemplate,
} = require("../controllers/template.controller");

const router = express.Router();

router.get("/", getTemplates);
router.get("/:id", getTemplate);

module.exports = router;