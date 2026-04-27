import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  nationality: { type: String, required: true },
  qualification: { type: String, required: true },
  status: { type: String, enum: ['Student', 'Professional'], required: true },
  institutionName: { type: String }, // For Student
  organizationName: { type: String }, // For Professional
  transactionId: { type: String, required: true },
  paymentProofUrl: { type: String, required: true },
  targetType: { type: String, required: true }, // e.g., 'Course', 'Internship', 'Quiz'
  targetName: { type: String, required: true }, // e.g., 'Cyber Security - 6 Months'
  mode: { type: String }, // online/offline
  additionalInfo: { type: String },
  statusApproval: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String }
}, { timestamps: true });

export default mongoose.model('Enrollment', enrollmentSchema);
