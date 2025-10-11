import Blog from '../models/blogModel.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../middleware/multer.js';

// Create new blog
export const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    let imageUrl = '';

    // If file uploaded, upload to Cloudinary
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, 'blogs');
      imageUrl = uploadResult.url;
    }

    const newBlog = new Blog({
      title,
      description,
      imageUrl,
    });

    await newBlog.save();
    return res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    console.error('Create Blog Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ created_at: -1 });
    return res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    console.error('Get All Blogs Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error('Get Blog Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    // 1. Find existing blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // 2. Update basic fields if provided
    if (title) blog.title = title;
    if (description) blog.description = description;

    // 3. If a new image is uploaded
    if (req.file) {
      console.log("New image uploaded:", req.file.originalname);

      // Extract old public ID (if any)
      const oldImageUrl = blog.imageUrl;
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
      const uploadResult = await uploadToCloudinary(req.file.path, 'blogs');
      blog.imageUrl = uploadResult.url;
    }

    // 4. Save updated blog
    const updatedBlog = await blog.save();

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog,
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the blog',
      error: error.message,
    });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Delete image from Cloudinary if exists
    if (blog.imageUrl) {
      const publicId = getPublicIdFromUrl(blog.imageUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    await Blog.deleteOne({ _id: req.params.id });
    return res.status(200).json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};