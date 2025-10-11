import express from 'express';
import {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  updateOrderItem,
  deleteOrderItem,
  bulkCreateOrderItems
} from '../controllers/orderItemController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes below
// router.use(authenticateToken);

// Create new order item
router.post('/',createOrderItem);

// Bulk create order items
router.post('/bulk',bulkCreateOrderItems);

// Get all order items
router.get('/', getAllOrderItems);

// Get order item by ID
router.get('/:id', getOrderItemById);

// Get order items by order ID
router.get('/order/:orderId', getOrderItemsByOrderId);

// Update order item
router.put('/:id',updateOrderItem);

// Delete order item
router.delete('/:id',deleteOrderItem);

export default router;