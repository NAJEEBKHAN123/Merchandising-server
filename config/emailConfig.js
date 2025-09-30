const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
   return nodemailer.createTransport({
  host: 'mail.mymirage.fr',
  port: 465, // Alternative port
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
};

// Email templates
const emailTemplates = {
  adminNotification: (contactData) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">📋 New Quote Request Received</h2>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
        <p><strong>👤 Name:</strong> ${contactData.name}</p>
        <p><strong>📧 Email:</strong> ${contactData.email}</p>
        <p><strong>📞 Phone:</strong> ${contactData.phone}</p>
        <p><strong>⏰ Urgency:</strong> ${contactData.urgencyLabel}</p>
        <p><strong>💬 Message:</strong> ${contactData.message || 'No message provided'}</p>
        <p><strong>📅 Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
        This email was sent from the Mirage erchandising website contact form.
      </p>
    </div>
  `,

  userConfirmation: (contactData) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">✨ Thank You for Your Interest in Mirage erchandising!</h2>
      <p>Dear ${contactData.name},</p>
      <p>We've received your quote request and our team will contact you within <strong>24 hours</strong> to discuss your project.</p>
      
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0;">
        <h3 style="color: #065f46; margin-top: 0;">Your Request Details:</h3>
        <p><strong>⏰ Service Urgency:</strong> ${contactData.urgencyLabel}</p>
        <p><strong>💬 Your Message:</strong> ${contactData.message || 'No additional details provided'}</p>
      </div>

      <p><strong>🔜 What happens next?</strong></p>
      <ol>
        <li>Our team will review your requirements</li>
        <li>We'll contact you to discuss details</li>
        <li>We'll prepare a customized quote</li>
        <li>We'll schedule your project</li>
      </ol>

      <p>📞 If you have any immediate questions, feel free to contact us directly:</p>
      <ul>
        <li>Email: Sveta@mymirage.fr</li>
        <li>Phone: +40 749 111 592</li>
      </ul>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #6b7280; font-size: 14px;">
        Best regards,<br>
        <strong>The Mirage erchandising Team</strong><br>
        <em>Transforming Retail Spaces</em>
      </p>
    </div>
  `
};

// Send email function
const sendEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send contact form emails
const sendContactEmails = async (contactData) => {
  const urgencyLabels = {
    urgent: 'Urgent (Within 1 week)',
    soon: 'Soon (Within 2-3 weeks)',
    planning: 'Planning (Next month)',
    future: 'Future (Just gathering info)'
  };

  const contactDataWithLabel = {
    ...contactData,
    urgencyLabel: urgencyLabels[contactData.urgency] || contactData.urgency
  };

  // Email to admin
  const adminMailOptions = {
    from: `Mirage erchandising Website <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `📋 New Quote Request: ${contactData.name} - ${contactDataWithLabel.urgencyLabel}`,
    html: emailTemplates.adminNotification(contactDataWithLabel)
  };

  // Email to user
  const userMailOptions = {
    from: `Mirage erchandising <${process.env.EMAIL_USER}>`,
    to: contactData.email,
    subject: '✨ Thank You for Your Quote Request - Mirage erchandising',
    html: emailTemplates.userConfirmation(contactDataWithLabel)
  };

  // Send both emails
  const results = await Promise.allSettled([
    sendEmail(adminMailOptions),
    sendEmail(userMailOptions)
  ]);

  return results;
};

module.exports = {
  createTransporter,
  sendEmail,
  sendContactEmails,
  emailTemplates
};