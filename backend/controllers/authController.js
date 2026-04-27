import * as authService from '../services/authService.js';

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  try {
    const result = await authService.loginAdmin(email, password);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required' });
  try {
    const result = await authService.refreshAuthToken(refreshToken);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });
  try {
    await authService.logoutAdmin(refreshToken);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};
