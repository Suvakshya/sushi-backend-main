import express from 'express';
const router = express.Router();

import {
  createOrUpdatePolicy,
  getPrivatePolicy,
  getPolicyById,
  deletePrivatePolicy,
  getAllPolicyVersions
} from '../controllers/privatePolicyController.js';

import { validatePrivatePolicy } from '../validators/privatePolicyValidator.js';

// Create or update private policy
router.post('/policy', validatePrivatePolicy, createOrUpdatePolicy);
router.put('/policy', validatePrivatePolicy, createOrUpdatePolicy);

// Get private policy
router.get('/policy', getPrivatePolicy);
router.get('/policy/versions', getAllPolicyVersions);
router.get('/policy/:id', getPolicyById);

// Delete private policy
router.delete('/policy/:id', deletePrivatePolicy);

export default router;