// // routes/menuItemRoutes.js
// import express from 'express';
// import {
//   createMenuItem,
//   getAllMenuItems,
//   getMenuItemById,
//   updateMenuItem,
//   deleteMenuItem
// } from '../controllers/menuItemController.js';
// import { singleUpload } from '../middleware/multer.js';

// const router = express.Router();

// router.post('/', singleUpload('image'), createMenuItem);
// router.get('/', getAllMenuItems);
// router.get('/:id', getMenuItemById);
// router.put('/:id', singleUpload('image'), updateMenuItem);
// router.delete('/:id', deleteMenuItem);

// export default router;

import express from 'express';
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuItemController.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post('/', singleUpload('image'), createMenuItem);
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);
router.put('/:id', singleUpload('image'), updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;