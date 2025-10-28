// import OrderItem from '../models/orderItemModel.js';
// import { orderItemValidationSchema, orderItemUpdateValidationSchema } from '../validators/orderItemValidation.js';

// // Create new order item
// export const createOrderItem = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = orderItemValidationSchema.validate(req.body);
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: error.details.map(detail => detail.message)
//       });
//     }

//     const orderItem = new OrderItem(value);
//     await orderItem.save();
//     await orderItem.populate('order_id');
//     await orderItem.populate('item_id');

//     res.status(201).json({
//       success: true,
//       message: 'Order item created successfully',
//       data: orderItem
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Get all order items
// export const getAllOrderItems = async (req, res) => {
//   try {
//     const orderItems = await OrderItem.find()
//       .populate('order_id')
//       .populate('item_id')
//       .sort({ _id: -1 });

//     res.json({
//       success: true,
//       data: orderItems
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Get order item by ID
// export const getOrderItemById = async (req, res) => {
//   try {
//     const orderItem = await OrderItem.findById(req.params.id)
//       .populate('order_id')
//       .populate('item_id');

//     if (!orderItem) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order item not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: orderItem
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Get order items by order ID
// export const getOrderItemsByOrderId = async (req, res) => {
//   try {
//     const orderItems = await OrderItem.find({ order_id: req.params.orderId })
//       .populate('order_id')
//       .populate('item_id')
//       .sort({ _id: -1 });

//     res.json({
//       success: true,
//       data: orderItems
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Update order item
// export const updateOrderItem = async (req, res) => {
//   try {
//     const { error, value } = orderItemUpdateValidationSchema.validate(req.body);
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: error.details.map(detail => detail.message)
//       });
//     }

//     const orderItem = await OrderItem.findByIdAndUpdate(
//       req.params.id,
//       value,
//       { new: true, runValidators: true }
//     )
//       .populate('order_id')
//       .populate('item_id');

//     if (!orderItem) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order item not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Order item updated successfully',
//       data: orderItem
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Delete order item
// export const deleteOrderItem = async (req, res) => {
//   try {
//     const orderItem = await OrderItem.findByIdAndDelete(req.params.id);

//     if (!orderItem) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order item not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Order item deleted successfully'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Bulk create order items (for multiple items in one order)
// export const bulkCreateOrderItems = async (req, res) => {
//   try {
//     const { orderItems } = req.body;

//     if (!Array.isArray(orderItems) || orderItems.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Order items array is required'
//       });
//     }

//     // Validate each order item
//     for (const item of orderItems) {
//       const { error } = orderItemValidationSchema.validate(item);
//       if (error) {
//         return res.status(400).json({
//           success: false,
//           message: 'Validation failed',
//           errors: error.details.map(detail => detail.message)
//         });
//       }
//     }

//     const createdOrderItems = await OrderItem.insertMany(orderItems);
    
//     // Populate the created items
//     const populatedItems = await OrderItem.find({
//       _id: { $in: createdOrderItems.map(item => item._id) }
//     })
//       .populate('order_id')
//       .populate('item_id');

//     res.status(201).json({
//       success: true,
//       message: 'Order items created successfully',
//       data: populatedItems
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

import OrderItem from '../models/orderItemModel.js';
import { orderItemValidationSchema, orderItemUpdateValidationSchema } from '../validators/orderItemValidation.js';

// Create new order item
export const createOrderItem = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = orderItemValidationSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    const orderItem = new OrderItem(value);
    await orderItem.save();
    await orderItem.populate('order_id');
    await orderItem.populate('item_id');

    res.status(201).json({
      success: true,
      message: 'Order item created successfully',
      data: orderItem
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all order items
export const getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find()
      .populate('order_id')
      .populate('item_id')
      .sort({ _id: -1 });

    res.json({
      success: true,
      data: orderItems
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get order item by ID
export const getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id)
      .populate('order_id')
      .populate('item_id');

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      });
    }

    res.json({
      success: true,
      data: orderItem
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get order items by order ID (basic version)
export const getOrderItemsByOrderId = async (req, res) => {
  try {
    const orderItems = await OrderItem.find({ order_id: req.params.orderId })
      .populate('order_id')
      .populate('item_id')
      .sort({ _id: -1 });

    res.json({
      success: true,
      data: orderItems
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get order items by order ID with detailed item information (NEW FUNCTION)
export const getOrderItemsWithDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log('Fetching order items with details for order:', orderId);
    
    const orderItems = await OrderItem.find({ order_id: orderId })
      .populate('item_id', 'name price image') // Populate menu item details
      .exec();

    const formattedItems = orderItems.map(item => ({
      name: item.item_id?.name || 'Menu Item',
      quantity: item.quantity,
      price: item.price,
      image: item.item_id?.image || null
    }));

    console.log('Found order items with details:', formattedItems.length);

    res.json({
      success: true,
      data: formattedItems
    });
  } catch (error) {
    console.error('Error fetching order items with details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order items',
      error: error.message
    });
  }
};

// Update order item
export const updateOrderItem = async (req, res) => {
  try {
    const { error, value } = orderItemUpdateValidationSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    const orderItem = await OrderItem.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    )
      .populate('order_id')
      .populate('item_id');

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      });
    }

    res.json({
      success: true,
      message: 'Order item updated successfully',
      data: orderItem
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete order item
export const deleteOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByIdAndDelete(req.params.id);

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      });
    }

    res.json({
      success: true,
      message: 'Order item deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Bulk create order items (for multiple items in one order)
export const bulkCreateOrderItems = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items array is required'
      });
    }

    // Validate each order item
    for (const item of orderItems) {
      const { error } = orderItemValidationSchema.validate(item);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.details.map(detail => detail.message)
        });
      }
    }

    const createdOrderItems = await OrderItem.insertMany(orderItems);
    
    // Populate the created items
    const populatedItems = await OrderItem.find({
      _id: { $in: createdOrderItems.map(item => item._id) }
    })
      .populate('order_id')
      .populate('item_id');

    res.status(201).json({
      success: true,
      message: 'Order items created successfully',
      data: populatedItems
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
