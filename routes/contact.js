const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  submitNewsletter,
  getContacts
} = require('../controllers/contactController');

// Public submission routes
router.post('/', submitContactForm);
router.post('/newsletter', submitNewsletter);

// Admin retrieval routes
router.get('/', getContacts);

module.exports = router;