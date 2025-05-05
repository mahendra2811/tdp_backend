const nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration from .env
const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Required for Mailtrap live service
  requireTLS: true,
};

console.log('Email Configuration:');
console.log('-------------------');
console.log(`Host: ${emailConfig.host}`);
console.log(`Port: ${emailConfig.port}`);
console.log(`Secure: ${emailConfig.secure}`);
console.log(`User: ${emailConfig.auth.user}`);
console.log(`From: ${process.env.EMAIL_FROM}`);
console.log('-------------------\n');

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Test email content
const testEmail = {
  from: process.env.EMAIL_FROM,
  to: 'test@example.com', // This email won't actually receive anything if using Mailtrap
  subject: 'Test Email from Thar Desert Photography',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h1 style="color: #b8860b;">Thar Desert Photography</h1>
      <h2>Email System Test</h2>
      <p>This is a test email to verify that the email system is working correctly.</p>
      <p>If you're using Mailtrap, you should see this email in your Mailtrap inbox.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #777; font-size: 14px;">
          Thar Desert Photography<br>
          Jaisalmer, Rajasthan, India<br>
          <a href="https://thardesertphotography.com">thardesertphotography.com</a>
        </p>
      </div>
    </div>
  `,
};

// Verify connection and send test email
async function testEmailSystem() {
  try {
    // Verify connection
    console.log('Verifying email server connection...');
    await transporter.verify();
    console.log('✅ Email server connection verified successfully!\n');

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);

    if (emailConfig.host.includes('mailtrap')) {
      console.log('\nSince you are using Mailtrap:');
      console.log('1. Log in to your Mailtrap account');
      console.log('2. Go to the inbox you configured');
      console.log('3. You should see the test email there');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check your .env file for correct email configuration');
    console.log('2. If using Gmail, make sure you have:');
    console.log('   - Enabled "Less secure app access" or');
    console.log('   - Created an app password if using 2FA');
    console.log('3. If using Mailtrap, verify your credentials');
  }
}

// Run the test
testEmailSystem();
