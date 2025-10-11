// routes/contactRoutes.js
import express from 'express';
const router = express.Router();

import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  searchContacts,
  getContactByEmail,
  getContactByMobile
} from '../controllers/contactController.js';

// Create a new contact
router.post('/contacts', createContact);

// Get all contacts
router.get('/contacts', getAllContacts);

// Search contacts
router.get('/contacts/search', searchContacts);

// Get contact by ID
router.get('/contacts/:id', getContactById);

// Get contact by email
router.get('/contacts/email/:email', getContactByEmail);

// Get contact by mobile number
router.get('/contacts/mobile/:mobileNumber', getContactByMobile);

// Update contact by ID
router.put('/contacts/:id', updateContact);

// Delete contact by ID
router.delete('/contacts/:id', deleteContact);

export default router;