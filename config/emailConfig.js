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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #2563eb; margin-bottom: 8px;">📋 New ${contactData.leadType === 'newsletter' ? 'Newsletter Subscription' : 'Quote Request'} Received</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
        <p style="margin: 6px 0;"><strong>👤 Name:</strong> ${contactData.name}</p>
        <p style="margin: 6px 0;"><strong>📧 Email:</strong> ${contactData.email}</p>
        <p style="margin: 6px 0;"><strong>📞 Phone:</strong> ${contactData.phone}</p>
        ${contactData.leadType !== 'newsletter' ? `<p style="margin: 6px 0;"><strong>⏰ Urgency:</strong> ${contactData.urgencyLabel}</p>` : ''}
        <p style="margin: 6px 0;"><strong>💬 Message:</strong> ${contactData.message || (contactData.leadType === 'newsletter' ? 'Newsletter subscription' : 'No message provided')}</p>
        <p style="margin: 6px 0;"><strong>📅 Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p style="margin-top: 20px; color: #64748b; font-size: 13px;">
        This alert was generated automatically from the Mirage Merchandising website.
      </p>
    </div>
  `,

  userConfirmation: (contactData) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #059669; margin-bottom: 8px;">✨ Thank You for Contacting Mirage Merchandising!</h2>
      <p>Dear ${contactData.name},</p>
      <p>We've received your inquiry and our operations team will get in touch with you within <strong>24 hours</strong>.</p>
      
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0;">
        <h3 style="color: #065f46; margin-top: 0;">Your Submission Summary:</h3>
        ${contactData.leadType !== 'newsletter' ? `<p style="margin: 6px 0;"><strong>⏰ Urgency:</strong> ${contactData.urgencyLabel}</p>` : ''}
        <p style="margin: 6px 0;"><strong>💬 Message:</strong> ${contactData.message || 'No additional details provided'}</p>
      </div>

      <p><strong>🔜 What happens next?</strong></p>
      <ol style="line-height: 1.6;">
        <li>Our retail specialists review your requirements</li>
        <li>We contact you to verify operational timelines and store dimensions</li>
        <li>We prepare a turnkey, zero-disruption project proposal</li>
      </ol>

      <p>📞 Need immediate assistance? Contact us directly:</p>
      <ul style="line-height: 1.6;">
        <li>Email: <a href="mailto:Sveta@mymirage.fr" style="color: #2563eb;">Sveta@mymirage.fr</a></li>
        <li>Phone: <a href="tel:+40749111592" style="color: #2563eb;">+40 749 111 592</a></li>
      </ul>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="color: #64748b; font-size: 13px;">
        Best regards,<br>
        <strong>The Mirage Merchandising Team</strong><br>
        <em>Retail Transformations & Merchandising Execution</em>
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
    future: 'Future (Information gathering)'
  };

  const contactDataWithLabel = {
    ...contactData,
    urgencyLabel: urgencyLabels[contactData.urgency] || contactData.urgency || 'Future'
  };

  const isNewsletter = contactData.leadType === 'newsletter';

  // Email to admin
  const adminMailOptions = {
    from: `"Mirage Merchandising" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    replyTo: contactData.email,
    subject: isNewsletter
      ? `📬 New Newsletter Subscriber: ${contactData.email}`
      : `📋 New Quote Request: ${contactData.name} (${contactDataWithLabel.urgencyLabel})`,
    text: `New ${contactData.leadType === 'newsletter' ? 'Newsletter Subscription' : 'Quote Request'}\n\nName: ${contactData.name}\nEmail: ${contactData.email}\nPhone: ${contactData.phone}\nUrgency: ${contactDataWithLabel.urgencyLabel}\nMessage: ${contactData.message || 'N/A'}\nDate: ${new Date().toLocaleString()}`,
    html: emailTemplates.adminNotification(contactDataWithLabel)
  };

  // Email to user
  const userMailOptions = {
    from: `"Mirage Merchandising" <${process.env.EMAIL_USER}>`,
    to: contactData.email,
    replyTo: process.env.EMAIL_USER,
    subject: isNewsletter
      ? 'Welcome to Mirage Merchandising Updates'
      : 'We received your quote request - Mirage Merchandising',
    text: `Dear ${contactData.name},\n\nThank you for contacting Mirage Merchandising. We have received your inquiry and our operations team will get in touch with you within 24 hours.\n\nYour Request Details:\n- Urgency: ${contactDataWithLabel.urgencyLabel}\n- Message: ${contactData.message || 'No additional details provided'}\n\nContact us directly:\nEmail: Sveta@mymirage.fr\nPhone: +40 749 111 592\n\nBest regards,\nThe Mirage Merchandising Team`,
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