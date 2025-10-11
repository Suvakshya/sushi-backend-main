import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post('/', singleUpload('imageUrl'), createBlog);
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.put('/:id', singleUpload('imageUrl'), updateBlog);
router.delete('/:id', deleteBlog);

export default router;