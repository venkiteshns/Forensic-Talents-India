import Event from '../models/Event.js';
import { eventCloudinary } from '../config/cloudinary.js';

export const getAllEvents = async () => {
  return await Event.find().sort({ createdAt: -1 });
};

export const createEvent = async (data, files) => {
  const { title, description, eventDate } = data;
  let coverImageUrl = "";
  let additionalImageUrls = [];

  if (files && files.coverImage && files.coverImage.length > 0) {
    const file = files.coverImage[0];
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    const cldRes = await eventCloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "events" });
    coverImageUrl = cldRes.secure_url;
  }

  if (files && files.additionalImages && files.additionalImages.length > 0) {
    for (const file of files.additionalImages) {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const cldRes = await eventCloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "events" });
      additionalImageUrls.push(cldRes.secure_url);
    }
  }

  const newEvent = new Event({
    title,
    description,
    eventDate,
    coverImage: coverImageUrl,
    images: additionalImageUrls
  });

  return await newEvent.save();
};

export const updateEvent = async (id, data, files) => {
  const { title, description, eventDate } = data;
  let existingImages = data.existingImages ? JSON.parse(data.existingImages) : [];

  const event = await Event.findById(id);
  if (!event) throw new Error("Event not found");

  event.title = title || event.title;
  event.description = description || event.description;
  if (eventDate) event.eventDate = eventDate;

  if (files && files.coverImage && files.coverImage.length > 0) {
    const file = files.coverImage[0];
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    const cldRes = await eventCloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "events" });
    event.coverImage = cldRes.secure_url;
  }

  let newAdditionalImageUrls = [];
  if (files && files.additionalImages && files.additionalImages.length > 0) {
    for (const file of files.additionalImages) {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const cldRes = await eventCloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "events" });
      newAdditionalImageUrls.push(cldRes.secure_url);
    }
  }

  event.images = [...existingImages, ...newAdditionalImageUrls].slice(0, 9);
  return await event.save();
};

export const deleteEvent = async (id) => {
  return await Event.findByIdAndDelete(id);
};
