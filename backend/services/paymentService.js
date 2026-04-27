import PaymentSettings from '../models/PaymentSettings.js';
import cloudinary from '../config/cloudinary.js';
import { deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

export const getPaymentSettings = async () => {
  let settings = await PaymentSettings.findOne();
  if (!settings) {
    settings = new PaymentSettings({
      accountName: "Forensic Talents",
      accountNumber: "1234567890",
      ifscCode: "XXXX0000000",
      bankName: "Example Bank",
    });
    await settings.save();
  }
  return settings;
};

export const updatePaymentSettings = async (data, file) => {
  const { accountName, accountNumber, ifscCode, bankName } = data;
  let settings = await PaymentSettings.findOne();
  if (!settings) {
    settings = new PaymentSettings({ accountName, accountNumber, ifscCode, bankName });
  } else {
    if (accountName) settings.accountName = accountName;
    if (accountNumber) settings.accountNumber = accountNumber;
    if (ifscCode) settings.ifscCode = ifscCode;
    if (bankName) settings.bankName = bankName;
  }

  if (file) {
    // Delete old QR code from Cloudinary before uploading the new one
    if (settings.qrCodeUrl) {
      await deleteFromCloudinary(settings.qrCodeUrl, 'image');
    }
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    const cldRes = await cloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "forensic_talents_payment" });
    settings.qrCodeUrl = cldRes.secure_url;
  }

  return await settings.save();
};

