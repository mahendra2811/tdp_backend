import express from 'express';
import {
  createRedirect,
  getRedirects,
  getRedirectById,
  updateRedirect,
  deleteRedirect,
  handleRedirect,
} from '../controllers/RedirectController';
import { protect, authorize } from '../middleware/auth';
import { redirectValidation, idParamValidation } from '../middleware/validators';

const router = express.Router();

// Public routes
router.get('/r/:slug', handleRedirect);

// Protected routes (admin only)
router.post('/', protect, authorize(['admin']), redirectValidation, createRedirect);
router.get('/', protect, authorize(['admin']), getRedirects);
router.get('/:id', protect, authorize(['admin']), idParamValidation, getRedirectById);
router.put('/:id', protect, authorize(['admin']), idParamValidation, redirectValidation, updateRedirect);
router.delete('/:id', protect, authorize(['admin']), idParamValidation, deleteRedirect);

export default router;