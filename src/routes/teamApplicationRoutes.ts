import express from 'express';
import {
  createTeamApplication,
  getTeamApplications,
  getTeamApplicationById,
  updateTeamApplicationStatus,
  deleteTeamApplication,
} from '../controllers/TeamApplicationController';
import { protect, authorize } from '../middleware/auth';
import { teamApplicationValidation, idParamValidation } from '../middleware/validators';

const router = express.Router();

// Public routes
router.post('/', teamApplicationValidation, createTeamApplication);

// Protected routes (admin only)
router.get('/', protect, authorize(['admin']), getTeamApplications);
router.get('/:id', protect, authorize(['admin']), idParamValidation, getTeamApplicationById);
router.patch('/:id', protect, authorize(['admin']), idParamValidation, updateTeamApplicationStatus);
router.delete('/:id', protect, authorize(['admin']), idParamValidation, deleteTeamApplication);

export default router;