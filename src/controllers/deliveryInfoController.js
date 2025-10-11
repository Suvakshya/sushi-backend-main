import DeliveryInfo from '../models/deliveryInfoModel.js';
import { deliveryInfoValidationSchema } from '../validators/deliveryInfoValidation.js';

// Create delivery info
export const createDeliveryInfo = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = deliveryInfoValidationSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if delivery info already exists for this order
    const existingDelivery = await DeliveryInfo.findOne({ order_id: value.order_id });
    if (existingDelivery) {
      return res.status(400).json({
        success: false,
        message: 'Delivery info already exists for this order'
      });
    }

    const deliveryInfo = new DeliveryInfo(value);
    await deliveryInfo.save();

    res.status(201).json({
      success: true,
      message: 'Delivery info created successfully',
      data: deliveryInfo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all delivery info
export const getAllDeliveryInfo = async (req, res) => {
  try {
    const deliveryInfo = await DeliveryInfo.find()
      .populate('order_id')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      data: deliveryInfo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get delivery info by ID
export const getDeliveryInfoById = async (req, res) => {
  try {
    const deliveryInfo = await DeliveryInfo.findById(req.params.id)
      .populate('order_id');

    if (!deliveryInfo) {
      return res.status(404).json({
        success: false,
        message: 'Delivery info not found'
      });
    }

    res.json({
      success: true,
      data: deliveryInfo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get delivery info by order ID
export const getDeliveryInfoByOrderId = async (req, res) => {
  try {
    const deliveryInfo = await DeliveryInfo.findOne({ order_id: req.params.orderId })
      .populate('order_id');

    if (!deliveryInfo) {
      return res.status(404).json({
        success: false,
        message: 'Delivery info not found for this order'
      });
    }

    res.json({
      success: true,
      data: deliveryInfo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update delivery info
export const updateDeliveryInfo = async (req, res) => {
  try {
    const { error, value } = deliveryInfoValidationSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    const deliveryInfo = await DeliveryInfo.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    ).populate('order_id');

    if (!deliveryInfo) {
      return res.status(404).json({
        success: false,
        message: 'Delivery info not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery info updated successfully',
      data: deliveryInfo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update delivery status only
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { delivery_status, delivery_person } = req.body;

    // Validate status
    if (!['Pending', 'Out for Delivery', 'Delivered'].includes(delivery_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery status'
      });
    }

    const deliveryInfo = await DeliveryInfo.findByIdAndUpdate(
      req.params.id,
      { 
        delivery_status,
        ...(delivery_person && { delivery_person })
      },
      { new: true, runValidators: true }
    ).populate('order_id');

    if (!deliveryInfo) {
      return res.status(404).json({
        success: false,
        message: 'Delivery info not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery status updated successfully',
      data: deliveryInfo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete delivery info
export const deleteDeliveryInfo = async (req, res) => {
  try {
    const deliveryInfo = await DeliveryInfo.findByIdAndDelete(req.params.id);

    if (!deliveryInfo) {
      return res.status(404).json({
        success: false,
        message: 'Delivery info not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery info deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};