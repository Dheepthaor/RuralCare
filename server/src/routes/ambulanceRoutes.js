import express from 'express';
import {
  getAmbulanceContacts,
  createAmbulanceContact,
  updateAmbulanceContact,
  toggleAmbulanceStatus,
} from '../controllers/ambulanceController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';

const router = express.Router();

router.get('/', getAmbulanceContacts);
router.post('/', authenticate, authorizeAdmin, createAmbulanceContact);
router.put('/:id', authenticate, authorizeAdmin, updateAmbulanceContact);
router.patch('/:id/status', authenticate, authorizeAdmin, toggleAmbulanceStatus);

export default router;
