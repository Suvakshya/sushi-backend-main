// controllers/termsAndConditionsController.js
import TermsAndConditions from '../models/termsAndConditionsModel.js';
import { termsAndConditionsSchema } from '../validators/termsAndConditionsValidator.js';

// Create or Update Terms and Conditions (Only one record allowed)
export const createOrUpdateTerms = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = termsAndConditionsSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Since we only want one record, we'll upsert
    const terms = await TermsAndConditions.findOneAndUpdate(
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
      message: 'Terms and conditions updated successfully',
      data: terms
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get latest Terms and Conditions
export const getTermsAndConditions = async (req, res) => {
  try {
    const terms = await TermsAndConditions.getLatest();

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: 'Terms and conditions not found'
      });
    }

    res.json({
      success: true,
      data: terms
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Terms and Conditions by ID
export const getTermsById = async (req, res) => {
  try {
    const terms = await TermsAndConditions.findById(req.params.id);

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: 'Terms and conditions not found'
      });
    }

    res.json({
      success: true,
      data: terms
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid terms ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete Terms and Conditions
export const deleteTermsAndConditions = async (req, res) => {
  try {
    const terms = await TermsAndConditions.findByIdAndDelete(req.params.id);

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: 'Terms and conditions not found'
      });
    }

    res.json({
      success: true,
      message: 'Terms and conditions deleted successfully',
      data: terms
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid terms ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all versions (if you want to keep history)
export const getAllTermsVersions = async (req, res) => {
  try {
    const termsList = await TermsAndConditions.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: termsList,
      count: termsList.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};