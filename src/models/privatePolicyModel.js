// models/PrivatePolicy.js
import mongoose from 'mongoose';

const PrivatePolicySchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [10000, 'Description cannot exceed 10000 characters']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Ensure only one document exists
PrivatePolicySchema.statics.getLatest = function() {
  return this.findOne().sort({ createdAt: -1 });
};

PrivatePolicySchema.pre('save', async function(next) {
  // If this is a new document, delete all existing ones to maintain single record
  if (this.isNew) {
    await this.constructor.deleteMany({});
  }
  next();
});

export default mongoose.model('PrivatePolicy', PrivatePolicySchema);