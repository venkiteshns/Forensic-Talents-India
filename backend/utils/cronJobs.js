import cron from 'node-cron';
import Enrollment from '../models/Enrollment.js';
import cloudinary from '../config/cloudinary.js';

export const startCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      const cutoff = new Date(Date.now() - THIRTY_DAYS);

      const enrollments = await Enrollment.find({
        statusApproval: "rejected",
        rejectedAt: { $lte: cutoff }
      });

      for (const enrollment of enrollments) {
        if (enrollment.paymentScreenshotPublicId) {
          try {
            await cloudinary.uploader.destroy(enrollment.paymentScreenshotPublicId);
          } catch (err) {
            console.error('Failed to delete cloudinary image:', err);
          }
        }
        await enrollment.deleteOne();
      }
      if (enrollments.length > 0) {
        console.log(`Cleaned up ${enrollments.length} rejected enrollments.`);
      }
    } catch (err) {
      console.error('Error in cron job cleanup:', err);
    }
  });
};
