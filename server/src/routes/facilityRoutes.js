import express from 'express';
import {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  toggleFacilityStatus,
} from '../controllers/facilityController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';

const router = express.Router();

router.get('/', getFacilities);
router.get('/:id', getFacilityById);
router.post('/', authenticate, authorizeAdmin, createFacility);
router.put('/:id', authenticate, authorizeAdmin, updateFacility);
router.patch('/:id/status', authenticate, authorizeAdmin, toggleFacilityStatus);

export default router;
