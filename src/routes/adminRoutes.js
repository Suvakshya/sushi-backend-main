import express from 'express';
import {
  adminLogin,
  getAdminProfile,
  changeAdminPassword
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Public route
router.post('/login', adminLogin);

// Protected routes
router.use(authenticateAdmin);

router.get('/profile', getAdminProfile);
router.patch('/change-password', changeAdminPassword);

export default router;
