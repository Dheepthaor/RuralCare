import express from 'express';
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  adminGetAppointments,
  adminUpdateAppointment,
} from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';

const router = express.Router();

// Patient routes (require authentication)
router.post('/', authenticate, bookAppointment);
router.get('/my', authenticate, getMyAppointments);
router.patch('/:id/cancel', authenticate, cancelAppointment);

// Admin management routes
router.get('/admin', authenticate, authorizeAdmin, adminGetAppointments);
router.patch('/admin/:id', authenticate, authorizeAdmin, adminUpdateAppointment);

export default router;
