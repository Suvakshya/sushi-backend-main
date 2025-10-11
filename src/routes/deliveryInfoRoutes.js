import express from 'express';
import {
  createDeliveryInfo,
  getAllDeliveryInfo,
  getDeliveryInfoById,
  getDeliveryInfoByOrderId,
  updateDeliveryInfo,
  updateDeliveryStatus,
  deleteDeliveryInfo
} from '../controllers/deliveryInfoController.js';

const router = express.Router();

// Create delivery info
router.post('/', createDeliveryInfo);

// Get all delivery info
router.get('/', getAllDeliveryInfo);

// Get delivery info by ID
router.get('/:id', getDeliveryInfoById);

// Get delivery info by order ID
router.get('/order/:orderId', getDeliveryInfoByOrderId);

// Update delivery info
router.put('/:id', updateDeliveryInfo);

// Update delivery status only
router.patch('/:id/status', updateDeliveryStatus);

// Delete delivery info
router.delete('/:id', deleteDeliveryInfo);

export default router;