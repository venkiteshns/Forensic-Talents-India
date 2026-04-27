import mongoose from 'mongoose';

const paymentSettingsSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  bankName: { type: String, required: true },
  qrCodeUrl: { type: String } // Optional QR Code Image
}, { timestamps: true });

export default mongoose.model('PaymentSettings', paymentSettingsSchema);
