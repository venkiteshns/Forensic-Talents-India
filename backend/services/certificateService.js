import Certificate from '../models/Certificate.js';
import Counter from '../models/Counter.js';
import Quiz from '../models/Quiz.js';

const normalize = (str) => {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/\s+/g, " ");
};

export const createCertificate = async ({ name, email, marksScored }) => {
  // Fetch the first/only quiz document
  const quiz = await Quiz.findOne().sort({ createdAt: -1 });
  if (!quiz) {
    throw new Error('No quiz found in the database');
  }

  // Store date like: "2026-04-25"
  const formattedDate = new Date(quiz.date).toISOString().split('T')[0];

  // Atomically get and increment the counter
  let counter = await Counter.findOneAndUpdate(
    { id: 'certificateNumber' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after' }
  );

  if (!counter) {
    try {
      const newCounter = new Counter({ id: 'certificateNumber', seq: 260501 });
      await newCounter.save();
      counter = newCounter;
    } catch (err) {
      // If concurrent insert happened, find it and increment
      if (err.code === 11000) {
        counter = await Counter.findOneAndUpdate(
          { id: 'certificateNumber' },
          { $inc: { seq: 1 } },
          { returnDocument: 'after' }
        );
      } else {
        throw err;
      }
    }
  }

  const seqNumber = counter.seq;
  const certificateNumber = `FOR-T/CS/${seqNumber}`;

  const certificate = new Certificate({
    name,
    email,
    quizName: quiz.title,
    quizDate: formattedDate,
    marksScored: marksScored || 'N/A', // optional, defaults to N/A
    certificateNumber
  });

  await certificate.save();
  return certificate;
};

export const getCertificates = async () => {
  return await Certificate.find().sort({ createdAt: -1 });
};

export const verifyCertificate = async (certificateNumber, participantName) => {
  const certificate = await Certificate.findOne({ certificateNumber });
  if (!certificate) {
    throw new Error('Certificate not found');
  }

  if (normalize(certificate.name) !== normalize(participantName)) {
    throw new Error('Name does not match our records');
  }

  return certificate;
};

export const resendCertificate = async (certificateNumber) => {
  const certificate = await Certificate.findOne({ certificateNumber });
  if (!certificate) {
    throw new Error('Certificate not found');
  }

  const externalUrl = process.env.CERTIFICATE_RESEND_EXTERNAL_URL;
  if (!externalUrl) {
    throw new Error('Resend service URL not configured');
  }

  try {
    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ certificateNumber }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`External Service Error [${response.status}]:`, errorText);
      throw new Error(`External service responded with status ${response.status}`);
    }

    return { message: 'Your request has been processed. The certificate will be delivered to your registered email address shortly.' };
  } catch (err) {
    console.error('Resend Service Exception:', err.message);
    throw new Error('We are currently unable to process your resend request. Please try again after some time or contact support.');
  }
};
