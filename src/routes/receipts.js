// // routes/receipts.js
// import express from 'express';
// import mongoose from 'mongoose';

// const router = express.Router();

// // Receipt Schema
// const receiptSchema = new mongoose.Schema({
//   _id: String,
//   user_id: String,
//   order_id: String,
//   total_price: Number,
//   order_type: String,
//   payment_method: String,
//   status: String,
//   items: [
//     {
//       name: String,
//       quantity: Number,
//       price: Number
//     }
//   ],
//   created_at: { type: Date, default: Date.now },
//   customer_name: String,
//   customer_email: String
// });

// const Receipt = mongoose.model('Receipt', receiptSchema);

// // Get all receipts for a user
// router.get('/user/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const receipts = await Receipt.find({ user_id: userId })
//       .sort({ created_at: -1 })
//       .limit(50);

//     res.json({
//       success: true,
//       data: receipts
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching receipts',
//       error: error.message
//     });
//   }
// });

// // Get single receipt
// router.get('/:receiptId', async (req, res) => {
//   try {
//     const { receiptId } = req.params;
//     const receipt = await Receipt.findById(receiptId);

//     if (!receipt) {
//       return res.status(404).json({
//         success: false,
//         message: 'Receipt not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: receipt
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching receipt',
//       error: error.message
//     });
//   }
// });

// // Delete receipt
// router.delete('/:receiptId', async (req, res) => {
//   try {
//     const { receiptId } = req.params;
//     const receipt = await Receipt.findByIdAndDelete(receiptId);

//     if (!receipt) {
//       return res.status(404).json({
//         success: false,
//         message: 'Receipt not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Receipt deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting receipt',
//       error: error.message
//     });
//   }
// });

// // Create receipt (call this when order is completed)
// router.post('/', async (req, res) => {
//   try {
//     const receiptData = req.body;
//     const receipt = new Receipt(receiptData);
//     await receipt.save();

//     res.json({
//       success: true,
//       data: receipt,
//       message: 'Receipt created successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error creating receipt',
//       error: error.message
//     });
//   }
// });

// export default router;

// routes/receipts.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Receipt Schema
const receiptSchema = new mongoose.Schema({
  _id: String,
  user_id: String,
  order_id: String,
  total_price: Number,
  order_type: String,
  payment_method: String,
  status: String,
  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  created_at: { type: Date, default: Date.now },
  customer_name: String,
  customer_email: String
});

const Receipt = mongoose.model('Receipt', receiptSchema);

// Get all receipts for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching receipts for user:', userId);
    
    const receipts = await Receipt.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(50);

    console.log('Found receipts:', receipts.length);
    console.log('Receipts data:', receipts);

    res.json({
      success: true,
      data: receipts
    });
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching receipts',
      error: error.message
    });
  }
});

// Get single receipt
router.get('/:receiptId', async (req, res) => {
  try {
    const { receiptId } = req.params;
    const receipt = await Receipt.findById(receiptId);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    res.json({
      success: true,
      data: receipt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching receipt',
      error: error.message
    });
  }
});

// Delete receipt
router.delete('/:receiptId', async (req, res) => {
  try {
    const { receiptId } = req.params;
    const receipt = await Receipt.findByIdAndDelete(receiptId);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    res.json({
      success: true,
      message: 'Receipt deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting receipt',
      error: error.message
    });
  }
});

// Create receipt (call this when order is completed)
router.post('/', async (req, res) => {
  try {
    const receiptData = req.body;
    console.log('Creating receipt with data:', receiptData);
    
    const receipt = new Receipt(receiptData);
    await receipt.save();

    console.log('Receipt created successfully:', receipt._id);

    res.json({
      success: true,
      data: receipt,
      message: 'Receipt created successfully'
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating receipt',
      error: error.message
    });
  }
});

export default router;
