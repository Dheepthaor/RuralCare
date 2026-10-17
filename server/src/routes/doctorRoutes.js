import express from 'express';
import {
  getDoctors,
  getDoctorById,
  getDoctorAvailability,
  createDoctor,
  updateDoctor,
  toggleDoctorStatus,
} from '../controllers/doctorController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);
router.post('/', authenticate, authorizeAdmin, createDoctor);
router.put('/:id', authenticate, authorizeAdmin, updateDoctor);
router.patch('/:id/status', authenticate, authorizeAdmin, toggleDoctorStatus);

export default router;
