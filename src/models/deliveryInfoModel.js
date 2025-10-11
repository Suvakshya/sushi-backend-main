import mongoose from 'mongoose';

const deliveryInfoSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  delivery_address: {
    type: String,
    required: true,
    trim: true
  },
  delivery_time: {
    type: Date,
    required: true
  },
  delivery_status: {
    type: String,
    required: true,
    enum: ['Pending', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
  delivery_person: {
    type: String,
    trim: true,
    default: ''
  }
});

export default mongoose.model('DeliveryInfo', deliveryInfoSchema);