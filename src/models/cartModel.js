import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  menu_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  total_price: {
    type: Number,
    default: 0
  },
  total_items: {
    type: Number,
    default: 0
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

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.total_price = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.total_items = this.items.reduce((total, item) => total + item.quantity, 0);
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('Cart', cartSchema);