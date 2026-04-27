import Internship from '../models/Internship.js';
import InternshipBenefit from '../models/InternshipBenefit.js';
import InternshipArea from '../models/InternshipArea.js';
import mongoose from 'mongoose';

export const getAllInternships = async () => {
  return await Internship.find();
};

export const createInternship = async (data) => {
  const intern = new Internship(data);
  return await intern.save();
};

export const updateInternship = async (id, data) => {
  const updated = await Internship.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  if (!updated) throw new Error('Internship not found');
  return updated;
};

export const deleteInternship = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid internship ID');
  }
  const deleted = await Internship.findByIdAndDelete(id);
  if (!deleted) throw new Error('Internship not found');

  await InternshipBenefit.deleteMany({ internshipId: id });
  await InternshipArea.deleteMany({ internshipId: id });

  return deleted;
};

// Benefits
export const getAllBenefits = async () => {
  return await InternshipBenefit.find().sort({ order: 1 });
};

export const createBenefit = async (data) => {
  const benefit = new InternshipBenefit(data);
  return await benefit.save();
};

export const updateBenefit = async (id, data) => {
  const updated = await InternshipBenefit.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  if (!updated) throw new Error('Benefit not found');
  return updated;
};

export const deleteBenefit = async (id) => {
  const deleted = await InternshipBenefit.findByIdAndDelete(id);
  if (!deleted) throw new Error('Benefit not found');
  return deleted;
};

// Areas
export const getAllAreas = async () => {
  return await InternshipArea.find().sort({ order: 1 });
};

export const createArea = async (data) => {
  const area = new InternshipArea(data);
  return await area.save();
};

export const updateArea = async (id, data) => {
  const updated = await InternshipArea.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  if (!updated) throw new Error('Area not found');
  return updated;
};

export const deleteArea = async (id) => {
  const deleted = await InternshipArea.findByIdAndDelete(id);
  if (!deleted) throw new Error('Area not found');
  return deleted;
};
