// controllers/logoLinkController.js
import LogoLink from '../models/logoLinkModel.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../middleware/multer.js';

// Create or update logo and links
export const createOrUpdateLogoLink = async (req, res) => {
  try {
    const { facebook, instagram } = req.body;
    
    // Check if there's already a document
    let logoLink = await LogoLink.findOne();
    
    if (logoLink) {
      // Update existing document
      const updateData = {};
      
      // Handle logo upload if file exists
      if (req.file) {
        // Delete old logo from Cloudinary if exists
        if (logoLink.logo) {
          try {
            const oldPublicId = getPublicIdFromUrl(logoLink.logo);
            if (oldPublicId) {
              await deleteFromCloudinary(oldPublicId);
            }
          } catch (error) {
            console.error('Error deleting old logo:', error);
          }
        }
        
        // Upload new logo to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.path, 'logos');
        updateData.logo = uploadResult.url;
      }
      
      // Update social links if provided
      if (facebook !== undefined) updateData.facebook = facebook || null;
      if (instagram !== undefined) updateData.instagram = instagram || null;
      
      logoLink = await LogoLink.findByIdAndUpdate(
        logoLink._id,
        updateData,
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        message: 'Logo and links updated successfully',
        data: logoLink
      });
      
    } else {
      // Create new document
      const newData = {
        facebook: facebook || null,
        instagram: instagram || null
      };
      
      // Handle logo upload if file exists
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.path, 'logos');
        newData.logo = uploadResult.url;
      }
      
      logoLink = new LogoLink(newData);
      await logoLink.save();
      
      res.status(201).json({
        success: true,
        message: 'Logo and links created successfully',
        data: logoLink
      });
    }
    
  } catch (error) {
    console.error('Error in createOrUpdateLogoLink:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get logo and links
export const getLogoLink = async (req, res) => {
  try {
    const logoLink = await LogoLink.findOne();
    
    if (!logoLink) {
      return res.status(404).json({
        success: false,
        message: 'No logo and links found'
      });
    }
    
    res.json({
      success: true,
      data: logoLink
    });
    
  } catch (error) {
    console.error('Error in getLogoLink:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete logo only
export const deleteLogo = async (req, res) => {
  try {
    const logoLink = await LogoLink.findOne();
    
    if (!logoLink || !logoLink.logo) {
      return res.status(404).json({
        success: false,
        message: 'No logo found to delete'
      });
    }
    
    // Delete logo from Cloudinary
    try {
      const publicId = getPublicIdFromUrl(logoLink.logo);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    } catch (error) {
      console.error('Error deleting logo from Cloudinary:', error);
    }
    
    // Remove logo from database
    logoLink.logo = null;
    await logoLink.save();
    
    res.json({
      success: true,
      message: 'Logo deleted successfully',
      data: logoLink
    });
    
  } catch (error) {
    console.error('Error in deleteLogo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete social links
export const deleteSocialLinks = async (req, res) => {
  try {
    const { platform } = req.params;
    const validPlatforms = ['facebook', 'instagram'];
    
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid platform. Must be facebook or instagram'
      });
    }
    
    const logoLink = await LogoLink.findOne();
    
    if (!logoLink) {
      return res.status(404).json({
        success: false,
        message: 'No logo and links found'
      });
    }
    
    // Remove the specific social link
    logoLink[platform] = null;
    await logoLink.save();
    
    res.json({
      success: true,
      message: `${platform} link deleted successfully`,
      data: logoLink
    });
    
  } catch (error) {
    console.error('Error in deleteSocialLinks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};