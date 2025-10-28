// models/logoLinkModel.js
import mongoose from 'mongoose';

const logoSchema = new mongoose.Schema({
  logo: {
    type: String,
    default: null
  },
  facebook: {
    type: String,
    default: null,
    match: [/^https?:\/\/.+\..+/, 'Please provide a valid URL']
  },
  instagram: {
    type: String,
    default: null,
    match: [/^https?:\/\/.+\..+/, 'Please provide a valid URL']
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

export default mongoose.model('LogoLink', logoSchema);