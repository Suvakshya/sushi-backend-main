// models/FAQ.js
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    minlength: [10, 'Question must be at least 10 characters long'],
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    minlength: [10, 'Answer must be at least 10 characters long'],
    maxlength: [2000, 'Answer cannot exceed 2000 characters']
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

export default mongoose.model('FAQ', faqSchema);