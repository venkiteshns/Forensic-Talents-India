import cloudinary from '../config/cloudinary.js';

/**
 * Extracts the Cloudinary public_id from a secure_url.
 * Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/filename.jpg
 * Returns: "folder/filename"
 */
export const extractPublicId = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    // Match everything after /upload/v<version>/ or /upload/
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    if (match && match[1]) return match[1];
    return null;
  } catch {
    return null;
  }
};

/**
 * Safely deletes an asset from Cloudinary by its URL.
 * Silently logs errors rather than throwing, so it never blocks primary operations.
 * @param {string} url - The Cloudinary secure_url
 * @param {'image'|'raw'|'video'} resourceType - Cloudinary resource type (default: 'image')
 */
export const deleteFromCloudinary = async (url, resourceType = 'image') => {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`[Cloudinary] Failed to delete asset "${publicId}":`, err.message);
  }
};
