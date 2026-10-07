const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryMediaStorage {
  async upload(fileBuffer, mimeType, userId) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `website-builder/${userId}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            providerId: result.public_id,
            width: result.width,
            height: result.height,
            mimeType: result.format ? `image/${result.format}` : mimeType,
          });
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  }

  async delete(providerId) {
    if (!providerId) return;
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(providerId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}

// Minimal Storage Abstraction
class MediaStorage {
  constructor(provider) {
    this.provider = provider;
  }

  async upload(fileBuffer, mimeType, userId) {
    return this.provider.upload(fileBuffer, mimeType, userId);
  }

  async delete(providerId) {
    return this.provider.delete(providerId);
  }
}

// Initialize with Cloudinary provider
const storageService = new MediaStorage(new CloudinaryMediaStorage());

module.exports = storageService;
