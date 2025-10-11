import User from '../models/userModel.js';
import { 
  userValidationSchema, 
  userUpdateValidationSchema, 
  userLoginValidationSchema 
} from '../validators/userValidation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';  // For generating reset code
import { sendResetCodeEmail } from '../utils/emailService.js';
// Register new user
export const registerUser = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = userValidationSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(value.password_hash, saltRounds);

    // Create user
    const user = new User({
      ...value,
      password_hash: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password_hash;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse,
      token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = userLoginValidationSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Find user by email
    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(value.password_hash, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      data: userResponse,
      token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password_hash').sort({ created_at: -1 });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password_hash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { error, value } = userUpdateValidationSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if email already exists (if email is being updated)
    if (value.email) {
      const existingUser = await User.findOne({ 
        email: value.email, 
        _id: { $ne: req.params.id } 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    ).select('-password_hash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password_hash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Forgot password: send reset code
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with this email does not exist'
      });
    }

    // Generate 6-digit numeric reset code
    const resetCode = crypto.randomInt(100000, 999999).toString();

    // Set expiry time 15 minutes from now
    const expires = Date.now() + 15 * 60 * 1000;

    // Save reset code and expiry in user document
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = expires;
    await user.save();

    // Send code via email
    await sendResetCodeEmail(user.email, resetCode);

    res.json({
      success: true,
      message: 'Password reset code sent to your email'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Reset password using code
export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, reset code, and new password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.resetPasswordCode || !user.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: 'No reset password request found. Please initiate forgot password first.'
      });
    }

    if (user.resetPasswordCode !== resetCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset code'
      });
    }

    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: 'Reset code expired. Please request a new one.'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset code fields
    user.password_hash = hashedPassword;
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
