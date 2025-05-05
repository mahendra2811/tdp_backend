import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
} from '../controllers/LeadController';
import { protect, authorize } from '../middleware/auth';
import { leadValidation, idParamValidation } from '../middleware/validators';

const router = express.Router();

// Public routes
router.post('/', leadValidation, createLead);

// Protected routes (admin only)
router.get('/', protect, authorize(['admin']), getLeads);
router.get('/:id', protect, authorize(['admin']), idParamValidation, getLeadById);
router.patch('/:id', protect, authorize(['admin']), idParamValidation, updateLeadStatus);
router.delete('/:id', protect, authorize(['admin']), idParamValidation, deleteLead);

export default router;