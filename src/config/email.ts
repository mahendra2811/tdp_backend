import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your_email@example.com',
    pass: process.env.EMAIL_PASS || 'your_email_password',
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
export const verifyEmailConfig = async (): Promise<void> => {
  try {
    await transporter.verify();
    console.log('Email server connection verified');
  } catch (error) {
    console.error('Email server connection error:', error);
  }
};

// Send email function
export const sendEmail = async (
  to: string | string[],
  subject: string,
  html: string,
  from: string = process.env.EMAIL_FROM || 'your_email@example.com'
): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default transporter;