const Contact = require('../models/contact');
const { sendContactEmails } = require('../config/emailConfig');

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    // Debug log to check incoming request
    console.log('Request body received:', req.body);

    const { name, email, phone, message, urgency } = req.body;

    // Validation
    if (!name || !email || !phone || !urgency) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields: name, email, phone, and urgency'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Save to database
    const newContact = new Contact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      message: message ? message.trim() : '',
      urgency
    });

    const savedContact = await newContact.save();
    console.log('✅ Contact saved to database:', savedContact._id);

    // Send emails
    const emailResults = await sendContactEmails({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      message: message ? message.trim() : '',
      urgency
    });

    // Check email results
    const adminEmailSuccess = emailResults[0].status === 'fulfilled' && emailResults[0].value.success;
    const userEmailSuccess = emailResults[1].status === 'fulfilled' && emailResults[1].value.success;

    if (!adminEmailSuccess || !userEmailSuccess) {
      console.warn('⚠️ Some emails failed to send, but contact was saved');
    }

    res.status(200).json({
      success: true,
      message: 'Thank you! We have received your request and will contact you within 24 hours.',
      data: {
        contactId: savedContact._id,
        timestamp: savedContact.date,
        emailsSent: {
          admin: adminEmailSuccess,
          user: userEmailSuccess
        }
      }
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);

    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later or contact us directly.'
    });
  }
};

// @desc    Get all contact submissions (for admin)
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = status ? { status } : {};
    
    const contacts = await Contact.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
};

module.exports = {
  submitContactForm,
  getContacts
};