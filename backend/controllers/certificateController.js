import * as certificateService from '../services/certificateService.js';

export const createCertificate = async (req, res, next) => {
  try {
    const certificate = await certificateService.createCertificate(req.body);
    res.status(201).json(certificate);
  } catch (err) {
    next(err);
  }
};

export const getCertificates = async (req, res, next) => {
  try {
    const certificates = await certificateService.getCertificates();
    res.json(certificates);
  } catch (err) {
    next(err);
  }
};
