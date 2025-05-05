const nodemailer = require('nodemailer');
require('dotenv').config();

// Mailtrap sandbox configuration
// Replace these with your actual Mailtrap sandbox credentials
const sandboxConfig = {
  host: "sandbox.smtp.mailtrap.io", // Note: different host for sandbox
  port: 2525, // Different port for sandbox
  secure: false,
  auth: {
    user: "YOUR_SANDBOX_USER", // Replace with your sandbox user
    pass: "YOUR_SANDBOX_PASSWORD" // Replace with your sandbox password
  }
};

console.log('Mailtrap Sandbox Configuration:');
console.log('-------------------');
console.log(`Host: ${sandboxConfig.host}`);
console.log(`Port: ${sandboxConfig.port}`);
console.log(`Secure: ${sandboxConfig.secure}`);
console.log(`User: ${sandboxConfig.auth.user}`);
console.log('-------------------\n');

// Create transporter with sandbox config
const transporter = nodemailer.createTransport(sandboxConfig);

// Test email content
// Note: In sandbox mode, you can use ANY from address for testing
const testEmail = {
  from: 'noreply@thardesertphotography.com', // Any email works in sandbox mode
  to: 'test@example.com', // This email won't actually receive anything in sandbox mode
  subject: 'Test Email from Thar Desert Photography (Sandbox)',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h1 style="color: #b8860b;">Thar Desert Photography</h1>
      <h2>Email System Test (Sandbox Mode)</h2>
      <p>This is a test email to verify that the email system is working correctly using Mailtrap's sandbox environment.</p>
      <p>In sandbox mode, emails are not actually delivered but captured in your Mailtrap testing inbox.</p>
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
    console.log('Using FROM address:', testEmail.from, '(sandbox mode allows any address)');
    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);

    console.log('\nSince you are using Mailtrap Sandbox:');
    console.log('1. Log in to your Mailtrap account');
    console.log('2. Go to the testing inbox you configured');
    console.log('3. You should see the test email there');
    console.log('\nNote: In sandbox mode, emails are never actually delivered to recipients');
    console.log('They are only captured in your Mailtrap testing inbox');
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure you\'ve replaced the placeholder credentials with your actual Mailtrap sandbox credentials');
    console.log('2. Check that you\'re using the correct host (sandbox.smtp.mailtrap.io) and port (2525)');
    console.log('3. Verify your Mailtrap account is active');
  }
}

// Run the test
testEmailSystem();