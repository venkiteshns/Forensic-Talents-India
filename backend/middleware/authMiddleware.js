import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    try {
      const token = auth.split(' ')[1];
      req.admin = jwt.verify(token, process.env.JWT_SECRET || 'forensic_secret');
      return next();
    } catch (e) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token' });
};
