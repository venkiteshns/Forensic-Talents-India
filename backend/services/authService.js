import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET || 'forensic_secret',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: admin._id },
    process.env.JWT_REFRESH_SECRET || 'forensic_refresh_secret',
    { expiresIn: '7d' }
  );

  admin.refreshTokens.push(refreshToken);
  await admin.save();

  return { token, refreshToken, admin: { name: admin.name, email: admin.email } };
};

export const refreshAuthToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'forensic_refresh_secret');
  const admin = await Admin.findById(decoded.id);

  if (!admin || !admin.refreshTokens.includes(refreshToken)) {
    throw new Error('Invalid refresh token');
  }

  admin.refreshTokens = admin.refreshTokens.filter(t => t !== refreshToken);

  const newToken = jwt.sign(
    { id: admin._id, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET || 'forensic_secret',
    { expiresIn: '15m' }
  );

  const newRefreshToken = jwt.sign(
    { id: admin._id },
    process.env.JWT_REFRESH_SECRET || 'forensic_refresh_secret',
    { expiresIn: '7d' }
  );

  admin.refreshTokens.push(newRefreshToken);
  await admin.save();

  return { token: newToken, refreshToken: newRefreshToken };
};

export const logoutAdmin = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'forensic_refresh_secret', { ignoreExpiration: true });
  const admin = await Admin.findById(decoded.id);

  if (admin) {
    admin.refreshTokens = admin.refreshTokens.filter(t => t !== refreshToken);
    await admin.save();
  }
};
