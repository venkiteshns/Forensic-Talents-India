import * as enrollmentService from '../services/enrollmentService.js';

export const enroll = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.processEnrollment(req.body, req.file);
    res.status(201).json({ message: 'Enrollment successful', enrollment });
  } catch (err) { next(err); }
};

export const getEnrollments = async (req, res, next) => {
  try {
    const { targetType, statusApproval } = req.query;
    const enrollments = await enrollmentService.getEnrollments(targetType, statusApproval);
    res.json(enrollments);
  } catch (err) { next(err); }
};

export const approveEnrollment = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.approveEnrollment(req.params.id);
    res.json(enrollment);
  } catch (err) { next(err); }
};

export const rejectEnrollment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const enrollment = await enrollmentService.rejectEnrollment(req.params.id, reason);
    res.json(enrollment);
  } catch (err) { next(err); }
};
