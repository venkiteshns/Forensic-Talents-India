import * as resourceService from '../services/resourceService.js';

export const getResources = async (req, res, next) => {
  try {
    const resources = await resourceService.getAllResources();
    res.json(resources);
  } catch (err) { next(err); }
};

export const createResource = async (req, res, next) => {
  try {
    const resource = await resourceService.createResource(req.body);
    res.status(201).json(resource);
  } catch (err) { next(err); }
};

export const updateResource = async (req, res, next) => {
  try {
    const updated = await resourceService.updateResource(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteResource = async (req, res, next) => {
  try {
    await resourceService.deleteResource(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) { next(err); }
};

export const uploadFile = async (req, res, next) => {
  try {
    const url = await resourceService.uploadFile(req.file);
    res.json({ success: true, url });
  } catch (err) { next(err); }
};
