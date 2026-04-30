import Review from '../models/Review.js';
import cloudinary from '../config/cloudinary.js';
import { deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

export const getApprovedReviews = async (type) => {
  const query = { status: 'approved' };
  if (type && ['service', 'education'].includes(type)) {
    query.type = type;
  }
  return await Review.find(query).sort({ createdAt: -1 });
};

export const getAllReviewsAdmin = async (statusFilter, typeFilter) => {
  let query = {};
  if (statusFilter && statusFilter !== 'all') {
    query.status = statusFilter;
  }
  if (typeFilter && typeFilter !== 'all') {
    query.type = typeFilter;
  }
  return await Review.find(query).sort({ createdAt: -1 });
};

export const createReview = async (data, file) => {
  const { name, email, rating, review, type } = data;
  if (!type || !['service', 'education'].includes(type)) {
    throw new Error('Review type is required. Must be "service" or "education".');
  }

  let photoUrl = "";
  if (file) {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    const cldRes = await cloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "reviews" });
    photoUrl = cldRes.secure_url;
  }

  const newReview = new Review({ name, email, rating, review, type, profileImage: photoUrl });
  return await newReview.save();
};

export const approveReview = async (id) => {
  const review = await Review.findById(id);
  if (!review) throw new Error("Review not found");

  review.status = 'approved';
  return await review.save();
};

export const rejectReview = async (id) => {
  const review = await Review.findById(id);
  if (!review) throw new Error("Review not found");

  if (review.profileImage) {
    await deleteFromCloudinary(review.profileImage, 'image');
    review.profileImage = null;
  }

  review.status = 'rejected';
  return await review.save();
};
