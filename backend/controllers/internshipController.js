import * as internshipService from '../services/internshipService.js';

export const getInternships = async (req, res, next) => {
  try {
    const internships = await internshipService.getAllInternships();
    res.json(internships);
  } catch (err) { next(err); }
};

export const createInternship = async (req, res, next) => {
  try {
    const intern = await internshipService.createInternship(req.body);
    res.status(201).json(intern);
  } catch (err) { next(err); }
};

export const updateInternship = async (req, res, next) => {
  try {
    const updated = await internshipService.updateInternship(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteInternship = async (req, res, next) => {
  try {
    await internshipService.deleteInternship(req.params.id);
    res.json({ success: true, message: 'Internship and associated data deleted successfully' });
  } catch (err) { next(err); }
};

// Benefits
export const getBenefits = async (req, res, next) => {
  try {
    const benefits = await internshipService.getAllBenefits();
    res.json(benefits);
  } catch (err) { next(err); }
};

export const createBenefit = async (req, res, next) => {
  try {
    const benefit = await internshipService.createBenefit(req.body);
    res.status(201).json(benefit);
  } catch (err) { next(err); }
};

export const updateBenefit = async (req, res, next) => {
  try {
    const updated = await internshipService.updateBenefit(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteBenefit = async (req, res, next) => {
  try {
    await internshipService.deleteBenefit(req.params.id);
    res.json({ message: 'Benefit deleted successfully' });
  } catch (err) { next(err); }
};

// Areas
export const getAreas = async (req, res, next) => {
  try {
    const areas = await internshipService.getAllAreas();
    res.json(areas);
  } catch (err) { next(err); }
};

export const createArea = async (req, res, next) => {
  try {
    const area = await internshipService.createArea(req.body);
    res.status(201).json(area);
  } catch (err) { next(err); }
};

export const updateArea = async (req, res, next) => {
  try {
    const updated = await internshipService.updateArea(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteArea = async (req, res, next) => {
  try {
    await internshipService.deleteArea(req.params.id);
    res.json({ message: 'Area deleted successfully' });
  } catch (err) { next(err); }
};
