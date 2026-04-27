import * as reviewService from '../services/reviewService.js';

export const getReviews = async (req, res, next) => {
  try {
    const { type } = req.query;
    const reviews = await reviewService.getApprovedReviews(type);
    res.json(reviews);
  } catch (err) { next(err); }
};

export const getAdminReviews = async (req, res, next) => {
  try {
    const { type, isApproved } = req.query;
    const reviews = await reviewService.getAllReviewsAdmin(type, isApproved);
    res.json(reviews);
  } catch (err) { next(err); }
};

export const submitReview = async (req, res, next) => {
  try {
    await reviewService.createReview(req.body, req.file);
    res.status(201).json({ message: "Review submitted for approval" });
  } catch (err) { next(err); }
};

export const approveReview = async (req, res, next) => {
  try {
    const review = await reviewService.toggleReviewApproval(req.params.id);
    res.json(review);
  } catch (err) { next(err); }
};

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) { next(err); }
};
