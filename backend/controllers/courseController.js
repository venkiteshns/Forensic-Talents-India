import * as courseService from '../services/courseService.js';

export const getCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (err) { next(err); }
};

export const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json(course);
  } catch (err) { next(err); }
};

export const updateCourse = async (req, res, next) => {
  try {
    const updated = await courseService.updateCourse(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteCourse = async (req, res, next) => {
  try {
    await courseService.deleteCourse(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) { next(err); }
};
