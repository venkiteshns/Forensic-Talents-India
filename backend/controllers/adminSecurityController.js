import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
  }

  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect current password' });

    admin.password = await bcrypt.hash(newPassword, 10);
    // Optionally log out all sessions by clearing refresh tokens
    admin.refreshTokens = [];
    
    await admin.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password update' });
  }
};

export const changeEmail = async (req, res) => {
  const { password, newEmail } = req.body;

  if (!password || !newEmail) {
    return res.status(400).json({ success: false, message: 'Password and new email are required' });
  }

  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    // Check if email is already taken
    const existingAdmin = await Admin.findOne({ email: newEmail.toLowerCase().trim() });
    if (existingAdmin && existingAdmin._id.toString() !== admin._id.toString()) {
      return res.status(400).json({ success: false, message: 'Email is already in use' });
    }

    admin.email = newEmail.toLowerCase().trim();
    await admin.save();
    
    res.json({ success: true, message: 'Email updated successfully', email: admin.email });
  } catch (error) {
    console.error('Change email error:', error);
    res.status(500).json({ success: false, message: 'Server error during email update' });
  }
};
