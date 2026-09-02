const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  submitNewsletter
} = require('../controllers/contactController');

// Only POST endpoints are permitted (Lead ingestion only)
router.post('/', submitContactForm);
router.post('/newsletter', submitNewsletter);

// Block all non-POST methods (GET, PUT, DELETE, PATCH, etc.)
router.use((req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.status(405).json({
    success: false,
    message: `Method ${req.method} is not allowed on this endpoint. This API is strictly write-only (POST) for contact submissions.`
  });
});

module.exports = router;