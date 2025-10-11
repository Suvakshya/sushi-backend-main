import mongoose from 'mongoose';

const sliderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
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

// Update the updated_at field before saving
sliderSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Update the updated_at field before updating via findOneAndUpdate, etc.
sliderSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: Date.now() });
  next();
});

export default mongoose.model('Slider', sliderSchema);