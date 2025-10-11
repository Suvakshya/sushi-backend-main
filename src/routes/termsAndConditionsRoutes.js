// routes/termsAndConditionsRoutes.js
import express from 'express';
const router = express.Router();

import {
  createOrUpdateTerms,
  getTermsAndConditions,
  getTermsById,
  deleteTermsAndConditions,
  getAllTermsVersions
} from '../controllers/termsAndConditionsController.js';

import { validateTermsAndConditions } from '../validators/termsAndConditionsValidator.js';

// Create or update terms and conditions (only one record maintained)
router.post('/terms', validateTermsAndConditions, createOrUpdateTerms);

// Update terms and conditions
router.put('/terms', validateTermsAndConditions, createOrUpdateTerms);

// Get latest terms and conditions
router.get('/terms', getTermsAndConditions);

// Get all versions (if keeping history)
router.get('/terms/versions', getAllTermsVersions);

// Get terms by ID
router.get('/terms/:id', getTermsById);

// Delete terms by ID
router.delete('/terms/:id', deleteTermsAndConditions);

export default router;