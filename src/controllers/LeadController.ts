import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Lead from '../models/Lead';
import { sendEmail } from '../config/email';

/**
 * Create a new lead
 * @route POST /api/leads
 * @access Public
 */
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    // Create new lead
    const lead = new Lead(req.body);
    await lead.save();

    // Send email notification
    await sendNotificationEmail(lead);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: lead,
    });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get all leads
 * @route GET /api/leads
 * @access Private (Admin)
 */
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get a single lead by ID
 * @route GET /api/leads/:id
 * @access Private (Admin)
 */
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error: any) {
    console.error('Error fetching lead:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Update lead status
 * @route PATCH /api/leads/:id
 * @access Private (Admin)
 */
export const updateLeadStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    if (!['new', 'contacted', 'converted', 'closed'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
      return;
    }
    
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: lead,
    });
  } catch (error: any) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Delete a lead
 * @route DELETE /api/leads/:id
 * @access Private (Admin)
 */
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Send email notification for new lead
 */
const sendNotificationEmail = async (lead: any): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const subject = 'New Inquiry Received';
  
  // Create HTML content for email
  const html = `
    <h1>New Inquiry Received</h1>
    <p>A new inquiry has been received with the following details:</p>
    <ul>
      <li><strong>Name:</strong> ${lead.name}</li>
      <li><strong>Email:</strong> ${lead.email}</li>
      <li><strong>Phone:</strong> ${lead.phone}</li>
    </ul>
    ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ''}
    <p>Please log in to the admin dashboard to manage this inquiry.</p>
  `;
  
  try {
    await sendEmail(adminEmail, subject, html);
    console.log('Lead notification email sent successfully');
  } catch (error) {
    console.error('Error sending lead notification email:', error);
  }
};