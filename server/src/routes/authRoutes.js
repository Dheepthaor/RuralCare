import express from 'express';
import { register, login, logout, getMe, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

export default router;
