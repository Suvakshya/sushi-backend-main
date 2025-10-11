import Slider from '../models/sliderModel.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../middleware/multer.js';

// Create new slider
export const createSlider = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = '';

    // If file uploaded, upload to Cloudinary
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, 'sliders');
      imageUrl = uploadResult.url;
    }

    const newSlider = new Slider({
      name,
      image: imageUrl,
    });

    await newSlider.save();
    return res.status(201).json({ success: true, data: newSlider });
  } catch (error) {
    console.error('Create Slider Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get all sliders
export const getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ created_at: -1 });
    return res.status(200).json({ success: true, data: sliders });
  } catch (error) {
    console.error('Get All Sliders Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single slider
export const getSliderById = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ success: false, message: 'Slider not found' });
    }
    return res.status(200).json({ success: true, data: slider });
  } catch (error) {
    console.error('Get Slider Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Update slider
export const updateSlider = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // 1. Find existing slider
    const slider = await Slider.findById(id);
    if (!slider) {
      return res.status(404).json({ success: false, message: 'Slider not found' });
    }

    // 2. Update basic fields if provided
    if (name) slider.name = name;

    // 3. If a new image is uploaded
    if (req.file) {
      console.log("New image uploaded:", req.file.originalname);

      // Extract old public ID (if any)
      const oldImageUrl = slider.image;
      const oldPublicId = getPublicIdFromUrl(oldImageUrl);

      // Delete old image from Cloudinary if valid
      if (oldPublicId) {
        try {
          await deleteFromCloudinary(oldPublicId);
          console.log(`Old Cloudinary image deleted: ${oldPublicId}`);
        } catch (err) {
          console.warn('Cloudinary delete warning:', err.message);
        }
      } else {
        console.warn('No valid public ID found in old image URL:', oldImageUrl);
      }

      // Upload new image to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.path, 'sliders');
      slider.image = uploadResult.url;
    }

    // 4. Save updated slider
    const updatedSlider = await slider.save();

    return res.status(200).json({
      success: true,
      message: 'Slider updated successfully',
      data: updatedSlider,
    });

  } catch (error) {
    console.error('Update Slider Error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the slider',
      error: error.message,
    });
  }
};

// Delete slider
export const deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ success: false, message: 'Slider not found' });
    }

    // Delete image from Cloudinary if exists
    if (slider.image) {
      const publicId = getPublicIdFromUrl(slider.image);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    await Slider.deleteOne({ _id: req.params.id });
    return res.status(200).json({ success: true, message: 'Slider deleted' });
  } catch (error) {
    console.error('Delete Slider Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};