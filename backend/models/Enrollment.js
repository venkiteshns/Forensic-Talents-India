import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  nationality: { type: String },
  qualification: { type: String, required: true },
  status: { type: String, enum: ['Student', 'Professional'], required: true },
  institutionName: { type: String }, // For Student
  organizationName: { type: String }, // For Professional
  transactionId: { type: String, required: true },
  paymentProofUrl: { type: String, required: true },
  targetType: { type: String, required: true }, // e.g., 'Course', 'Internship', 'Quiz'
  targetName: { type: String, required: true }, // e.g., 'Online Internship - 2 months'
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' }, // set when targetType = Internship
  mode: { type: String, enum: ['online', 'offline', 'Online', 'Offline'] }, // system-derived from internship; user-controlled for course
  priceINR: { type: Number },
  priceUSD: { type: Number },
  additionalInfo: { type: String },
  statusApproval: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  rejectionReason: { type: String },
  rejectedAt: { type: Date, default: null },
  paymentScreenshotPublicId: { type: String }
}, { timestamps: true });

export default mongoose.model('Enrollment', enrollmentSchema);
