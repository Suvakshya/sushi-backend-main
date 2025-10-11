import PrivatePolicy from '../models/privatePolicyModel.js';
import { privatePolicySchema } from '../validators/privatePolicyValidator.js';

// Create or Update Private Policy (Only one record allowed)
export const createOrUpdatePolicy = async (req, res) => {
  try {
    const { error, value } = privatePolicySchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    const policy = await PrivatePolicy.findOneAndUpdate(
      {},
      value,
      { 
        new: true, 
        upsert: true, 
        runValidators: true,
        setDefaultsOnInsert: true 
      }
    );

    res.status(200).json({
      success: true,
      message: 'Private policy updated successfully',
      data: policy
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get latest Private Policy
export const getPrivatePolicy = async (req, res) => {
  try {
    const policy = await PrivatePolicy.getLatest();

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Private policy not found'
      });
    }

    res.json({
      success: true,
      data: policy
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Private Policy by ID
export const getPolicyById = async (req, res) => {
  try {
    const policy = await PrivatePolicy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Private policy not found'
      });
    }

    res.json({
      success: true,
      data: policy
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid policy ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete Private Policy
export const deletePrivatePolicy = async (req, res) => {
  try {
    const policy = await PrivatePolicy.findByIdAndDelete(req.params.id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Private policy not found'
      });
    }

    res.json({
      success: true,
      message: 'Private policy deleted successfully',
      data: policy
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid policy ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all versions
export const getAllPolicyVersions = async (req, res) => {
  try {
    const policies = await PrivatePolicy.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: policies,
      count: policies.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};