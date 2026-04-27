import Course from '../models/Course.js';

export const getAllCourses = async () => {
  return await Course.find();
};

export const createCourse = async (courseData) => {
  const course = new Course(courseData);
  return await course.save();
};

export const updateCourse = async (id, courseData) => {
  const updated = await Course.findByIdAndUpdate(id, courseData, { returnDocument: 'after' });
  if (!updated) throw new Error('Course not found');
  return updated;
};

export const deleteCourse = async (id) => {
  const deleted = await Course.findByIdAndDelete(id);
  if (!deleted) throw new Error('Course not found');
  return deleted;
};
