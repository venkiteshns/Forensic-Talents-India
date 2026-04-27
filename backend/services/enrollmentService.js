import Enrollment from '../models/Enrollment.js';
import cloudinary from '../config/cloudinary.js';
import transporter from '../config/nodemailer.js';

export const processEnrollment = async (data, file) => {
  const { name, email, phone, nationality, qualification, status, institutionName, organizationName, transactionId, targetType, targetName, mode, additionalInfo } = data;

  if (!file) throw new Error('Payment proof is required');

  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataURI = "data:" + file.mimetype + ";base64," + b64;
  const cldRes = await cloudinary.uploader.upload(dataURI, { resource_type: "auto", folder: "forensic_talents_enrollments" });
  const paymentProofUrl = cldRes.secure_url;

  const newEnrollment = new Enrollment({
    name, email, phone, nationality, qualification, status, institutionName, organizationName, transactionId, paymentProofUrl, targetType, targetName, mode, additionalInfo
  });

  await newEnrollment.save();

  // Admin notification
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `New Enrollment: ${targetName}`,
    html: `
      <h2>New Enrollment Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Nationality:</strong> ${nationality}</p>
      <p><strong>Qualification:</strong> ${qualification}</p>
      <p><strong>Status:</strong> ${status}</p>
      ${institutionName ? `<p><strong>Institution:</strong> ${institutionName}</p>` : ''}
      ${organizationName ? `<p><strong>Organization:</strong> ${organizationName}</p>` : ''}
      <hr/>
      <h3>Enrollment Details</h3>
      <p><strong>Target Type:</strong> ${targetType}</p>
      <p><strong>Target Name:</strong> ${targetName}</p>
      ${mode ? `<p><strong>Mode:</strong> ${mode}</p>` : ''}
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
      <p><strong>Payment Proof:</strong> <a href="${paymentProofUrl}">View Image</a></p>
      ${additionalInfo ? `<p><strong>Additional Info:</strong> ${additionalInfo}</p>` : ''}
    `
  };

  transporter.sendMail(mailOptions).catch(err => console.error("Admin enrollment email failed", err));

  return newEnrollment;
};

export const getEnrollments = async (targetType, statusApproval) => {
  let filter = {};
  if (targetType && targetType !== 'All') filter.targetType = targetType;
  if (statusApproval && statusApproval !== 'All') filter.statusApproval = statusApproval;

  return await Enrollment.find(filter).sort({ createdAt: -1 });
};

export const approveEnrollment = async (id) => {
  const enrollment = await Enrollment.findById(id);
  if (!enrollment) throw new Error('Enrollment not found');

  enrollment.statusApproval = 'approved';
  await enrollment.save();

  const mailOptions = {
    from: `"Forensic Talents" <${process.env.EMAIL_USER}>`,
    to: enrollment.email,
    subject: `Enrollment Approved - ${enrollment.targetName}`,
    html: `
      <h2>Congratulations ${enrollment.name}!</h2>
      <p>Your enrollment for <strong>${enrollment.targetName}</strong> has been successfully approved.</p>
      <p>Our team will contact you shortly with further updates and instructions.</p>
      <p>If you have any queries, feel free to contact us on <a href="mailto:forensictalents@gmail.com">forensictalents@gmail.com</a> or +91 7046669919.</p>
      <br/>
      <p>Best regards,<br/>
        <strong>Mr. Arunkumar Kavad</strong><br/>
        CEO, FOR-T INDIA | Gujarat, INDIA
        </p>
    `
  };

  transporter.sendMail(mailOptions).catch(err => console.error("User approval email failed", err));

  return enrollment;
};

export const rejectEnrollment = async (id, reason) => {
  if (!reason) throw new Error('Rejection reason is required');

  const enrollment = await Enrollment.findById(id);
  if (!enrollment) throw new Error('Enrollment not found');

  enrollment.statusApproval = 'rejected';
  enrollment.rejectionReason = reason;
  await enrollment.save();

  const mailOptions = {
    from: `"Forensic Talents" <${process.env.EMAIL_USER}>`,
    to: enrollment.email,
    subject: `Enrollment Update - Application Status`,
    html: `
      <p>Dear ${enrollment.name},</p>
      <p>Thank you for your interest in <strong>${enrollment.targetName}</strong>.</p>
      <p>Your enrollment request has been reviewed and was not approved.</p>
      <p><strong>Reason:</strong><br/>${reason}</p>
      <br/>
      <p>For further clarification, please contact us at <a href="mailto:forensictalents@gmail.com">forensictalents@gmail.com</a> or +91 7046669919.</p>
      <br/>
      <p>Best regards,<br/>
        <strong>Mr. Arunkumar Kavad</strong><br/>
        CEO, FOR-T INDIA | Gujarat, INDIA
        </p>
    `
  };

  transporter.sendMail(mailOptions).catch(err => console.error("User rejection email failed", err));

  return enrollment;
};
