const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true,
    default: 'N/A'
  },
  message: {
    type: String,
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
    default: ''
  },
  urgency: {
    type: String,
    enum: {
      values: ['urgent', 'soon', 'planning', 'future'],
      message: 'Urgency must be: urgent, soon, planning, or future'
    },
    default: 'future'
  },
  leadType: {
    type: String,
    enum: ['quote_request', 'newsletter', 'general_contact'],
    default: 'quote_request'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'closed'],
    default: 'new'
  },
  sourceUrl: {
    type: String,
    trim: true,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  },
  lang: {
    type: String,
    trim: true,
    default: 'fr'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for better query performance
contactSchema.index({ email: 1, date: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ date: -1 });

module.exports = mongoose.model('Contact', contactSchema);