// routes/faqRoutes.js
import express from 'express';
const router = express.Router();

import {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ
} from '../controllers/faqController.js';

import { validateFAQ, validateFAQUpdate } from '../validators/faqValidation.js';

// Create FAQ
router.post('/faqs', validateFAQ, createFAQ);

// Get all FAQs
router.get('/faqs', getAllFAQs);

// Get FAQ by ID
router.get('/faqs/:id', getFAQById);

// Update FAQ
router.put('/faqs/:id', validateFAQUpdate, updateFAQ);

// Delete FAQ
router.delete('/faqs/:id', deleteFAQ);

export default router;