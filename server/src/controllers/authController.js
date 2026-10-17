import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signToken, attachAuthCookie, clearAuthCookie } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Enforce PATIENT role for public registration
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      passwordHash,
      role: 'PATIENT',
    });

    const token = signToken({ id: user._id, role: user.role });
    attachAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    const token = signToken({ id: user._id, role: user.role });
    attachAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
