import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['sushi', 'sashimi', 'drinks', 'appetizers', 'desserts'],
    trim: true
  },
  image:{
    type: String,
    trim: true,
    default: ''
  },
  is_available: {
    type: Boolean,
    default: true
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

menuItemSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('MenuItem', menuItemSchema);