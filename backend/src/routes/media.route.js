const express = require("express");
const multer = require("multer");
const {
  getMediaAssets,
  getMediaAsset,
  createMediaAsset,
  uploadMediaAsset,
  updateMediaAsset,
  deleteMediaAsset,
} = require("../controllers/media.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

const router = express.Router();

router.get("/", getMediaAssets);
router.post("/", createMediaAsset);
router.post("/upload", upload.single("file"), uploadMediaAsset);
router.get("/:id", getMediaAsset);
router.patch("/:id", updateMediaAsset);
router.delete("/:id", deleteMediaAsset);

module.exports = router;
