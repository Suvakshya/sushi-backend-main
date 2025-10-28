// // import mongoose from 'mongoose';

// // const orderSchema = new mongoose.Schema({
// //   user_id: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: true
// //   },
// //   total_price: {
// //     type: Number,
// //     required: true,
// //     min: 0
// //   },
// //   order_type: {
// //     type: String,
// //     required: true,
// //     enum: ['Delivery', 'Takeaway']
// //   },
// //   payment_method: {
// //     type: String,
// //     required: true,
// //     enum: ['Cash', 'Card', 'Online']
// //   },
// //   status: {
// //     type: String,
// //     required: true,
// //     enum: ['Pending', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'],
// //     default: 'Pending'
// //   },
// //   created_at: {
// //     type: Date,
// //     default: Date.now
// //   },
// //   updated_at: {
// //     type: Date,
// //     default: Date.now
// //   }
// // });

// // orderSchema.pre('save', function(next) {
// //   this.updated_at = Date.now();
// //   next();
// // });

// // export default mongoose.model('Order', orderSchema);


// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   total_price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   order_type: {
//     type: String,
//     required: true,
//     enum: ['Delivery', 'Takeaway']
//   },
//   payment_method: {
//     type: String,
//     required: true,
//     enum: ['Cash', 'Card', 'Online']
//   },
//   payment_status: {
//     type: String,
//     enum: ['pending', 'paid', 'failed'],
//     default: 'pending'
//   },
//   stripe_payment_intent_id: {
//     type: String
//   },
//   status: {
//     type: String,
//     required: true,
//     enum: ['Pending', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'],
//     default: 'Pending'
//   },
//   created_at: {
//     type: Date,
//     default: Date.now
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now
//   }
// });

// orderSchema.pre('save', function(next) {
//   this.updated_at = Date.now();
//   next();
// });

// export default mongoose.model('Order', orderSchema);

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  total_price: {
    type: Number,
    required: true,
    min: 0
  },
  order_type: {
    type: String,
    required: true,
    enum: ['Delivery', 'Takeaway']
  },
  payment_method: {
    type: String,
    required: true,
    enum: ['Cash', 'Card', 'Online']
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  stripe_payment_intent_id: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('Order', orderSchema);