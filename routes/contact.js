const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getContacts
} = require('../controllers/contactController');

// Public routes
router.post('/', submitContactForm);

// Admin routes
router.get('/', getContacts);

module.exports = router;