import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/BookingController';
import { protect, authorize } from '../middleware/auth';
import { bookingValidation, idParamValidation } from '../middleware/validators';

const router = express.Router();

// Public routes
router.post('/', bookingValidation, createBooking);

// Protected routes (admin only)
router.get('/', protect, authorize(['admin']), getBookings);
router.get('/:id', protect, authorize(['admin']), idParamValidation, getBookingById);
router.patch('/:id', protect, authorize(['admin']), idParamValidation, updateBookingStatus);
router.delete('/:id', protect, authorize(['admin']), idParamValidation, deleteBooking);

export default router;