// // models/Contact.js
// import mongoose from 'mongoose';

// const contactSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true,
//     minlength: [2, 'Name must be at least 2 characters long'],
//     maxlength: [50, 'Name cannot exceed 50 characters']
//   },

//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
//   },

//   mobileNumber: {
//     type: String,
//     required: [true, 'Mobile number is required'],
//     unique: true,
//     match: [/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits']
//   },

//   description: {
//     type: String,
//     maxlength: [500, 'Description cannot exceed 500 characters'],
//     default: ''
//   }
// }, {
//   timestamps: true,
//   toJSON: {
//     transform: function(doc, ret) {
//       ret.id = ret._id;
//       delete ret._id;
//       delete ret.__v;
//       return ret;
//     }
//   }
// });

// // Index for better query performance
// contactSchema.index({ email: 1 });
// contactSchema.index({ mobileNumber: 1 });

// // Pre-save middleware to sanitize data
// contactSchema.pre('save', function(next) {
//   if (this.name) {
//     this.name = this.name.trim();
//   }
//   if (this.email) {
//     this.email = this.email.toLowerCase().trim();
//   }
//   if (this.mobileNumber) {
//     this.mobileNumber = this.mobileNumber.replace(/\D/g, ''); // Remove non-digit characters
//   }
//   next();
// });

// // Static method to check if email exists
// contactSchema.statics.isEmailTaken = async function(email, excludeId = null) {
//   const contact = await this.findOne({ 
//     email, 
//     _id: { $ne: excludeId } 
//   });
//   return !!contact;
// };

// // Static method to check if mobile number exists
// contactSchema.statics.isMobileTaken = async function(mobileNumber, excludeId = null) {
//   const contact = await this.findOne({ 
//     mobileNumber, 
//     _id: { $ne: excludeId } 
//   });
//   return !!contact;
// };

// // Change this line from module.exports to export default
// export default mongoose.model('Contact', contactSchema);

// models/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]+$/, 'Mobile number must contain only digits']
  },

  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
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

// Index for better query performance (removed unique indexes)
contactSchema.index({ email: 1 });
contactSchema.index({ mobileNumber: 1 });

// Pre-save middleware to sanitize data
contactSchema.pre('save', function(next) {
  if (this.name) {
    this.name = this.name.trim();
  }
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.mobileNumber) {
    this.mobileNumber = this.mobileNumber.replace(/\D/g, ''); // Remove non-digit characters
  }
  next();
});

// Remove the unique constraint checking methods since we don't need them anymore

export default mongoose.model('Contact', contactSchema);