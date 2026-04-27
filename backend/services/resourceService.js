import Resource from '../models/Resource.js';
import cloudinary from '../config/cloudinary.js';

export const getAllResources = async () => {
  return await Resource.find().sort({ createdAt: -1 });
};

export const createResource = async (data) => {
  const resource = new Resource(data);
  return await resource.save();
};

export const updateResource = async (id, data) => {
  const updated = await Resource.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  if (!updated) throw new Error('Resource not found');
  return updated;
};

export const deleteResource = async (id) => {
  const deleted = await Resource.findByIdAndDelete(id);
  if (!deleted) throw new Error('Resource not found');
  return deleted;
};

export const uploadFile = async (file) => {
  if (!file) throw new Error('File is required');

  const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
  const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniquePublicId = `${Date.now()}-${sanitizedName.split('.')[0]}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'forensic_talents_resources',
        resource_type: resourceType,
        public_id: uniquePublicId,
        overwrite: false
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(file.buffer);
  });
};
