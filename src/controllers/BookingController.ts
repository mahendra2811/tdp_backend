import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Booking from '../models/Booking';
import { sendEmail } from '../config/email';

/**
 * Create a new booking
 * @route POST /api/bookings
 * @access Public
 */
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    // Create new booking
    const booking = new Booking(req.body);
    await booking.save();

    // Send email notification
    await sendNotificationEmail(booking);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get all bookings
 * @route GET /api/bookings
 * @access Private (Admin)
 */
export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get a single booking by ID
 * @route GET /api/bookings/:id
 * @access Private (Admin)
 */
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Update booking status
 * @route PATCH /api/bookings/:id
 * @access Private (Admin)
 */
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
      return;
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Delete a booking
 * @route DELETE /api/bookings/:id
 * @access Private (Admin)
 */
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Send email notification for new booking
 */
const sendNotificationEmail = async (booking: any): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const subject = 'New Booking Request';
  
  // Create HTML content for email
  const html = `
    <h1>New Booking Request</h1>
    <p>A new booking request has been received with the following details:</p>
    <ul>
      <li><strong>Name:</strong> ${booking.name}</li>
      <li><strong>Phone:</strong> ${booking.phone}</li>
      <li><strong>Email:</strong> ${booking.email || 'Not provided'}</li>
      <li><strong>Country:</strong> ${booking.country}${booking.otherCountry ? ` (${booking.otherCountry})` : ''}</li>
      <li><strong>Check-in Date:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</li>
      <li><strong>Check-out Date:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</li>
      <li><strong>Number of Tourists:</strong> ${booking.tourists}</li>
    </ul>
    ${booking.queries ? `<p><strong>Queries/Comments:</strong> ${booking.queries}</p>` : ''}
    <p>Please log in to the admin dashboard to manage this booking.</p>
  `;
  
  try {
    await sendEmail(adminEmail, subject, html);
    console.log('Booking notification email sent successfully');
  } catch (error) {
    console.error('Error sending booking notification email:', error);
  }
};