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
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  urgency: {
    type: String,
    required: [true, 'Urgency is required'],
    enum: {
      values: ['urgent', 'soon', 'planning', 'future'],
      message: 'Urgency must be: urgent, soon, planning, or future'
    }
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'closed'],
    default: 'new'
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