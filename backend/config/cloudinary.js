import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("WARNING: Cloudinary environment variables are missing!");
}

export const eventCloudinary = cloudinary;
if (process.env.CLOUDINARY_EVENT_CLOUD_NAME) {
  eventCloudinary.config({
    cloud_name: process.env.CLOUDINARY_EVENT_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_EVENT_API_KEY,
    api_secret: process.env.CLOUDINARY_EVENT_API_SECRET
  });
}

export default cloudinary;
