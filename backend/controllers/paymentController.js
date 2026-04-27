import * as paymentService from '../services/paymentService.js';

export const getPaymentSettings = async (req, res, next) => {
  try {
    const settings = await paymentService.getPaymentSettings();
    res.json(settings);
  } catch (err) { next(err); }
};

export const updatePaymentSettings = async (req, res, next) => {
  try {
    const settings = await paymentService.updatePaymentSettings(req.body, req.file);
    res.json(settings);
  } catch (err) { next(err); }
};
