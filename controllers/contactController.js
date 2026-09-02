const Contact = require('../models/contact');
const { sendContactEmails } = require('../config/emailConfig');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Handle contact & quote form submission
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    console.log('📥 Incoming contact submission:', req.body);

    const { name, email, phone, message, urgency, leadType, sourceUrl, lang } = req.body;

    // Check for newsletter type
    const isNewsletter = leadType === 'newsletter' || name === 'Newsletter Subscriber';

    // Email validation (always required)
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (!isNewsletter) {
      // Full quote request validation
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your full name.'
        });
      }

      if (!phone || phone.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid phone number.'
        });
      }
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name ? name.trim() : (isNewsletter ? 'Newsletter Subscriber' : 'Website Visitor');
    const cleanPhone = phone ? phone.trim() : 'N/A';
    const cleanUrgency = ['urgent', 'soon', 'planning', 'future'].includes(urgency) ? urgency : 'future';
    const cleanLang = (lang && ['fr', 'en', 'de', 'nl', 'it', 'es', 'ro'].includes(lang.toLowerCase())) ? lang.toLowerCase() : 'fr';

    // 1. Save lead to MongoDB
    const newContact = new Contact({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: message ? message.trim() : '',
      urgency: cleanUrgency,
      leadType: isNewsletter ? 'newsletter' : (leadType || 'quote_request'),
      sourceUrl: sourceUrl || req.headers.referer || '',
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
      lang: cleanLang
    });

    const savedContact = await newContact.save();
    console.log(`✅ Lead saved to database [ID: ${savedContact._id}, Type: ${savedContact.leadType}, Lang: ${cleanLang}]`);

    // 2. Dispatch internal alert and confirmation email
    let emailStatus = { admin: false, user: false };
    try {
      const emailResults = await sendContactEmails({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        message: message ? message.trim() : '',
        urgency: cleanUrgency,
        leadType: savedContact.leadType,
        lang: cleanLang
      });

      emailStatus.admin = emailResults[0]?.status === 'fulfilled' && emailResults[0]?.value?.success;
      emailStatus.user = emailResults[1]?.status === 'fulfilled' && emailResults[1]?.value?.success;
    } catch (emailErr) {
      console.error('⚠️ Email dispatch error (lead was safely stored in database):', emailErr);
    }

    return res.status(200).json({
      success: true,
      message: isNewsletter
        ? 'Thank you for subscribing to our newsletter!'
        : 'Thank you! We have received your request and our team will contact you within 24 hours.',
      data: {
        contactId: savedContact._id,
        timestamp: savedContact.date,
        emailsSent: emailStatus
      }
    });

  } catch (error) {
    console.error('❌ Contact submission error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while processing your request. Please try again or contact us directly.'
    });
  }
};

// @desc    Handle dedicated newsletter submission
// @route   POST /api/contact/newsletter
// @access  Public
const submitNewsletter = async (req, res) => {
  req.body.leadType = 'newsletter';
  req.body.name = req.body.name || 'Newsletter Subscriber';
  req.body.phone = req.body.phone || 'N/A';
  req.body.urgency = 'future';
  return submitContactForm(req, res);
};

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, leadType } = req.query;

    const query = {};
    if (status) query.status = status;
    if (leadType) query.leadType = leadType;

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

// @desc    Get single contact lead by ID (Admin only)
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('❌ Get contact by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving lead details'
    });
  }
};

// @desc    Update contact lead status (Admin only)
// @route   PUT /api/contact/:id or PATCH /api/contact/:id
// @access  Private/Admin
const updateContactStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['new', 'contacted', 'quoted', 'closed'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('❌ Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lead'
    });
  }
};

// @desc    Delete contact lead (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead removed successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('❌ Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lead'
    });
  }
};

module.exports = {
  submitContactForm,
  submitNewsletter,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact
};