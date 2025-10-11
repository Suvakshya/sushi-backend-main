import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password_hash: {
    type: String,
    required: true
  },
  last_login: {
    type: Date
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

// Hash password before saving if modified
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();

  try {
    const saltRounds = 12;
    this.password_hash = await bcrypt.hash(this.password_hash, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp
adminSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// Clean password from output
adminSchema.methods.toJSON = function () {
  const admin = this.toObject();
  delete admin.password_hash;
  return admin;
};

export default mongoose.model('Admin', adminSchema);
