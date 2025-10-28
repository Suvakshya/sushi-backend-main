import Applicant from '../models/applicantModel.js';

// Create new applicant
export const createApplicant = async (req, res) => {
  try {
    const { name, email, phone, address, position, description } = req.body;

    // Basic validation
    if (!name || !email || !phone || !address || !position || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const applicant = await Applicant.create({
      name,
      email,
      phone,
      address,
      position,
      description
    });

    res.status(201).json({
      success: true,
      data: applicant,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Create applicant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
};

// Get all applicants
export const getApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: applicants
    });
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applicants'
    });
  }
};

// Delete applicant
export const deleteApplicant = async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Applicant.findByIdAndDelete(id);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }

    res.json({
      success: true,
      message: 'Applicant deleted successfully'
    });
  } catch (error) {
    console.error('Delete applicant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete applicant'
    });
  }
};