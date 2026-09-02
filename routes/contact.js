const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  submitNewsletter,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { requireAdminAuth } = require('../middleware/authMiddleware');

// 🟢 Public submission routes (Lead generation only)
router.post('/', submitContactForm);
router.post('/newsletter', submitNewsletter);

// 🔒 Protected Administrator CRUD routes (Strictly requires admin authentication & never cached)
router.get('/', requireAdminAuth, getContacts);
router.get('/:id', requireAdminAuth, getContactById);
router.put('/:id', requireAdminAuth, updateContactStatus);
router.patch('/:id', requireAdminAuth, updateContactStatus);
router.delete('/:id', requireAdminAuth, deleteContact);

module.exports = router;