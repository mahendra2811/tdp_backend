import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import TeamApplication from '../models/TeamApplication';
import { sendEmail } from '../config/email';

/**
 * Create a new team application
 * @route POST /api/team-applications
 * @access Public
 */
export const createTeamApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    // Create new team application
    const application = new TeamApplication(req.body);
    await application.save();

    // Send email notification
    await sendNotificationEmail(application);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error: any) {
    console.error('Error creating team application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get all team applications
 * @route GET /api/team-applications
 * @access Private (Admin)
 */
export const getTeamApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await TeamApplication.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error: any) {
    console.error('Error fetching team applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get a single team application by ID
 * @route GET /api/team-applications/:id
 * @access Private (Admin)
 */
export const getTeamApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await TeamApplication.findById(req.params.id);
    
    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Team application not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    console.error('Error fetching team application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Update team application status
 * @route PATCH /api/team-applications/:id
 * @access Private (Admin)
 */
export const updateTeamApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
      return;
    }
    
    const application = await TeamApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Team application not found',
      });
      return;
    }
    
    // If status is changed to accepted or rejected, send notification email to applicant
    if (status === 'accepted' || status === 'rejected') {
      await sendStatusUpdateEmail(application);
    }
    
    res.status(200).json({
      success: true,
      message: 'Team application status updated successfully',
      data: application,
    });
  } catch (error: any) {
    console.error('Error updating team application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Delete a team application
 * @route DELETE /api/team-applications/:id
 * @access Private (Admin)
 */
export const deleteTeamApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await TeamApplication.findByIdAndDelete(req.params.id);
    
    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Team application not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Team application deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting team application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Send email notification for new team application
 */
const sendNotificationEmail = async (application: any): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const subject = 'New Team Application Received';
  
  // Create HTML content for email
  const html = `
    <h1>New Team Application Received</h1>
    <p>A new application to join the team has been received with the following details:</p>
    <ul>
      <li><strong>Name:</strong> ${application.name}</li>
      <li><strong>Mobile:</strong> ${application.mobile}</li>
      <li><strong>Address:</strong> ${application.address}</li>
    </ul>
    <p><strong>Reason for joining:</strong> ${application.reason}</p>
    ${application.extra ? `<p><strong>Additional Comments:</strong> ${application.extra}</p>` : ''}
    <p>Please log in to the admin dashboard to review this application.</p>
  `;
  
  try {
    await sendEmail(adminEmail, subject, html);
    console.log('Team application notification email sent successfully');
  } catch (error) {
    console.error('Error sending team application notification email:', error);
  }
};

/**
 * Send status update email to applicant
 */
const sendStatusUpdateEmail = async (application: any): Promise<void> => {
  // Skip if no email is provided
  if (!application.email) {
    console.log('No email provided for applicant, skipping status update email');
    return;
  }
  
  const subject = application.status === 'accepted' 
    ? 'Your Team Application Has Been Accepted' 
    : 'Update on Your Team Application';
  
  // Create HTML content for email based on status
  let html = '';
  
  if (application.status === 'accepted') {
    html = `
      <h1>Congratulations!</h1>
      <p>Dear ${application.name},</p>
      <p>We are pleased to inform you that your application to join the Thar Desert Photography team has been accepted!</p>
      <p>We will contact you shortly with more details about the next steps.</p>
      <p>Thank you for your interest in joining our conservation efforts.</p>
      <p>Best regards,<br>The TDP Team</p>
    `;
  } else {
    html = `
      <h1>Update on Your Application</h1>
      <p>Dear ${application.name},</p>
      <p>Thank you for your interest in joining the Thar Desert Photography team.</p>
      <p>After careful consideration, we regret to inform you that we are unable to accept your application at this time.</p>
      <p>We appreciate your enthusiasm for conservation and encourage you to stay connected with our activities.</p>
      <p>Best regards,<br>The TDP Team</p>
    `;
  }
  
  try {
    await sendEmail(application.email, subject, html);
    console.log(`Status update email sent to applicant (${application.status})`);
  } catch (error) {
    console.error('Error sending status update email to applicant:', error);
  }
};