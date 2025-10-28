import express from 'express';
import { createApplicant, getApplicants, deleteApplicant } from '../controllers/applicantController.js';

const router = express.Router();

// Public route - submit application
router.post('/apply', createApplicant);

// Admin routes - get and manage applications
router.get('/applications', getApplicants);
router.delete('/:id', deleteApplicant);

export default router;