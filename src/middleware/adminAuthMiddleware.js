import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin account not found'
      });
    }

    req.adminId = decoded.adminId;
    next();

  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
