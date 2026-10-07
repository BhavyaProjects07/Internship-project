const mediaService = require("../services/media.service");
const storageService = require("../services/storage.service");
const { getAuth } = require("@clerk/express");

const getMediaAssets = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const assets = await mediaService.getMediaAssets(userId);
    res.json({ success: true, data: assets });
  } catch (error) {
    console.error("Error getting media assets:", error);
    res.status(500).json({ success: false, message: "Failed to fetch media assets" });
  }
};

const getMediaAsset = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const asset = await mediaService.getMediaAssetById(req.params.id, userId);
    if (!asset) return res.status(404).json({ success: false, message: "Asset not found" });

    res.json({ success: true, data: asset });
  } catch (error) {
    console.error("Error getting media asset:", error);
    res.status(500).json({ success: false, message: "Failed to fetch media asset" });
  }
};

const createMediaAsset = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { url, filename, alt, mimeType, width, height } = req.body;
    if (!url) return res.status(400).json({ success: false, message: "URL is required" });

    const asset = await mediaService.createMediaAsset(userId, { url, filename, alt, mimeType, width, height });
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    console.error("Error creating media asset:", error);
    res.status(500).json({ success: false, message: "Failed to create media asset" });
  }
};

const uploadMediaAsset = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const file = req.file;
    const mimeType = file.mimetype;

    // Validate mime type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validMimeTypes.includes(mimeType)) {
      return res.status(400).json({ success: false, message: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." });
    }

    // Upload to storage provider
    const uploadResult = await storageService.upload(file.buffer, mimeType, userId);

    try {
      // Create DB record
      const asset = await mediaService.createMediaAsset(userId, {
        url: uploadResult.url,
        filename: file.originalname,
        alt: null,
        mimeType: uploadResult.mimeType,
        width: uploadResult.width,
        height: uploadResult.height,
        provider: "cloudinary",
        providerId: uploadResult.providerId,
      });

      res.status(201).json({ success: true, data: asset });
    } catch (dbError) {
      console.error("Database record creation failed, attempting to clean up storage provider...", dbError);
      try {
        await storageService.delete(uploadResult.providerId);
      } catch (cleanupError) {
        console.error("Cleanup also failed, orphan asset created:", cleanupError);
      }
      return res.status(500).json({ success: false, message: "Failed to persist media asset" });
    }
  } catch (error) {
    console.error("Error uploading media asset:", error);
    res.status(500).json({ success: false, message: "Failed to upload media asset" });
  }
};

const updateMediaAsset = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { alt, filename } = req.body;
    const data = {};
    if (alt !== undefined) data.alt = alt;
    if (filename !== undefined) data.filename = filename;

    const asset = await mediaService.updateMediaAsset(req.params.id, userId, data);
    res.json({ success: true, data: asset });
  } catch (error) {
    console.error("Error updating media asset:", error);
    if (error.message === "Media asset not found") return res.status(404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Failed to update media asset" });
  }
};

const deleteMediaAsset = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    await mediaService.deleteMediaAsset(req.params.id, userId);
    res.json({ success: true, message: "Media asset deleted" });
  } catch (error) {
    console.error("Error deleting media asset:", error);
    if (error.message === "Media asset not found") return res.status(404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Failed to delete media asset" });
  }
};

module.exports = {
  getMediaAssets,
  getMediaAsset,
  createMediaAsset,
  uploadMediaAsset,
  updateMediaAsset,
  deleteMediaAsset,
};
