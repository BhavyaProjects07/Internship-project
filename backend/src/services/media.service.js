const { PrismaClient } = require("@prisma/client");
const storageService = require("./storage.service");
const prisma = new PrismaClient();

const getMediaAssets = async (userId) => {
  return await prisma.mediaAsset.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

const getMediaAssetById = async (id, userId) => {
  return await prisma.mediaAsset.findFirst({
    where: { id, userId },
  });
};

const createMediaAsset = async (userId, data) => {
  return await prisma.mediaAsset.create({
    data: {
      userId,
      url: data.url,
      filename: data.filename || "Untitled",
      alt: data.alt || null,
      mimeType: data.mimeType || null,
      width: data.width || null,
      height: data.height || null,
      provider: data.provider || "url",
      providerId: data.providerId || null,
    },
  });
};

const updateMediaAsset = async (id, userId, data) => {
  const asset = await getMediaAssetById(id, userId);
  if (!asset) throw new Error("Media asset not found");

  return await prisma.mediaAsset.update({
    where: { id },
    data,
  });
};

const deleteMediaAsset = async (id, userId) => {
  const asset = await getMediaAssetById(id, userId);
  if (!asset) throw new Error("Media asset not found");

  // If this asset was uploaded via a storage provider, delete it from the provider first
  if (asset.provider !== "url" && asset.providerId) {
    try {
      await storageService.delete(asset.providerId);
    } catch (error) {
      console.error("Failed to delete asset from storage provider:", error);
      // We can choose to throw or continue. Continuing allows the DB record to be cleaned up
      // if Cloudinary fails, but throwing is safer to prevent orphans.
      throw new Error("Failed to delete asset from storage provider");
    }
  }

  // Delete the database record
  return await prisma.mediaAsset.delete({
    where: { id },
  });
};

module.exports = {
  getMediaAssets,
  getMediaAssetById,
  createMediaAsset,
  updateMediaAsset,
  deleteMediaAsset,
};
