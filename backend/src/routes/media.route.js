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

// Multer memory storage configuration with 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file format. Only JPEG, PNG, WebP, GIF, and SVG images are supported.")
      );
    }
    cb(null, true);
  },
});

/**
 * Custom Multer upload wrapper to handle file-size and format errors cleanly
 */
const handleUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Uploaded file exceeds the maximum 10MB size limit.",
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error occurred",
      });
    }
    next();
  });
};

const router = express.Router();

router.get("/", getMediaAssets);
router.post("/", createMediaAsset);
router.post("/upload", handleUpload, uploadMediaAsset);
router.get("/:id", getMediaAsset);
router.patch("/:id", updateMediaAsset);
router.delete("/:id", deleteMediaAsset);

module.exports = router;
