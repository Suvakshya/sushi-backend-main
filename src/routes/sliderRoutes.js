import express from 'express';
import {
  createSlider,
  getAllSliders,
  getSliderById,
  updateSlider,
  deleteSlider
} from '../controllers/sliderController.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post('/', singleUpload('image'), createSlider);
router.get('/', getAllSliders);
router.get('/:id', getSliderById);
router.put('/:id', singleUpload('image'), updateSlider);
router.delete('/:id', deleteSlider);

export default router;