import Admin from '../models/adminModel.js';
import {
  adminLoginValidationSchema,
  changePasswordValidationSchema
} from '../validators/adminValidation.js';
import jwt from 'jsonwebtoken';

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { error, value } = adminLoginValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(d => d.message)
      });
    }

    const { username, password } = value;

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    admin.last_login = new Date();
    await admin.save();

    const token = jwt.sign(
      {
        adminId: admin._id,
        username: admin.username
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: admin._id,
        username: admin.username,
        last_login: admin.last_login
      },
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

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password_hash');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        last_login: admin.last_login,
        created_at: admin.created_at
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Change admin password
export const changeAdminPassword = async (req, res) => {
  try {
    const { error, value } = changePasswordValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(d => d.message)
      });
    }

    const { current_password, new_password } = value;

    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const isCurrentPasswordValid = await admin.comparePassword(current_password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    admin.password_hash = new_password; // Will trigger pre-save hook
    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
