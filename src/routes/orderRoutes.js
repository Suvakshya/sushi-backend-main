import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrdersByStatus
} from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
// Apply authentication middleware to all routes below
// router.use(authenticateToken);

// Create new order
router.post('/', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Get orders by user ID
router.get('/user/:userId', getOrdersByUserId);

// Get orders by status
router.get('/status/:status', getOrdersByStatus);

// Update order
router.put('/:id', updateOrder);

// Update order status only
router.patch('/:id/status', updateOrderStatus);

// Delete order
router.delete('/:id', deleteOrder);

export default router;