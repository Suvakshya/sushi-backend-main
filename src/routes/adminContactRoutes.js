import express from 'express';
import { getContactInfo, updateContactInfo } from '../controllers/adminContactController.js';

const router = express.Router();

// Public route - get contact info
router.get('/', getContactInfo);

// Public route - update contact info (no authentication required)
router.put('/update', updateContactInfo);

export default router;