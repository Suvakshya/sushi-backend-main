import MenuItem from '../models/menuItemModel.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../middleware/multer.js';

// Create new menu item
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, quantity, category, is_available } = req.body;
    let imageUrl = '';

    // If file uploaded, upload to Cloudinary
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, 'menuItems');
      imageUrl = uploadResult.url;
    }

    const newItem = new MenuItem({
      name,
      description,
      price,
      quantity: quantity || 0,
      category,
      image: imageUrl,
      is_available: is_available !== undefined ? is_available : true,
    });

    await newItem.save();
    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error('Create MenuItem Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ created_at: -1 });
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('Get All MenuItems Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single menu item
export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Get MenuItem Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Update menu item
// export const updateMenuItem = async (req, res) => {
//   const { id } = req.params;
//   const { name, description, price, quantity, category } = req.body;

//   try {
//     // 1. Find existing menu item
//     const item = await MenuItem.findById(id);
//     if (!item) {
//       return res.status(404).json({ success: false, message: 'Menu item not found' });
//     }

//     // 2. Update basic fields if provided
//     if (name) item.name = name;
//     if (description) item.description = description;
//     if (price) item.price = price;
//     if (quantity !== undefined) item.quantity = quantity;
//     if (category) item.category = category;

//     // 3. If a new image is uploaded
//     if (req.file) {
//       console.log("New image uploaded:", req.file.originalname);

//       // Extract old public ID (if any)
//       const oldImageUrl = item.image;
//       const oldPublicId = getPublicIdFromUrl(oldImageUrl);

//       // Delete old image from Cloudinary if valid
//       if (oldPublicId) {
//         try {
//           await deleteFromCloudinary(oldPublicId);
//           console.log(`Old Cloudinary image deleted: ${oldPublicId}`);
//         } catch (err) {
//           console.warn('Cloudinary delete warning:', err.message);
//         }
//       } else {
//         console.warn('No valid public ID found in old image URL:', oldImageUrl);
//       }

//       // Upload new image to Cloudinary
//       const uploadResult = await uploadToCloudinary(req.file.path, 'menuItems');
//       item.image = uploadResult.url;
//     }

//     // 4. Save updated item
//     const updatedItem = await item.save();

//     return res.status(200).json({
//       success: true,
//       message: 'Menu item updated successfully',
//       data: updatedItem,
//     });

//   } catch (error) {
//     console.error('Update error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'An error occurred while updating the menu item',
//       error: error.message,
//     });
//   }
// };
// Update menu item
export const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category, is_available } = req.body; // Add is_available here

  try {
    // 1. Find existing menu item
    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    // 2. Update basic fields if provided
    if (name) item.name = name;
    if (description) item.description = description;
    if (price) item.price = price;
    if (quantity !== undefined) item.quantity = quantity;
    if (category) item.category = category;
    
    // ADD THIS: Handle is_available field
    if (is_available !== undefined) {
      item.is_available = is_available === 'true' || is_available === true;
    }

    // 3. If a new image is uploaded
    if (req.file) {
      console.log("New image uploaded:", req.file.originalname);

      // Extract old public ID (if any)
      const oldImageUrl = item.image;
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
      const uploadResult = await uploadToCloudinary(req.file.path, 'menuItems');
      item.image = uploadResult.url;
    }

    // 4. Save updated item
    const updatedItem = await item.save();

    return res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedItem,
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the menu item',
      error: error.message,
    });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    // Delete image from Cloudinary if exists
    if (item.image) {
      const publicId = getPublicIdFromUrl(item.image);
      await deleteFromCloudinary(publicId);
    }

    await MenuItem.deleteOne({ _id: req.params.id });
    return res.status(200).json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    console.error('Delete MenuItem Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};