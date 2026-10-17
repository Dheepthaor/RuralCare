import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Also support Authorization Bearer token header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to continue.',
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or deactivated.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please sign in again.',
    });
  }
};
