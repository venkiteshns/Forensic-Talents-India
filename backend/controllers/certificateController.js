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

export const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateNumber, participantName } = req.body;
    if (!certificateNumber || !participantName) {
      return res.status(400).json({ message: 'Certificate number and participant name are required' });
    }
    const certificate = await certificateService.verifyCertificate(certificateNumber, participantName);
    res.json({ success: true, data: certificate });
  } catch (err) {
    if (err.message === 'Certificate not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err.message === 'Name does not match our records') {
      return res.status(403).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const resendCertificate = async (req, res, next) => {
  try {
    const { certificateNumber } = req.body;
    if (!certificateNumber) {
      return res.status(400).json({ message: 'Certificate number is required' });
    }
    const response = await certificateService.resendCertificate(certificateNumber);
    res.json(response);
  } catch (err) {
    if (err.message === 'Certificate not found') {
      return res.status(404).json({ message: err.message });
    }
    next(err);
  }
};
