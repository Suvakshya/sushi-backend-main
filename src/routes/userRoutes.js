// import express from 'express';
// import {
//   registerUser,
//   loginUser,
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   getProfile
// } from '../controllers/userController.js';
// import { authenticateToken } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // Public routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// // Apply authentication to all routes below this line
// // router.use(authenticateToken);

// // Protected routes
// router.get('/profile', getProfile);
// router.get('/', getAllUsers);
// router.get('/:id', getUserById);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

// export default router;

import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  forgotPassword,
  resetPassword
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Apply authentication to all routes below this line
// router.use(authenticateToken);

// Protected routes
router.get('/profile', getProfile);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
