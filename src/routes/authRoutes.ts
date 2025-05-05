import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/AuthController';
import { protect, authorize } from '../middleware/auth';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  updateUserValidation,
  idParamValidation,
} from '../middleware/validators';

const router = express.Router();

// Public routes
router.post('/login', loginValidation, login);

// Protected routes (all authenticated users)
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfileValidation, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);

// Protected routes (admin only)
router.post('/register', protect, authorize(['admin']), registerValidation, register);
router.get('/users', protect, authorize(['admin']), getUsers);
router.put('/users/:id', protect, authorize(['admin']), idParamValidation, updateUserValidation, updateUser);
router.delete('/users/:id', protect, authorize(['admin']), idParamValidation, deleteUser);

export default router;